import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { ADAPTER_VERSION, assertSource, isProject, sourcesFor } from './adapters.ts';
import type { Project, Source } from './adapters.ts';

const LIMIT = 2_000_000;
const ID = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,100}$/;
const hash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
const iso = () => new Date().toISOString();
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
type Status = 'ok' | 'http_error' | 'access_denied' | 'rate_limited' | 'redirect_rejected' | 'network_error' | 'timeout' | 'invalid_json' | 'response_too_large';
export interface Outcome {
  evidence_id: string; source: Source; params: Record<string, string>; started_at: string; finished_at: string;
  status: Status; http_status: number | null; response_sha256: string | null; response_file: string | null;
  retry_after_seconds: number | null;
}
export interface Run {
  schema_version: 'competitors-run-v1'; adapter_version: typeof ADAPTER_VERSION; id: string; project_id: Project;
  started_at: string; finished_at: string; status: 'complete' | 'partial' | 'blocked'; missing_reason: string | null;
  policy: { max_requests: 60; min_interval_ms: 1000; timeout_ms: 30000; max_response_bytes: 2000000 };
  outcomes: Outcome[];
}
export interface Metric {
  project_id: Project; metric: string; value: number | null; unit: string; window_start: string | null; window_end: string | null;
  as_of: string | null; retrieved_at: string; source_url: string | null; params: Record<string, string>;
  source_version: string | null; calculation: string; evidence_ids: string[]; coverage: string; missing_reason: string | null;
}
export interface Report { schema_version: 'competitors-report-v1'; run_id: string; adapter_version: string; metrics: Metric[] }
export function runDirectory(root: string, id: string): string {
  if (!ID.test(id)) throw new Error('Invalid run id');
  return join(resolve(root), 'data/private/competitors/runs', id);
}
export async function refresh(root: string, project: Project, options: { transport?: typeof fetch; wait?: typeof sleep; run_id?: string } = {}): Promise<Run> {
  if (!isProject(project)) throw new Error('Unknown project');
  const id = options.run_id ?? `${project}-${iso().replace(/[^0-9]/g, '')}-${randomUUID().slice(0, 8)}`;
  const directory = runDirectory(root, id);
  await mkdir(join(resolve(root), 'data/private/competitors/runs'), { recursive: true });
  await mkdir(directory, { mode: 0o700 }); // exclusive new directory: never reuse any prior capture
  const run: Run = { schema_version: 'competitors-run-v1', adapter_version: ADAPTER_VERSION, id, project_id: project,
    started_at: iso(), finished_at: '', status: 'complete', missing_reason: null,
    policy: { max_requests: 60, min_interval_ms: 1000, timeout_ms: 30000, max_response_bytes: LIMIT }, outcomes: [] };
  const sources = sourcesFor(project);
  if (!sources.length) { run.status = 'blocked'; run.missing_reason = 'No verified public aggregate GET adapter'; }
  let lastStart = 0;
  for (const source of sources) {
    assertSource(project, source);
    if (run.outcomes.length >= run.policy.max_requests) { run.status = 'partial'; run.missing_reason = 'Request budget exhausted'; break; }
    await (options.wait ?? sleep)(Math.max(0, lastStart + 1000 - Date.now()));
    lastStart = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    const out: Outcome = { evidence_id: `${id}-${run.outcomes.length + 1}`, source, params: Object.fromEntries(new URL(source.url).searchParams), started_at: iso(), finished_at: '', status: 'network_error', http_status: null, response_sha256: null, response_file: null, retry_after_seconds: null };
    try {
      const response = await (options.transport ?? fetch)(source.url, { method: 'GET', redirect: 'manual', credentials: 'omit', signal: controller.signal });
      out.http_status = response.status;
      const retry = response.headers.get('retry-after');
      if (retry && /^\d+$/.test(retry) && Number.isSafeInteger(Number(retry))) out.retry_after_seconds = Number(retry);
      const chunks: Uint8Array[] = []; let size = 0;
      if (response.body) {
        const reader = response.body.getReader();
        try {
          while (true) {
            const next = await reader.read(); if (next.done) break;
            size += next.value.byteLength;
            if (size > LIMIT) { await reader.cancel(); throw new Error('response_too_large'); }
            chunks.push(next.value);
          }
        } finally { reader.releaseLock(); }
      }
      const bytes = Buffer.concat(chunks);
      out.response_sha256 = hash(bytes); out.response_file = `response-${run.outcomes.length + 1}.bin`;
      await writeFile(join(directory, out.response_file), bytes, { flag: 'wx', mode: 0o600 });
      out.status = response.status === 429 ? 'rate_limited' : [401, 403].includes(response.status) ? 'access_denied'
        : response.status >= 300 && response.status < 400 ? 'redirect_rejected' : !response.ok ? 'http_error' : 'ok';
      if (out.status === 'ok') { try { JSON.parse(bytes.toString('utf8')); } catch { out.status = 'invalid_json'; } }
    } catch (error) {
      out.status = controller.signal.aborted ? 'timeout' : error instanceof Error && error.message === 'response_too_large' ? 'response_too_large' : 'network_error';
    } finally { clearTimeout(timer); }
    out.finished_at = iso(); run.outcomes.push(out);
    if (out.status !== 'ok') { run.status = 'partial'; run.missing_reason = out.status; }
    if ([401, 403, 429].includes(out.http_status ?? 0)) { run.missing_reason = `Stopped after HTTP ${out.http_status}`; break; }
  }
  if (run.outcomes.length && !run.outcomes.some(o => o.status === 'ok')) run.status = 'blocked';
  run.finished_at = iso();
  await writeFile(join(directory, 'run.json'), JSON.stringify(run, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  return run;
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected object');
  return value as Record<string, unknown>;
}
function date(value: unknown): value is string { return typeof value === 'string' && Number.isFinite(Date.parse(value)); }
function finite(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value) && value >= 0; }
export async function readRun(root: string, id: string): Promise<{ run: Run; payloads: Map<string, unknown> }> {
  const directory = runDirectory(root, id);
  const run = JSON.parse(await readFile(join(directory, 'run.json'), 'utf8')) as Run;
  if (run.schema_version !== 'competitors-run-v1' || run.adapter_version !== ADAPTER_VERSION || run.id !== id || !isProject(run.project_id)
    || !date(run.started_at) || !date(run.finished_at) || Date.parse(run.finished_at) < Date.parse(run.started_at)
    || !Array.isArray(run.outcomes) || run.outcomes.length > 60 || !['complete', 'partial', 'blocked'].includes(run.status)
    || !(run.missing_reason === null || typeof run.missing_reason === 'string')) throw new Error('Invalid collection run');
  if (JSON.stringify(run.policy) !== JSON.stringify({ max_requests: 60, min_interval_ms: 1000, timeout_ms: 30000, max_response_bytes: LIMIT })) throw new Error('Invalid collection policy');
  const payloads = new Map<string, unknown>(); const evidence = new Set<string>();
  const expectedSources = sourcesFor(run.project_id);
  if (run.outcomes.length > expectedSources.length || run.status === 'complete' && (run.outcomes.length !== expectedSources.length || !expectedSources.length || run.missing_reason !== null || run.outcomes.some(o => o.status !== 'ok'))) throw new Error('Invalid run completeness');
  for (const [index, out] of run.outcomes.entries()) {
    assertSource(run.project_id, out.source);
    if (out.source.id !== expectedSources[index]?.id || !['ok', 'http_error', 'access_denied', 'rate_limited', 'redirect_rejected', 'network_error', 'timeout', 'invalid_json', 'response_too_large'].includes(out.status)
      || !(out.http_status === null || Number.isInteger(out.http_status) && out.http_status >= 100 && out.http_status <= 599)
      || index > 0 && [401, 403, 429].includes(run.outcomes[index - 1]!.http_status ?? 0)) throw new Error('Invalid outcome status or request order');
    if (out.evidence_id !== `${id}-${index + 1}` || evidence.has(out.evidence_id) || !date(out.started_at) || !date(out.finished_at)
      || Date.parse(out.started_at) < Date.parse(run.started_at) || Date.parse(out.finished_at) > Date.parse(run.finished_at)
      || Date.parse(out.started_at) > Date.parse(out.finished_at) || JSON.stringify(out.params) !== JSON.stringify(Object.fromEntries(new URL(out.source.url).searchParams))) throw new Error('Invalid outcome binding');
    evidence.add(out.evidence_id);
    if (out.response_file !== null) {
      if (out.response_file !== `response-${index + 1}.bin`) throw new Error('Invalid response path');
      const bytes = await readFile(join(directory, out.response_file));
      if (bytes.length > LIMIT || hash(bytes) !== out.response_sha256) throw new Error('Response bytes hash mismatch');
      if (out.status === 'ok') {
        if (out.http_status === null || out.http_status < 200 || out.http_status >= 300) throw new Error('Invalid successful HTTP status');
        payloads.set(out.evidence_id, JSON.parse(bytes.toString('utf8')));
      }
    } else if (out.response_sha256 !== null || out.status === 'ok') throw new Error('Missing response bytes');
  }
  return { run, payloads };
}
export function buildReport(run: Run, payloads: Map<string, unknown>): Report {
  const metrics: Metric[] = [];
  const add = (metric: string, value: number | null, unit: string, out: Outcome | null, calculation: string, coverage: string, missing: string | null, asOf: string | null = null, start: string | null = null, end: string | null = null) => metrics.push({
    project_id: run.project_id, metric, value, unit, window_start: start, window_end: end, as_of: asOf, retrieved_at: out?.finished_at ?? run.finished_at,
    source_url: out?.source.url ?? null, params: out?.params ?? {}, source_version: out?.source.source_version ?? null, calculation, evidence_ids: out ? [out.evidence_id] : [], coverage, missing_reason: missing,
  });
  if (run.project_id === 'cardboard' || run.project_id === 'rektrade') {
    const scaled = (value: unknown, scale: number): number | null => {
      if (!(typeof value === 'string' && /^-?\d+$/.test(value) || typeof value === 'number' && Number.isSafeInteger(value))) return null;
      const raw = Number(value); return Number.isSafeInteger(raw) ? raw / scale : null;
    };
    const field = (metric: string, raw: unknown, scale: number, unit: string, out: Outcome | null, definition: string, coverage: string, asOf: string | null = null) => {
      const parsed = scaled(raw, scale);
      const value = parsed !== null && parsed < 0 && metric !== 'reported_trader_pnl' ? null : parsed;
      add(metric, value, unit, out, definition, value === null ? 'missing' : coverage, value === null ? out && out.status !== 'ok' ? out.status : 'Missing, negative or non-safe-integer aggregate field' : null, asOf);
    };
    const dataFor = (kind: Source['kind']): { out: Outcome | null; data: Record<string, unknown> | null } => {
      const out = run.outcomes.find(o => o.source.kind === kind) ?? null;
      return { out, data: out && payloads.has(out.evidence_id) ? object(payloads.get(out.evidence_id)) : null };
    };
    const nested = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
    if (run.project_id === 'cardboard') {
      const { out, data } = dataFor('cardboard-analytics'); const stats = nested(data?.stats), pool = nested(stats.pool);
      const notes = 'Source integer USD6 / 1e6, matching frontend USD formatter; response metric_version is not business as-of time. ';
      field('reported_cumulative_notional_volume', stats.volume, 1e6, 'USD', out, notes + 'stats.volume is cumulative despite range=1d; opening/closing/liquidation leg coverage unverified', 'provider_cumulative_start_unknown');
      const parts = ['btc_volume_24h', 'eth_volume_24h', 'sol_volume_24h'].map(k => scaled(stats[k], 1));
      const total = parts.every(v => v !== null) ? parts.reduce<number>((sum, v) => sum + v!, 0) : null;
      field('notional_volume_provider_24h', total, 1e6, 'USD', out, notes + 'Sum stats BTC/ETH/SOL *_volume_24h; exact rolling endpoints and leg convention unverified', 'provider_reported_window');
      for (const [metric, key] of [['open_interest', 'open_interest'], ['open_margin', 'open_margin'], ['reported_trader_pnl', 'trader_pnl']] as const)
        field(metric, stats[key], 1e6, 'USD', out, notes + `stats.${key}; provider-defined; PnL fee/payment treatment unverified`, 'provider_snapshot');
      for (const [metric, key] of [['lp_cash', 'lp_cash'], ['reported_treasury', 'treasury'], ['queue_liability', 'total_queued']] as const)
        field(metric, pool[key], 1e6, 'USD', out, notes + `stats.pool.${key}; treasury is not pure house bankroll`, 'provider_snapshot');
      for (const [metric, key, unit] of [['cumulative_wallets', 'users', 'wallets'], ['cumulative_reported_trades', 'trades', 'events'], ['open_positions', 'open_positions', 'positions']] as const)
        field(metric, stats[key], 1, unit, out, `stats.${key}; provider counts; wallets are not people, cumulative wallets are not period-active wallets`, 'provider_reported_count');
    } else {
      const { out, data } = dataFor('rekt-stats'); const venue = nested(data?.venue);
      const stamp = typeof data?.at === 'number' && Number.isSafeInteger(data.at) && data.at > 0 && data.at < 1e12 ? new Date(data.at * 1000).toISOString() : null;
      const notes = 'Source integer USD6 / 1e6, matching frontend formatter; provider timestamp is not chain finality. ';
      for (const [metric, key] of [['reported_cumulative_notional_volume', 'volume'], ['cumulative_reported_lost', 'lost'], ['cumulative_paid_to_winners', 'paidToWinners']] as const)
        field(metric, venue[key], 1e6, 'USD', out, notes + `venue.${key}; cumulative start and notional leg convention unknown; lost/paid are not net realized trader PnL`, 'provider_cumulative_start_unknown', stamp);
      for (const [metric, key, unit] of [['cumulative_wallets', 'traders', 'wallets'], ['cumulative_reported_trades', 'trades', 'events'], ['open_positions', 'openPositions', 'positions']] as const)
        field(metric, venue[key], 1, unit, out, `venue.${key}; provider counts; wallets are not people or window-active traders`, 'provider_reported_count', stamp);
      const house = dataFor('rekt-house'), books = nested(house.data?.books);
      for (const [metric, key] of [['free_cash', 'freeCash'], ['reported_treasury', 'treasury'], ['queue_liability', 'queuedTotal'], ['open_margin', 'marginTotal']] as const)
        field(metric, books[key], 1e6, 'USD', house.out, notes + `books.${key}; separate response has no business timestamp; no cross-response reconciliation or pure-bankroll inference`, 'provider_snapshot');
    }
    for (const [metric, unit, reason] of [['active_wallets', 'wallets', 'No complete owner-wallet activity window'], ['notional_volume_aligned_7d', 'USD', 'No exact endpoint history; cumulative total cannot establish seven-day volume'], ['realized_trader_pnl', 'USD', 'No independently reconciled fee/payment/queue-adjusted realized PnL']] as const)
      add(metric, null, unit, null, 'Unavailable', 'missing', reason);
    return { schema_version: 'competitors-report-v1', run_id: run.id, adapter_version: ADAPTER_VERSION, metrics };
  }
  const protocol = run.outcomes.find(o => o.source.kind === 'protocol') ?? null;
  if (protocol && payloads.has(protocol.evidence_id)) {
    const data = object(payloads.get(protocol.evidence_id));
    if (data.name !== (run.project_id === 'yolo' ? 'Jupiter YOLO' : 'Papertrade')) throw new Error('Protocol identity mismatch');
    const tvl = Array.isArray(data.tvl) ? data.tvl : [];
    const last = tvl.at(-1); const row = last && typeof last === 'object' ? object(last) : null;
    const value = row && finite(row.totalLiquidityUSD) ? row.totalLiquidityUSD : null;
    const asOf = row && finite(row.date) && row.date < 1e12 ? new Date(row.date * 1000).toISOString() : null;
    add('tvl', value, 'USD', protocol, 'Last supplied DefiLlama TVL history point; includes user funds, not house bankroll', 'provider_snapshot', value === null ? 'No reported TVL history; empty is not zero' : null, asOf);
  } else add('tvl', null, 'USD', protocol, 'No available protocol response', 'missing', protocol?.status ?? run.missing_reason);
  const fees = run.outcomes.find(o => o.source.kind === 'fees') ?? null;
  if (fees && payloads.has(fees.evidence_id)) {
    const data = object(payloads.get(fees.evidence_id));
    if (data.name !== (run.project_id === 'yolo' ? 'Jupiter YOLO' : 'Papertrade')) throw new Error('Fees identity mismatch');
    for (const [key, metric] of [['total24h', 'fees_provider_24h'], ['total7d', 'fees_provider_7d'], ['totalAllTime', 'fees_provider_cumulative']] as const) {
      const value = finite(data[key]) ? data[key] : null;
      const measure = run.project_id === 'yolo' ? metric.replace('fees_', 'profit_fees_') : metric;
      const scope = run.project_id === 'yolo' ? 'Provider-defined 2% winning-profit fees only; excludes house trading PnL and does not measure all trader costs or the official close-notional fee' : 'Provider-defined fees/revenue including LP surplus distributions; not total trader losses or total trading costs';
      add(measure, value, 'USD', fees, `${scope}. DefiLlama ${key}; period boundaries not supplied by this adapter; not aligned to other products`, 'provider_reported_window', value === null ? 'Field unavailable or invalid' : null);
    }
  } else for (const metric of ['fees_provider_24h', 'fees_provider_7d', 'fees_provider_cumulative']) add(run.project_id === 'yolo' ? metric.replace('fees_', 'profit_fees_') : metric, null, 'USD', fees, 'No available fees response', 'missing', fees?.status ?? run.missing_reason);
  for (const [metric, unit, reason] of [
    ['notional_volume', 'USD', 'No verified output adapter; opening, closing and liquidation notional must have separate definitions'],
    ['house_bankroll', 'USD', 'TVL is not bankroll; no verified bankroll adapter'], ['open_interest', 'USD', 'No verified OI adapter'],
    ['active_wallets', 'wallets', 'No verified windowed owner-wallet coverage; cumulative growth is not activity'],
    ['queue_liability', 'USD', 'No verified queue adapter; missing does not mean zero'],
    ['realized_trader_pnl', 'USD', 'No verified fee/payment/queue-adjusted PnL adapter'],
  ]) add(metric!, null, unit!, null, 'Unavailable', 'missing', reason!);
  return { schema_version: 'competitors-report-v1', run_id: run.id, adapter_version: ADAPTER_VERSION, metrics };
}
export function csv(report: Report): string {
  const keys = ['project_id', 'metric', 'value', 'unit', 'window_start', 'window_end', 'as_of', 'retrieved_at', 'source_url', 'params', 'source_version', 'calculation', 'evidence_ids', 'coverage', 'missing_reason'] as const;
  const cell = (value: unknown) => { const s = value === null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value); return /[",\n\r]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s; };
  return keys.join(',') + '\n' + report.metrics.map(m => keys.map(k => cell(m[k])).join(',')).join('\n') + '\n';
}
export async function reportRun(root: string, id: string): Promise<{ report: Report; directory: string }> {
  const { run, payloads } = await readRun(root, id); const report = buildReport(run, payloads);
  const directory = join(runDirectory(root, id), `report-${randomUUID()}`); await mkdir(directory);
  await writeFile(join(directory, 'metrics.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  await writeFile(join(directory, 'metrics.csv'), csv(report), { flag: 'wx', mode: 0o600 });
  return { report, directory };
}
/** Endpoint-counter helper: no interpolation, no first-bucket-as-zero assumption. */
export function cumulativeDelta(points: { at: string; value: number | null }[], start: string, end: string, signed = false): { value: number | null; missing_reason: string | null } {
  if (!date(start) || !date(end) || Date.parse(start) >= Date.parse(end)) throw new Error('Invalid counter window');
  const from = points.filter(p => p.at === start), to = points.filter(p => p.at === end);
  if (from.length !== 1 || to.length !== 1 || !Number.isFinite(from[0]!.value) || from[0]!.value === null || !Number.isFinite(to[0]!.value) || to[0]!.value === null) return { value: null, missing_reason: 'Insufficient exact boundary history' };
  const value = to[0]!.value! - from[0]!.value!;
  return !signed && value < 0 ? { value: null, missing_reason: 'Cumulative counter decreased; reset or revision unresolved' } : { value, missing_reason: null };
}
