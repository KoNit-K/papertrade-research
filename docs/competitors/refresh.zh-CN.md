# 刷新与复算业务快照

[English](refresh.md) · [综合报告](README.zh-CN.md) · [统计定义](methodology.zh-CN.md)

## 已支持的输入

| 项目ID | 固定公开GET输入 | 范围 |
|---|---|---|
| `papertrade` | DefiLlama protocol与fees摘要 | 来源TVL和费用窗口；未取得可验证的成交量、OI、House或队列 |
| `yolo` | DefiLlama `jupiter-yolo` protocol与fees摘要 | 来源盈利手续费窗口；空TVL历史保持未知 |
| `cardboard` | 官方 `/v1/analytics?range=1d` | 累计计数、来源24小时市场量、OI和池子字段 |
| `rektrade` | 官方 `/api/stats` 与 `/api/house` | 累计场所统计和独立池子字段 |
| `trade-everything`、`stox` | 无已验证适配器 | 明确返回blocked，零请求 |

适配模块固定主机、路径与查询串。`params`也记录URL查询参数，例如 `range=1d`，没有查询参数时为空。调用者不能指定端点、请求头、凭证或钱包。适配器版本和最终源码摘要记录在研究协议中。

审阅后的采集有67条指标，包括缺项：四个成功项目在2026年10月28日01:31:54–01:35:05 UTC（北京时间09:31:54–09:35:05）采集，另有两个无适配器的blocked运行。业务截止时间彼此不同或缺失。精确时间、定义和证据编号见[JSON](../../research/competitors/snapshots/latest.json)及[CSV](../../research/competitors/snapshots/latest.csv)。

## 运行命令

需要Node.js >=24.12和仓库指定的pnpm。依赖缺失时运行 `pnpm install --frozen-lockfile --ignore-scripts`。本次使用已有依赖，没有安装包。Codex shell找不到Node/pnpm时，使用工作区依赖工具返回的路径。常见捆绑运行时设置为：

```sh
export PATH="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH"
```

在仓库根目录运行：

```sh
pnpm competitors:refresh --project cardboard
pnpm competitors:report --run <刷新返回的run_id>
pnpm validate:competitors
```

刷新进行有边界的联网GET，返回新运行编号和传输状态。报告命令读取已留存字节、核对SHA-256，在新目录生成 `metrics.json` 和 `metrics.csv`，完全不联网，也不自动发布或替换审阅快照。同一运行反复离线复算得到一致指标、不同目录；新联网刷新可能合理改变数值。

退出码0表示请求的操作成功；刷新退出码2表示部分或受阻，应检查原因和报告；1表示参数或处理失败。HTTP成功不等于指标齐全或业务已独立验证。元数据验证不鉴定来源真伪或协议执行。

## 检查和更新

1. 核对项目、URL/查询参数、适配器版本和响应哈希。
2. 分别看采集时间和业务时间；业务时点缺失时保持未知。
3. 比较前读计算说明、覆盖范围、单位和缺失原因。
4. 保留旧运行。离线命令用于复算，新刷新用于新观测。
5. 公开更新前审阅聚合投影。原始响应和账户信息保持私有，工具不自动批准发布。

Cardboard的 `range=1d` 不使 `stats.volume`、用户和笔数自动成为日数据；24小时量来自三个明确市场字段求和。USD6整数先检查安全范围再除以1e6，无效或过大值保留缺失。Rektrade统计时间戳不继承给另取的House响应。DefiLlama YOLO费用不含全部成本或文档平仓名义额收费。本次不推导排行榜总量。

## 缺失来源与后续检查

官方来源不可得时，不能用旧媒体数字或普通Jupiter Perps/JLP统计替代。不能为补表连接钱包、签名、交易、查询私人账户或绕过拒绝。

后续正常匿名YOLO浏览器可用时，记录UTC、排行榜窗口/分类、可见House/队列和分页覆盖。只检查公开页面实际发出的请求；确认身份、单位和访问范围后才加入固定聚合适配器。未付利润、净PnL及完整排行榜覆盖仍待核。

已支持适配器没有分页；重复来源/结果绑定会拒绝，不宣称完整排行榜或事件覆盖。累计辅助函数拒绝缺失/重复边界和无法解释的下降，但尚未实现线上对齐7天窗口重建。既有chain999采集器保持原样。

## 基本资料、背景和截图怎样手动复查

[基本资料](basics.zh-CN.md)与[浏览器记录](browser-checks.zh-CN.md)不是新适配器承诺。打开记录中的原URL，保留所选标的、网络／Demo标识、交易时段、滑杆范围、收费基数和UTC观察时间；重新截取匿名视口并计算 `sha256sum <image.jpg>`。默认输入不是最低准入门槛，单市场页头不是自动成立的全平台统计。若受阻，登记失败，不把旧图写成新观察。

团队线索按[背景资料](backgrounds.zh-CN.md)的原始链接逐项复查：优先找到原作者正文和日期，再确认产品交叉链接；搜索缓存、镜像、本人自述与第三方归因保留各自层级。新证据可以提升或撤回具体主张，不继承未核实的国籍、总部、共同团队或机构出资。历史来源保留日期，不静默覆盖。
