# Refresh and reproduce the business snapshot

[中文](refresh.zh-CN.md) · [Report](README.md) · [Definitions](methodology.md)

## Supported inputs

| Project ID | Fixed public GET inputs | Scope |
|---|---|---|
| `papertrade` | DefiLlama protocol and fees summaries | Provider TVL and fee windows; no verified volume, OI, House or queue output |
| `yolo` | DefiLlama `jupiter-yolo` protocol and fees summaries | Winning-profit fee windows; empty TVL history remains unknown |
| `cardboard` | Official `/v1/analytics?range=1d` | Cumulative counters, provider 24h volume, OI and pool fields |
| `rektrade` | Official `/api/stats` and `/api/house` | Cumulative venue counters and separate pool fields |
| `trade-everything`, `stox` | No verified adapter | Explicit blocked result with zero requests |

Hosts, paths and query strings are fixed in the adapter. `params` also records the URL query, such as `range=1d`; it is empty for URLs without query parameters. Callers cannot supply endpoints, headers, credentials or wallets. The adapter version and final source-code digests are recorded in the research protocol.

The reviewed collection has 67 metric rows, including missing values: four successful project runs collected between 01:31:54 and 01:35:05 UTC on 28 October 2026 (09:31:54–09:35:05 Beijing), plus two blocked no-adapter runs. Business cutoffs differ or are absent. See [JSON](../../research/competitors/snapshots/latest.json) and [CSV](../../research/competitors/snapshots/latest.csv) for exact times, definitions and evidence IDs.

## Commands

Use Node.js >=24.12 and the repository's pnpm version. Install missing dependencies with `pnpm install --frozen-lockfile --ignore-scripts`. This task used existing dependencies without installation. If Node/pnpm are absent from the Codex shell PATH, use the workspace-dependency loader's paths. A typical bundled-runtime setup is:

```sh
export PATH="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH"
```

From the repository root:

```sh
pnpm competitors:refresh --project cardboard
pnpm competitors:report --run <run_id_from_refresh>
pnpm validate:competitors
```

Refresh makes bounded live GET requests and prints a new run ID and transport status. Report reads retained response bytes, verifies SHA-256, and creates a new directory with `metrics.json` and `metrics.csv`, without network requests. It does not publish or replace the reviewed snapshot. Repeated reporting of one run produces identical metric content in different directories; a new live refresh may legitimately change values.

Exit 0 means the requested operation succeeded. Refresh exit 2 means partial or blocked collection: inspect its reason and report. Exit 1 means invalid invocation or processing failure. Successful HTTP collection does not imply complete metrics or independent business verification. Metadata validation does not authenticate source truth or protocol execution.

## Inspect and update

1. Match the project, URL/query, adapter version and response hashes.
2. Read `retrieved_at` separately from `as_of`; absent business time stays unknown.
3. Read calculation, coverage, unit and missing reason before comparing values.
4. Preserve old runs. Use report for offline replay and refresh for new observations.
5. Review aggregate projections before public updates. Raw responses and account information remain private; there is no automatic publication approval.

Cardboard's `range=1d` does not make `stats.volume`, users or trades daily figures. Its 24h volume sums three explicit market fields. USD6 integers are checked for safe conversion before division by 1e6; invalid or oversized values remain missing. Rektrade's stats timestamp does not apply to the separately retrieved House response. DefiLlama YOLO fees exclude other costs, including the documented close-notional fee. No leaderboard totals are inferred.

## Missing sources and bounded follow-up

An unavailable official source is not replaced by an old media number or ordinary Jupiter Perps/JLP statistics. Do not connect a wallet, sign, trade, query private accounts or bypass a refusal to complete a table.

When an ordinary anonymous YOLO browser becomes available, record UTC time, selected leaderboard period/category, visible House/queue values and page coverage. Inspect only public requests actually made by that page. A fixed aggregate adapter requires verified identity, units and access. Queued-profit treatment, net PnL and complete leaderboard coverage remain unresolved.

Supported adapters have no pagination. Duplicate source/outcome bindings are rejected; complete leaderboard/event coverage is not claimed. The cumulative helper rejects missing/duplicate boundaries and unexplained decreases, but live aligned 7d reconstruction is not implemented. The existing chain-999 collector is unchanged.

## Manually rechecking basic facts, backgrounds and screenshots

The [basic-facts guide](basics.md) and [browser register](browser-checks.md) are not new adapter-support claims. Open the recorded URL; retain selected market, network/Demo label, session, slider range, fee basis and UTC observation time. Capture an anonymous viewport and calculate `sha256sum <image.jpg>`. Input defaults are not admission minimums; selected-market headers are not automatically platform totals. Record blocked access instead of relabelling an old image as fresh.

Recheck [background claims](backgrounds.md) at each linked source: first seek the original author's dated text and product cross-links. Preserve the distinction between search cache, mirror, self-claim and third-party attribution. New evidence can promote or retract a specific claim; it does not inherit unverified nationality, headquarters, shared ownership or institutional financing. Keep dated historical evidence rather than silently overwriting it.
