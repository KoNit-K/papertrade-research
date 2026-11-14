import { address, raw } from './protocol.ts';
import { object } from './state.ts';
import type { Address } from 'viem';
export const origin='https://exchange.papertrade.xyz';
export class ReadError extends Error {
  readonly status:number;readonly retryAfter:string|null;
  constructor(status:number,retryAfter:string|null) {super(`Read failed: HTTP ${status}`);this.status=status;this.retryAfter=retryAfter;}
}
export class PapertradeReader {
  private transport:typeof fetch;
  constructor(transport:typeof fetch=fetch) {this.transport=transport;}
  private async get(path:string,signal?:AbortSignal):Promise<unknown> {
    const response=await this.transport(origin+path,{method:'GET',credentials:'same-origin',redirect:'error',headers:{Accept:'application/json'},signal:signal?AbortSignal.any([signal,AbortSignal.timeout(10_000)]):AbortSignal.timeout(10_000)});
    if(!response.ok)throw new ReadError(response.status,response.headers.get('retry-after'));
    return response.json();
  }
  summary(signal?:AbortSignal) {return this.get('/query/protocol/summary',signal);}
  async history(wallet:Address,kind:'trades'|'cashflows'|'staking'|'queue',options:{cursor?:string;limit?:number;filter?:string;signal?:AbortSignal}={}) {
    if(!['trades','cashflows','staking','queue'].includes(kind))throw new Error('Unsupported read');
    const limit=options.limit??75;
    if(!Number.isInteger(limit)||limit<1||limit>200||options.cursor&&options.cursor.length>2048)throw new Error('Invalid pagination');
    const q=new URLSearchParams({limit:String(limit)});
    if(options.cursor)q.set('cursor',options.cursor);if(kind==='trades')q.set('filter',options.filter??'all');
    else if(options.filter)throw new Error('Filter is only supported for trades');
    q.sort(); // Current server rejects equivalent noncanonical query ordering with HTTP 400.
    const page=object(await this.get(`/query/accounts/${address(wallet)}/${kind}?${q}`,options.signal));
    if(!Array.isArray(page.items)||page.items.length>200||page.nextCursor!==null&&(typeof page.nextCursor!=='string'||!page.nextCursor||page.nextCursor.length>2048||page.nextCursor===options.cursor))throw new Error('Invalid/repeated history cursor');
    return page;
  }
  queueRanks(wallet:Address,signal?:AbortSignal) {return this.get(`/queue-rank/accounts/${address(wallet)}`,signal);}
  priceHistory(instrumentId:number,fromMs:number,toMs:number,intervalMs:number,signal?:AbortSignal) {
    if(![instrumentId,fromMs,toMs,intervalMs].every(Number.isSafeInteger)||instrumentId<0||fromMs<0||toMs<=fromMs||intervalMs<1)throw new Error('Invalid history window');
    const q=new URLSearchParams({fromMs:String(fromMs),toMs:String(toMs),intervalMs:String(intervalMs)});q.sort();
    return this.get(`/query/markets/${instrumentId}/price-history?${q}`,signal);
  }
  /** One SSE connection. On reconnect callers must invalidate their mirror and obtain a full snapshot. */
  async *accountEvents(wallet:Address,signal:AbortSignal):AsyncGenerator<{event:string;data:unknown}> {
    const controller=new AbortController();let timer:ReturnType<typeof setTimeout>;
    const reset=(ms:number)=>{clearTimeout(timer);timer=setTimeout(()=>controller.abort(),ms);};
    reset(15_000);
    let reader:ReadableStreamDefaultReader<Uint8Array>|undefined;
    try {
      const response=await this.transport(`${origin}/state/user/live?wallet=${address(wallet)}`,{method:'GET',credentials:'include',redirect:'error',headers:{Accept:'text/event-stream'},signal:AbortSignal.any([signal,controller.signal])});
      if(!response.ok)throw new ReadError(response.status,response.headers.get('retry-after'));
      if(!response.headers.get('content-type')?.startsWith('text/event-stream')||!response.body)throw new Error('Expected SSE');
      reader=response.body.getReader();const decoder=new TextDecoder();let buffer='',event='',data:string[]=[];let silence=45_000;
      for(;;) {
        const chunk=await reader.read();if(chunk.done)throw new Error('Account stream disconnected; resnapshot required');
        buffer+=decoder.decode(chunk.value,{stream:true});if(buffer.length>1_000_000)throw new Error('Oversized SSE frame');
        let end:number;
        while((end=buffer.indexOf('\n'))>=0) {
          const line=buffer.slice(0,end).replace(/\r$/,'');buffer=buffer.slice(end+1);
          if(line==='') {
            if(data.length) {
              const parsed:unknown=JSON.parse(data.join('\n'));
              if(event==='heartbeat') {if(parsed!==null)throw new Error('Invalid heartbeat');}
              else if(event==='liveness') {const n=object(parsed).heartbeatIntervalMs;if(!Number.isSafeInteger(n)||Number(n)<=0)throw new Error('Invalid liveness');silence=Math.min(45_000,3*Number(n));}
              else if(event==='wallet')yield {event,data:parsed};
              reset(silence);
            }
            event='';data=[];
          } else if(line.startsWith('event:'))event=line.slice(6).trim();
          else if(line.startsWith('data:'))data.push(line.slice(5).replace(/^ /,''));
        }
      }
    } finally {clearTimeout(timer!);controller.abort();await reader?.cancel().catch(()=>undefined);}
  }
}

export type TradingConfig={indexedThroughBlock:number;minimumTradeSizeRaw:bigint;minimumOpenNotionalRaw:bigint;intakeRevision:number;minimumPaperStakeRaw:bigint;pausedActions:string[];maximumLeverage:number;minimumLeverage:number;instruments:unknown[][];raw:Record<string,unknown>};
export function tradingConfig(input:unknown):TradingConfig {
  const f=object(input),intake=f.intakeControls;
  if(f.schemaVersion!==1||!Number.isSafeInteger(f.indexedThroughBlock)||typeof f.tradingPaused!=='boolean'||!Array.isArray(f.instruments)||!Array.isArray(intake)||intake.length!==3||!Number.isSafeInteger(intake[0])||!Array.isArray(intake[2])||!intake[2].every(x=>typeof x==='string'))throw new Error('Unknown trading schema');
  for(const i of f.instruments)if(!Array.isArray(i)||i.length!==23)throw new Error('Unknown instrument tuple');
  return {indexedThroughBlock:Number(f.indexedThroughBlock),minimumTradeSizeRaw:raw(f.minimumTradeSizeRaw),minimumOpenNotionalRaw:raw(f.minimumOpenNotionalRaw),intakeRevision:Number(intake[0]),minimumPaperStakeRaw:raw(intake[1]),pausedActions:intake[2],maximumLeverage:Number(f.maximumLeverage??0),minimumLeverage:Number(f.minimumLeverage??0),instruments:f.instruments,raw:structuredClone(f)};
}
/** Requests full publications, never fossil deltas; disconnect invalidates readiness. No hidden reconnect. */
export function subscribeTrading(onConfig:(config:TradingConfig)=>void,onDisconnect:(reason:string)=>void,createSocket:(url:string)=>WebSocket=url=>new WebSocket(url)) {
  const socket=createSocket('wss://stream.papertrade.xyz/connection/websocket');let live=false,lastConfigAt=0;
  let silence:ReturnType<typeof setTimeout>;
  const activity=()=>{clearTimeout(silence);silence=setTimeout(()=>{live=false;onDisconnect('silence_timeout');socket.close();},45_000);};
  const timeout=setTimeout(()=>{onDisconnect('bootstrap_timeout');socket.close();},15_000);
  socket.addEventListener('open',()=>socket.send(JSON.stringify({id:1,connect:{}})));
  socket.addEventListener('message',event=>{
    try {
      for(const line of String(event.data).split('\n').filter(Boolean)) {
        const reply=object(JSON.parse(line));
        activity();
        if(Object.keys(reply).length===0){socket.send('{}');continue;}
        if(reply.error)throw new Error('Subscription rejected');
        if(reply.id===1)socket.send(JSON.stringify({id:2,subscribe:{channel:'trading:current'}}));
        const push=reply.push?object(reply.push):null;
        const initial=reply.id===2&&reply.subscribe?object(reply.subscribe).publications:undefined;
        const publications=Array.isArray(initial)?initial:push&&push.channel==='trading:current'&&push.pub?[push.pub]:[];
        for(const pub of publications) {
          const publication=object(pub);if(publication.delta)throw new Error('Unexpected delta; full snapshot required');
          const config=tradingConfig(publication.data);clearTimeout(timeout);live=true;lastConfigAt=Date.now();onConfig(config);
        }
      }
    } catch {live=false;onDisconnect('invalid_publication');socket.close();}
  });
  socket.addEventListener('error',()=>{live=false;onDisconnect('transport_error');});
  socket.addEventListener('close',()=>{clearTimeout(timeout);clearTimeout(silence);live=false;onDisconnect('closed');});
  return {current:()=>live&&Date.now()-lastConfigAt<45_000,close:()=>{clearTimeout(timeout);clearTimeout(silence);live=false;socket.close();}};
}
