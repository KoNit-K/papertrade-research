import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { bytesToHex, hashTypedData } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { keccak_256 } from '@noble/hashes/sha3.js';
import type { Address, Hex } from 'viem';
import { btcExposure, domain, hedgeMargin, identify, internalToUsdc, preview, previewOpen, previewCloseGroups, previewRevocation, units, usdcToInternal, priceRaw, validateOpenLimits, validateSigner, wire } from '../packages/research/papertrade/protocol.ts';
import { AccountMirror, ExecutionTracker } from '../packages/research/papertrade/state.ts';
import type { Operation } from '../packages/research/papertrade/state.ts';
import { PapertradeReader, ReadError, subscribeTrading } from '../packages/research/papertrade/client.ts';
import { IntakeRejected, IntentSubmitter, SubmissionUnknown } from '../packages/research/papertrade/submit.ts';

// All signing uses fresh ephemeral keys and an explicitly isolated domain.
// Accidental default HTTP/WS networking fails immediately in this test process.
globalThis.fetch=async()=>{throw new Error('OFFLINE TEST: external HTTP forbidden');};
globalThis.WebSocket=class {constructor(){throw new Error('OFFLINE TEST: external WS forbidden');}} as unknown as typeof WebSocket;
const user:Address='0x1111111111111111111111111111111111111111';
const testDomain={name:'Papertrade Research Test',version:'1',chainId:31337,verifyingContract:'0x2222222222222222222222222222222222222222' as Address};
const id=('0x'+'ab'.repeat(32)) as Hex,W=10n**18n;
const open=()=>previewOpen({user,instrumentId:0n,isLong:true,margin:'10',leverage:100n,nonce:91n,deadline:2000n},testDomain);
const mock=(fn:(url:string,init:RequestInit)=>Promise<Response>|Response):typeof fetch=>((url,init)=>fn(String(url),init??{})) as typeof fetch;
const frame=()=>({address:user,accountRevision:1,walletRevision:1,queueRevision:'7',indexedThroughBlock:10,indexedThroughTimestamp:1000,balance:String(100n*W),queued:'0',locked:'0',funds:{reservedBalance:'0',reservedQueued:'0',availableBalance:String(100n*W),availableQueued:'0'},sessionKeys:[],paper:{balance:'0',staked:'0',pendingBase:'0',rewardDebt:'0'},operations:[],openPositions:[] as unknown[]});
const pos=(intentId:string=id)=>['21',0,true,false,'700000',String(10n*W),100,'690000',999000,intentId];
const patch=()=>({address:user,baseAccountRevision:1,accountRevision:2,state:{},addedPositions:[] as unknown[],removedPositionIds:[],addedOperations:[],removedOperationIds:[],intentOutcomes:[] as unknown[]});
const operation=():Operation=>({key:'pop-fill-synthetic-1',intentId:id,action:'openPosition',deadline:1100n,state:'prepared',queueRevision:null,positionIds:[],expectedOpen:{instrumentId:0,isLong:true,marginRaw:10n*W,leverage:100n,useDebt:false}});

test('margin, USDC and price scales retain integer precision and reject lossy conversions',()=>{
  assert.equal(open().message.size,10n*W);assert.equal(usdcToInternal(10_000_000n),10n*W);assert.equal(internalToUsdc(10n*W),10_000_000n);
  assert.equal(priceRaw('70000.1',10n),700001n);
  assert.throws(()=>internalToUsdc(W+1n));assert.throws(()=>units('0.0000001',6));assert.throws(()=>units('1e3',18));assert.throws(()=>priceRaw('70000.11',10n));
});
test('hedge preview uses margin, then recomputes exposure at actual entry and rejects invalid inputs',()=>{
  const target=units('0.01',18),margin=hedgeMargin(target,700000n,10n,100n);
  assert.equal(margin,7n*W);assert.equal(btcExposure(margin,100n,700000n,10n),target);
  assert.ok(btcExposure(margin,100n,710000n,10n)<target);assert.throws(()=>hedgeMargin(target,700000n,0n,100n));
});
test('local minimums reject the otherwise correctly sized seven-dollar hedge',()=>{
  const p=open(),limits={current:true,openable:true,minimumMargin:10n*W,minimumNotional:500n*W,minimumLeverage:1n,maximumLeverage:1000n,maximumNotional:10_000_000n*W,available:100n*W,paperStaked:1000n*W,minimumPaperStake:1000n*W};
  validateOpenLimits(p,limits);
  assert.throws(()=>validateOpenLimits(previewOpen({user,instrumentId:0n,isLong:true,margin:'7',leverage:100n,nonce:1n,deadline:2000n},testDomain),limits));
  assert.throws(()=>validateOpenLimits(p,{...limits,paperStaked:0n}));assert.throws(()=>validateOpenLimits(p,{...limits,current:false}));
});
test('production domains distinguish cancellation and staking from Exchange',()=>{
  assert.equal(domain('OpenPosition').name,'String');assert.equal(domain('CancelIntent').version,'2');assert.equal(domain('CancelIntent').verifyingContract,domain('Close').verifyingContract);assert.notEqual(domain('Stake').verifyingContract,domain('Close').verifyingContract);
});
test('EIP-712 primitive matches the independent published Ether Mail reference digest',()=>{
  assert.equal(hashTypedData({domain:{name:'Ether Mail',version:'1',chainId:1,verifyingContract:'0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'},types:{Person:[{name:'name',type:'string'},{name:'wallet',type:'address'}],Mail:[{name:'from',type:'Person'},{name:'to',type:'Person'},{name:'contents',type:'string'}]},primaryType:'Mail',message:{from:{name:'Cow',wallet:'0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'},to:{name:'Bob',wallet:'0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'},contents:'Hello, Bob!'}}),'0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2');
});
test('ephemeral signatures recover; intent ID independently concatenates 32+32+20 raw bytes',async()=>{
  const account=privateKeyToAccount(generatePrivateKey()),p=open(),signature=await account.signTypedData(p),i=await identify(p,signature);
  assert.equal(i.signer,account.address.toLowerCase());
  const tag=keccak_256(new TextEncoder().encode('papertrade:intent-id:v2'));
  assert.equal(i.intentId,bytesToHex(keccak_256(Buffer.concat([tag,Buffer.from(p.digest.slice(2),'hex'),Buffer.from(i.signer.slice(2),'hex')]))));
  const request=wire(p,signature);assert.equal((request.signed as Record<string,unknown>).size,String(10n*W));assert.doesNotThrow(()=>JSON.stringify(request));
});
test('wrong domain, contract, chain, nonce or deadline cannot recover the expected signer',async()=>{
  const account=privateKeyToAccount(generatePrivateKey()),p=open(),signature=await account.signTypedData(p);
  for(const d of [{...testDomain,name:'Wrong'},{...testDomain,chainId:31338},{...testDomain,verifyingContract:user}])assert.notEqual((await identify(preview('OpenPosition',p.message,d),signature)).signer,account.address.toLowerCase());
  for(const m of [{...p.message,nonce:92n},{...p.message,deadline:2001n}])assert.notEqual((await identify(preview('OpenPosition',m,testDomain),signature)).signer,account.address.toLowerCase());
});
test('authorization rejects wrong signer, expired/revoked session, short expiry and wrong master',()=>{
  const p=open(),session={user,key:user,expiry:3000n};validateSigner(p,user,1000n,session);assert.throws(()=>validateSigner(p,user,1000n,{...session,user:testDomain.verifyingContract}));
  assert.throws(()=>validateSigner(p,testDomain.verifyingContract,1000n,session));assert.throws(()=>validateSigner(p,user,2001n,session));assert.throws(()=>validateSigner(p,user,1000n,{...session,revoked:true}));assert.throws(()=>validateSigner(p,user,1000n,{...session,expiry:1999n}));
  const r=preview('RegisterSessionKey',{user,key:testDomain.verifyingContract,expiry:3000n,feeAddress:'0x0000000000000000000000000000000000000000',nonce:1n,deadline:2000n},testDomain);assert.throws(()=>validateSigner(r,testDomain.verifyingContract,1000n));
});
test('full-position Close arrays hash in order; partial size, duplicates, empty or >12 are rejected',()=>{
  const base={user,positionIds:[1n,2n],nonce:1n,deadline:2000n};const p=preview('Close',base,testDomain);
  assert.notEqual(p.digest,preview('Close',{...base,positionIds:[2n,1n]},testDomain).digest);
  for(const ids of [[],[1n,1n],Array.from({length:13},(_,i)=>BigInt(i))])assert.throws(()=>preview('Close',{...base,positionIds:ids},testDomain));
  assert.throws(()=>preview('Close',{...base,size:1n},testDomain));assert.throws(()=>preview('OpenPosition',{...open().message,size:1n<<128n},testDomain));
  const groups=previewCloseGroups(user,Array.from({length:13},(_,i)=>BigInt(i+1)),91n,2000n,testDomain);assert.equal(groups.length,2);assert.equal(groups[1].message.nonce,92n);assert.deepEqual(groups[1].message.positionIds,[13n]);
  assert.equal(previewRevocation(user).requiresMainWallet,true);
});
test('master-only PAPER and withdrawal preview fields encode without submitting',()=>{
  for(const kind of ['Stake','Unstake','WithdrawToCore'] as const)assert.equal(preview(kind,{user,amount:W,nonce:1n,deadline:2000n},testDomain).message.amount,W);
  for(const kind of ['Claim','Distribute'] as const)assert.equal(preview(kind,{user,nonce:1n,deadline:2000n},testDomain).message.nonce,1n);
});
test('mirror validates full snapshot and patch revision/funds/position joins',()=>{
  const mirror=new AccountMirror(user);mirror.ingest(frame(),1_000_000);const p=patch();p.addedPositions=[pos()];p.state={locked:String(10n*W)};
  assert.equal(mirror.ingest(p,1_000_001).positions[0].entryPriceRaw,700000n);assert.equal(mirror.fresh(1_001_000),true);
  assert.throws(()=>mirror.ingest(p,1_000_002));assert.equal(mirror.current,false);
});
test('lost/out-of-order increment and reconnect require a new snapshot; stale source time is rejected for readiness',()=>{
  const mirror=new AccountMirror(user);mirror.ingest(frame(),1_000_000);
  assert.throws(()=>mirror.ingest({...patch(),baseAccountRevision:2},1_000_001));assert.throws(()=>mirror.ingest(patch(),1_000_002));
  mirror.ingest(frame(),1_000_003);assert.equal(mirror.fresh(1_100_000),false);
  mirror.disconnect();assert.equal(mirror.fresh(1_000_004),false);assert.throws(()=>mirror.ingest({...frame(),indexedThroughBlock:9},1_000_005));
});
test('mirror rejects account changes, duplicate positions and inconsistent available/locked funds',()=>{
  for(const f of [{...frame(),address:testDomain.verifyingContract},{...frame(),openPositions:[pos(),pos()],locked:String(20n*W)},{...frame(),locked:'1'}])assert.throws(()=>new AccountMirror(user).ingest(f,1_000_000));
});
test('HTTP confirmed is queued, timeout is unknown, and restart cannot allocate a second opening intent',()=>{
  const t=new ExecutionTracker();t.reserve(operation());t.begin(operation().key);t.receipt(operation().key,{intentId:id,action:'openPosition',state:'confirmed',queueRevision:'7'});assert.equal(t.export()[0].state,'queued');
  t.timeout(operation().key);const restarted=new ExecutionTracker(t.export());assert.equal(restarted.export()[0].state,'unknown');assert.throws(()=>restarted.begin(operation().key));assert.throws(()=>restarted.reserve({...operation(),intentId:'0x'+'cd'.repeat(32)}));
});
test('open execution requires actual matching position; duplicate/mismatched positions require reconciliation',()=>{
  for(const count of [1,2]){
    const t=new ExecutionTracker([operation()]),m=new AccountMirror(user),f=frame();f.openPositions=Array.from({length:count},(_,i)=>{const p=pos();p[0]=String(21+i);return p;});f.locked=String(BigInt(count)*10n*W);m.ingest(f,1_000_000);
    assert.equal(t.observe(operation().key,m,1_000_001).state,count===1?'executed':'reconcile');
  }
});
test('receipt revision barrier and disconnected/stale mirror prevent premature confirmation',()=>{
  const t=new ExecutionTracker([operation()]);t.receipt(operation().key,{intentId:id,action:'openPosition',queueRevision:'8',state:'queued'});const m=new AccountMirror(user);const f=frame();f.openPositions=[pos()];f.locked=String(10n*W);m.ingest(f,1_000_000);
  assert.equal(t.observe(operation().key,m,1_000_001).state,'queued');m.disconnect();assert.equal(t.observe(operation().key,m,1_000_002).state,'queued');
});
test('deadline passage and absence alone do not prove expiry or failed execution',()=>{
  const t=new ExecutionTracker([operation()]),m=new AccountMirror(user);const f=frame();f.indexedThroughTimestamp=3000;m.ingest(f,3_000_000);assert.equal(t.observe(operation().key,m,3_000_001).state,'prepared');
});
test('cancel request racing a fill resolves to actual position, while contradictory terminal evidence reconciles',()=>{
  const t=new ExecutionTracker([operation()]),m=new AccountMirror(user),f=frame();f.openPositions=[pos()];f.locked=String(10n*W);m.ingest(f,1_000_000);assert.equal(t.observe(operation().key,m,1_000_001).state,'executed');
  const p=patch();p.removedPositionIds=['21'] as never[];p.state={locked:'0'};p.intentOutcomes=[[id,'cancelled']];m.ingest(p,1_000_002);assert.equal(t.observe(operation().key,m,1_000_003).state,'reconcile');
});
test('close success needs per-intent success plus all requested IDs absent; group outcomes remain separate',()=>{
  const t=new ExecutionTracker([{...operation(),action:'closePositions',positionIds:['21']}]),m=new AccountMirror(user);m.ingest(frame(),1_000_000);assert.equal(t.observe(operation().key,m,1_000_001).state,'prepared');
  const p=patch();p.intentOutcomes=[[id,'succeeded']];m.ingest(p,1_000_002);assert.equal(t.observe(operation().key,m,1_000_003).state,'executed');
});
test('readonly history sorts canonical query keys and preserves rate-limit metadata without retry',async()=>{
  let calls=0;const reader=new PapertradeReader(mock((url,init)=>{calls++;assert.equal(init.method,'GET');assert.ok(url.endsWith('/trades?filter=all&limit=75'));return Response.json({items:[],nextCursor:null});}));await reader.history(user,'trades');assert.equal(calls,1);
  const limited=new PapertradeReader(mock(()=>{calls++;return new Response('',{status:429,headers:{'Retry-After':'5'}});}));await assert.rejects(limited.summary(),e=>e instanceof ReadError&&e.retryAfter==='5');assert.equal(calls,2);
});
test('a partial close-group failure never rolls back a separately confirmed earlier group',()=>{
  const first={...operation(),action:'closePositions' as const,positionIds:['21']},second={...first,key:'group-2',intentId:'0x'+'cd'.repeat(32),positionIds:['22']};
  const t=new ExecutionTracker([first,second]),m=new AccountMirror(user),f=frame();m.ingest(f,1_000_000);
  const p=patch();p.intentOutcomes=[[first.intentId,'succeeded'],[second.intentId,'failed']];m.ingest(p,1_000_001);
  assert.equal(t.observe(first.key,m,1_000_002).state,'executed');assert.equal(t.observe(second.key,m,1_000_002).state,'failed');
});
test('SSE parser handles fragmented CRLF, liveness and a wallet snapshot, then closes cleanly',async()=>{
  let cancelled=false;const text=`event: liveness\r\ndata: {"heartbeatIntervalMs":10000}\r\n\r\nevent: wallet\r\ndata: ${JSON.stringify(frame())}\r\n\r\n`;
  const reader=new PapertradeReader(mock(()=>new Response(new ReadableStream({start(c){for(const part of [text.slice(0,19),text.slice(19)])c.enqueue(new TextEncoder().encode(part));},cancel(){cancelled=true;}}),{headers:{'Content-Type':'text/event-stream'}})));
  for await(const f of reader.accountEvents(user,new AbortController().signal)){assert.equal(f.event,'wallet');assert.equal(new AccountMirror(user).ingest(f.data,1_000_000).accountRevision,1);break;}assert.equal(cancelled,true);
});
test('WS consumes bootstrap publications, pongs and invalidates on close or unknown schema',()=>{
  class Socket extends EventEmitter {sent:string[]=[];send(s:string){this.sent.push(s);}close(){this.emit('close');}addEventListener(n:string,f:(e:any)=>void){this.on(n,f);}}
  const socket=new Socket(),config={schemaVersion:1,indexedThroughBlock:10,tradingPaused:false,minimumTradeSizeRaw:String(10n*W),minimumOpenNotionalRaw:String(500n*W),intakeControls:[1,String(1000n*W),[]],instruments:[]};let received=0,disconnects=0;
  const s=subscribeTrading(c=>{received++;assert.equal(c.minimumPaperStakeRaw,1000n*W);},()=>disconnects++,()=>socket as unknown as WebSocket);
  socket.emit('open');socket.emit('message',{data:'{"id":1,"connect":{}}'});socket.emit('message',{data:JSON.stringify({id:2,subscribe:{publications:[{data:config}]}})});assert.equal(received,1);assert.equal(s.current(),true);
  socket.emit('message',{data:'{}'});assert.equal(socket.sent.at(-1),'{}');socket.emit('message',{data:'{"push":{"channel":"trading:current","pub":{"delta":true}}}'});assert.equal(s.current(),false);assert.ok(disconnects>0);s.close();
});
test('real submission defaults closed before any transport or signature operation',async()=>{
  let calls=0;const s=new IntentSubmitter({build:'synthetic',transport:mock(()=>{calls++;throw new Error('Unexpected network');})});await assert.rejects(s.submit(open(),'0x' as Hex,{user,key:user,expiry:3000n},1000n),/disabled/);assert.equal(calls,0);
});
test('simulation POST is correlated, never retried, and a 200 queued acknowledgement remains an acknowledgement',async()=>{
  const a=privateKeyToAccount(generatePrivateKey()),p=open(),sig=await a.signTypedData(p),i=await identify(p,sig);let calls=0;
  const s=new IntentSubmitter({allowLiveWrites:true,build:'synthetic',simulationDomain:testDomain,transport:mock((url,init)=>{calls++;assert.equal(url,'https://exchange.papertrade.xyz/intents');assert.equal(init.method,'POST');return Response.json({intentId:i.intentId,action:p.action,state:'confirmed',queueRevision:'7'});})});
  assert.equal((await s.submit(p,sig,{user,key:a.address,expiry:3000n},1000n)).acknowledgement.state,'confirmed');assert.equal(calls,1);
});
test('submission transport timeout, malformed/mismatched reply and 5xx preserve unknown original intent',async()=>{
  const a=privateKeyToAccount(generatePrivateKey()),p=open(),sig=await a.signTypedData(p);
  for(const transport of [mock(()=>{throw new Error('timeout after acceptance');}),mock(()=>Response.json({intentId:id,action:p.action,state:'queued',queueRevision:'7'})),mock(()=>new Response('bad',{status:503}))]){
    const s=new IntentSubmitter({allowLiveWrites:true,build:'synthetic',simulationDomain:testDomain,transport});await assert.rejects(s.submit(p,sig,{user,key:a.address,expiry:3000n},1000n),SubmissionUnknown);
  }
});
test('recognized intake rejection is distinct from unknown and production domain mismatch fails closed',async()=>{
  const a=privateKeyToAccount(generatePrivateKey()),p=open(),sig=await a.signTypedData(p);
  const s=new IntentSubmitter({allowLiveWrites:true,build:'synthetic',simulationDomain:testDomain,transport:mock(()=>Response.json({error:'rate_limited'},{status:429,headers:{'Retry-After':'2'}}))});await assert.rejects(s.submit(p,sig,{user,key:a.address,expiry:3000n},1000n),IntakeRejected);
  const production=new IntentSubmitter({allowLiveWrites:true,build:'synthetic'});await assert.rejects(production.submit(p,sig,{user,key:a.address,expiry:3000n},1000n),/domain/);
});
test('cancel uses target intent in URL and flat signed body, with its own test-domain signature',async()=>{
  const a=privateKeyToAccount(generatePrivateKey()),p=preview('CancelIntent',{user,intentId:id,deadline:2000n},testDomain),sig=await a.signTypedData(p);
  const s=new IntentSubmitter({allowLiveWrites:true,build:'synthetic',simulationDomain:testDomain,transport:mock((url,init)=>{assert.ok(url.endsWith(`/intents/${id}/cancel`));const b=JSON.parse(String(init.body));assert.equal(b.intentId,id);assert.equal(b.action,undefined);return Response.json({intentId:id,action:'openPosition',state:'cancelled'});})});assert.equal((await s.submit(p,sig,{user,key:a.address,expiry:3000n},1000n)).targetIntentId,id);
});
