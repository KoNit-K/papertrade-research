/** Version-bound research interfaces. No key generation, custody or network access. */
import { concatHex, encodeFunctionData, hashTypedData, keccak256, parseSignature, recoverTypedDataAddress, stringToHex } from 'viem';
import type { Address, Hex, TypedDataDomain } from 'viem';

export const contracts = {
  exchange: '0x6cd5661646289fb6e65ea5c032310fded797d0a2',
  staking: '0xaad6c7b0cc3014fc80ffedae0ed7ce5967b0f016',
  sessions: '0x8326eb8896e358717f10502ec73ce8d28e37b108',
} as const;
const field = (name: string, type: string) => ({ name, type });
const tail = [field('nonce','uint256'),field('deadline','uint64')];
export const types = {
  RegisterSessionKey: [field('user','address'),field('key','address'),field('expiry','uint64'),field('feeAddress','address'),...tail],
  OpenPosition: [field('user','address'),field('instrumentId','uint32'),field('isLong','bool'),field('size','uint128'),field('leverage','uint32'),field('useDebt','bool'),...tail],
  Close: [field('user','address'),field('positionIds','uint256[]'),...tail],
  CancelIntent: [field('user','address'),field('intentId','bytes32'),field('deadline','uint256')],
  WithdrawToCore: [field('user','address'),field('amount','uint256'),...tail],
  Stake: [field('user','address'),field('amount','uint256'),...tail],
  Unstake: [field('user','address'),field('amount','uint256'),...tail],
  Claim: [field('user','address'),...tail],
  Distribute: [field('user','address'),...tail],
} as const;
export type Kind = keyof typeof types;
export type Message = Record<string, bigint | boolean | string | bigint[]>;
const actions: Record<Kind,string> = {RegisterSessionKey:'registerSessionKey',OpenPosition:'openPosition',Close:'closePositions',CancelIntent:'cancelIntent',WithdrawToCore:'withdrawToCore',Stake:'paperStake',Unstake:'paperUnstake',Claim:'paperClaim',Distribute:'paperDistribute'};
export type Preview = { kind: Kind; action: string; domain: TypedDataDomain; types: Record<string,readonly {name:string;type:string}[]>; primaryType: Kind; message: Message; digest: Hex };
export function address(value: unknown): Address {
  if (typeof value !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(value)) throw new Error('Invalid address');
  return value.toLowerCase() as Address;
}
export function uint(value: unknown, bits=256): bigint {
  if (typeof value !== 'bigint' || value < 0n || value >= 1n<<BigInt(bits)) throw new RangeError('Unsigned integer outside width');
  return value;
}
export function raw(value: unknown, bits=256): bigint {
  if (typeof value !== 'string' || !/^(0|[1-9][0-9]*)$/.test(value)) throw new Error('Invalid decimal integer');
  return uint(BigInt(value), bits);
}
export function units(value: string, decimals: number): bigint {
  if (!Number.isInteger(decimals) || decimals<0 || decimals>36 || !/^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(value)) throw new Error('Invalid decimal amount');
  const [whole,fraction=''] = value.split('.');
  if (fraction.length>decimals) throw new Error('Precision loss');
  return uint(BigInt(whole)*10n**BigInt(decimals)+BigInt(fraction.padEnd(decimals,'0')||'0'));
}
export function internalToUsdc(amount: bigint): bigint {
  uint(amount); if(amount%10n**12n) throw new Error('USDC precision loss');
  return amount/10n**12n;
}
export const usdcToInternal = (amount: bigint) => uint(uint(amount)*10n**12n);
export function priceRaw(price: string, scale: bigint): bigint {
  uint(scale); if(scale===0n) throw new Error('Invalid scale');
  const decimal=units(price,18)*scale;
  if(decimal%10n**18n) throw new Error('Price does not fit instrument scale');
  return uint(decimal/10n**18n,64);
}
export function domain(kind: Kind, chainId=999): TypedDataDomain {
  return {name:kind==='CancelIntent'?'PaperTrade Intent Cancel':['Stake','Unstake','Claim','Distribute'].includes(kind)?'PaperStaking':'String',version:kind==='CancelIntent'?'2':'1',chainId,verifyingContract:['Stake','Unstake','Claim','Distribute'].includes(kind)?contracts.staking:contracts.exchange};
}
export function preview(kind: Kind, input: Message, signingDomain=domain(kind)): Preview {
  if (!Number.isSafeInteger(signingDomain.chainId) || Number(signingDomain.chainId)<=0) throw new Error('Invalid chain');
  address(signingDomain.verifyingContract);
  const message: Message={};
  if(Object.keys(input).length!==types[kind].length) throw new Error('Unexpected/missing signed fields');
  for(const {name,type} of types[kind]) {
    const value=input[name];
    if(type==='address') message[name]=address(value);
    else if(type==='bool') {if(typeof value!=='boolean') throw new Error('Invalid boolean'); message[name]=value;}
    else if(type==='bytes32') {if(typeof value!=='string'||!/^0x[0-9a-fA-F]{64}$/.test(value)) throw new Error('Invalid bytes32');message[name]=value.toLowerCase();}
    else if(type==='uint256[]') {
      if(!Array.isArray(value)||value.length<1||value.length>12||new Set(value).size!==value.length) throw new Error('Close requires 1–12 distinct whole positions (client bound)');
      message[name]=value.map(v=>uint(v));
    } else message[name]=uint(value,Number(type.slice(4)));
  }
  if(kind==='OpenPosition' && (message.size===0n||message.leverage===0n)) throw new Error('Positive margin and leverage required');
  const data={domain:{...signingDomain},types:{[kind]:types[kind]},primaryType:kind,message};
  return {...data,kind,action:actions[kind],digest:hashTypedData(data)};
}
export function previewOpen(input: {user:Address; instrumentId:bigint; isLong:boolean; margin:string; leverage:bigint; useDebt?:boolean; nonce:bigint; deadline:bigint}, signingDomain=domain('OpenPosition')): Preview {
  const {margin,useDebt=false,...rest}=input;
  return preview('OpenPosition',{...rest,useDebt,size:units(margin,18)},signingDomain);
}
export function previewCloseGroups(user:Address,positionIds:bigint[],firstNonce:bigint,deadline:bigint,signingDomain=domain('Close')) {
  if(!positionIds.length||new Set(positionIds).size!==positionIds.length)throw new Error('Distinct whole positions required');
  const groups:Preview[]=[];
  for(let offset=0;offset<positionIds.length;offset+=12)groups.push(preview('Close',{user,positionIds:positionIds.slice(offset,offset+12),nonce:firstNonce+BigInt(groups.length),deadline},signingDomain));
  return groups;
}
export function previewRevocation(key:Address) {
  return {chainId:999,to:contracts.sessions,requiresMainWallet:true,data:encodeFunctionData({abi:[{type:'function',name:'revokeSessionKey',stateMutability:'nonpayable',inputs:[{name:'key',type:'address'}],outputs:[]}],functionName:'revokeSessionKey',args:[address(key)]})};
}
export async function identify(p: Preview, signature: Hex) {
  if(hashTypedData(p)!==p.digest)throw new Error('Preview changed after hashing');
  const signer=(await recoverTypedDataAddress({...p,signature})).toLowerCase() as Address;
  return {signer,digest:p.digest,intentId:keccak256(concatHex([keccak256(stringToHex('papertrade:intent-id:v2')),p.digest,signer]))};
}
export function wire(p: Preview, signature: Hex): Record<string,unknown> {
  const {r,s,yParity}=parseSignature(signature);
  if(yParity!==0&&yParity!==1) throw new Error('Invalid signature parity');
  const signed=Object.fromEntries(Object.entries(p.message).map(([k,v])=>[k,typeof v==='bigint'?v.toString():Array.isArray(v)?v.map(String):v]));
  Object.assign(signed,{v:String(27+yParity),r:r.toLowerCase(),s:s.toLowerCase()});
  return p.kind==='CancelIntent'?signed:{action:p.action,signed};
}
export function validateSigner(p:Preview, signer:Address, nowSec:bigint, session?:{user:Address;key:Address;expiry:bigint;revoked?:boolean}) {
  if(raw(String(p.message.deadline))<=nowSec) throw new Error('Deadline expired');
  const sessionAction=['OpenPosition','Close','CancelIntent'].includes(p.kind);
  if(sessionAction) {
    if(!session||address(session.user)!==address(p.message.user)||session.revoked||session.expiry<=nowSec||session.expiry<BigInt(String(p.message.deadline))||address(signer)!==address(session.key)) throw new Error('Session unauthorized or expires before deadline');
  } else if(address(signer)!==address(p.message.user)) throw new Error('Master wallet required');
}
/** Preview only. BTC quantity is scaled by 1e18; price uses its instrument scale. */
export function hedgeMargin(btcRaw:bigint, referencePriceRaw:bigint, scale:bigint, leverage:bigint) {
  uint(btcRaw);uint(referencePriceRaw);uint(scale);uint(leverage,32);
  if(!btcRaw||!referencePriceRaw||!scale||!leverage) throw new Error('Positive hedge inputs required');
  const denominator=scale*leverage;
  return uint((btcRaw*referencePriceRaw+denominator-1n)/denominator,128);
}
export function btcExposure(marginRaw:bigint, leverage:bigint, entryPriceRaw:bigint, scale:bigint) {
  uint(marginRaw,128);uint(leverage,32);uint(entryPriceRaw,64);uint(scale);
  if(!entryPriceRaw||!scale) throw new Error('Positive entry price and scale required');
  return marginRaw*leverage*scale/entryPriceRaw;
}
/** Necessary local checks only; relayer OI, reservations and admission remain authoritative. */
export function validateOpenLimits(p:Preview,l:{current:boolean;openable:boolean;minimumMargin:bigint;minimumNotional:bigint;minimumLeverage:bigint;maximumLeverage:bigint;maximumNotional:bigint;available:bigint;paperStaked:bigint;minimumPaperStake:bigint}) {
  if(p.kind!=='OpenPosition'||!l.current||!l.openable)throw new Error('Current openable market/account required');
  const margin=uint(p.message.size),leverage=uint(p.message.leverage,32),notional=margin*leverage;
  if(margin<l.minimumMargin||notional<l.minimumNotional||leverage<l.minimumLeverage||leverage>l.maximumLeverage||notional>l.maximumNotional||margin>l.available||l.paperStaked<l.minimumPaperStake)throw new Error('Open exceeds current local limits');
}
