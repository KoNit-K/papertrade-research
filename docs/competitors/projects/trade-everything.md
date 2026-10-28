# Trade Everything

[中文](trade-everything.zh-CN.md) · [Official site](https://tradeeverything.xyz/) · [Documentation](https://docs.tradeeverything.xyz/intro/what-is-tradeeverything/) · [Evidence metadata](../../../research/competitors/sources/trade-everything.json)

Observed on 28 October 2026. **Acknowledged borrowing is established; real-money operating scale is not.** Current documentation is labelled Draft, and some acquired pages disagree about BTC/ETH execution. None of the descriptions below is a verified deployed-code specification.

## Trading underlyings and settlement

Draft crypto scope: BTC, ETH, SOL, HYPE, BCH; USDC collateral/settlement. The default/demo-host metadata has 208 unique stock/ETF symbols; six Asian names are separately documented and may overlap. These are not verified mainnet-active counts; BTC/ETH routing remains unresolved. [Full inventory and source scope](../markets.md).

## Identity, dates and relationship

The official architecture names HyperEVM chain 999, USDC held on HyperCore and Pyth Pro prices. This corrects the discovery list's Solana attribution. The acquired Terms call the counterparty only the interface operator; legal entity, operating jurisdiction, headquarters and verified team biographies remain unknown. The similarly named `tradeeverything.com` and `everything.co` must not be merged with `tradeeverything.xyz`. [T007, T018]

The [Built on Paper Trade](https://docs.tradeeverything.xyz/built-on-paper/overview/) page explicitly attributes the model to Papertrade and calls the project a separate member of its community. It brings the pool/loss-issued-token model to stocks and ETFs and allocates part of issuance to PAPER stakers. This proves **acknowledged model borrowing**, not a code fork. [T002]

An official-account post dated 22 October, read through a third-party mirror, announces 26 October at 13:30 UTC. The landing page and network-switch script repeat that planned mainnet instant. No independently checked first mainnet fill or distinct beta launch was obtained. The landing HTML contains both countdown and live wording; its exchange link defaults to a paper-money demo. The official network script directs both testnet and mainnet to `testnet.tradeeverything.xyz`, using chain 998/999 routes respectively. This is an explicit product configuration, not a workaround. All four selected `/api/999/` aggregate/config GETs returned HTTP 502. **Elapsed launch time and a live label do not establish actual trading.** [T011–T014, T019–T025]

## Product design and configuration conflicts

| Area | Official description and unresolved scope |
|---|---|
| Markets | About 200 US stocks/ETFs plus six Asian markets; up to 500× on the top ten US names in regular hours, lower session/market limits elsewhere. These are documented availability/limits, not demonstrated tradable depth. [T001, T009, T016] |
| Pricing/execution | Stock orders are committed then filled at the first qualifying Pyth update after a session-dependent delay. Off-hours closes can use the worse of that price and a running average. No order book or conventional funding; no underlying equity delivery. [T015] |
| Costs | For wins: documented 0.2-bp deadband, nonlinear haircut (maximum retention 90%), then ordinarily 2% win fee, potentially up to 10%. A losing user pays the loss; a 2% house-side loss fee can be taken only when the queue is empty. Half of collectible fees goes to stakers and half the dev recipient. These are Draft documentation values. [T003] |
| Liquidation/market closures | A documented 5-bp buffer before zero equity; hard liquidation loses full isolated margin. Halts/weekend locks, session leverage/OI trims and gap-profit caps materially change holding outcomes; first-price/recovery protections are described. [T005, T009, T016] |
| House/queue | The independent pool starts at zero and accepts no LP deposits. Unpaid winning profit can queue; cash-funded surviving margin returns immediately. Harvest splits available payment cash **50% by queue order and 50% pro rata across remaining claims**, so this is not pure FIFO. Queued claims may be reused as margin and lost. [T004, T017] |
| Loss incentives/revenue | Documented 10B issuance cap, 80% loss-earned trader allocation/20% PAPER-staker allocation, zero team allocation. Stakers receive half of fees and a threshold-dependent share of pool gains; queued winners have priority. This is business participation, not token-price analysis. [T008] |
| Infrastructure/authority | Relayer/batcher, fill/liquidation/session/risk/scoring keepers; proxies described as owned by a seven-day timelock and 2-of-3 multisig. Guardian can pause opens or retire/freeze a market; owner can upgrade. Other pages also describe freezing suspected manipulating wallets. These controls were not authenticated onchain. [T006–T007, T016] |

**BTC/ETH must be kept separate.** T002 says each BTC/ETH order routes one-for-one to Papertrade through a user subaccount, preserving the user's PAPER entitlement; these trades would already be Papertrade business. In contrast, T015–T016 describe Pyth-priced BTC/ETH, an independent crypto basket and recovery rules. Neither page supplies a deployment/version binding resolving this conflict. Do not silently combine the two descriptions. Until actual routes are verified, classify BTC/ETH as **documented routing with conflicting independent-market descriptions**, and exclude it from sums of independent competitor volume. The stocks/ETF model can be compared separately. [T002, T015–T016]

A second conflict concerns payout timing: the off-hours section of the pricing page says every win is paid at once, while the pool/queue and solvency pages explicitly describe unpaid profit, partial harvest and delayed payment. The acquired pages have no deployment/version binding resolving this. Neither statement establishes a guaranteed payment time for the actual deployment. [T004, T015, T017]

The landing page also advertises Price Promise, a premium-paid contingent-position product. Its realized uptake and contribution to pool cash/options valuation were not measured. A headline “cash + options value” would not equal liquid payout cash. [T004, T011]

## Business measurement limits

The public application bundle reveals mainnet protocol-summary, house-current and queue-summary routes; their acquired responses were 502, so volume, trader counts, cash, revenue and queue measurements remain **null, not zero**. Demo `/api/` market summaries must not be substituted for `/api/999/` business data. A future deployment check needs successful mainnet configuration, contract/version identity and a bounded transaction or aggregate-history cross-check; none is claimed here. [T013, T021–T025]

T001–T025 abbreviate `EVD-COMP-TRADEEVERYTHING-001`–`025`. Metadata retains the UTC retrieval instant and SHA-256 of successful captures. This collection used 25 low-rate public GET attempts, including one transport failure and four HTTP 502s; no login, account query, wallet connection or transaction occurred.
