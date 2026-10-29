# Papertrade: launch context and business-data scope

[中文](business-snapshot.zh-CN.md) · [Product review](current-product-review.md) · [Competitors](competitors/README.md)

Reviewed **2026-10-30**. These are historical observations through the dates below, not October 30 live metrics. Source reports, provider values, author-supplied figures and arithmetic checks have different evidence status. The manuscript tables do not overwrite the existing adapter snapshot or its nulls.

## Launch context

[Bankless's May 14 article](https://www.bankless.com/read/papertrade-turns-liquidations-into-ownership) includes Jez's May 12 introduction naming Blurr alongside him. Its [October 9 preview](https://banklesscom.beehiiv.com/p/what-to-know-about-papertrade-s-launch) dates trading to October 10. [The Defiant's accessible summary](https://thedefiant.io/news/defi/papertrade-sets-1000x-perps-launch-with-85-million-deposited) gives 10 a.m. Eastern, or **14:00 UTC / 22:00 Shanghai**, and about **$85M** deposited; the manuscript's $85.30M precision was not independently recovered. [BlockBeats's publication feed](https://t.me/s/theblockbeats?before=199857) later attributes **$138M from 11,465 addresses** to the site. These are differently timed reports, not verified house capital or first-fill timestamps.

[Galaxy's October 2025 analysis](https://www.galaxy.com/insights/research/cryptos-flash-crash-liquidation-binance-adl-auto-deleveraging) connects the 20:50 UTC tariff news on October 10 to over $19B of notional liquidations in roughly 24 hours. That evening was October 11 in Shanghai. In [PANews's interview rendering](https://www.panews.io/articles/01a12eb9-598a-722e-8f60-1a3104d5c217), Jez describes the launch date as the anniversary of his own liquidation experience. The interview audio was not independently checked. This explains the narrative contrast between involuntary liquidation and loss incentives, not the intent behind every position or a promise to recover losses.

## Early trading observations

[BlockBeats, attributing TradingBeats](https://en.theblockbeats.news/flash/371208), reports **7,962** opening addresses, **5,836** using 1000× and **61,222** positions opened at that leverage. Of those positions, **12,657** were liquidated, losing **$20.0771M** of margin. All leverage levels together had **14,158** liquidations and **$23.1162M** of lost margin. The **7m 35s** median applies specifically to liquidated 1000× positions. This review checked the report, not a complete transaction index.

The manuscript's launch comparison is Papertrade **$596.28B**, Binance futures **$49.48B**, Hyperliquid futures **$6.01B**. A secondary report corroborates Papertrade's approximate headline, but original exports, common windows and counting rules remain missing. Treat the three values as **author-supplied, pending verification**. A first 24-hour period starting at 14:00 UTC crosses into October 11; it is not the October 10 UTC calendar day.

## TVL and revenue definitions

The [DefiLlama historical table](https://defillama.com/protocol/papertrade) read on October 30 lists TVL of $101.80M on October 10, **$102.09M on October 11**, and **$30.73M on October 27**. The decline from the rounded peak to October 27 is **69.9%**. These are provider UTC snapshots and checked arithmetic, not independently reconstructed balances. TVL includes customer trading balances and the protocol LP in the Exchange's HyperCore spot USDC account; it is not unrestricted house cash, and a fall is not solely trader loss.

| Manuscript cumulative item, through October 27 | Amount | Evidence status |
|---|---:|---|
| Fees | $65.78M | Author-supplied historical endpoint; not independently reproduced |
| LP surplus | $55.58M | Same |
| Trading fees | $8.68M | Same |
| Liquidation fees | $1.52M | Same |
| PAPER holder allocation | $60.68M | Same; not verified external withdrawals |
| Developer fee recipient | $5.10M | Same; not team net profit |

The components sum to $65.78M under both classifications. Arithmetic closure does not verify their source. DefiLlama's method includes distributed excess LP profits in Fees; it excludes trading PnL retained in the pool. The applicable fee split and LP-surplus allocation explain why holder revenue and developer fees are separate. Current page counters cannot verify the manuscript's exact October 27 cutoff; the API reread was unavailable.

## Cumulative notional comparison

**Author-supplied; not independently reproduced.** Stated interval: **October 10–27, 2026, UTC**. Exact endpoints, instrument exports and counting rules were not supplied. B = billion USD; M = million USD.

| Platform | BTC | ETH | BTC + ETH |
|---|---:|---:|---:|
| Papertrade | Combined | Combined | $1,490.4B |
| Binance | $239.6B | $179.9B | $419.6B |
| Bybit | $73.6B | $39.6B | $113.2B |
| Bitget | $41.8B | $28.3B | $70.1B |
| Hyperliquid | $40.5B | $17.2B | $57.6B |
| Aster Perps | $6.8B | $5.4B | $12.2B |

Binance and Hyperliquid displayed components differ from their totals by $0.1B. Independent rounding or scope may explain this; raw precision is needed. Synthetic position notional is not an order-book fill, depth or net capital investment. Opening, closing and liquidation counting must be reconciled before comparisons.

## Rolling 24-hour comparison

**Author-supplied; source exports pending.** Collection date: **October 28, 2026, UTC+8**; exact collection time and rolling endpoint are unknown. Do not merge these values with the earlier repository API/browser snapshots.

| Platform | BTC 24h | ETH 24h | BTC + ETH 24h | Total OI | Liquidated notional 24h |
|---|---:|---:|---:|---:|---:|
| Papertrade | $7.87B | $2.74B | $10.61B | $174.7M | ~$272.3M* |
| Binance | $11.13B | $8.19B | $19.32B | $19.79B | $30.3M |
| Bybit | $3.70B | $1.92B | $5.61B | $3.81B | $6.6M |
| Bitget | $2.07B | $1.37B | $3.44B | $2.43B | $3.2M |
| Hyperliquid | $1.80B | $679M | $2.48B | $3.09B | $10.9M |
| Aster Perps | $314M | $291M | $605M | $725M | $1.54M** |

`*` Papertrade's notional figure lacks the source query and position-level leverage. DefiLlama's Collateral Liquidated measures forfeited margin and explicitly does **not** report liquidated notional. A universal leverage multiplier cannot recover it. `**` The original Aster marker has no source footnote; it remains unverified. Other venues' liquidation market coverage is also unspecified.

Papertrade's covered markets are BTC/ETH; other venues' total OI may span all markets. Bybit's displayed components sum to $5.62B rather than the stated $5.61B; preserve the supplied total pending raw precision. This is not a like-for-like market-share or risk ranking.

| Additional manuscript Papertrade figure | Value | Remaining scope gap |
|---|---:|---|
| Cumulative liquidated notional | $45.37B | Position-level source and starting point |
| Cumulative forfeited margin | $75.97M | Historical endpoint verification |
| Cumulative trading addresses | 28,173 | Deduplication and starting point; not unique people |
| 24h forfeited margin | ~$474K | Rolling endpoint |
| 24h active addresses | 3,098 | Activity definition and rolling endpoint |

## Interpretation and follow-up

The existing [67-row competitor snapshot](../research/competitors/snapshots/latest.json) retains its original observations and unknowns. Original URLs/exports, UTC windows, instrument scope and counting methods are needed to promote the manuscript values to reproducible observations.

Longer-term evaluation requires actual trading demand, paid USDC, outstanding debt and retention. New users are not the only possible source of loss cash; existing users can also keep trading. The relevant question is whether net cash flows support obligations. Issuing PAPER changes incentives and ownership shares, without supplying cash or guaranteeing recovery or a future token market.
