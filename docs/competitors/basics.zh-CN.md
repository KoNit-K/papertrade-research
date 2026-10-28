# 平台基本资料：杠杆、门槛、限额与费用

[English](basics.md) · [综合比较](README.zh-CN.md) · [完整标的清单](markets.zh-CN.md) · [浏览器检查](browser-checks.zh-CN.md) · [结构化资料](../../research/competitors/basic-facts.json) · [基本信息证据](../../research/competitors/sources/basic-facts.json)

观察日期为2026年10月28日。下表分别保留文档描述、API自报、静态前端默认值和浏览器显示的范围。页面上限不等于已认证的合约参数或实际准入保证。“未知”表示已读来源没有建立数值，不等于零或没有限制。证据保留原始采集日期，不把本页整理时间当成重新观测；没有连接钱包或交易。

稍后的匿名浏览器检查另有[来源记录及截图保存时间](../../research/competitors/sources/browser.json)，补充早先未取得的页面观测，不覆盖此前67行体量快照。保存时间不是精确画面时点或业务截止时间；页面数字的业务时点仍保持未知。

## Papertrade

[官网](https://papertrade.xyz/) · [交易应用](https://exchange.papertrade.xyz/) · [文档](https://docs.papertrade.xyz/) · [账号地址](https://x.com/papertrade_xyz)

| 基本项目 | 已取得信息及边界 |
|---|---|
| 链与资产 | HyperEVM chain 999，USDC基础设施涉及HyperCore。BTC/ETH交易标的，USDC保证金及交易支付；PAPER是参与分配资产，本次未建立其衍生品上市。 |
| 杠杆 | 文档称BTC/ETH最高 **1,000倍**；稍后的BTC票据页面显示 **1—1,000倍滑杆**，默认10倍。显示的下限不认证合约最低倍数；步长和逐市场实际准入上限仍未知。 |
| 最低保证金 | **当前值未知**。较早保留的服务观测在索引区块49121146—49121151报告：最低 **10美元保证金／1,000美元开仓名义额**。这不是今天票据的最低值。 |
| 仓位及持有期 | 保留FAQ、基准报告和服务记录没有建立当前每仓名义额上限及固定最短/最长持有期。产品有仓位限制，未知不等于无限。 |
| 主要费用 | 保留的正常模型没有开仓、资金或按名义额平仓收费。盈利依次经过deadband、小波动holdback、非对称impact，再按适用分支收 **调整后利润的2%**；获批builder分支可再加 **调整后利润的0.5%**。标准/非正常时段holdback区间分别为0.75—6／0.3—10bp；现金/债权、队列及费用豁免另分支处理。 |
| 日期与状态 | 报道称前端 **2026年10月10日** 上线，未独立核对原始公告或首笔成交。文档版本日期为set 1：10月7日，set 2：10月21日；两类日期不能混用。 |
| 稍后浏览器数字 | 选定BTC页面头部显示取整的 **24小时量76.8亿美元、多头OI 8,420万美元、空头OI 3,260万美元**。它们是**业务时点未知**的页面断言，不是已验证的全平台总额、未取整数值或统一名义额口径。保证金框默认1 USDC也不建立开仓最低门槛。 |

证据：`EVD-COMP-BASIC-PT-BASELINE`、`EVD-COMP-BASIC-PT-FAQ`、`EVD-COMP-BASIC-PT-SERVICE-NOTE`，及稍后的 `EVD-COMP-BROWSER-PT`。见[基准档案](projects/papertrade.zh-CN.md)和[BTC截图](browser-checks.zh-CN.md#papertrade-btc)。页面已补可见滑杆范围，开仓最低准入与仓位限额仍需另证。

## Jupiter YOLO

[应用](https://jup.ag/yolo) · [文档](https://docs.jup.ag/user-docs/labs/yolo) · [账号地址](https://x.com/JupiterExchange)

| 基本项目 | 已取得信息及边界 |
|---|---|
| 链与资产 | Solana；SOL/BTC/ETH/ZEC/HYPE方向交易。**JupUSD**保证金及支付；其他输入代币被兑换，不增加交易标的。House与JLP分开。 |
| 杠杆 | 官方描述 **500—1,000倍，每档100倍**。本轮保留的总览截图显示该宣传范围，不是程序执行认证。 |
| 最低保证金 | 文档为 **5 JupUSD**；网络、兑换成本另计。 |
| 仓位上限 | 文档每仓名义额上限：**SOL/BTC/ETH各100万美元，ZEC/HYPE各25万美元**；另受可变市场方向容量限制。 |
| 持有与付款 | 最早 **15秒** 手动关闭，期间仍可能清算；**72小时** 或调整后利润达到 **保证金50倍** 时自动关闭。整笔FIFO可使关闭后的利润继续等待，无保证付款日。 |
| 主要费用 | 描述中无开仓/资金费。有利变动先扣 **0.2bp deadband**，再非线性调整、50倍封顶，之后收 **2%盈利费**。每次平仓/清算另从保证金扣 **名义额的0.2bp**。各自基数不同，第三方盈利费指标也不覆盖所有成本。 |
| 日期与状态 | Jupiter Labs beta公告为 **2026年10月15日**；镜像显示12:59 UTC／北京时间20:59。未独立认证原帖时点或首笔主网成交。 |

证据：`EVD-COMP-BASIC-YOLO-OVERVIEW`、`EVD-COMP-BASIC-YOLO-TRADING`、`EVD-COMP-BASIC-YOLO-FEES`、`EVD-COMP-BASIC-YOLO-LAUNCH`，及 `EVD-COMP-BROWSER-YOLO`。见[档案及精确算式](projects/yolo.zh-CN.md)。稍后交易页导航失败（`EVD-COMP-BROWSER-YOLO-TRADE-FAIL`），未补到当前House、队列或榜单，不等于证明全站停机。[浏览器范围](browser-checks.zh-CN.md#yolo-overview)。

![YOLO官方总览显示500—1000倍及JupUSD](assets/yolo-overview-20261028.jpg)

## Cardboard Trade

[应用](https://cardboardtrade.xyz/) · [文档](https://docs.cardboardtrade.xyz/) · [账号地址](https://x.com/cardboard_trade)

| 基本项目 | 已取得信息及边界 |
|---|---|
| 链与资产 | Solana；BTC/ETH/SOL，**USDC**保证金及支付；CARDBOARD是亏损/收入参与资产。 |
| 杠杆 | 文档 **1—1,000倍**，保留配置 `max_leverage=1000`；浏览器滑杆显示x1—1000。仍受方向容量及签署的最低派彩系数限制。 |
| 最低保证金 | **未知**。截图中输入/默认 **1 USDC不证明最低为1**。静态客户端读取市场 `min_margin`、`min_notional`，取得的聚合/config字段没有这些市场门槛。 |
| 仓位及持有期 | 文档单笔最高名义额 **1,000万美元**。保留文档/config未建立固定最短/最长持有期；开仓锁定保证金、杠杆、盈利敞口和费用条款，未描述追加保证金或部分关闭。 |
| 主要费用 | `round_trip_fee_ppm=200` 即 **关闭时按原名义额收2bp**，截图也显示2bp；配置deadband为 **0**，不沿用旧帖。盈利费随市场变化，动态文档占位符未提供可确认数值；无周期资金费。Builder默认附加 **基础费用的10%**，最高 **基础费用的25%**，不是名义额的10%/25%。 |
| 日期与状态 | 镜像中 **10月18日** 起有运营更新；**10月25日** 条款将Attractor Labs, Inc.写为运营者。精确beta/实盘首笔及实体注册地未知。 |

证据：`EVD-COMP-BASIC-CARDBOARD-OVERVIEW`、`EVD-COMP-BASIC-CARDBOARD-TRADING`、`EVD-COMP-BASIC-CARDBOARD-FEES`、`EVD-COMP-BASIC-CARDBOARD-CONFIG`、`EVD-COMP-BASIC-CARDBOARD-CLIENT`，及稍后的 `EVD-COMP-BROWSER-CARDBOARD`；上线/条款见[档案](projects/cardboard.zh-CN.md)中的 `EVD-COMP-CARDBOARD-014`、`011`。[浏览器范围](browser-checks.zh-CN.md#cardboard-trade)。

![Cardboard票据显示x1—1000及2bp平仓费；输入保证金不是最低门槛证明](assets/cardboard-trade-20261028.jpg)

## Trade Everything

[官网](https://tradeeverything.xyz/) · [Draft文档](https://docs.tradeeverything.xyz/) · [账号地址](https://x.com/TradeEverythin_)

| 基本项目 | 已取得信息及边界 |
|---|---|
| 链与资产 | 文档为HyperEVM 999，**USDC**保证金/支付。Draft文档并集列BTC/ETH/SOL/HYPE/BCH；BTC/ETH路由Papertrade与独立Pyth定价描述冲突。208条股票/ETF demo元数据和六个亚洲名称不是已核主网活跃市场总数。 |
| 加密杠杆 | Draft杠杆页称 **BTC/ETH最高1,000倍**，受容量限制；不能把五币并集升级为五个独立主网市场或全部1,000倍。 |
| 美股杠杆 | 文档成交排名前十：**常规500倍／盘前盘后375倍／隔夜250倍**。其他股票 **最高100倍**，常规为benchmark B的4倍、盘前盘后3倍、隔夜2倍；时段、价差、事件和风控可进一步压低。 |
| 亚洲杠杆 | Draft正常交易时段公式 `min(4B,100)`：Nikkei 225、KOSPI 200为 **80倍**；SK hynix、Samsung、Xiaomi为 **100倍**；SoftBank为 **40倍**。两个指数非现货时段为 **40倍**；亚洲锁定时段规则为 `floor(0.5B)`。这些是文档公式和推算上限，不是成交证明。 |
| 其他限制 | 股票用欠款作保证金最高 **20倍**；加密预言机恢复后五分钟新仓最高 **10倍**。美股周末在交易时段页按历史gap设限，其NVDA示例为 **10倍**，杠杆页示例却为 **25倍**；不能强行合成一个现行值。 |
| 最低及仓位 | 最低保证金/开仓名义额 **未知**。Draft每股票每账户上限：A档 **1,000万美元**、B档 **200万美元**、C档 **50万美元**、D档 **10万美元**；BTC/ETH **每仓及每账户1,000万美元**。每单不超过方向剩余额度的 **25%**；时段、情景和启动期上限可更紧。 |
| 持有及费用 | 固定最短/最长持有期未知。美股按时段 **1/2/3秒** 执行延迟不是最低持有时间；休市可停成交，切换时段可强制缩仓。描述中无开仓/资金收费；先 **0.2bp deadband**、最多保留90%的非线性haircut，再收 **默认2%、最高10%盈利费**。House侧亏损费有条件，不是用户价格亏损外另收费。 |
| 日期与状态 | 10月22日镜像预告 **2026年10月26日13:30 UTC／北京时间21:30** 开放。Draft/demo/live措辞、付款冲突和 `/api/999/` 读取失败，使真实主网执行仍未确认。 |
| 稍后浏览器检查 | 官网显示 **Mainnet is live** 及 **最高500倍**。默认exchange明确为 **Demo**；NVDA票据显示 **Overnight Max 250倍**，所选125倍，DOM说明下个盘前上限 **375倍**。Demo equity **10,000美元不是用户入金**。这些显示没有解决实际主网激活或此前主网聚合读取失败。 |

证据：`EVD-COMP-BASIC-TE-LEVERAGE`、`EVD-COMP-BASIC-TE-HOURS`、`EVD-COMP-BASIC-TE-FEES`、`EVD-COMP-BASIC-TE-ANNOUNCEMENT`，及稍后的 `EVD-COMP-BROWSER-TE-HOME`／`EVD-COMP-BROWSER-TE-DEMO`。[档案](projects/trade-everything.zh-CN.md)另保留路由、即时付款与排队的冲突；[浏览器检查](browser-checks.zh-CN.md#trade-everything-demo)将demo余额与真实业务分开。

## Rektrade

[应用](https://rektrade.fun/) · [内嵌文档](https://rektrade.fun/docs) · [账号地址](https://x.com/rektradefun)

| 基本项目 | 已取得信息及边界 |
|---|---|
| 链与资产 | HyperEVM 999；BTC/ETH/SOL/ZEC/NEAR/XMR/HYPE；**USDC**保证金及支付。Ember是同一场所另一入口，不另算业务。 |
| 杠杆冲突 | 前端/config的 `fixedLeverage=1000` 固定选择 **1,000倍**；`/api/markets` 对七币均报告 **1,000倍**，稍后首页截图也将七币都标为 **1,000倍**。同轮 `/api/config` 却报告 **BTC/ETH/HYPE 1,000倍、SOL 500倍、ZEC/NEAR/XMR 200倍**。页面不消除该冲突，也不认证统一合约最低倍数或实际可执行上限。 |
| 最低保证金/入金 | 配置为 **1 USDC保证金、5 USDC入金**；都是USD6解码，但属不同门槛。 |
| 仓位上限 | `/api/markets`名义额：**BTC/ETH/HYPE各10万美元，SOL 50万美元，ZEC/NEAR/XMR各25万美元**；config每用户最高 **32个持仓**。属于API自报，未试单验证。 |
| 持有 | config最短 **10秒**；最长未知。原始 `maxPayoutX=0` 不表示只能零利润，也不是按时间的关闭上限。 |
| 主要费用 | config为 **0.2bp deadband、27.3%基础impact、5%盈利费、20% win tax、5%入金税、5% House侧亏损费**。各层基数和顺序不同，不能直接加成原始PnL上的税率。未描述按名义额交易费或资金费。 |
| 日期与状态 | 官方账号镜像称 **2026年10月22日** 已上线；独立首笔成交未知。内嵌文档与API还在价格、发行日程上冲突。 |

证据：`EVD-COMP-BASIC-REKT-CONFIG`、`EVD-COMP-BASIC-REKT-MARKETS`、`EVD-COMP-BASIC-REKT-CLIENT`、`EVD-COMP-BASIC-REKT-LAUNCH`，及稍后的 `EVD-COMP-BROWSER-REKT`。见[档案](projects/rektrade.zh-CN.md)、[首页截图](browser-checks.zh-CN.md#rektrade-home)；底层Hyperliquid成交量不是Rektrade业务量，稍后的取整首页计数也不构成精确聚合对账。

## STOX perps

[应用及内嵌说明](https://stoxpreps.com/) · [账号地址](https://x.com/STOXPREPS)

| 基本项目 | 已取得信息及边界 |
|---|---|
| 链与资产 | 配置为Robinhood Chain **4663**；**USDG**保证金及交易支付。保留60条非加密配置，没有crypto标的；STOX/ETH分配与House Shares不增加交易结算币选项。 |
| 本轮页面杠杆 | 保留的 **NVDA页面明确显示MAX LEVERAGE 1,000倍**，滑杆 **x1—1000**，按钮 **5/20/50/100/500/1000倍**。这是所选页面显示，不是对全部60市场的合约参数认证。 |
| 运行值与fallback | 客户端逐市场读取 `getMarketCfg(i)`、`maxLeverage(i)`；时段数组为常规/延长/非正常时段。静态largecap/highvol/index后备数组均为 `[1000,1000,1000]`，deployment配置本身没有cap数值；其他市场的当前实际cap仍未知。 |
| 最低保证金 | 当前开仓最低值 **未知**。部分关闭代码把 **不足5 USDG余量** 转成整仓关闭，不能冒充本轮读取的合约 `minMargin()`。 |
| 仓位上限 | 实际值未知。静态fallback为 **25万USDG基础名义额、200倍分界**；超过分界按 `基础额×分界倍数÷杠杆` 降低，因此1,000倍fallback名义额为 **5万USDG**，不是25万。运行值可覆盖默认。 |
| 持有及费用 | 固定持有时限未知，`gridSeconds=5` 是排程网格。前端显示 **按保证金收0.5%开仓费**，另收 **利润/亏损的2%**（balancing显示1%），还存在coverage/近入场盈利调整。运行时另读开仓费，可覆盖fallback。 |
| 日期与状态 | 配置 `launchTime` 为 **2026年10月20日00:12:28 UTC／北京时间08:12:28**，不证明首笔成交或v2部署。部分关闭及keeper止盈止损是展示的功能，执行行为未独立核验。 |

证据：`EVD-COMP-BASIC-STOX-CLIENT`、`EVD-COMP-BASIC-STOX-CONFIG`、`EVD-COMP-BASIC-STOX-HTML`，及稍后的 `EVD-COMP-BROWSER-STOX` 和下方保留截图。见[档案](projects/stox.zh-CN.md)、[浏览器范围](browser-checks.zh-CN.md#stox-trade)。较早静态研究没有取得实时数值标签；稍后截图补充的是所选页面断言，不是已认证链配置或已对账的全产品成交量。查看页面无需连接账户。

![STOX的NVDA页面显示MAX LEVERAGE 1000倍和x1—1000滑杆](assets/stox-trade-20261028.jpg)

## 如何读这些门槛

**1bp＝0.01%**，必须同时看收费基数：名义额费用、保证金开仓费、调整后利润分成都不是同一个成本。输入框默认值不是最低门槛；执行延迟、最低持有、自动关闭与延后付款也不是同一个时间。标的清单和业务体量分别见[市场目录](markets.zh-CN.md)及[带时点快照](../../research/competitors/snapshots/latest.json)，本页没有刷新这些业务数字。
