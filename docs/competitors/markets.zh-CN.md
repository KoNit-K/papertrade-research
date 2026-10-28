# 各平台支持的交易标的与结算币

[English](markets.md) · [综合报告](README.zh-CN.md)

核对日期：2026年10月28日。这里的币种指合约交易标的；抵押/结算币和亏损激励分别说明。以下是文档、API或前端配置的有范围清单，不承诺实时容量、逐仓成交或全部主网激活。

| 平台 | 加密资产交易标的 | 其他交易标的 | 保证金／交易结算 | 证据范围 |
|---|---|---|---|---|
| Papertrade | BTC、ETH | 本次未建立 | USDC／USDC | 当前官方FAQ；能扩展上市不等于已经上线 |
| Jupiter YOLO | SOL、BTC、ETH、ZEC、HYPE | 本次未建立 | JupUSD／JupUSD | 官方总览；其他输入代币会被兑换，不增加交易市场 |
| Cardboard | BTC、ETH、SOL | 本次未建立 | USDC／USDC | 官方文档与产品API一致 |
| Trade Everything | Draft文档：BTC、ETH、SOL、HYPE、BCH | 208条股票/ETF元数据；另有六个亚洲标的名称，可能重叠 | USDC／USDC | demo域名元数据及Draft范围，不是已验证主网激活清单；加密业务路线未解 |
| Rektrade | BTC、ETH、SOL、ZEC、NEAR、XMR、HYPE | 本次未建立 | USDC／USDC | 产品市场API；杠杆上限与config冲突 |
| STOX | 保留配置未列加密币标的 | 60条股票、ETF、商品、FX、指数及intl配置 | USDG／USDG | 前端配置，不是独立核验的活跃市场登记 |

PAPER、CARDBOARD、REKT和EVERYTHING是本研究涉及的亏损激励/分配资产，不能因此把它们列为各产品已开通的合约交易标的。STOX的House Shares是不可转让收入权益；其STOX/ETH分配路径不改变USDG交易结算。原始symbol和完整名称见[机器清单](../../research/competitors/markets.json)，对应来源见[市场补充证据](../../research/competitors/sources/markets.json)和[本轮官方reader记录](../../research/competitors/sources/markets-reader.json)。

## Trade Everything：文档与市场元数据

五种加密标的是Draft文档并集。BTC/ETH在Built on Paper页被描述为逐单路由至Papertrade，其他页又描述独立Pyth定价，不能确认为五个主网独立市场。亚洲文档名称为Nikkei 225、KOSPI 200、SK hynix、Samsung Electronics、Xiaomi、SoftBank Group；未猜测交易ticker，可能与208条元数据重叠，不能相加成214个市场。

本轮从前端已发布路径读取 `exchange.tradeeverything.xyz/api/market-summary`，提取208个唯一股票/ETF ticker及名称。该域名是默认demo/落地元数据来源，并非 `/api/999/` 主网登记；保留的主网请求仍是502。接口报价/底层Nasdaq活动也不是该产品成交量。完整symbol如下，逐项名称在JSON中：

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

## STOX：60条前端配置

保留配置中的分类与symbol，不把FX原标签EUR/JPY/GBP自动映射成某个外汇货币对，也不把intl一概认定为已上市股票。配置存在不证明报价新鲜、合约激活或真实成交。

| 来源分类 | 条数 | 全部symbol |
|---|---:|---|
| stocks | 22 | NVDA, AAPL, MSFT, AMZN, GOOGL, META, TSLA, COIN, MSTR, PLTR, CRCL, SPCX, SNDK, MU, INTC, CRWV, AMD, MRVL, NBIS, CBRS, MRNA, HOOD |
| index | 4 | SP500, XYZ100, JP225, KR200 |
| etf | 8 | SMH, MAGS, XLE, XBI, URNM, TLT, EWJ, EWY |
| commodity | 8 | GOLD, SILVER, CL, BRENTOIL, COPPER, NATGAS, PLATINUM, PALLADIUM |
| fx | 3 | EUR, JPY, GBP |
| intl | 15 | TSM, ASML, SMSN, SKHX, BABA, HYUNDAI, SOFTBANK, KIOXIA, CAMBRICON, CXMT, GIGADEV, ZHIPU, MINIMAX, UNITREE, SHEIN |

## 口径与后续复查

Papertrade与YOLO本轮通过官方网页reader再读；精确传输时间及原始字节未提供，因此证据中不填伪精确时点或哈希。其他保留capture注明原观察时间；清单组装时间不升级成所有市场的实时检查时间。新增市场、暂停、容量和杠杆应另行核对，尤其Rektrade两个配置接口互相冲突。业务体量快照仍使用此前固定窗口，本次没有把市场目录抓取时间当成成交量刷新。
