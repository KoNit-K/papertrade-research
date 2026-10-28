# Trading underlyings and settlement assets

[中文](markets.zh-CN.md) · [Report](README.md)

Checked on 28 October 2026. Trading underlyings, collateral/settlement assets and loss incentives are distinct. The inventory describes scoped documentation, APIs and frontend configuration, not guaranteed capacity, execution or complete mainnet activation.

| Platform | Crypto trading underlyings | Other underlyings | Collateral / trade settlement | Evidence scope |
|---|---|---|---|---|
| Papertrade | BTC, ETH | None established | USDC / USDC | Current official FAQ; listing capability is not a listing |
| Jupiter YOLO | SOL, BTC, ETH, ZEC, HYPE | None established | JupUSD / JupUSD | Official overview; other input tokens are swapped, not extra markets |
| Cardboard | BTC, ETH, SOL | None established | USDC / USDC | Official docs and product API agree |
| Trade Everything | BTC, ETH, SOL, HYPE, BCH **in Draft docs** | 208 stock/ETF metadata entries; six Asian names additionally documented, potentially overlapping | USDC / USDC | Demo-host metadata and Draft scope; mainnet activation/crypto routes unverified |
| Rektrade | BTC, ETH, SOL, ZEC, NEAR, XMR, HYPE | None established | USDC / USDC | Product market API; leverage caps conflict with config |
| STOX | No crypto entry in retained config | 60 configured entries across stocks, ETF, commodity, FX, index and intl | USDG / USDG | Frontend configuration; not independently checked active-market registry |

PAPER, CARDBOARD, REKT and EVERYTHING are loss-incentive/participation assets in this research, not thereby listed derivative underlyings. STOX House Shares are nontransferable participation rights; separate STOX/ETH distributions do not change USDG trade settlement. Original symbols and full names are in the [machine inventory](../../research/competitors/markets.json), with [supplemental evidence](../../research/competitors/sources/markets.json) and [current official reader records](../../research/competitors/sources/markets-reader.json).

## Trade Everything: documentation and market metadata

The five crypto names are the union of Draft documentation. Built on Paper routes BTC/ETH to Papertrade while other pages describe independent Pyth pricing; five independent mainnet markets are not established. Asian documentation names Nikkei 225, KOSPI 200, SK hynix, Samsung Electronics, Xiaomi and SoftBank Group. Their tickers were not guessed; entries can overlap the 208 metadata symbols and must not be summed to 214 markets.

The published frontend route `exchange.tradeeverything.xyz/api/market-summary` supplied 208 unique stock/ETF symbols and names. It is default/demo-host metadata, not the `/api/999/` mainnet registry; retained mainnet reads remain 502. Quotes and underlying Nasdaq activity are not this product’s volume. Symbols follow; per-entry names are retained in JSON:

```text
AAAU, AAL, AAOI, AAPL, ADBE, ADM, AEHR, AFRM, AIQ, ALAB, AMAT, AMD
AMZN, ANET, APD, APLD, APP, ARKK, ARM, ASML, ASTS, AVAV, AVGO, AXP
AXTI, AZN, BA, BABA, BAC, BB, BE, BIDU, BILI, BIRD, BKNG, BLK
BMNR, BOTZ, BRK.B, BX, CBRS, CCJ, CELH, CIEN, CLSK, COF, COHR, COIN
COP, COST, CPER, CRCL, CRDO, CRM, CRWD, CRWV, CSCO, CVX, DDOG, DELL
DIA, DIS, DKNG, DRAM, EBAY, ECHO, ETN, EWH, EWJ, EWT, EWY, EWZ
FCX, FLUT, FUTU, FXI, GDX, GDXJ, GEV, GLD, GLW, GME, GOOG, GOOGL
GRAB, HAL, HD, HIMS, HOOD, HPE, IAU, IBIT, IBKR, IBM, IEF, IGV
INDA, INTC, INTU, IONQ, IREN, IVV, IWM, JD, JEPQ, JPM, KHC, KLAC
KO, KWEB, LITE, LLY, LMT, LRCX, LUNR, MA, MAGS, MARA, META, MRK
MRVL, MSFT, MSTR, MU, MXL, NBIS, NEM, NFLX, NIO, NLR, NNE, NOW
NU, NVDA, NVO, NVTS, OKLO, ONDS, OPEN, ORCL, OXY, PANW, PAYP, PDD
PENG, PLTR, POET, PURR, PYPL, QBTS, QCOM, QQQ, QQQM, QUBT, RDW, RGTI
RIVN, RKLB, RTX, SBUX, SGOV, SHLD, SILJ, SIVR, SKHY, SLB, SLV, SMCI
SMH, SMR, SNDK, SOFI, SONY, SOXX, SPCX, SPMO, SPOT, SPY, SPYM, STX
SYF, TCOM, TEM, TER, TLT, TSEM, TSLA, TSM, TXN, UBER, UMC, UPST
URA, USAR, USO, V, VOO, VRT, VST, VT, WDC, WMT, XBI, XLE
XLK, XOM, XOP, ZM
```

## STOX: 60 frontend-configured entries

Source groups and symbols are preserved. EUR/JPY/GBP labels are not mapped to assumed FX pairs, and intl is not automatically classified as listed equities. Config presence does not prove fresh prices, activated contracts or actual trades.

| Source group | Count | All symbols |
|---|---:|---|
| stocks | 22 | NVDA, AAPL, MSFT, AMZN, GOOGL, META, TSLA, COIN, MSTR, PLTR, CRCL, SPCX, SNDK, MU, INTC, CRWV, AMD, MRVL, NBIS, CBRS, MRNA, HOOD |
| index | 4 | SP500, XYZ100, JP225, KR200 |
| etf | 8 | SMH, MAGS, XLE, XBI, URNM, TLT, EWJ, EWY |
| commodity | 8 | GOLD, SILVER, CL, BRENTOIL, COPPER, NATGAS, PLATINUM, PALLADIUM |
| fx | 3 | EUR, JPY, GBP |
| intl | 15 | TSM, ASML, SMSN, SKHX, BABA, HYUNDAI, SOFTBANK, KIOXIA, CAMBRICON, CXMT, GIGADEV, ZHIPU, MINIMAX, UNITREE, SHEIN |

## Interpretation and refresh

Papertrade and YOLO were reopened through an official-page reader this turn; exact transport timestamps and raw response bytes were not provided, so those fields remain null. Retained captures keep their original observation times; assembly time does not make every listing live-checked. Additions, pauses, capacity and leverage need separate verification, especially Rektrade’s conflicting interfaces. Business metrics retain their earlier fixed capture window; fetching a market catalog is not a volume refresh.
