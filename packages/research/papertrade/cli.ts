/** Explicit read commands only. No CLI route can sign or submit an intent. */
import { PapertradeReader, subscribeTrading } from './client.ts';
import { AccountMirror, object } from './state.ts';
import { address, hedgeMargin, priceRaw, units } from './protocol.ts';
const [command,...args]=process.argv.slice(2);
try {
  const reader=new PapertradeReader();
  if(command==='preview-hedge') {
    if(args.length!==3)throw new Error('preview-hedge <BTC quantity> <USD reference price> <integer leverage>');
    const margin=hedgeMargin(units(args[0],18),priceRaw(args[1],10n),10n,BigInt(args[2]));
    console.log(JSON.stringify({mode:'unsigned-preview',marginRaw:String(margin),amountDecimals:18,warning:'Check current minimums, admission, available funds and actual entry exposure before any separately authorized execution.'}));
  } else if(command==='read-summary')console.log(JSON.stringify(await reader.summary()));
  else if(command==='read-history') {
    const result=object(await reader.history(address(args[0]),'trades'));
    console.log(JSON.stringify({items:Array.isArray(result.items)?result.items.length:null,hasNextPage:result.nextCursor!==null}));
  } else if(command==='read-account') {
    const wallet=address(args[0]),controller=new AbortController(),mirror=new AccountMirror(wallet);
    const timer=setTimeout(()=>controller.abort(),15_000);
    try {for await(const event of reader.accountEvents(wallet,controller.signal)) {
      const s=mirror.ingest(event.data,Date.now());console.log(JSON.stringify({accountRevision:s.accountRevision,indexedThroughBlock:s.indexedThroughBlock,positions:s.positions.length,operations:s.operations.length}));break;
    }}finally{clearTimeout(timer);controller.abort();mirror.disconnect();}
  } else if(command==='read-config')await new Promise<void>((resolve,reject)=>{
    const timer=setTimeout(()=>{s.close();reject(new Error('Configuration bootstrap timed out'));},16_000);
    const s=subscribeTrading(c=>{clearTimeout(timer);console.log(JSON.stringify({indexedThroughBlock:c.indexedThroughBlock,minimumMarginRaw:String(c.minimumTradeSizeRaw),minimumNotionalRaw:String(c.minimumOpenNotionalRaw),minimumPaperStakeRaw:String(c.minimumPaperStakeRaw),intakeRevision:c.intakeRevision,maximumLeverage:c.maximumLeverage,minimumLeverage:c.minimumLeverage}));s.close();resolve();},reason=>{if(reason!=='closed'){clearTimeout(timer);s.close();reject(new Error(reason));}});
  });
  else throw new Error('Commands: preview-hedge, read-summary, read-config, read-history <address>, read-account <address>');
} catch(error) {console.error(error instanceof Error?error.message:'Read failed');process.exitCode=1;}
