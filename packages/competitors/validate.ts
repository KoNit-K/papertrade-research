import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { isProject } from './adapters.ts';
const ensure = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const obj = (v: unknown): Record<string, unknown> => { ensure(v && typeof v === 'object' && !Array.isArray(v), 'Expected record'); return v as Record<string, unknown>; };
const time = (v: unknown) => typeof v === 'string' && Number.isFinite(Date.parse(v));
const optionalTime = (v: unknown) => v === null || time(v);
const sha = (v: unknown) => v === null || typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
async function optionalList(path: string): Promise<string[]> {
  try { return await readdir(path); } catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return []; throw e; }
}
async function json(path: string): Promise<unknown> { return JSON.parse(await readFile(path, 'utf8')); }
export async function validateResearch(root: string): Promise<{ checked_files: string[]; source_count: number; snapshot_count: number; limitations: string[] }> {
  const base = join(resolve(root), 'research/competitors'); const checked: string[] = [];
  const protocol = obj(await json(join(base, 'protocol.json')));
  ensure(protocol.schema_version === 1 && time(protocol.started_at) && typeof protocol.baseline_commit === 'string' && /^[a-f0-9]{40}$/.test(protocol.baseline_commit), 'Invalid protocol baseline');
  checked.push('research/competitors/protocol.json');
  const sourceRows: Record<string, unknown>[] = []; const ids = new Set<string>();
  for (const file of (await optionalList(join(base, 'sources'))).filter(f => f.endsWith('.json')).sort()) {
    const data = await json(join(base, 'sources', file));
    const rows = Array.isArray(data) ? data : obj(data).sources; ensure(Array.isArray(rows), `Invalid sources list: ${file}`);
    for (const item of rows as unknown[]) {
      const row = obj(item);
      ensure(typeof row.id === 'string' && row.id.length > 0 && !ids.has(row.id), 'Duplicate or missing source id');
      ids.add(row.id as string); sourceRows.push(row);
      ensure(typeof row.project_id === 'string' && isProject(row.project_id), 'Unknown source project');
      ensure(typeof row.title === 'string' && row.title.length > 0 && typeof row.provenance === 'string', 'Missing source description');
      const url = new URL(String(row.url)); ensure(url.protocol === 'https:' && !url.username && !url.password, 'Invalid source URL');
      ensure(optionalTime(row.retrieved_at) && optionalTime(row.source_published_at) && sha(row.capture_sha256), 'Invalid source timestamp/hash');
      ensure(row.http_status === null || Number.isInteger(row.http_status) && Number(row.http_status) >= 100 && Number(row.http_status) <= 599, 'Invalid source HTTP status');
      ensure(typeof row.access_status === 'string' && typeof row.content_read === 'string', 'Missing source access status');
      ensure(Array.isArray(row.source_dependency_ids) && Array.isArray(row.supports) && Array.isArray(row.limitations), 'Missing source relationships');
      if ([401, 403, 429].includes(Number(row.http_status))) ensure(row.content_read === 'none' && row.access_status !== 'fetched', 'Denied source cannot claim read content');
    }
    checked.push(`research/competitors/sources/${file}`);
  }
  for (const row of sourceRows) for (const dep of row.source_dependency_ids as unknown[]) ensure(typeof dep === 'string' && ids.has(dep) && dep !== row.id, 'Unresolved source dependency');
  const milestones = obj(await json(join(base, 'milestones.json'))); ensure(Array.isArray(milestones.milestones), 'Missing milestones');
  const milestoneIds = new Set<string>();
  for (const item of milestones.milestones as unknown[]) {
    const row = obj(item); ensure(typeof row.id === 'string' && !milestoneIds.has(row.id), 'Duplicate milestone'); milestoneIds.add(row.id as string);
    ensure(['not_started', 'in_progress', 'partial', 'blocked', 'complete'].includes(String(row.status)), 'Invalid milestone status');
    ensure(optionalTime(row.started_at) && optionalTime(row.finished_at), 'Invalid milestone times');
    if (row.started_at && row.finished_at) ensure(Date.parse(String(row.finished_at)) >= Date.parse(String(row.started_at)), 'Reversed milestone times');
    ensure(Array.isArray(row.evidence_ids), 'Missing milestone evidence ids');
    for (const id of row.evidence_ids as unknown[]) ensure(typeof id === 'string' && ids.has(id), 'Unresolved milestone evidence');
  }
  checked.push('research/competitors/milestones.json');
  let snapshotCount = 0;
  for (const file of (await optionalList(join(base, 'snapshots'))).filter(f => f.endsWith('.json')).sort()) {
    const data = await json(join(base, 'snapshots', file)); const rows = Array.isArray(data) ? data : obj(data).metrics;
    ensure(Array.isArray(rows), 'Invalid snapshot metrics');
    for (const item of rows as unknown[]) {
      const row = obj(item); ensure(typeof row.project_id === 'string' && isProject(row.project_id) && typeof row.metric === 'string', 'Invalid snapshot identity');
      ensure(row.value === null || typeof row.value === 'number' && Number.isFinite(row.value), 'Invalid metric value');
      for (const field of ['unit', 'calculation', 'coverage']) ensure(typeof row[field] === 'string' && String(row[field]).length > 0, `Missing snapshot ${field}`);
      ensure(row.source_version === null || typeof row.source_version === 'string', 'Invalid source version');
      ensure(row.params && typeof row.params === 'object' && !Array.isArray(row.params), 'Invalid source params');
      if (row.source_url !== null) { const url = new URL(String(row.source_url)); ensure(url.protocol === 'https:' && !url.username && !url.password, 'Invalid metric source URL'); }
      for (const key of ['window_start', 'window_end', 'as_of']) ensure(optionalTime(row[key]), `Invalid snapshot ${key}`);
      ensure(time(row.retrieved_at), 'Missing retrieval timestamp');
      ensure((row.window_start === null) === (row.window_end === null), 'Incomplete metric window');
      if (row.window_start && row.window_end) ensure(Date.parse(String(row.window_start)) < Date.parse(String(row.window_end)), 'Invalid metric window');
      ensure(Array.isArray(row.evidence_ids) && (row.evidence_ids as unknown[]).every(id => typeof id === 'string' && ids.has(id)), 'Unresolved snapshot evidence');
      if (row.value !== null) ensure(row.source_url !== null && (row.evidence_ids as unknown[]).length > 0 && row.coverage !== 'missing', 'Numeric metric requires source evidence and coverage');
      ensure(row.value !== null || typeof row.missing_reason === 'string' && row.missing_reason.length > 0, 'Unknown metric requires reason'); snapshotCount++;
    }
    checked.push(`research/competitors/snapshots/${file}`);
  }
  return { checked_files: checked, source_count: sourceRows.length, snapshot_count: snapshotCount,
    limitations: ['Structural checks only; no source-content truth, live access, completeness or settlement reproduction claimed', 'Only existing files listed in checked_files were checked; absent future files are not verified'] };
}
