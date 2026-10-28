import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildReport, csv, cumulativeDelta, readRun, refresh, reportRun, runDirectory } from '../packages/competitors/core.ts';
import { assertSource } from '../packages/competitors/adapters.ts';
import { validateResearch } from '../packages/competitors/validate.ts';

async function temporary(fn: (root: string) => Promise<void>) { const root = await mkdtemp(join(tmpdir(), 'competitors-')); try { await fn(root); } finally { await rm(root, { recursive: true, force: true }); } }
const noWait = async () => {};
const protocol = { name: 'Papertrade', tvl: [{ date: 1793059200, totalLiquidityUSD: 123 }] };
const fees = { name: 'Papertrade', total24h: 2, total7d: 12, totalAllTime: 20 };
function fakeTransport(response: (url: string) => Response): typeof fetch {
  return (async (url, init) => { assert.equal(init?.method, 'GET'); assert.equal(init?.redirect, 'manual'); assert.equal(init?.credentials, 'omit'); assert.equal(init?.headers, undefined); return response(String(url)); }) as typeof fetch;
}
const good = fakeTransport(url => Response.json(url.includes('/protocol/') ? protocol : fees));
test('captured bytes drive deterministic offline JSON/CSV reports and never overwrite captures', () => temporary(async root => {
  const run = await refresh(root, 'papertrade', { run_id: 'first', transport: good, wait: noWait });
  assert.equal(run.status, 'complete'); assert.equal(run.outcomes.length, 2);
  const one = await reportRun(root, run.id), two = await reportRun(root, run.id);
  assert.deepEqual(one.report, two.report); assert.notEqual(one.directory, two.directory);
  assert.equal(await readFile(join(one.directory, 'metrics.csv'), 'utf8'), csv(two.report));
  assert.equal(one.report.metrics.find(m => m.metric === 'tvl')?.value, 123);
  assert.equal(one.report.metrics.find(m => m.metric === 'house_bankroll')?.value, null);
  assert.equal(one.report.metrics.find(m => m.metric === 'fees_provider_24h')?.window_end, null);
  await assert.rejects(refresh(root, 'papertrade', { run_id: 'first', transport: good, wait: noWait }), /EEXIST/);
  const next = await refresh(root, 'papertrade', { run_id: 'second', transport: good, wait: noWait }); assert.notEqual(next.id, run.id);
}));
test('offline pipeline rejects raw-byte tampering', () => temporary(async root => {
  const run = await refresh(root, 'papertrade', { run_id: 'tamper', transport: good, wait: noWait });
  await writeFile(join(runDirectory(root, run.id), 'response-1.bin'), '{}');
  await assert.rejects(reportRun(root, run.id), /hash mismatch/);
}));
test('offline pipeline rejects ledger source substitutions', () => temporary(async root => {
  const run = await refresh(root, 'papertrade', { run_id: 'source', transport: good, wait: noWait });
  run.outcomes[0]!.source.url = 'https://api.llama.fi/protocol/jupiter-perpetual-exchange';
  await writeFile(join(runDirectory(root, run.id), 'run.json'), JSON.stringify(run));
  await assert.rejects(readRun(root, run.id), /allowlist/);
}));
for (const status of [401, 403, 429]) test(`HTTP ${status} stops project reads and preserves denial bytes`, () => temporary(async root => {
  let calls = 0;
  const transport = fakeTransport(() => { calls++; return new Response('denied', { status, headers: { 'Retry-After': '9' } }); });
  const run = await refresh(root, 'papertrade', { run_id: `denied-${status}`, transport, wait: noWait });
  assert.equal(calls, 1); assert.equal(run.status, 'blocked'); assert.equal(run.outcomes[0]!.retry_after_seconds, 9);
  const { report } = await reportRun(root, run.id); assert.ok(report.metrics.every(m => m.value === null));
  assert.equal(await readFile(join(runDirectory(root, run.id), 'response-1.bin'), 'utf8'), 'denied');
}));
test('redirect is recorded without following and invalid JSON remains missing', () => temporary(async root => {
  let calls = 0;
  const transport = fakeTransport(() => ++calls === 1 ? new Response('', { status: 302, headers: { Location: 'https://untrusted.invalid' } }) : new Response('not-json'));
  const run = await refresh(root, 'papertrade', { run_id: 'redirect', transport, wait: noWait });
  assert.deepEqual(run.outcomes.map(o => o.status), ['redirect_rejected', 'invalid_json']);
  assert.equal((await reportRun(root, run.id)).report.metrics[0]!.value, null);
}));
test('unimplemented projects produce explicit offline blocked reports without any network', () => temporary(async root => {
  const transport = fakeTransport(() => { throw new Error('Network forbidden'); });
  const run = await refresh(root, 'stox', { run_id: 'blocked', transport, wait: noWait });
  assert.equal(run.outcomes.length, 0); assert.equal(run.status, 'blocked');
  assert.ok((await reportRun(root, run.id)).report.metrics.every(m => m.value === null && m.missing_reason));
}));
test('YOLO empty TVL is unknown, never ordinary Jupiter perps or zero', () => temporary(async root => {
  const transport = fakeTransport(() => Response.json({ name: 'Jupiter YOLO', tvl: [] }));
  const run = await refresh(root, 'yolo', { run_id: 'yolo', transport, wait: noWait });
  const { report } = await reportRun(root, run.id);
  assert.equal(report.metrics[0]!.value, null); assert.match(report.metrics[0]!.missing_reason!, /empty is not zero/);
  assert.throws(() => assertSource('yolo', { id: 'yolo-llama-protocol', url: 'https://api.llama.fi/protocol/jupiter', kind: 'protocol', source_version: null }), /allowlist/);
}));
test('missing and reset cumulative counters cannot fabricate aligned window totals', () => {
  const start = '2026-10-26T00:00:00Z', end = '2026-10-27T00:00:00Z';
  assert.equal(cumulativeDelta([{ at: end, value: 9 }], start, end).value, null);
  assert.match(cumulativeDelta([{ at: start, value: 10 }, { at: end, value: 9 }], start, end).missing_reason!, /reset/);
  assert.equal(cumulativeDelta([{ at: start, value: 10 }, { at: end, value: 12 }], start, end).value, 2);
  assert.equal(cumulativeDelta([{ at: start, value: 10 }, { at: end, value: 9 }], start, end, true).value, -1);
});
test('Cardboard separates cumulative and reported 24h volume, parses USD6 and projects no account lists', () => temporary(async root => {
  const transport = fakeTransport(() => Response.json({ metric_version: 100, activity: [{ owner: 'private-wallet' }], stats: {
    volume: '500000000', btc_volume_24h: '1000000', eth_volume_24h: '2000000', sol_volume_24h: '3000000', open_interest: '7000000',
    trader_pnl: '-500000', users: '10', trades: '20', open_positions: '2', open_margin: '500000', pool: { lp_cash: '4000000', treasury: '9000000', total_queued: '0' },
  } }));
  const run = await refresh(root, 'cardboard', { run_id: 'cardboard', transport, wait: noWait });
  assert.deepEqual(run.outcomes[0]!.params, { range: '1d' });
  const { report } = await reportRun(root, run.id), metric = (key: string) => report.metrics.find(m => m.metric === key)!;
  assert.equal(metric('reported_cumulative_notional_volume').value, 500); assert.equal(metric('notional_volume_provider_24h').value, 6);
  assert.equal(metric('reported_trader_pnl').value, -0.5); assert.equal(metric('queue_liability').value, 0);
  assert.equal(metric('notional_volume_provider_24h').window_start, null); assert.equal(metric('lp_cash').as_of, null);
  assert.ok(!JSON.stringify(report).includes('private-wallet')); assert.equal(metric('active_wallets').value, null);
}));
test('Rektrade keeps stats timestamp separate from untimed house snapshot and does not derive realized PnL', () => temporary(async root => {
  const transport = fakeTransport(url => Response.json(url.endsWith('/stats') ? { at: 1793151174, venue: { volume: '10000000', lost: '4000000', paidToWinners: '2000000', traders: 3, trades: '6', openPositions: '0' }, winners: ['private-wallet'] }
    : { books: { freeCash: '1200000', treasury: '9000000', queuedTotal: '0', marginTotal: '0' }, queue: [{ owner: 'private-wallet' }] }));
  const run = await refresh(root, 'rektrade', { run_id: 'rekt', transport, wait: noWait });
  const { report } = await reportRun(root, run.id), metric = (key: string) => report.metrics.find(m => m.metric === key)!;
  assert.equal(metric('reported_cumulative_notional_volume').value, 10); assert.equal(metric('cumulative_paid_to_winners').value, 2);
  assert.equal(metric('free_cash').value, 1.2); assert.equal(metric('free_cash').as_of, null);
  assert.ok(metric('reported_cumulative_notional_volume').as_of); assert.equal(metric('realized_trader_pnl').value, null);
  assert.ok(!JSON.stringify(report).includes('private-wallet'));
}));
test('duplicate source outcome and response path traversal are rejected offline', () => temporary(async root => {
  const run = await refresh(root, 'papertrade', { run_id: 'duplicate', transport: good, wait: noWait });
  run.outcomes[1]!.source = run.outcomes[0]!.source;
  await writeFile(join(runDirectory(root, run.id), 'run.json'), JSON.stringify(run));
  await assert.rejects(readRun(root, run.id), /order/);
  run.outcomes.pop(); run.status = 'partial'; run.missing_reason = 'test'; run.outcomes[0]!.response_file = '../response.bin';
  await writeFile(join(runDirectory(root, run.id), 'run.json'), JSON.stringify(run));
  await assert.rejects(readRun(root, run.id), /path/);
}));
test('CSV escapes commas, double quotes and newline losslessly', () => temporary(async root => {
  const run = await refresh(root, 'stox', { run_id: 'csv', wait: noWait });
  const report = buildReport(run, new Map()); report.metrics[0]!.missing_reason = 'a,b "quoted"\nnext';
  assert.ok(csv(report).includes('"a,b ""quoted""\nnext"'));
}));
test('validator checks existing research references without claiming absent snapshots', () => temporary(async root => {
  const base = join(root, 'research/competitors'); await mkdir(join(base, 'sources'), { recursive: true });
  await writeFile(join(base, 'protocol.json'), JSON.stringify({ schema_version: 1, started_at: '2026-10-28T00:00:00Z', baseline_commit: 'a'.repeat(40) }));
  const row = { id: 'S1', project_id: 'yolo', title: 'test', url: 'https://example.org', provenance: 'official_doc', retrieved_at: null, source_published_at: null, capture_sha256: null, http_status: null, access_status: 'unknown', content_read: 'none', source_dependency_ids: [], supports: [], limitations: [] };
  await writeFile(join(base, 'sources', 'test.json'), JSON.stringify([row]));
  await writeFile(join(base, 'milestones.json'), JSON.stringify({ milestones: [{ id: 'M0', status: 'partial', started_at: null, finished_at: null, evidence_ids: ['S1'] }] }));
  const result = await validateResearch(root); assert.equal(result.source_count, 1); assert.equal(result.snapshot_count, 0); assert.equal(result.checked_files.length, 3);
  row.source_dependency_ids = ['absent'] as never[];
  await writeFile(join(base, 'sources', 'test.json'), JSON.stringify({ sources: [row] }));
  await assert.rejects(validateResearch(root), /dependency/);
}));

test('public snapshot rejects lost units, unbound numbers and half-defined windows', () => temporary(async root => {
  const base = join(root, 'research/competitors'); await mkdir(join(base, 'sources'), { recursive: true }); await mkdir(join(base, 'snapshots'));
  await writeFile(join(base, 'protocol.json'), JSON.stringify({ schema_version: 1, started_at: '2026-10-28T00:00:00Z', baseline_commit: 'a'.repeat(40) }));
  await writeFile(join(base, 'milestones.json'), JSON.stringify({ milestones: [] }));
  await writeFile(join(base, 'sources', 'source.json'), JSON.stringify([{ id: 'S1', project_id: 'cardboard', title: 'test', url: 'https://example.org', provenance: 'official_api', retrieved_at: null, source_published_at: null, capture_sha256: null, http_status: null, access_status: 'fetched', content_read: 'full', source_dependency_ids: [], supports: [], limitations: [] }]));
  const metric = { project_id: 'cardboard', metric: 'lp_cash', value: 123, unit: 'USD', window_start: null, window_end: null, as_of: null, retrieved_at: '2026-10-28T00:00:00Z', source_url: 'https://example.org', source_version: null, params: {}, calculation: 'USD6 / 1e6', evidence_ids: ['S1'], coverage: 'provider_snapshot', missing_reason: null };
  const file = join(base, 'snapshots', 'sample.json');
  await writeFile(file, JSON.stringify({ metrics: [metric] })); assert.equal((await validateResearch(root)).snapshot_count, 1);
  for (const [change, expected] of [[{ unit: '' }, /unit/], [{ evidence_ids: [] }, /source evidence/], [{ window_start: '2026-10-27T00:00:00Z' }, /Incomplete metric window/], [{ source_url: 'https://user:password@example.org' }, /source URL/]] as const) {
    await writeFile(file, JSON.stringify({ metrics: [{ ...metric, ...change }] })); await assert.rejects(validateResearch(root), expected);
  }
}));
