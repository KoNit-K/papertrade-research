# Evidence and business metric definitions

[中文](methodology.zh-CN.md) · [Report](README.md)

## Evidence levels and identities

A source reading supports what that source says. It does not prove deployed execution. This study distinguishes **verified observation**, **source assertion**, **not independently verified**, and **unavailable**. Independent recomputation refers only to the identified input bytes and calculation, never to full protocol reproduction.

Each project has its own identity. Officially acknowledged inspiration, verified code fork, mechanism similarity, routing/integration and adjacent comparison are different relationship categories. No code fork is established merely by similar leverage or a payment queue. A chain, oracle or distribution partner is not automatically the product issuer, financier or legal operator. Unknown names, geography, financing and dates remain unknown.

The candidate list is bounded to 12 entries and the report to six competitors, with Papertrade as a separate baseline. General paper-trading simulators, lookalike tokens, bots, dashboards and treasury products are outside direct-product comparison. Independent underlying activity and routed activity are kept separate.

## Times and coverage

Record retrieval time, source data time, publication date and version separately. A date without a time is not silently assigned midnight. A pre-announcement, public beta, first real trade, contract deployment, configured launch time and upgrade are separate events. Social mirrors and news repeating one post remain dependent sources.

Preferred comparable windows are `[start,end)` ending at a complete UTC hour. These require adequate final historical data at both boundaries or complete event coverage. Provider-defined rolling windows, calendar days and cumulative totals keep their original labels when exact boundaries are unavailable. Do not interpolate, annualize launch-day figures, replace missing buckets with zero, or label an unknown-start total as since launch. Beijing time is UTC+8.

A fresh HTTP response does not prove that its business data is fresh. Separate endpoints with different cutoffs do not form one simultaneous balance sheet. A parameter can change without a contract upgrade, so mechanism claims retain their document/frontend/API version limits.

## Metric dictionary

| Metric | Definition and required distinction |
|---|---|
| Notional volume | Exposure, usually collateral times leverage. Explain whether opens, voluntary closes and liquidations count, and whether both sides are counted. It is not deposited cash. |
| Trades | Define position opens, closes or fills. Do not combine incompatible event counts. |
| Active wallets | Unique eligible owner wallets during a stated window and coverage. Cumulative users and newly observed wallets are different; wallets are not people. |
| TVL | Use the provider's asset/account scope. It can include customer funds and collateral, and cannot be renamed House bankroll. |
| House bankroll | Distinguish book LP, free cash, token treasury, segregated collateral, reserves and unpaid obligations. Do not sum overlapping ledgers. |
| OI | Outstanding trader-side long plus short notional; avoid adding the House side again. |
| Fees | Provider-defined realized charges. Separate profit fee, close fee, builder fee, trading profit and distributions. Fees are not total trader costs. |
| Queue | Unpaid claims at a specific observation. Amount, count, age and payout policy are separate. A zero snapshot proves neither persistent zero debt nor future payment capacity. |
| Trader PnL | State gross/net fees, settled/paid, queued claims and inclusion of noncash rewards. |
| Leaderboard | State period, sort, filters, pagination and returned sample. Top accounts do not establish population totals, win rates or retention. |

No cross-project total is published: coverage and definitions differ, and routing can duplicate Papertrade activity. Loss rewards and staking are studied as economic design, without token-price, market-cap or investment analysis.

## Records and collection

`research/competitors/protocol.json` fixes scope and collection policy; `sources/*.json` records atomic source support and dependencies; `snapshots/*.json` retains reviewed numeric outputs; `milestones.json` records actual progress. Values use explicit units and nulls with reasons. Where no source data timestamp exists, `as_of` stays null; `retrieved_at` is only a retrieval bound.

Raw captures, response bytes and task handoffs stay under ignored private storage. SHA-256 proves byte identity, not source truth, authenticity or redistribution rights. Public metadata without captured bytes is not a complete historical replay bundle. Original paraphrases, necessary minimal summaries and aggregate metadata are reviewed before inclusion. Public blockchain addresses do not authorize personal identity joins.

The minimal tool uses fixed public GET sources, no credentials, no redirects, a 60-request maximum, at least one second between starts, 30-second timeout and 2 MB response cap. 401/403/429 stop collection. A no-adapter project returns blocked without making a request. No wallet action or chain mutation is part of this study.
