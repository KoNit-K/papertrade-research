# Technical-sharing manuscript reconciliation

Reviewed **2026-10-30** against repository commit `e52219b712a63ed496ed88dc52932cde08bd41a8`. [English review](../current-product-review.md) · [中文汇总](../papertrade-summary.zh-CN.md) · [Business data](../business-snapshot.md) · [竞品](../competitors/README.zh-CN.md).

This is a topic-by-topic documentation integration authorized by the repository owner. It does not replace the repository framework, historical evidence, tooling or images. The supplied prose was edited into the existing product, mint, liquidation, business and competitor sections; no raw conversation export is published. Missing Lark images were not represented as inspected or reconstructed originals.

## What was checked and where it belongs

| Manuscript area | Destination | Result |
|---|---|---|
| May introduction, October launch, anniversary | Business supplement; product narrative opening | Bankless/Defiant reports and PANews interview rendering read; publication claims remain attributed |
| House counterparty and price settlement | Existing product review and narrative | Preserve distinction between synthetic exposure, real USDC and no corresponding HyperCore order |
| CEX / DEX comparison | Product-review comparison table | Avoid universal leverage/funding ranges, compulsory external hedging and a legal CFD classification |
| BBO risks | Pricing sections | Guardian KV-01 and CertiK article read; net withdrawals do not establish manipulation profit |
| Execution / fees / liquidation | Existing fee and liquidation sections | Keep versioned branch details; distinguish higher priority fees from guaranteed ordering |
| Mint change | Existing issuance sections and figure appendix | Preserve set-1/set-2 comparison; normalize the retained coefficient; correct proportional-dilution statement |
| Funding / authorization / governance | Existing detailed sections | Retain cash/debt branches, sweep stages and withdrawal authority; no fresh production certification |
| TVL / revenue / cross-venue metrics | Bilingual business supplement | TVL dates and provider definitions read; missing source queries remain explicit |
| Competitor timeline / operators | Existing competitor topic and dossiers | Retain documented conflicts and unknowns; no new inferred affiliations |
| Sustainability | Existing narrative conclusion | Focus on cash, debt, demand and retention; no guaranteed loss recovery or future token market |

## Corrections that affect the interpretation

1. **Relative issuance.** With fixed coefficient and weighted eligible basis, `M/S ≈ exp(c × g_eff) − 1` does not fall as total supply increases. More supply gives more absolute tokens for the same basis. Existing fixed holdings still dilute. This continuous model is not promoted to an exact integer settlement implementation.
2. **Old curve chronology.** 100 PAPER/$ describes the low-LP branch. 25/20/about 10 are curve examples or dated observations, not four verified historical stages. The old/new comparison remains; there is no duplicated full manuscript archive.
3. **Liquidation arithmetic.** An exact 5bps buffer gives about 0.05005% adverse movement for a 1000× long and 0.04995% for a short before integer rounding. The press's 0.052% remains an attributed approximation, not a universal formula. The 100× long example remains 99.0495 from entry 100.
4. **Holding-time denominator.** 7m 35s concerns liquidated 1000× positions, not all positions. 61,222 counts opened 1000× positions; 12,657 counts their liquidations.
5. **Revenue.** Fees can include distributed LP surplus. A $65.78M headline is not developer net profit. The manuscript split adds correctly, but the exact October 27 export was not reproduced.
6. **Measurement windows.** The first 24 hours after 14:00 UTC opening cross two UTC dates. October 28 Shanghai collection does not specify a rolling window's endpoint. BTC/ETH volume and all-market OI/liquidations need separate coverage labels.
7. **Competitor identity.** YOLO's acquired documentation establishes a House and queue, not loss-token issuance. Cardboard's October 25 terms do not date its first trade. Existing evidence does not establish Backpack/Mad Lads, GMX/Synthetix or Robinhood funding affiliations. No anonymous community hypothesis is promoted without an attributable source.
8. **Availability versus launch.** Trade Everything's 502 responses and default Demo UI do not prove the absence of live mainnet trading. Its live claim, preview date, conflicting crypto routes and missing first-fill verification remain separate. STOX's permanent capital function does not identify a specific investor.
9. **Economic interpretation.** Cash losses can fund the pool, but claim-funded losses reduce liabilities without new cash. Continued trading by existing users can generate cash losses; a perpetual requirement for new users is not a mathematical consequence of the mint equation. Dividends are conditional, and a future TGE/free-transfer market is not established.

The anecdote about 15,000 PAPER earning 50 USDT in a week was not adopted as return evidence: no wallet-safe original record, window or reward reconciliation was supplied, and the protocol's described distribution asset is USDC. Missing source markers and unverifiable affiliations are resolved by explicit limits, not by invented citations.

## Source checks in this increment

| Source | Access and evidence scope |
|---|---|
| [Bankless, May 14](https://www.bankless.com/read/papertrade-turns-liquidations-into-ownership) | Search reader returned article text and embedded May 12 introduction; source publication/attribution, not X authentication |
| [Bankless launch preview, October 9](https://banklesscom.beehiiv.com/p/what-to-know-about-papertrade-s-launch) | Article text read; launch-date report and named builders |
| [The Defiant launch report](https://thedefiant.io/news/defi/papertrade-sets-1000x-perps-launch-with-85-million-deposited) | Accessible summary read; about $85M and 10 a.m. ET schedule, not $85.30M precision |
| [BlockBeats publication feed](https://t.me/s/theblockbeats?before=199857) | Read reported $138M / 11,465 addresses attributed to the website; direct mobile story unavailable |
| [BlockBeats / TradingBeats](https://en.theblockbeats.news/flash/371208) | Report text read; position/address counts and conditional holding-time sample, not independent chain reindexing |
| [PANews interview rendering](https://www.panews.io/articles/01a12eb9-598a-722e-8f60-1a3104d5c217) | Anniversary answer read; underlying audio/video not checked |
| [Galaxy, October 2025 crash](https://www.galaxy.com/insights/research/cryptos-flash-crash-liquidation-binance-adl-auto-deleveraging) | Research search text read; historic time and notional-liquidation context, not a fresh event reconstruction |
| [DefiLlama Papertrade](https://defillama.com/protocol/papertrade) | Page history and methodology read; October 11/27 TVL endpoints present, current widgets differ in cutoff and are not substituted for manuscript dates |
| [DefiLlama fee API](https://api.llama.fi/summary/fees/papertrade) | Reader unavailable; no new October 27 fee-series export obtained |
| [Guardian protocol review](https://www.guardian.security/portfolio/papertrade/protocol-review-2026-10-09/) | KV-01 and known-vector classification read; review scope is not deployed-code equivalence |
| [CertiK incident analysis](https://www-cn.certik.com/blog/papertrade-bbo-pricing-incident) | Article read; account net withdrawals and causal limits, no new replay |
| [Hyperliquid funding](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/funding) | Official hourly-payment rule read for comparison |
| [HyperCore / HyperEVM timing](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interaction-timings) | Official ordering read; shared chain execution does not make CoreWriter delivery synchronous with intent acceptance |
| Papertrade official mint, liquidation, asymmetric-impact and change pages | Readers reported unavailable, with no current content or HTTP status; the prior dated source record remains the mechanism basis |

No alternate domain was treated as the official Papertrade host. Existing competitor observations are explicitly October 28 evidence, not fresh production checks. The source index links this review; dated structured evidence records are not rewritten to imply new captures.

## Arithmetic and publication validation

The retained coefficient is `q = 1101001766258568981998368146`; normalized `c = q / 10^36 ≈ 1.101001766258569e-9` per dollar. Decimal checks give `100 × expm1(c × 10^6) ≈ 0.1101608091%` and `(1 − 30.73 / 102.09) × 100 ≈ 69.89910863%` TVL decline.

For the retained continuous holdback display curves, the standard maximum occurs at `u=1/2`: `3.597 × 5.25 / 16 = 1.180265625 bps`, at 3.375bps raw movement. The off-hours maximum occurs at `u=2/5`: `6.085 × 9.7 × (0.4)^2 × (0.6)^3 = 2.03988672 bps`, at 4.18bps. These calculations do not include Solidity integer rounding or the remaining profit pipeline.

Validation checks cover these arithmetic identities, bilingual table values, preserved main headings, Markdown table widths, relative links/anchors against the repository tree, and the explicit outgoing document list. Runtime code and structured source snapshots are unchanged; no protocol test suite or production replay is claimed for this documentation-only change. Publication checks and their actual results are recorded in the final delivery, not inferred from the existence of this note.
