# Rektrade

[中文](rektrade.zh-CN.md) · [Official site](https://rektrade.fun/) · [Application documentation](https://rektrade.fun/docs) · [Evidence metadata](../../../research/competitors/sources/rektrade.json)

Observed on 28 October 2026. Current configuration and business aggregates are **official API reports**, not independently reconstructed chain state. The site's embedded explanatory text contains several outdated or conflicting descriptions.

## Trading underlyings and settlement

BTC, ETH, SOL, ZEC, NEAR, XMR, HYPE; USDC collateral and trade settlement. Market-name scope does not resolve conflicting leverage caps. [Full inventory and source scope](../markets.md).

## Identity, dates and relationship

The official frontend links to `@rektradefun` and Ember; API configuration reports HyperEVM chain 999 and USDC collateral. An official-account post, acquired through a third-party mirror, says “live on HyperEVM” on 22 October. Ember's mirrored announcement describes its own interface as another door to the **same contracts and keeper**, so Ember and Rektrade must not be counted as two independent venues. Named legal operator, founders' verified identities/backgrounds and operating location remain unknown. [R001–R004]

Rektrade has the distinctive house/queue/loss-issued-revenue-token combination and is a **strong mechanism analogue** to Papertrade. Its mirror includes Papertrade comparisons and a third-party “fork ecosystem” list. That does not establish acknowledged code derivation or a verified code fork. Exact first mainnet transaction, deployment timestamp and any separate beta/preannouncement dates were not verified; 22 October is an official launch claim via a mirror. [R003]

## Mechanism and actual configuration differences

| Area | Acquired evidence |
|---|---|
| Markets/leverage | Current `/api/markets` lists BTC, ETH, SOL, ZEC, NEAR, XMR **and HYPE**, each with a 1,000× cap. Frontend describes fixed 1,000× opens. Older six-market posts should not define the current list. `/api/config` simultaneously carries older-looking 500× SOL and 200× ZEC/NEAR/XMR caps, conflicting with `/api/markets`; fixed 1,000× is not an independently verified execution guarantee. [R002, R004, R008] |
| Pricing | Embedded docs broadly say HyperCore BBO midpoint through precompiles. Current API instead reports `settle=bbo` for BTC/ETH/SOL, `oracle` for ZEC/NEAR/XMR, and `mark` for HYPE. This is a material documentation/configuration conflict; “all markets settle at BBO” is unsupported. Underlying Hyperliquid `dayVolume` fields are not Rektrade volume. [R002, R008] |
| Position lifecycle | Documented isolated fixed margin, no top-up, leverage edit or partial close; current config minimum hold 10 seconds. A bust forfeits full margin; the reported 5-bp price buffer makes a 1,000× bust about a 0.05% adverse move. No order book/funding or notional trading fee is described. [R002, R004] |
| Winning costs | Deadband then asymmetric impact, winning fee and win tax. Current API parameters report 0.2-bp deadband (`deadbandDiv=50000`), base impact 27.3%, win fee 5%, win tax 20%; these apply to different stages and must not be added as a simple 25% fee on raw PnL. [R002, R004] |
| Loss/deposit costs | User price loss is bounded by margin; the house can carve a loss fee from its gain when no winner is queued. Config reports loss fee 5%, deposit tax 5%, minimum deposit 5 USDC. A deposit tax is economically different from trading notional fees. [R002, R004] |
| House and queue | Docs say the house starts empty from losses, surviving margin returns at close and insufficient profit enters FIFO. Head entries are paid as cash covers them; future losses fund waiting claims, with no fees while queued. Current API exposes free cash, equity, liabilities and queue separately. [R002, R005] |
| Revenue participation | Realized losses mint REKT subject to a 21M cap; staking earns a share of collectible fees and tracked LP surplus above the cap. Current config reports a 30% staker share and a 500,000-USDC surplus threshold; these are business terms, not a return forecast. [R002, R004] |
| Authority | Embedded docs say no proxy/upgrade, owner-bounded parameter controls, pause/retire powers and permission to take unencumbered house cash only with an empty queue. Guardian can pause/retire. Session keys trade but cannot withdraw/stake/claim. These are unverified official descriptions, not an audit. [R002] |

Two further conflicts prevent a single timeless specification. The embedded docs describe a 21→1 daily mint schedule; the current house API reports **start 14.9, decrement 0.6/day, floor 1, day 7 rate 11.3**, plus a stake bonus. The config also exposes `mintHouseBps=2000`; its precise deployed allocation semantics were not reproduced. Secondly, embedded docs describe a Uniswap v4 token market while current API identifies HyperSwap V2. This research does not analyze token prices; the discrepancy matters for version/source reliability. [R002, R004–R005]

## Business measurement

The public [stats endpoint](https://rektrade.fun/api/stats) reports cumulative venue volume, trade/trader counts, losses, winners paid, user balances, open margin, fees and staker distributions. Its capture reports **1,449 trades / 52 traders**, while the house endpoint separately exposes cash/queue accounting. Counts are supplier-defined; unique humans, completeness and wash filtering are unknown. Volume has six-decimal USDC units in the frontend, not token decimals. Current cumulative `volume` must not be labelled 24-hour volume. [R002, R005–R006]

`/api/stats.at` is a supplier-reported Unix-seconds timestamp; the house response has an index height but no canonical block hash. Retrieval time and business timestamp remain separate. A zero queue/open-position snapshot is not evidence of lifetime solvency or no demand. No personal-wallet query, contract execution, security verification or full event replay was performed. The status route had a transport failure, which does not establish the site was down. [R005–R007]

R001–R008 abbreviate `EVD-COMP-REKTRADE-001`–`008`. This profile's collection used eight low-rate public GET attempts including that failure; the metadata gives exact UTC retrieval times and successful-capture SHA-256. Raw account/identity-bearing response sections remain private.

## Public basics, builders and community clues

The home labels all seven markets1000x, while config givesSOL500/ZEC-NEAR-XMR200x; the conflict remains. Ember’s own domain serves a Rektrade entry; its project-account mirror bio says built by @embercurve. Retained project-feed material attributes a self-claimed REKT deployment to billymeth.eth/@biiiiymeister, a developer clue rather than legal-CEO or deployment-wallet verification. Ember/Rektrade interfaces are not counted as two venues.

[Basic facts and leverage tiers](../basics.md) · [Background sources and access status](../backgrounds.md) · [Real screenshots and evidence IDs](../browser-checks.md). These additions do not close legal-identity, first-fill or deployed-parameter gaps.
