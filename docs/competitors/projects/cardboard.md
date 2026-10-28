# Cardboard Trade

[中文](cardboard.zh-CN.md) · [Official application](https://cardboardtrade.xyz/) · [Documentation](https://docs.cardboardtrade.xyz/) · [Evidence metadata](../../../research/competitors/sources/cardboard.json)

Observed on 28 October 2026. This profile describes official documentation and supplier API responses, not independently reproduced settlement or verified contract security.

## Trading underlyings and settlement

BTC, ETH, SOL; USDC collateral and trade settlement. CARDBOARD is a participation/reward asset, not an established derivative market. [Full inventory and source scope](../markets.md).

## Identity, status and relationship

Cardboard is a Solana USDC application for synthetic BTC, ETH and SOL long/short positions, with documented leverage from 1× to 1,000× and a $10 million order-value ceiling. Its 25 October Terms name **Attractor Labs, Inc.** as interface operator. The acquired materials do not establish incorporation jurisdiction, operating headquarters, named founders or their professional histories. A jurisdiction excluded from access is not the operator's location. [C001, C011]

It is a **strong mechanism analogue** to Papertrade: house counterparty, delayed winning profits, losses minting a revenue-sharing token. External commentators call it a fork, but this collection establishes neither an official admission of copying nor shared source-code ancestry. Record it as mechanism similarity; code-fork status remains unknown.

The official-account mirror contains operating updates dated 18–27 October, including analytics/builder/SDK changes. These are third-party copies of posts, not direct X verification or a proven first mainnet trade. Exact announcement, beta and real-money launch instants remain null. The application API currently reports unpaused trading, live positions and aggregate activity; this supports an operating-product claim at supplier level, without proving the earliest launch date. [C014–C017]

## Product and economic design

| Area | Acquired description and limit |
|---|---|
| Execution | Each isolated position faces the house. Entry/close use an accepted bid/ask midpoint. Quote freshness gates opens; closes/liquidations may use the last accepted price during an outage. The underlying price-provider identity is not established by the pages read. No periodic funding. [C002, C009] |
| Position changes | No margin top-up/removal, leverage change or partial close. Additional exposure requires another position. [C002] |
| Winning payout | A depth/exposure curve locks a winning exposure at opening; long/short capacity is separate. A locked deadband, winning fee and close charge then affect settlement. Splitting an order does not create extra capacity. [C003–C004] |
| Loss/liquidation | An adverse-price loss reduces isolated margin; a bust forfeits the whole margin. A house-side loss fee is not an additional price loss; the close charge can still reduce returned margin. The liquidation-specific page failed to return, so the exact current buffer is unverified. [C004–C005] |
| Queue | Surviving cash-funded margin returns to available balance; unfunded profit enters FIFO, with partial payments and no promised date. Optional queued-claim collateral can lose or destroy an unpaid claim. [C006] |
| Loss-issued participation | Eligible adverse-price losses, including full liquidation margin, mint claimable CARDBOARD. A close charge alone does not qualify. Issuance starts at zero; the documented rate is 100 per eligible USDC below a $1M tracked-house threshold, followed by a progress-dependent declining curve. This is an incentive/revenue claim, not a loss refund. [C007] |
| Revenue distribution | Half of collectible gain/loss fees funds the staking/referral budget and half the fee recipient. The notional close charge funds house liquidity. Eligible excess above the configured threshold can also be distributed; the queue has priority. Staking is proportional with no current cooldown. [C008] |
| Builder channel | Documented wallet/session authorization and optional fee markups; the default markup is 10% of each base fee, capped at 25%, rather than 10/25% of order notional. [C010] |

The captured configuration reports `max_leverage=1000`, `deadband_ppm=0`, `round_trip_fee_ppm=200` (0.02% = 2 basis points), and `trading_paused=false`. These are **supplier configuration values at collection**, not authenticated onchain parameters. Documentation tables contain dynamic placeholders; older posts about 0.4-bp fees or a 0.2-bp deadband must not replace this snapshot. [C015]

Operators can pause opens, limit/retire markets, freeze accounts and close a position at an explicit price. A freeze can block voluntary closes, deposits, withdrawals and rewards while liquidation remains possible. Documentation describes a 200-ms relay delay with closes/liquidations prioritized. Deployment upgrade authority and a deployed binary/source match were not verified. [C009]

## Business evidence and remaining gaps

The public aggregate [analytics endpoint](https://cardboardtrade.xyz/v1/analytics?range=1d) reports cumulative `stats.volume`, `trades` and `users`, separate BTC/ETH/SOL `*_volume_24h`, OI, open margin, LP cash, treasury and unpaid queue. **`range=1d` does not make `stats.volume` a one-day value.** At this capture it reported 75,008 trades and 1,388 users; the population/deduplication definitions are unverified. `lp_cash` is not the same as `treasury` or user balances. [C016]

The response has no explicit business-as-of timestamp; keep it null and retain retrieval time separately. The system endpoint provides index/slot freshness but does not attach a canonical block hash to the analytics response. No independent cumulative-history completeness, wash-volume filter, beneficial-user count, fee/revenue reconciliation or payout-tail measurement was performed. Raw activity records stay private; public analysis uses aggregate fields only. [C016–C017]

Evidence labels C001–C018 mean `EVD-COMP-CARDBOARD-001`–`018` in the metadata file. That file includes successful and failed requests, source SHA-256 and access/read limitations. Collection used 18 low-rate public GET attempts, with no login or wallet action.

## Public basics, builders and community clues

Docs and the BTC ticket show1–1000x; the screenshot displays a2bp close charge. Terms identify AttractorLabs,Inc. as interface operator, with @cardboard_trade the public development channel. A syndicated sanyi.eth community comment calls it a Papertrade clone, not verified code ancestry. The same-name AttractorLabs in a Founders,Inc. list lacks cross-links and is not merged into this team.

[Basic facts and leverage tiers](../basics.md) · [Background sources and access status](../backgrounds.md) · [Real screenshots and evidence IDs](../browser-checks.md). These additions do not close legal-identity, first-fill or deployed-parameter gaps.
