# Current programmatic execution investigation

Date: **2026-11-14**. Baseline `ad675e26d6cd7bbd474e6ab7b5c82a4d494538d7`. [Report and interfaces](../programmatic-execution.md) · [Reviewed metadata](../../research/cases/013-programmatic-execution.json).

## Questions resolved within this scope

- Current official client still builds Exchange `OpenPosition` / `Close`, a distinct `CancelIntent` domain, and a signer-derived deterministic intent ID. Real local EIP-712 recovery now complements the older unsigned encoding tests.
- Margin is an 18-decimal collateral amount; current entry prices use instrument-specific integer scales. The funding wrapper's `token()` read resolves the different frontend and official-native-USDC addresses.
- The inspected external-wallet client now persists a generated trading key in scoped localStorage and includes a legacy signer migration path. No real browser storage, key, wallet signature or handoff was accessed.
- Anonymous synthetic-address history and SSE bootstrap work. Canonically sorted history parameters matter; unsorted parameters produce a canonical-URL error. These observations do not authenticate access to a funded personal account.
- Public config bootstrap arrives in the subscribe response as well as subsequent publications. Current config exposes 10-USDC margin, 500-USDC notional, 1000× maximum and a 1000-PAPER intake field. The precise PAPER action gate remains unresolved.
- Reference-block proxy reads identify three implementations different from the October observations. Runtime identity is established as a provider read; complete new-runtime semantics are not inherited from prior mock tests.

## Evidence and collection limits

The private collector made 60 HTTP/RPC capture records, including selected repeated resources and bounded failed GET variants. All byte lengths and SHA-256 digests matched. Raw captures are unpublished. Public provenance includes URLs, times, hashes and byte locators; RPC records bind explicit block tags and code hashes. Native token lookup was a view-only `eth_call`; no transaction RPC was used. Public WebSocket/SSE checks are recorded separately and are not included in the 60-capture count.

The initial Python urllib 403 was diagnosed as Cloudflare 1010: normal curl and an honest descriptive User-Agent succeeded. The successful fetch path, not the failed generic reader, supplied this increment's official-page evidence. No authentication bypass, cookies or browser impersonation were used.

The public batch receipt proves a top-level successful transaction envelope only. No item event was assigned a guessed ABI or linked to an owner's account. Registration, open/close admission, cancellations, funding, staking and rewards were never submitted. No production-domain signature was generated. The only signatures use newly generated temporary keys with an explicitly isolated local-test domain.

## Code and checks

The new module implements unsigned previews, explicit units and local limits, signature recovery/correlation, public GET/WS/SSE readers, a conservative account mirror, operation tracking and a disabled-by-default open/close/cancel transport. It is not a full official SDK, custody system, durable journal, nonce coordinator, event decoder or strategy executor.

Twenty-eight focused tests cover actual research risks: wrong domain/contract/nonce/deadline/signer, precision and exposure errors, unsupported partial closes, acknowledgement without execution, timeout/restart duplication, expiry/revocation, broken increments, cancellation competition and simulated write transport. The tests reject default external HTTP/WS in their process. Required repository checks and publication review results are recorded in [STATUS](../../STATUS.md) and the case metadata after their actual runs; earlier protocol-reproduction milestones retain their scopes.
