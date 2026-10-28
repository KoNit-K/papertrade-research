import { relative } from 'node:path';
import { isProject } from './adapters.ts';
import { refresh, reportRun } from './core.ts';
import { validateResearch } from './validate.ts';
const args = process.argv.slice(2), root = process.cwd();
try {
  if (args[0] === 'refresh' && args[1] === '--project' && args.length === 3 && isProject(args[2]!)) {
    const run = await refresh(root, args[2]);
    console.log(JSON.stringify({ run_id: run.id, status: run.status, requests: run.outcomes.length, missing_reason: run.missing_reason }));
    if (run.status !== 'complete') process.exitCode = 2;
  } else if (args[0] === 'report' && args[1] === '--run' && args.length === 3) {
    const result = await reportRun(root, args[2]!);
    console.log(JSON.stringify({ run_id: args[2], directory: relative(root, result.directory), metrics: result.report.metrics.length }));
  } else if (args[0] === 'validate' && args.length <= 2) {
    console.log(JSON.stringify(await validateResearch(args[1] ?? root), null, 2));
  } else throw new Error('Usage: refresh --project <id> | report --run <id> | validate [repository-root]');
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Competitor tooling failed'); process.exitCode = 1;
}
