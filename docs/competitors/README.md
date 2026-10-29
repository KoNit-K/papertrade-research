# Papertrade followers and adjacent products

[中文](README.zh-CN.md) · [Chinese narrative](summary.zh-CN.md) · [Definitions](methodology.md) · [Refresh](refresh.md) · [Milestones](progress.md)

Research date: **28 October 2026**. Five competitors are covered, with Papertrade as a separate benchmark. This is a comparison of product design and business observations, without token-market analysis. Source descriptions, supplier statistics and independently recomputed transformations retain different evidence scopes.

## Findings

The strongest attribution is not a proven code fork. Trade Everything directly credits Papertrade's model; YOLO's creator credits the queue idea through a located original post read via mirrors/media. Cardboard and Rektrade reproduce a distinctive combination of House trading, unpaid winning claims and loss-issued participation, but source-code ancestry is unproven. STOX is included as an adjacent design with direct House capital contributions. These relationships do not imply common ownership or financing.

There is meaningful design divergence. YOLO documents whole-claim FIFO, which can block later winners behind a large head claim. Cardboard describes partial FIFO payments; Trade Everything describes half-order/half-pro-rata harvest. STOX offers a Reserve and permanent capital deposits. These are different cash-flow rules, and similar headline leverage does not make the obligations interchangeable. Their deployed behavior was not independently replayed.

Business visibility is uneven. Public product APIs provide useful Cardboard and Rektrade aggregates. YOLO's acquired current data is limited to DefiLlama's defined profit-fee series; the current House and leaderboard were not obtained. Papertrade has an acquired third-party TVL/fee snapshot, while its official history was blocked and the inspected external volume/OI adapter deliberately disables publication. A report can preserve these gaps without turning unavailable fields into zero.

## Who operates them, and when did they launch?

| Product / dossier | Origin and relationship | Date evidence and its limit |
|---|---|---|
| [Papertrade](projects/papertrade.md) | HyperEVM benchmark; existing set-2 research | Set 1 from October 7 and set 2 from October 21 are version dates. Launch reports support October 10 at 14:00 UTC / 22:00 Shanghai; the first executed public trade remains unverified. |
| [Jupiter YOLO](projects/yolo.md) | Jupiter Labs on Solana; acknowledged design inspiration via attributed post | Beta announcement 15 October; Siong mirror shows 12:59 UTC / 20:59 Beijing. Original unavailable; first executed public trade unverified. |
| [Cardboard](projects/cardboard.md) | Solana; Terms name **Attractor Labs, Inc.** as interface operator; strong mechanism analogue | Mirrored operational posts from 18 October; Terms dated 25 October. Exact first real trade and beta timestamp unknown. |
| [Trade Everything](projects/trade-everything.md) | HyperEVM; separate Papertrade-community project explicitly borrowing its model | Announced mainnet opening 26 October 13:30 UTC / 21:30 Beijing. Draft/demo/live wording and failed mainnet reads prevent confirmation of actual launch execution. |
| [Rektrade](projects/rektrade.md) | HyperEVM; strong mechanism analogue; Ember is another interface to the same venue | Mirrored official claim says live on 22 October; independent first-trade timestamp unknown. |
| [STOX](projects/stox.md) | Configured Robinhood Chain 4663; explicitly unaffiliated with Robinhood/Hyperliquid; adjacent design | Frontend config `launchTime` resolves to 20 October 00:12:28 UTC / 08:12:28 Beijing. It is not an independently checked first trade or v2 deployment time. |

Legal entity, founders' verified biographies, headquarters and product-specific financing remain unknown where the dossier does not identify supporting evidence. Jupiter's brand attribution is not a finding about a YOLO contracting entity; a chain or oracle provider is not the product's issuer. Attractor Labs' name does not establish its jurisdiction. Geographic access restrictions do not establish company location.

The discovery list misclassified Trade Everything as Solana; its official architecture names HyperEVM. See the [candidate register](../../research/competitors/candidates.json).

The [business supplement](../business-snapshot.md) adds Papertrade launch reports without replacing the October 28 adapter snapshot. [Review decisions](../research-notes/019-manuscript-reconciliation.md) retain existing source boundaries: YOLO's documented House/queue model does not establish loss-token issuance; Cardboard's October 25 terms date is not its verified launch; Rektrade's market/config leverage conflict remains; Trade Everything's 502/Demo observations do not prove it never opened; STOX's chain and capital-injection design do not establish Robinhood backing. Backpack/Mad Lads and GMX/Synthetix team hypotheses lack attributable supporting evidence in this review.

## Supported coins and assets

| Platform | Crypto trading underlyings | Other underlyings | Collateral / trade settlement | Evidence scope |
|---|---|---|---|---|
| Papertrade | BTC, ETH | None established | USDC / USDC | Current official FAQ; listing capability is not a listing |
| Jupiter YOLO | SOL, BTC, ETH, ZEC, HYPE | None established | JupUSD / JupUSD | Official overview; other input tokens are swapped, not extra markets |
| Cardboard | BTC, ETH, SOL | None established | USDC / USDC | Official docs and product API agree |
| Trade Everything | BTC, ETH, SOL, HYPE, BCH **in Draft docs** | 208 stock/ETF metadata entries; six Asian names additionally documented, potentially overlapping | USDC / USDC | Demo-host metadata and Draft scope; mainnet activation/crypto routes unverified |
| Rektrade | BTC, ETH, SOL, ZEC, NEAR, XMR, HYPE | None established | USDC / USDC | Product market API; leverage caps conflict with config |
| STOX | No crypto entry in retained config | 60 configured entries across stocks, ETF, commodity, FX, index and intl | USDG / USDG | Frontend configuration; not independently checked active-market registry |

The [full market inventory and evidence scopes](markets.md) separate underlyings, collateral and rewards. Trade Everything’s five crypto names are Draft descriptions; STOX’s 60 entries are frontend configuration.

## Public basics and leverage

The [basic-facts guide](basics.md) covers official links, accounts, chain, collateral, leverage, minimums, limits, holding times and costs. [Builder and community background](backgrounds.md) separates biographies, self-claims and tentative associations. [Browser checks](browser-checks.md) retain seven real viewport screenshots with save times. Current coverage is Papertrade plus five competitors.

| Platform | Leverage information | Evidence and admission boundary |
|---|---|---|
| Papertrade | BTC/ETH docs up to1000x; selected BTC slider1–1000x | Default10x/1USDC is not an admission minimum; effective minimum unverified |
| YOLO | 500–1000x,100x steps | Official description; trade page connection failed, current directional capacity unverified |
| Cardboard | Docs and BTC slider1–1000x | Configmax1000; default margin1 does not prove minimum1 |
| Trade Everything | DraftBTC/ETH up to1000x; topUSregular500/pre-post375/overnight250x; other equities≤100x; Asian regular40/80/100x | Home advertises500x; default Demo NVDA overnight shows250x; session/risk rules are not execution-verified across mainnet |
| Rektrade | Home/markets show1000x for seven markets; configSOL500/ZEC-NEAR-XMR200x | ConfigBTC/ETH/HYPE1000x; conflicting sources not resolved by real admission |
| STOX | NVDA slider1–1000x,MAX1000x | Other markets and effective contract settings unverified; staticfallback is not chain state |

Geography is equally scoped: Papertrade has historical NewYork-meeting and US-biography clues; Jupiter terms state a Panama interface-law scope. Current headquarters or nationality is not inferred from language, chain or company suffix. Tentative associations retain their direct source and uncertainty.

## Mechanism comparison

| Product | Trading and pricing | House / payments | Participation and control differences |
|---|---|---|---|
| Papertrade | Isolated high leverage; HyperCore BBO midpoint; relayer | Loss-funded LP; cash and claim-funded positions; separate payment queue | Loss-issued PAPER and keeper-mediated distributions; source/version limits in existing review |
| YOLO | 500–1,000×; Pyth Pro; 15-second minimum manual hold; no TP/SL | JupUSD; whole-claim FIFO; 72h/50× profit close rules | Nonlinear profit adjustment, 2% win fee and 0.2-bp close charge; trade service co-signature; no loss-token mechanism established |
| Cardboard | 1–1,000×; opening-locked winning exposure; accepted midpoint | USDC; partial FIFO; optional queued-claim margin | Loss-issued CARDBOARD, staking/referrals/builders; freeze and explicit-price close powers; dynamic config differs from old posts |
| Trade Everything | Stocks/ETFs with session limits and Pyth Pro; BTC/ETH route descriptions conflict | Independent pool described; half-order/half-pro-rata harvest | Loss issuance and PAPER-staker allocation; Draft docs also conflict on immediate payment; actual routing/version unresolved |
| Rektrade | Published market configs disagree on caps; BBO/oracle/mark differ by market | USDC House; queue; free cash and liabilities exposed separately | Loss-issued REKT, staking, deposit tax and multi-stage win costs; mint schedule/venue descriptions conflict with API |
| STOX | USDG; up to 1,000× displayed; partial close and keeper TP/SL | Shared House plus Reserve; permanent capital contributions | Nontransferable House Shares can come from losses or deposits; configured addresses not independently deployment-verified |

These are bounded source observations, not a deployed-contract feature certification. Each dossier records source IDs and unresolved contradictions. The current Rektrade market list includes HYPE, unlike older six-market descriptions. Trade Everything's BTC/ETH route to Papertrade cannot be counted as independent competitor activity while its own Draft pages disagree about that route.

## Business observations

The adapter table retains the original09:31–09:35Beijing snapshot. Later11:04–11:15browser captures show rounded Papertrade BTC-view24hvolume$7.68B/longOI$84.2M/shortOI$32.6M and selected STOX NVDA-view24hvolume$62.7M/longOI$250/shortOI$0. Definitions, business-as-of and platform-wide coverage were not established; these page assertions are separate from adapter metrics. See [screenshots](browser-checks.md).


Successful network reads: **01:31:54.850–01:35:04.865 UTC / 09:31:54.850–09:35:04.865 Beijing, 28 October 2026**. The two zero-request blocked runs were created separately at 01:36:57 UTC. Figures below are source assertions and byte-checked unit transformations, not a common-time balance sheet or market-share ranking. Full precision, per-field retrieval times, source URLs, evidence IDs and missing reasons are in the [67-row snapshot](../../research/competitors/snapshots/latest.json) and [CSV](../../research/competitors/snapshots/latest.csv); response hashes are in the [metrics source metadata](../../research/competitors/sources/metrics.json).

| Product | Volume / recorded activity | Capital / debt fields | Data scope |
|---|---|---|---|
| Papertrade | Current notional volume and active wallets unavailable here; provider-defined 24h fees **$60,113** | Provider TVL **$30,863,176**, business time 00:01:47 UTC; House/queue unknown | DefiLlama; TVL includes customer funds, and fee measure includes defined distributions. Not pure bankroll or directly comparable to YOLO fees. |
| YOLO | Current notional volume/wallets unavailable; provider 24h profit fees **$4,650**, 7d **$48,332**, cumulative **$83,051.25** | Current House/queue unknown; empty provider TVL history is not zero | DefiLlama profit-fee scope, unspecified exact window boundaries; excludes other costs. |
| Cardboard | Reported cumulative notional **$7,407,335,307.36**; explicit provider 24h fields sum **$12,812,556.65**; **75,008** reported trades, **1,388** cumulative wallets | LP cash **$723,128.07**, treasury **$882,859.51**, queue **$0**, OI **$567,116.28** | Official aggregate API; business timestamp absent. Treasury and LP cash scopes are not reconciled and are not added. Counts are not 24h-active people. |
| Rektrade | Reported cumulative notional **$135,225,758.26**; **1,449** reported trades, **52** cumulative wallets; no verified 24h volume | Free cash **$1,103.83**, treasury **$1,971.24**, queue **$0** | Official stats at 01:35:04 UTC; separate House response has no business timestamp. No net-profit or solvency inference. |
| Trade Everything | Unknown | Unknown | Four selected mainnet config/aggregate reads returned 502; demo data excluded. |
| STOX | Unknown | Unknown | Initial HTML/config values were placeholders; later rounded selected-NVDA counters are separately recorded; no aggregate adapter verified. |

Cardboard's cumulative volume is not its one-day volume despite `range=1d`. Neither cumulative wallets nor cumulative losses establishes activity or retention. Rektrade's reported cumulative losses and winners paid are separately exported but are not reconciled net trader PnL. A zero queue snapshot does not establish that historical claims were always paid or future winners will be paid.

The YOLO **$1B in less than 24 hours** story is kept as a historical issuer claim. The original post locator was extracted from acquired SolanaFloor HTML; original complete post and event total were not directly verified. It refers to leveraged notional rather than deposited cash. The Defiant body did not load, so it is not presented as a fully read corroborating article. The owner-provided House/queue example lacks a timestamp and is excluded from current scale.

## Evidence coverage and follow-up

Independent agents checked selected source captures, critical mechanisms and the data pipeline. Four captured project runs reproduced identically offline, and a second Cardboard live refresh created a distinct run. Focused tests, repository checks and remaining findings are recorded in [verification](../../research/competitors/verification.json), [independent review](../../research/competitors/review.json) and [data review](../../research/competitors/review-data.json). These checks validate byte identity and processing, not upstream honesty, complete event history or contract security.

The most consequential gaps are YOLO's current House/queue and full leaderboard, first-trade/deployment dates, legal/financing identities, Trade Everything's live mainnet and conflicting docs, and deployed resolution of Rektrade's inconsistent settings. Follow-up steps are in each dossier and the [refresh guide](refresh.md). No cross-project aggregate, user-retention estimate, token-market analysis or solvency guarantee is produced.
