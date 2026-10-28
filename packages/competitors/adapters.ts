/** Deliberately small, fixed public GET adapters. No account or wallet requests. */
export const PROJECTS = ['papertrade', 'yolo', 'cardboard', 'trade-everything', 'rektrade', 'stox', 'parchment'] as const;
export type Project = typeof PROJECTS[number];
export interface Source { id: string; url: string; kind: 'protocol' | 'fees' | 'cardboard-analytics' | 'rekt-stats' | 'rekt-house'; source_version: string | null }
export function isProject(value: string): value is Project { return (PROJECTS as readonly string[]).includes(value); }
export function sourcesFor(project: Project): Source[] {
  if (project === 'cardboard') return [{ id: 'cardboard-analytics', url: 'https://cardboardtrade.xyz/v1/analytics?range=1d', kind: 'cardboard-analytics', source_version: null }];
  if (project === 'rektrade') return [
    { id: 'rektrade-stats', url: 'https://rektrade.fun/api/stats', kind: 'rekt-stats', source_version: null },
    { id: 'rektrade-house', url: 'https://rektrade.fun/api/house', kind: 'rekt-house', source_version: null },
  ];
  const slug = project === 'yolo' ? 'jupiter-yolo' : project === 'papertrade' ? 'papertrade' : null;
  if (!slug) return [];
  return [
    { id: `${project}-llama-protocol`, url: `https://api.llama.fi/protocol/${slug}`, kind: 'protocol', source_version: null },
    { id: `${project}-llama-fees`, url: `https://api.llama.fi/summary/fees/${slug}`, kind: 'fees', source_version: null },
  ];
}
export function assertSource(project: Project, source: Source): void {
  if (!sourcesFor(project).some(s => JSON.stringify(s) === JSON.stringify(source))) throw new Error('Source outside fixed public GET allowlist');
}
export const ADAPTER_VERSION = 'competitors-defillama-v1';
