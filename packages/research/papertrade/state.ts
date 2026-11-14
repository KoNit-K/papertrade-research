import { address, raw, uint } from './protocol.ts';
import type { Address } from 'viem';

export function object(input:unknown):Record<string,unknown> {
  if(!input||typeof input!=='object'||Array.isArray(input)) throw new Error('Expected object');
  return input as Record<string,unknown>;
}
function integer(v:unknown) {if(!Number.isSafeInteger(v)||Number(v)<0) throw new Error('Invalid revision/time');return Number(v);}
function array(v:unknown):unknown[] {if(!Array.isArray(v)) throw new Error('Expected array');return v;}
function hash(v:unknown):string {if(typeof v!=='string'||!/^0x[0-9a-f]{64}$/.test(v)) throw new Error('Invalid intent ID');return v;}
export type Position={id:string;instrumentId:number;isLong:boolean;useDebt:boolean;entryPriceRaw:bigint;marginRaw:bigint;leverage:bigint;bustPriceRaw:bigint;openedAtMs:number;intentId:string|null};
function position(input:unknown):Position {
  const p=array(input);if(p.length!==10||typeof p[2]!=='boolean'||typeof p[3]!=='boolean') throw new Error('Invalid position tuple');
  const entry=raw(p[4],64);if(!entry) throw new Error('Zero entry');
  return {id:raw(p[0]).toString(),instrumentId:integer(p[1]),isLong:p[2],useDebt:p[3],entryPriceRaw:entry,marginRaw:raw(p[5],128),leverage:uint(BigInt(integer(p[6])),32),bustPriceRaw:raw(p[7],64),openedAtMs:integer(p[8]),intentId:p[9]===null?null:hash(p[9])};
}
export type Outcome='succeeded'|'failed'|'expired'|'cancelled'|'unknown';
export type AccountSnapshot={address:Address;accountRevision:number;walletRevision:number;queueRevision:bigint;indexedThroughBlock:number;indexedThroughTimestamp:number;balance:bigint;queued:bigint;locked:bigint;availableBalance:bigint;availableQueued:bigint;sessionKeys:Record<string,bigint>;positions:Position[];operations:unknown[];outcomes:Map<string,Outcome>;closedPositions:unknown[];paper:Record<string,unknown>};
/** No browser storage. A broken stream invalidates the mirror until a full snapshot. */
export class AccountMirror {
  snapshot:AccountSnapshot|null=null;
  current=false;
  receivedAtMs=0;
  private frame:Record<string,unknown>|null=null;
  readonly wallet:Address;readonly maxAgeMs:number;
  constructor(wallet:Address,maxAgeMs=45_000) {this.wallet=address(wallet);this.maxAgeMs=maxAgeMs;}
  disconnect() {this.current=false;this.frame=null;}
  fresh(nowMs:number) {return this.current&&!!this.snapshot&&nowMs>=this.receivedAtMs&&nowMs-this.receivedAtMs<this.maxAgeMs&&Math.abs(nowMs-this.snapshot.indexedThroughTimestamp*1000)<this.maxAgeMs;}
  ingest(input:unknown,nowMs:number):AccountSnapshot {
    try {
      const incoming=structuredClone(object(input));
      if(address(incoming.address)!==address(this.wallet)) throw new Error('Account mismatch');
      let f=incoming;
      if('baseAccountRevision' in incoming) {
        if(!this.current||!this.frame||integer(incoming.baseAccountRevision)!==this.snapshot?.accountRevision) throw new Error('Account increment lost or out of order; snapshot required');
        const merge=(old:unknown,added:unknown,removed:unknown,positionIds:boolean)=>{
          const key=(v:unknown)=>positionIds?raw(array(v)[0]).toString():hash(array(v)[0]);
          const items=new Map(array(old).map(v=>[key(v),v]));const removedSet=new Set<string>();
          for(const v of array(removed)){const k=positionIds?raw(v).toString():hash(v);if(removedSet.has(k)||!items.delete(k)) throw new Error('Invalid removal');removedSet.add(k);}
          for(const v of array(added)){const k=key(v);if(removedSet.has(k)||items.has(k)) throw new Error('Invalid addition');items.set(k,v);}
          return [...items.values()];
        };
        f={...this.frame,...object(incoming.state),accountRevision:incoming.accountRevision,
          openPositions:merge(this.frame.openPositions,incoming.addedPositions,incoming.removedPositionIds,true),
          operations:merge(this.frame.operations,incoming.addedOperations,incoming.removedOperationIds,false),
          intentOutcomes:incoming.intentOutcomes??[],closedPositions:incoming.closedPositions??[]};
      }
      const rev=integer(f.accountRevision),queue=raw(f.queueRevision,64),walletRev=integer(f.walletRevision),block=integer(f.indexedThroughBlock);
      if(!rev||this.snapshot&&(rev<this.snapshot.accountRevision||this.current&&rev===this.snapshot.accountRevision||queue<this.snapshot.queueRevision||walletRev<this.snapshot.walletRevision||block<this.snapshot.indexedThroughBlock)) throw new Error('Regressing account state');
      const positions=array(f.openPositions).map(position);
      if(new Set(positions.map(p=>p.id)).size!==positions.length) throw new Error('Duplicate position');
      const locked=raw(f.locked),balance=raw(f.balance),queued=raw(f.queued),funds=object(f.funds);
      const reservedBalance=raw(funds.reservedBalance),reservedQueued=raw(funds.reservedQueued),availableBalance=raw(funds.availableBalance),availableQueued=raw(funds.availableQueued);
      const sub=(a:bigint,b:bigint)=>a>b?a-b:0n;
      if(locked!==positions.reduce((a,p)=>a+p.marginRaw,0n)||availableBalance!==sub(balance,reservedBalance)||availableQueued!==sub(queued,reservedQueued)) throw new Error('Inconsistent account funds');
      const sessions:Record<string,bigint>={};
      for(const v of array(f.sessionKeys)){const [key,expiry]=array(v),k=address(key);if(k in sessions) throw new Error('Duplicate session');sessions[k]=raw(expiry,64);}
      const outcomes=new Map<string,Outcome>();
      for(const v of array(f.intentOutcomes??[])){const [id,status]=array(v);if(!['succeeded','failed','expired','cancelled','unknown'].includes(String(status))||outcomes.has(hash(id))) throw new Error('Invalid outcome');outcomes.set(hash(id),status as Outcome);}
      const operations=array(f.operations);const ids=operations.map(v=>hash(array(v)[0]));if(new Set(ids).size!==ids.length) throw new Error('Duplicate operation');
      this.snapshot={address:address(f.address),accountRevision:rev,walletRevision:walletRev,queueRevision:queue,indexedThroughBlock:block,indexedThroughTimestamp:integer(f.indexedThroughTimestamp),balance,queued,locked,availableBalance,availableQueued,sessionKeys:sessions,positions,operations,outcomes,closedPositions:array(f.closedPositions??[]),paper:object(f.paper)};
      this.frame=f;this.current=true;this.receivedAtMs=nowMs;return this.snapshot;
    } catch(error) {this.disconnect();throw error;}
  }
}

export type ExecutionState='prepared'|'submitting'|'unknown'|'queued'|'executed'|'failed'|'expired'|'cancelled'|'reconcile';
export type Operation={key:string;intentId:string;action:'openPosition'|'closePositions';deadline:bigint;state:ExecutionState;queueRevision:bigint|null;positionIds:string[];expectedOpen?:{instrumentId:number;isLong:boolean;marginRaw:bigint;leverage:bigint;useDebt:boolean}};
/** One logical operation may never silently acquire a new intent/nonce after timeout. */
export class ExecutionTracker {
  private records=new Map<string,Operation>();
  constructor(initial:Operation[]=[]) {for(const op of initial)this.reserve(op);}
  reserve(op:Operation) {
    hash(op.intentId);const existing=this.records.get(op.key);
    if(existing) {if(existing.intentId!==op.intentId) throw new Error('Reconcile existing operation before replacing intent');return structuredClone(existing);}
    if([...this.records.values()].some(v=>v.intentId===op.intentId)) throw new Error('Intent already bound');
    this.records.set(op.key,structuredClone(op));return structuredClone(op);
  }
  begin(key:string) {const op=this.get(key);if(op.state!=='prepared') throw new Error('No automatic resubmission');op.state='submitting';}
  timeout(key:string) {const op=this.get(key);if(!['executed','failed','cancelled','expired'].includes(op.state))op.state='unknown';}
  receipt(key:string,input:unknown) {
    const op=this.get(key),r=object(input);
    if(r.intentId!==op.intentId||r.action!==op.action) {this.timeout(key);throw new Error('Mismatched acknowledgement');}
    const revision=raw(r.queueRevision,64);if(['executed','failed','cancelled','expired'].includes(op.state))return;
    op.queueRevision=revision;op.state='queued'; // including HTTP state="confirmed"
  }
  observe(key:string,mirror:AccountMirror,nowMs:number) {
    const op=this.get(key),s=mirror.snapshot;
    if(!mirror.fresh(nowMs)||!s||op.queueRevision!==null&&s.queueRevision<op.queueRevision)return structuredClone(op);
    const matches=s.positions.filter(p=>p.intentId===op.intentId),outcome=s.outcomes.get(op.intentId);
    if(op.action==='openPosition'&&matches.length) {
      const p=matches[0],e=op.expectedOpen;
      if(matches.length!==1||!e||p.instrumentId!==e.instrumentId||p.isLong!==e.isLong||p.marginRaw!==e.marginRaw||p.leverage!==e.leverage||p.useDebt!==e.useDebt)op.state='reconcile';
      else {op.state='executed';op.positionIds=[p.id];}
    } else if(outcome==='succeeded') {
      // An open can have executed and closed between snapshots: historical evidence required.
      op.state=op.action==='closePositions'&&op.positionIds.every(id=>!s.positions.some(p=>p.id===id))?'executed':'reconcile';
    } else if(outcome&&outcome!=='unknown') {
      if(op.state==='executed')op.state='reconcile';else op.state=outcome;
    }
    // Passing the local deadline alone never proves non-execution.
    return structuredClone(op);
  }
  export():Operation[] {return structuredClone([...this.records.values()]);}
  private get(key:string) {const op=this.records.get(key);if(!op)throw new Error('Unknown operation');return op;}
}
