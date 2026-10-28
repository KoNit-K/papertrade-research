# Platform basics: leverage, limits and costs

[中文](basics.zh-CN.md) · [Comparison](README.md) · [Full market inventory](markets.md) · [Browser checks](browser-checks.md) · [Structured facts](../../research/competitors/basic-facts.json) · [Basic-fact evidence](../../research/competitors/sources/basic-facts.json)

Observed on 28 October 2026. Documentation, API reports, static client defaults and browser displays have separate scopes. A displayed limit does not authenticate a contract parameter or guarantee admission. Unknown means the named sources did not establish the value; it does not mean zero or unrestricted trading. Source IDs below retain the original capture dates, rather than treating this page's assembly as a new observation. No wallet connection or trade was used.

Later anonymous browser checks have their own [source records and screenshot save times](../../research/competitors/sources/browser.json). They supplement earlier missing observations without replacing the earlier 67-row business snapshot. Screenshot save time is not precise frame time or business-as-of; those business cutoffs remain unknown.

## Papertrade

[Website](https://papertrade.xyz/) · [Trading app](https://exchange.papertrade.xyz/) · [Docs](https://docs.papertrade.xyz/) · [Account locator](https://x.com/papertrade_xyz)

| Basic field | Acquired information and boundary |
|---|---|
| Chain / assets | HyperEVM chain 999; HyperCore-related USDC infrastructure. BTC/ETH underlyings; USDC collateral and trade payout. PAPER is a participation asset, not an established listed derivative here. |
| Leverage | Documented maximum **1,000×** for BTC/ETH. A later selected-BTC ticket displays a **1–1,000× slider**, default 10×. The displayed lower endpoint does not authenticate a contract minimum; increments and effective per-market admission limits remain unknown. |
| Minimum margin | **Current value unknown.** A retained earlier service observation at indexed blocks 49121146–49121151 reported **$10 margin / $1,000 opening notional**. These are historical observations, not today's ticket minimum. |
| Position / holding limits | Current per-position maximum notional and fixed minimum/maximum holding period were not established by the retained FAQ, baseline and service-note search. Position-size controls exist; missing numbers are not unlimited size. |
| Headline costs | No opening, funding or notional close fee in the retained normal model. Favorable PnL passes deadband → small-move holdback → asymmetric impact → applicable **2% of scaled profit**. An approved builder can add **0.5% of scaled profit** in that branch. Standard/off-hours holdback bands are 0.75–6 / 0.3–10 bps. Cash/debt, queue and fee-waiver branches remain distinct. |
| Date / status | Frontend launch is reported as **10 October 2026**, without an independently checked original announcement or first fill. Documentation version dates are set 1: 7 October, set 2: 21 October. They are not the same event. |
| Later browser figures | The selected-BTC header displays rounded **24h volume $7.68B, long OI $84.2M, short OI $32.6M**. These are page assertions with **unknown business-as-of**, not a verified whole-platform total, exact unrounded measure or standardized notional definition. The margin input's default 1 USDC does not establish an opening minimum. |

Evidence: `EVD-COMP-BASIC-PT-BASELINE`, `EVD-COMP-BASIC-PT-FAQ`, `EVD-COMP-BASIC-PT-SERVICE-NOTE`, and later browser `EVD-COMP-BROWSER-PT`. See the [baseline dossier](projects/papertrade.md) and [BTC screenshot](browser-checks.md#papertrade-btc). The later page display supplies a visible slider range; opening admission minimum and size limits still need separate evidence.

## Jupiter YOLO

[App](https://jup.ag/yolo) · [Docs](https://docs.jup.ag/user-docs/labs/yolo) · [Account locator](https://x.com/JupiterExchange)

| Basic field | Acquired information and boundary |
|---|---|
| Chain / assets | Solana; SOL/BTC/ETH/ZEC/HYPE direction trades. **JupUSD** collateral and payout; other input tokens are swapped and do not add trading markets. House is separate from JLP. |
| Leverage | Official description: **500–1,000×**, in **100× steps**. The retained overview screenshot confirms the advertised range, not program-level enforcement. |
| Minimum margin | Documented **5 JupUSD**; network/swap costs are separate. |
| Position limits | Documented maximum notional per position: **$1M for SOL/BTC/ETH**, **$250k for ZEC/HYPE**. Mutable market-side capacity can bind earlier. |
| Holding / payout | Earliest manual close **15 seconds**; liquidation can occur meanwhile. Automatic close at **72 hours** or adjusted profit reaching **50× collateral**. Whole-claim FIFO can delay profit after closing; no guaranteed payout date. |
| Headline costs | No opening/funding fee in the description. **0.2-bp favorable deadband**, nonlinear profit adjustment, 50× cap, then **2% winning-profit fee**. Every close/liquidation also charges **0.2 bp of notional** from collateral. These bases differ; provider profit-fee metrics exclude other costs. |
| Date / status | Jupiter Labs beta announcement: **15 October 2026**; mirror displays 12:59 UTC / 20:59 Beijing. Original-post authenticity/time and first mainnet fill were not independently checked. |

Evidence: `EVD-COMP-BASIC-YOLO-OVERVIEW`, `EVD-COMP-BASIC-YOLO-TRADING`, `EVD-COMP-BASIC-YOLO-FEES`, `EVD-COMP-BASIC-YOLO-LAUNCH`, and browser `EVD-COMP-BROWSER-YOLO`. [Dossier and exact formula](projects/yolo.md). The later trade-page navigation failed (`EVD-COMP-BROWSER-YOLO-TRADE-FAIL`); it supplied no current House, queue or leaderboard and does not prove global downtime. [Browser scope](browser-checks.md#yolo-overview).

![YOLO official overview displaying 500–1000x and JupUSD](assets/yolo-overview-20261028.jpg)

## Cardboard Trade

[App](https://cardboardtrade.xyz/) · [Docs](https://docs.cardboardtrade.xyz/) · [Account locator](https://x.com/cardboard_trade)

| Basic field | Acquired information and boundary |
|---|---|
| Chain / assets | Solana; BTC/ETH/SOL; **USDC** collateral and payout. CARDBOARD is a loss/revenue-participation asset. |
| Leverage | Documented **1–1,000×**; captured config reports `max_leverage=1000`. Browser slider displays x1–1000. Side capacity and signed payout-factor minimum still apply. |
| Minimum margin | **Unknown.** The screenshot's entered/default **1 USDC is not proof of a 1-USDC minimum**. Static client consumes market `min_margin` and `min_notional`, which were not present in the acquired aggregate/config fields. |
| Position / holding limits | Documented maximum order notional **$10M**. No fixed minimum/maximum hold established in retained docs/config. Margin, leverage, winning exposure and fee terms lock at opening; no margin edit or partial close is described. |
| Headline costs | Captured `round_trip_fee_ppm=200` means **2 bp of original notional on close**, also displayed in the screenshot. Config deadband is **0**, rather than an old post's value. Winning fee is market-specific and was not resolved from dynamic documentation placeholders. No periodic funding. Builder markup defaults to **10% of the base fee**, capped at **25% of that base**, not order notional. |
| Date / status | Mirrored operational updates exist from **18 October**; Terms dated **25 October** name Attractor Labs, Inc. Exact beta/first-real-trade time and the entity's jurisdiction remain unknown. |

Evidence: `EVD-COMP-BASIC-CARDBOARD-OVERVIEW`, `EVD-COMP-BASIC-CARDBOARD-TRADING`, `EVD-COMP-BASIC-CARDBOARD-FEES`, `EVD-COMP-BASIC-CARDBOARD-CONFIG`, `EVD-COMP-BASIC-CARDBOARD-CLIENT`, and later browser `EVD-COMP-BROWSER-CARDBOARD`; launch/Terms: `EVD-COMP-CARDBOARD-014`, `011` in the [dossier](projects/cardboard.md). [Browser scope](browser-checks.md#cardboard-trade).

![Cardboard ticket displaying x1–1000 and a 2-bp close charge; entered margin is not a minimum](assets/cardboard-trade-20261028.jpg)

## Trade Everything

[Website](https://tradeeverything.xyz/) · [Draft docs](https://docs.tradeeverything.xyz/) · [Account locator](https://x.com/TradeEverythin_)

| Basic field | Acquired information and boundary |
|---|---|
| Chain / assets | HyperEVM 999 described; **USDC** collateral/payout. Five crypto names in the Draft-documentation union: BTC/ETH/SOL/HYPE/BCH. BTC/ETH routing to Papertrade conflicts with independent-Pyth-market descriptions. 208 stock/ETF demo metadata entries and six Asian names are not a verified active-mainnet count. |
| Crypto leverage | **BTC/ETH up to 1,000×** in Draft leverage docs, subject to capacity. The five-name crypto union does not establish a 1,000× limit for every name or five independent active markets. |
| US equity leverage | Top ten by documented volume ranking: **500× regular / 375× pre-market and after-hours / 250× overnight**. Others: **at most 100×**, with 4× benchmark B regular, 3× B extended and 2× B overnight. Session/spread/event/risk limits can reduce those caps. |
| Asian leverage | Draft cash-session formula `min(4B,100)`: Nikkei 225 and KOSPI 200 **80×**; SK hynix/Samsung/Xiaomi **100×**; SoftBank **40×**. The two indices are **40×** outside cash hours. At locks, the Asian rule is `floor(0.5B)`. These are documented formulas and derived caps, not fills. |
| Additional restrictions | Stock positions funded with queued claims: **20×**. Crypto recovery new opens: **10× for five minutes**. US weekend caps use historical-gap rules in the hours page; its NVDA example is **10×**, while the leverage page shows **25×**. Do not force them into one current setting. |
| Minimum / position limits | Minimum margin/open notional **unknown**. Draft per-stock per-account maxima: Tier A **$10M**, B **$2M**, C **$500k**, D **$100k**. BTC/ETH: **$10M per position and account**; an order uses at most **25% of remaining side room**. Lower session/scenario/launch caps can bind. |
| Holding / costs | Fixed minimum/maximum hold unknown. Fill delays **1/2/3 seconds by US session** are not minimum hold; locks and session changes can stop fills or force trims. No opening/funding charge described; **0.2-bp deadband**, nonlinear haircut retaining at most 90%, then **2% default / up to 10% winning fee**. House-side loss fee is conditional, not extra user price loss. |
| Date / status | Announced opening **26 October 2026 13:30 UTC / 21:30 Beijing**, through a 22 October mirrored post. Draft/demo/live wording, contradictory payment descriptions and failed `/api/999/` reads prevent confirmation of live mainnet execution. |
| Later browser checks | Homepage displays **Mainnet is live** and **500× maximum**. The default exchange is explicitly **Demo**: selected NVDA shows **Overnight Max 250×**, selected 125×; DOM describes next pre-market **375×**. Demo equity **$10,000 is not a customer deposit**. These displays do not resolve actual mainnet activation or the earlier failed mainnet aggregate reads. |

Evidence: `EVD-COMP-BASIC-TE-LEVERAGE`, `EVD-COMP-BASIC-TE-HOURS`, `EVD-COMP-BASIC-TE-FEES`, `EVD-COMP-BASIC-TE-ANNOUNCEMENT`, and later `EVD-COMP-BROWSER-TE-HOME` / `EVD-COMP-BROWSER-TE-DEMO`. [Dossier](projects/trade-everything.md) retains the routing and immediate-payment/queue conflicts; [browser checks](browser-checks.md#trade-everything-demo) keep demo balances separate from real business.

## Rektrade

[App](https://rektrade.fun/) · [Embedded docs](https://rektrade.fun/docs) · [Account locator](https://x.com/rektradefun)

| Basic field | Acquired information and boundary |
|---|---|
| Chain / assets | HyperEVM 999; BTC/ETH/SOL/ZEC/NEAR/XMR/HYPE; **USDC** collateral and payout. Ember is another interface to the same venue, not extra business. |
| Leverage conflict | Frontend/config `fixedLeverage=1000` selects **1,000×**. `/api/markets` reports **1,000× for all seven**, and the later homepage screenshot labels all seven **1,000×**. `/api/config` simultaneously reports **BTC/ETH/HYPE 1,000×, SOL 500×, ZEC/NEAR/XMR 200×**. The page does not resolve this conflict or establish a universal contract minimum/effective executable cap. |
| Minimum margin / deposit | Captured config: **1 USDC margin**, **5 USDC deposit**; different rules, both USD6 decoded. |
| Position limits | `/api/markets` reports maximum notional **BTC/ETH/HYPE $100k; SOL $500k; ZEC/NEAR/XMR $250k**. Config allows **32 open positions per user**. These are API reports, not tested admission. |
| Holding | Config minimum hold **10 seconds**; maximum duration unknown. Raw `maxPayoutX=0` does not mean zero permitted profit or a timed close cap. |
| Headline costs | Config: **0.2-bp deadband**, **27.3% base impact**, **5% win fee**, **20% win tax**, **5% deposit tax**, **5% house-side loss fee**. Impact/fees/tax have different bases and order; do not add them into one raw-PnL rate. No notional trading or funding charge described. |
| Date / status | Official-account mirror claims live on **22 October 2026**. Independent first fill remains unknown. Embedded docs/API also disagree on pricing and mint schedule. |

Evidence: `EVD-COMP-BASIC-REKT-CONFIG`, `EVD-COMP-BASIC-REKT-MARKETS`, `EVD-COMP-BASIC-REKT-CLIENT`, `EVD-COMP-BASIC-REKT-LAUNCH`, and later `EVD-COMP-BROWSER-REKT`. [Dossier](projects/rektrade.md) · [Homepage screenshot](browser-checks.md#rektrade-home). Underlying Hyperliquid volume is not Rektrade volume; later rounded homepage counters are not a new exact aggregate reconciliation.

## STOX perps

[App and embedded explanations](https://stoxpreps.com/) · [Account locator](https://x.com/STOXPREPS)

| Basic field | Acquired information and boundary |
|---|---|
| Chain / assets | Configured Robinhood Chain **4663**; **USDG** collateral and trade payout. 60 retained non-crypto configuration entries; no crypto underlying there. STOX/ETH distribution paths and House Shares do not add trade-settlement choices. |
| Observed leverage | The retained **NVDA page displays MAX LEVERAGE 1,000×**, slider **x1–1000**, and presets **5/20/50/100/500/1000×**. This is a browser display for the selected page, not certified contract settings for all 60 markets. |
| Runtime / fallback distinction | Client loads each market's `getMarketCfg(i)` and `maxLeverage(i)`; session order is regular/extended/off-hours. Static largecap/highvol/index fallback arrays are `[1000,1000,1000]`; deployment config itself has no cap values. Other markets' current effective caps remain unknown. |
| Minimum margin | Current opening minimum **unknown**. Client partial-close logic collapses a remainder below **5 USDG** into a full close; that is not an authenticated current `minMargin()` read. |
| Position limits | Actual cap unknown. Static fallback: **250,000 USDG base notional**, tier **200×**; above tier, cap becomes `base × tier / leverage`, so fallback at 1,000× is **50,000 USDG**, not 250,000. Runtime values can override defaults. |
| Holding / costs | Fixed hold limits unknown; `gridSeconds=5` is a scheduling grid. Frontend shows **0.5% of margin to open**, plus **2% of profit/loss** (balancing display: 1%), with further coverage/near-entry profit adjustment. Runtime open fee is separately read and may override the fallback. |
| Date / status | Frontend `launchTime` converts to **20 October 2026 00:12:28 UTC / 08:12:28 Beijing**. It is not a first-trade or v2 deployment proof. Partial closes and keeper TP/SL are displayed features; executed behavior remains unverified. |

Evidence: `EVD-COMP-BASIC-STOX-CLIENT`, `EVD-COMP-BASIC-STOX-CONFIG`, `EVD-COMP-BASIC-STOX-HTML`, plus later `EVD-COMP-BROWSER-STOX` and the retained browser image below. [Dossier](projects/stox.md) · [Browser scope](browser-checks.md#stox-trade). The earlier static review did not obtain live numeric labels; the later screenshot adds selected-page assertions, not authenticated chain configuration or reconciled product-wide volume. No account connection was needed.

![STOX NVDA page displaying MAX LEVERAGE 1000x and the x1–1000 slider](assets/stox-trade-20261028.jpg)

## Reading the limits

Basis points apply to the stated base: **1 bp = 0.01%**. A notional fee, a margin-based opening fee and a share of adjusted profit are different costs. Default input values do not establish minimums. Session delay, minimum hold, automatic close and delayed payment are also separate clocks. For market lists and business scale, use the separate [inventory](markets.md) and [dated snapshot](../../research/competitors/snapshots/latest.json); this page does not refresh them.
