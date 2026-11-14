import { domain, identify, preview, validateSigner, wire } from './protocol.ts';
import type { Preview } from './protocol.ts';
import type { Address, Hex, TypedDataDomain } from 'viem';
import { origin } from './client.ts';
import { object } from './state.ts';

export class SubmissionUnknown extends Error {
  readonly intentId:Hex;
  constructor(intentId:Hex) {super('Submission outcome unknown; reconcile this intent before retrying');this.intentId=intentId;}
}
export class IntakeRejected extends Error {
  readonly code:string;readonly status:number;readonly retryAfter:string|null;
  constructor(code:string,status:number,retryAfter:string|null) {super(`Intake rejected: ${code}`);this.code=code;this.status=status;this.retryAfter=retryAfter;}
}
const rejections=new Set(['invalid_intent','deadline_expired','unauthorized_intent','intent_conflict','admission_rejected','below_minimum_paper_stake','intake_action_paused','rate_limited']);
/** No production signing/custody. Caller supplies a signature. Never retries a POST. */
export class IntentSubmitter {
  private allowLiveWrites:boolean;
  private build:string;
  private transport:typeof fetch;
  private simulationDomain?:TypedDataDomain;
  constructor(options:{allowLiveWrites?:boolean;build:string;transport?:typeof fetch;simulationDomain?:TypedDataDomain}) {
    if(options.simulationDomain&&(options.simulationDomain.chainId!==31337||options.simulationDomain.name!=='Papertrade Research Test'||!options.transport||options.transport===globalThis.fetch))throw new Error('Simulation requires an isolated test domain and injected transport');
    this.simulationDomain=options.simulationDomain;
    this.allowLiveWrites=options.allowLiveWrites===true;this.build=options.build;this.transport=options.transport??fetch;
  }
  async submit(p:Preview,signature:Hex,session:{user:Address;key:Address;expiry:bigint;revoked?:boolean},nowSec=BigInt(Math.floor(Date.now()/1000))) {
    if(!this.allowLiveWrites)throw new Error('Live trading submission is disabled');
    if(!['OpenPosition','Close','CancelIntent'].includes(p.kind)||!this.build.trim())throw new Error('Unsupported production submit route/build');
    const expected=this.simulationDomain??domain(p.kind);
    if(['name','version','chainId','verifyingContract'].some(k=>p.domain[k as keyof TypedDataDomain]!==expected[k as keyof TypedDataDomain]))throw new Error('Unexpected production signing domain');
    const canonical=preview(p.kind,p.message,expected);
    if(canonical.digest!==p.digest)throw new Error('Preview changed after signing');
    const identity=await identify(canonical,signature);validateSigner(canonical,identity.signer,nowSec,session);
    const cancelled=p.kind==='CancelIntent',target=cancelled?String(p.message.intentId):identity.intentId;
    const path=cancelled?`/intents/${target}/cancel`:'/intents';
    try {
      const response=await this.transport(origin+path,{method:'POST',credentials:'same-origin',redirect:'error',cache:'no-store',headers:{Accept:'application/json','Content-Type':'application/json','X-Papertrade-Build':this.build},body:JSON.stringify(wire(canonical,signature)),signal:AbortSignal.timeout(35_000)});
      const body=object(await response.json());
      if(!response.ok||body.error||body.ok===false) {
        const payload=typeof body.payload==='object'&&body.payload?object(body.payload):body;
        const code=String(payload.code??payload.error??body.code??body.error??'');
        if(rejections.has(code)&&response.status<500)throw new IntakeRejected(code,response.status,response.headers.get('retry-after'));
        throw new SubmissionUnknown(target as Hex);
      }
      if(body.intentId!==target||(!cancelled&&body.action!==p.action)||typeof body.state!=='string'||(!cancelled&&!/^(0|[1-9][0-9]*)$/.test(String(body.queueRevision))))throw new SubmissionUnknown(target as Hex);
      // An acknowledgement is deliberately returned without converting it to a fill.
      return {identity,targetIntentId:target,acknowledgement:body};
    } catch(error) {if(error instanceof IntakeRejected||error instanceof SubmissionUnknown)throw error;throw new SubmissionUnknown(target as Hex);}
  }
}
