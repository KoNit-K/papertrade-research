# Responsiveness and queue stages

Reviewed: **2026-10-28**. Baseline: `d3fba1edd93d2fb1d492c0cdbe26dcf6fffa0050`. [English review](../current-product-review.md#why-it-can-feel-fast) · [中文解释](../current-product-review.zh-CN.md#为什么体感快).

This follow-up connects existing frontend/transaction evidence with six successful official-page rereadings. Those mediated readings identify Contract set 2 and show October 21 as the page update date. Exact upstream request times and response-byte hashes are unavailable; a retained reader response is not an upstream HTML capture. Client evidence remains bound to its original capture date/build. The explanations below establish mechanisms and stage boundaries, not a current latency or congestion measurement.

## Confirmed explanations

| ID | Addition | Evidence and scope |
|---|---|---|
| UX-01 | Quotes, candles, rules and account changes have separate producers and revisions. Prompt display does not require an individual intent to finish. | C1: recovered October 22 consumers; reducing interaction/fetching is a design interpretation, not a benchmark. |
| UX-02 | Session signing and personal-address deposit orchestration reduce repeated user actions. | D3, D4, D6: official descriptions; C1: dated funding implementation. |
| UX-03 | Execution scheduling, funded payout and withdrawal delivery are distinct waits. | D1, D2, D5; C2–C4: dated receipts, telemetry and client state handling. |
| UX-04 | Cash-funded returned margin differs from unpaid profit; claim-funded collateral remains a claim subject to payment. | D1, D2 and earlier ledger research; conditional arithmetic below. |
| UX-05 | Queue rank, timeouts, validity and transfer-state labels each have a limited meaning. | D3, C2–C4. No execution FIFO or ETA follows from them; external credit requires its own evidence. |

## Source map

| ID | Actually examined source and locator | Supported use |
|---|---|---|
| D1 | [The LP and the payout queue](https://docs.papertrade.xyz/learn/lp-queue/), payout queue and user consequences | Cash collateral versus unpaid profit; claim-funded exception and bust treatment. |
| D2 | [Solvency & queue](https://docs.papertrade.xyz/how/solvency-queue/), model, winning closes, harvest and invariants | FIFO priority, close-time funding, earmarked cash and bounded harvest processing. |
| D3 | [Session keys](https://docs.papertrade.xyz/learn/session-keys/), scope and expiry | Open/close preauthorization; main-wallet withdrawal; signed-trade validity. |
| D4 | [Deposits and withdrawals](https://docs.papertrade.xyz/learn/deposits-withdrawals/), depositing/withdrawing | Attributed Hyperliquid deposit speed description and bridge-dependent routes; available-balance withdrawal. |
| D5 | [Architecture](https://docs.papertrade.xyz/how/architecture/), contracts and trade lifecycle | Relayer-only open/close delivery, per-item dispatch, distinct withdrawal delivery permissions. |
| D6 | [CREATE2 deposits](https://docs.papertrade.xyz/how/deposits/), address, sweeper and rationale | Predictable addresses, operated sweep/finalize and reduced Exchange approval/deposit steps. |
| C1 | [Note 013 data planes](013-market-state-funding-and-upgrade-followup.md#2-assemble-three-independent-data-planes), funding and onward sections; [CASE-010 metadata](../../research/cases/010-market-funding-upgrade.json), `sources` and `frontend_build` | Build `2b8e2c45a33e`, October 22; source SHA-256/locators for app, hooks, chart, quote and funding consumers. Reused static evidence, not a newly fetched build. |
| C2 | [Note 007](007-queue-and-dividend-payment.md#execution-array-order-and-partial-failures-are-real-scheduler-fifo-is-unknown), batch result and frontend-waiting sections | Historical mixed-success batch and captured polling/timeout semantics; array order does not reveal scheduler policy. |
| C3 | [Note 008](008-core-credit-and-relayer-pressure.md#real-backend-observation-anonymous-relayer-pressure), public pressure and selected Core credit | October 21 aggregate backlog and one reconciled withdrawal. Submitted-gas saturation differs from queued work; the case is not a general timing benchmark. |
| C4 | [Note 012 funding states](012-independent-clients-orders-and-bridges.md#funding-providers-and-actual-client-branches); [note 013 onward route](013-market-state-funding-and-upgrade-followup.md#5-withdrawal-has-two-authorizations-and-another-completion-boundary) | Captured transfer states, replacement authorization and Circle completion boundary. |

The first six rows were reread on October 28. The other rows reuse the repository's source identities and original verification scope. No historical claim status, chain packet or production interface is changed by this prose index.

## Teaching checks and completion scenarios

The cash example assumes an initially empty payout queue, no liquidation and **net** profit after applicable deductions: returned margin 100 + paid profit 10 = **110 available**; net profit 30 − paid profit 10 = **20 queued**. The total is 130, matching margin plus net profit. Existing queued claims invalidate the direct-profit-payment assumption. This checks explanatory arithmetic only.

The claim-funded example isolates a 100 claim reduced by a 20 realized loss: **80 survives**, with no incoming 100 cash transfer. It does not reconstruct branch-specific fee routing, queue redemption or integer rounding. Both examples are synthetic; neither supplies a real active-queue partial-payment case.

| Scenario explained | Evidence boundary |
|---|---|
| Chart moves while an order waits | Independent read/push and execution paths; no end-to-end timing measurement. |
| Close succeeds while some profit is unpaid | Documented cash/claim separation and funding priority; example balances are conditional. |
| Platform withdrawal executes before onward credit is established | EVM action, HyperCore ledger and external destination are separate confirmations. |

Public additions are explanations, source links and conditional arithmetic. Raw account streams, signed requests, transaction inputs and third-party source copies are not published. Documentation/link/arithmetic checks do not establish server scheduling, an active payout replay or current transfer performance.
