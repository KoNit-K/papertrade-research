# Papertrade 跟随者与相邻产品研究

[English](README.md) · [中文文字汇总](summary.zh-CN.md) · [统计口径](methodology.zh-CN.md) · [刷新复算](refresh.zh-CN.md) · [里程碑](progress.zh-CN.md)

研究日期：**2026年10月28日**。本次覆盖五个竞品，Papertrade另列基准。研究产品设计和业务观测，不分析代币行情。官方描述、来源自报和独立复算分别保留证据范围。

## 主要发现

最明确的关系是设计借鉴，尚未证明代码fork。Trade Everything直接在官网承认使用Papertrade模型；YOLO创始人致谢付款队列思路的原帖已定位，实际内容来自镜像及媒体。Cardboard、Rektrade采用“庄家作对手方、赢家欠款、亏损换分配权益”的组合，但未证明共同代码来源。STOX作为相邻设计纳入，允许直接投入庄家资本。这些关系不能推导共同团队或出资方。

这些产品的付款规则已有实质分化：YOLO文档是整笔FIFO，队首大额债权可能阻塞后面赢家；Cardboard支持部分FIFO；Trade Everything描述一半按顺序、一半按债权比例偿付；STOX增加Reserve和永久资本投入。这些是不同的现金流安排，相同的最高杠杆不代表债务结构相同。本次未独立重放部署执行。

业务数据透明度也不同。Cardboard与Rektrade公开产品独立API；YOLO本次取得的当前数据仅为DefiLlama定义的盈利手续费，未取得当前House及真实排行榜。Papertrade取得第三方TVL/费用快照，但官方历史受阻，外部成交量/OI适配器也主动停用输出。不可得的字段保持缺失，不补零。

## 谁在运营，什么时候上线？

| 产品/档案 | 来历与关系 | 日期证据及限制 |
|---|---|---|
| [Papertrade](projects/papertrade.zh-CN.md) | HyperEVM比较基准；使用既有set 2研究 | 文档标set 1从10月7日、set 2从21日。这是版本日期；报道中的10月10日前端上线未在本次独立定锚。 |
| [Jupiter YOLO](projects/yolo.zh-CN.md) | Jupiter Labs，Solana；有归因的设计借鉴 | 10月15日beta公告；Siong镜像显示12:59 UTC／北京时间20:59。原站不可得，首笔公开成交未验证。 |
| [Cardboard](projects/cardboard.zh-CN.md) | Solana；条款将界面运营方写为 **Attractor Labs, Inc.**；强机制相似 | 镜像中10月18日起有运营更新，条款日期25日；首笔实盘及beta精确时刻未知。 |
| [Trade Everything](projects/trade-everything.zh-CN.md) | HyperEVM；自称Papertrade社区中的独立项目，明确承认模型借鉴 | 预告10月26日13:30 UTC／北京时间21:30主网上线。Draft、demo、live措辞并存，主网读取失败，未确认实际执行上线。 |
| [Rektrade](projects/rektrade.zh-CN.md) | HyperEVM；强机制相似；Ember是同一场所的另一前端 | 官方帖镜像称10月22日已上线；独立首笔成交时刻未知。 |
| [STOX](projects/stox.zh-CN.md) | 配置Robinhood Chain 4663；声明不隶属Robinhood/Hyperliquid；相邻设计 | 配置 `launchTime` 换算为10月20日00:12:28 UTC／北京时间08:12:28，不等于独立验证的首笔成交或v2部署日期。 |

档案中没有证据的法定实体、创始人真实履历、总部和产品融资保持未知。Jupiter品牌归属不能代替YOLO签约实体；链或预言机提供商不自动成为发行方。Attractor Labs的名称不能证明注册地，地区访问限制也不证明公司所在地。

发现清单把Trade Everything归到Solana，官方架构实际写HyperEVM。见[候选登记](../../research/competitors/candidates.json)。

## 支持哪些币种和资产？

| 平台 | 加密资产交易标的 | 其他交易标的 | 保证金／交易结算 | 证据范围 |
|---|---|---|---|---|
| Papertrade | BTC、ETH | 本次未建立 | USDC／USDC | 当前官方FAQ；能扩展上市不等于已经上线 |
| Jupiter YOLO | SOL、BTC、ETH、ZEC、HYPE | 本次未建立 | JupUSD／JupUSD | 官方总览；其他输入代币会被兑换，不增加交易市场 |
| Cardboard | BTC、ETH、SOL | 本次未建立 | USDC／USDC | 官方文档与产品API一致 |
| Trade Everything | Draft文档：BTC、ETH、SOL、HYPE、BCH | 208条股票/ETF元数据；另有六个亚洲标的名称，可能重叠 | USDC／USDC | demo域名元数据及Draft范围，不是已验证主网激活清单；加密业务路线未解 |
| Rektrade | BTC、ETH、SOL、ZEC、NEAR、XMR、HYPE | 本次未建立 | USDC／USDC | 产品市场API；杠杆上限与config冲突 |
| STOX | 保留配置未列加密币标的 | 60条股票、ETF、商品、FX、指数及intl配置 | USDG／USDG | 前端配置，不是独立核验的活跃市场登记 |

[完整标的清单与证据范围](markets.zh-CN.md)区分交易标的、保证金和奖励。Trade Everything的五种加密标的来自Draft资料；STOX的60条是前端配置。

## 基本资料与杠杆补全

[逐平台基本资料](basics.zh-CN.md)补齐官网、账号、链、保证金、杠杆、门槛、仓位限额、持有期和费用；[建设者与社区背景](backgrounds.zh-CN.md)记录本人自述、疑似身份和出处；[浏览器核验](browser-checks.zh-CN.md)提供七张真实截图及保存时间。当前范围为Papertrade基准加五个竞品。

| 平台 | 杠杆信息 | 页面、文档与实际准入的区别 |
|---|---|---|
| Papertrade | BTC/ETH文档最高1000倍；本次BTC页面滑杆1—1000倍 | 输入默认10倍、1USDC不证明最低准入门槛；最低可执行值待核 |
| YOLO | 500—1000倍，每档100倍 | 官方说明；本次交易页连接失败，不能保证实时方向容量 |
| Cardboard | 文档及BTC页面1—1000倍 | 配置max1000；页面默认保证金1不证明最低1 |
| Trade Everything | Draft BTC/ETH最高1000倍；头部美股常规500／盘前盘后375／隔夜250倍；其他股票≤100倍；亚洲正常时段40／80／100倍 | 官网最高500倍，默认Demo的NVDA隔夜显示250倍；股票时段和风控细则见基本资料，不当作全部主网市场实测 |
| Rektrade | 首页和markets给七市场1000倍；config给SOL500、ZEC/NEAR/XMR200倍 | BTC/ETH/HYPE的config也是1000；冲突未通过真实准入核验 |
| STOX | NVDA页面滑杆1—1000倍，MAX1000倍 | 其余市场及合约有效参数未独立核验；静态fallback不能冒充链上值 |

地域信息同样按证据限缩：Papertrade有纽约见面及人物历史美国履历线索；Jupiter条款明确Panama界面法律范围；其余没有足够依据确立当前总部或国籍。“疑似”附具体出处，不凭中文社区、公链或公司后缀推断地域。

## 机制对比

| 产品 | 交易与价格 | 庄家与付款 | 权益与控制差异 |
|---|---|---|---|
| Papertrade | 逐仓高杠杆、HyperCore BBO中间价、relayer | 亏损补充LP，现金/债权保证金分别记账，独立付款队列 | 亏损铸PAPER，keeper参与分配；以既有报告的版本和证据范围为准 |
| YOLO | 500–1000倍，Pyth Pro，手动关闭最早15秒，无止盈止损 | JupUSD，整笔FIFO，72小时/50倍利润关闭规则 | 非线性盈利调整、2%盈利费、0.2bp平仓费，交易服务共同签名；未建立亏损发币机制 |
| Cardboard | 1–1000倍，开仓锁定盈利敞口，接受的中间价 | USDC，部分FIFO，可选择用欠款作保证金 | 亏损CARDBOARD、质押/推荐/builder，冻结与指定价关闭权限；动态参数与旧帖有差异 |
| Trade Everything | 股票/ETF受交易时段限制，Pyth Pro；BTC/ETH路线文档互相矛盾 | 描述独立池，50%顺序/50%按比例偿付 | 亏损发行及PAPER质押者分配；Draft文档还在即时付款方面矛盾，实际路线/版本待核 |
| Rektrade | 公开接口对杠杆上限不一致，分市场BBO/oracle/mark | USDC House与队列，可用现金和债务分别暴露 | 亏损REKT、质押、入金税、多阶段盈利成本；发币计划和交易场所描述与API有冲突 |
| STOX | USDG，展示最高1000倍，部分关闭及keeper止盈止损 | 共享House、Reserve、永久资本投入 | 不可转让House Shares可来自亏损或入金；配置地址未独立验证部署 |

这是有范围的来源观测，不是已部署合约功能认证。各档案保留证据编号和未解冲突。Rektrade当前市场接口还有HYPE，不能沿用旧六市场描述。Trade Everything文档中的BTC/ETH路由业务应归入Papertrade已有业务；其Draft资料又有独立市场描述，路线未解决前不加入独立竞品总量。

## 业务观测

以下适配器数字保持原09:31—09:35北京时间快照。后续11:04—11:15浏览器截图另取得Papertrade BTC视图的24h量约$7.68B、多OI$84.2M、空OI$32.6M，以及STOX所选NVDA页的24h量约$62.7M、多OI$250、空OI$0。它们是取整页面断言，计数定义、业务时点及全平台覆盖未核，不能与接口数字混合排名；见[截图记录](browser-checks.zh-CN.md)。


成功联网读取范围：**2026年10月28日01:31:54.850–01:35:04.865 UTC／北京时间09:31:54.850–09:35:04.865**。两个零请求blocked运行另在01:36:57 UTC创建。以下是来源自报和核对原始字节后的单位转换，不是同时点资产负债表或市场份额排名。完整精度、各字段采集时间、来源、证据编号、口径和缺失原因见[67条指标快照](../../research/competitors/snapshots/latest.json)及[CSV](../../research/competitors/snapshots/latest.csv)；响应哈希见[统计来源元数据](../../research/competitors/sources/metrics.json)。

| 产品 | 成交/记录活动 | 资金/欠款字段 | 数据边界 |
|---|---|---|---|
| Papertrade | 本次当前名义成交量、活跃钱包不可得；来源24小时费用 **$60,113** | 来源TVL **$30,863,176**，业务时点00:01:47 UTC；House/队列未知 | DefiLlama；TVL含用户资金，费用含规定的分配项，不是纯庄家本金，也不与YOLO费用直接同口径 |
| YOLO | 当前名义量/钱包不可得；来源24小时盈利费 **$4,650**、7天 **$48,332**、累计 **$83,051.25** | 当前House/队列未知；来源空TVL历史不等于零 | DefiLlama盈利费，精确窗口边界未给出，不含其他成本 |
| Cardboard | 来源累计名义量 **$7,407,335,307.36**（约74.07亿美元）；明确24小时字段合计 **$12,812,556.65**；**75,008**笔、累计**1,388**钱包 | LP现金 **$723,128.07**、treasury **$882,859.51**、队列 **$0**、OI **$567,116.28** | 官方聚合API，无业务截止时点；treasury与LP范围未对账，不相加；累计计数不是24小时活跃真人 |
| Rektrade | 来源累计名义量 **$135,225,758.26**（约1.352亿美元），**1,449**笔、累计**52**钱包；无已核24小时量 | 可用现金 **$1,103.83**、treasury **$1,971.24**、队列 **$0** | 官方stats时点01:35:04 UTC，House另取且无业务时点，不据此推导净利润或偿付能力 |
| Trade Everything | 未知 | 未知 | 四项主网配置/聚合读取502，不以demo数据替代 |
| STOX | 未知 | 未知 | 初次HTML数值占位；后续NVDA页面取整数另列，未验证全平台聚合适配器 |

Cardboard的累计量不能因为 `range=1d` 就当成日成交量。累计钱包和累计亏损不能证明活跃度或留存。Rektrade的累计亏损、赢家已付另有导出，但未对账为净交易者PnL。队列单次为零不能证明历史始终按时付清或未来赢家一定能拿到钱。

YOLO的“不到24小时10亿美元”保留为历史发行方主张。原帖地址从本轮取得的SolanaFloor HTML提取，但原帖全文和底层事件总数未直接验证；它指杠杆名义额，不是实际入金。The Defiant正文未加载，不写成已完整读到的佐证文章。用户提供的底池/队列例子缺采集时间，不纳入当前体量。

## 核验覆盖与后续方向

独立代理检查了选定原始捕获、关键机制和处理链路。四组已采项目从原始字节重复离线复算一致，第二次Cardboard联网刷新创建了独立运行。测试、仓库检查与问题记录见[验证记录](../../research/competitors/verification.json)、[独立复核](../../research/competitors/review.json)及[数据复核](../../research/competitors/review-data.json)。这些验证字节一致和处理流程，不证明上游诚实、历史事件完整或合约安全。

最重要的缺口是YOLO当前House/队列及完整排行榜、首笔成交/部署日期、法定实体与融资身份、Trade Everything主网和矛盾文档，以及Rektrade配置冲突的部署解释。后续步骤见各档案与[刷新指南](refresh.zh-CN.md)。本次不生成跨项目总量、留存估计、代币行情或偿付保证。
