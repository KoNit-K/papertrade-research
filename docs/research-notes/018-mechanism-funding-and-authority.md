# Mechanism, funding-stage and authority clarification

Reviewed: **2026-10-28**. Baseline: `334fec007df9c2c13c11e1ccb58ca1fa30e49b40`. [English review](../current-product-review.md) · [中文报告](../current-product-review.zh-CN.md) · [中文文字汇总](../papertrade-summary.zh-CN.md).

This note records successful clarifications with separate scopes: set-2 official descriptions, dated client/code findings, explorer displays and offline consistency checks. Official pages below were successfully reread on October 28 and identify set 2 with an October 21 update date. Reader responses are mediated content; no upstream HTML byte hash is assigned. This increment does not authenticate all current parameters, reconstruct a full settlement or close protocol-reproduction milestones.

## Confirmed additions

| ID | Addition | Source and scope |
|---|---|---|
| GAP-P01 | BBO sanity checks versus deviation protection; permanent market retirement versus reversible global opens gate | [Pricing](https://docs.papertrade.xyz/how/pricing-bbo/), BBO checks and retirement; official description |
| GAP-P02 | Narrow keeper roles, directional OI headroom and dev-fee recipient authority | [Risk](https://docs.papertrade.xyz/how/risk/), controls/admin keys; [addresses](https://docs.papertrade.xyz/dev/contract-addresses/), governance; documentation, not live role storage |
| GAP-P03 | Cash/debt outcome table and independent payout-curve/payment gates | [Solvency](https://docs.papertrade.xyz/how/solvency-queue/), model/wins/losses; [impact](https://docs.papertrade.xyz/how/asymmetric-impact/), four steps and two curves; [builders](https://docs.papertrade.xyz/how/builder-codes/), costs/credit; conceptual rules |
| GAP-P04 | Source receipt, Core instruction, finalization and destination receipt have distinct meanings | [Deposits](https://docs.papertrade.xyz/how/deposits/); dated [client follow-up](013-market-state-funding-and-upgrade-followup.md); no new client-byte verification |
| GAP-P05 | First-deposit allowance and HyperCore first-outbound activation have different scopes | [Product guide](https://docs.papertrade.xyz/learn/deposits-withdrawals/); [Circle](https://developers.circle.com/cctp/concepts/cctp-on-hypercore), Account activation fee; no measured charge |
| GAP-P06 | A fixed request/finalize pair has matching fields and amounts | Explorer records and offline checks below; provider-record consistency |
| GAP-P07 | Five explorer implementation labels and a matched six-action scheduling/execution payload | Display/ABI-structure observations below; not complete state-transition verification |
| GAP-P08 | Qualified session-validator correction and action authorization table | [Session docs](https://docs.papertrade.xyz/learn/session-keys/), [staking docs](https://docs.papertrade.xyz/paper/staking/), [dated validator inspection](013-market-state-funding-and-upgrade-followup.md#7-new-session-and-builder-paths-narrow-two-earlier-unknowns); no real signature recovery |

## Sweep-stage observation

| Field | Request | Finalize |
|---|---|---|
| Transaction | [`0x36a6…c2d2`](https://hyperevmscan.io/tx/0x36a6bbbb73ed5b18a741ac1554dbf3662151461d68993ed33f4782c3bfaac2d2) | [`0x1edb…efb7`](https://hyperevmscan.io/tx/0x1edb1e87295ea5c831fd7e20954532e2b6535de93aaa43124389e1d6c108efb7) |
| Explorer-reported status | Success | Success |
| Block | 49713666 | 49713667 |
| UTC block time, 2026-10-28 | 02:43:35 | 02:43:36 |
| Method selector | `requestSweep(address)` / `0xe0189108` | `finalizeSweep(address)` / `0x6d142da1` |
| Checked amount | CoreWriter raw `3828775000000` | `Swept` raw `38287750000000000000000` |

The target/caller fields and input user fields match across the two records; the final event recipient matches that input. Identifying user/proxy joins and complete calldata remain private. The request emits CoreWriter `RawAction` with version 1, action 6 and token index 0. Its dynamic bytes and the final `Swept` data were independently decoded. Ethereum Keccak checks matched both method selectors and both event topics, with an empty-input hash vector checked first. The additional unnamed request event was not assigned a speculative name or semantics.

`38287750000000000000000 = 3828775000000 × 10^10`. Using the retained [Core eight-decimal and Exchange eighteen-decimal conventions](007-queue-and-dividend-payment.md), both represent **38,287.75 USDC**. This verifies field/amount consistency in provider-reported records. There is no independently retrieved Core receipt, complete before/after balance or source-bridge receipt for this pair; block hashes and transaction-point implementation are not authenticated here. The one-second block-timestamp difference is neither end-to-end deposit latency nor a service benchmark.

## Deployment display and upgrade linkage

The official address list describes nine protocol contracts on chain 999, all except BuilderRegistry as proxies. The October 28 reader responses exposed these implementation labels; abbreviated text is preserved as displayed rather than expanded into invented addresses:

| Protocol proxy | Explorer implementation label |
|---|---|
| [Exchange](https://hyperevmscan.io/address/0x6cd5661646289fb6e65ea5c032310fded797d0a2) | `0x0A44049d...c0B4A3723` |
| [BatchExecutor](https://hyperevmscan.io/address/0x233ff29b239abc1d7748605da9b205c3e008626e) | `0xE0Bc9cC7...C9CDd7262` |
| [PaperToken](https://hyperevmscan.io/address/0xe40f17915daa230324030003a197cdaef2261c0e) | `0x433bD418...3e735Bb4A` |
| [PaperStaking](https://hyperevmscan.io/address/0xaad6c7b0cc3014fc80ffedae0ed7ce5967b0f016) | `0xE6e35194...a2d0cBb15` |
| [PaperTokenomics](https://hyperevmscan.io/address/0x75174549dbbd44497d31a47e2e2d7406408d63d9) | `0x7c0A72A7...21EB58a03` |

A proxy's published source is not the business implementation's verified source. These labels are not a common-block storage/bytecode snapshot and do not certify audit-remediation equivalence. The full official Exchange implementation identity remains separately documented in [note 016](016-2026-10-28-sync.md#upgrade-transaction-anchor).

The [scheduling event](https://hyperevmscan.io/tx/0x0c7e7581647d2a4b1ba70dbdc256d515e5882baf3bd1b6da0f54c264b92c4d95)'s nested six-action payload was decoded and compared with the retained successful upgrade receipt's execution event. **Ordered targets, native values, calldata and salt match byte-for-byte**, and the operation identifier matches. The wrappers differ: scheduling selector `0x8b07f62b`, execution selector `0xa6cc2c8c`. The first three actions carry SessionKeyManager, Exchange and Tokenomics proxy/implementation pairs under selector `0x99a88ec4`; the remaining selectors are Session `0xbd322efa(address)`, Exchange `0xefc1bd46(address)` and Tokenomics `0x85eb2a08()`. Those shapes do not supply verified ABI names or complete initializer effects. All six native-value fields are zero.

The execution record is the previously checked [set-2 upgrade transaction](https://hyperevmscan.io/tx/0x4410b81e3eb76f83f5ddc4e3faee794fb67208d2f129bc013094b9d06055acb6), block 49169385, not a new RPC read. This structural match links the plan to that receipt; historical prestate, exhaustive internal execution and resulting configuration still require separate evidence. No unnamed event word is relabeled as a storage completion sentinel.

## Authorization and teaching checks

The [client guide](../independent-client-guide.md#5-session-nonce-and-deterministic-correlation) lists known authorization fields and scopes. The later captured-validator result narrows the old master-wallet question only in the inspected paths: mocked recovery to the master address did not bypass session-record checks. It establishes neither actual cryptographic recovery nor production service admission.

Independent teaching checks covered fee split `100 → 98 / 97.5`, available/queued `110 / 20`, debt survivor `80`, deficit weight `220`, and the two holdback formulas at a 4-bps raw favorable move. Standard/off-hours holdback is approximately **1.05024 / 2.03250 bps**; subtracting that and the 0.2-bps deadband leaves **2.74976 / 1.76750 bps** before impact. These decimal checks do not verify Solidity rounding or the exact combined fee-funding branch. Existing record identities and historical case scopes remain unchanged.
