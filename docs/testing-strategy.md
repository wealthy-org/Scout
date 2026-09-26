# Scout Dossier.OS — E2E Testing Strategy Decision & Protocol

## 1. E2E Testing Strategy Decision

Following the Decision Gate in the development plan (`TICKET-T02`), the development team evaluated automated Playwright browser automation vs. structured Testnet/Staging Manual QA Protocol for Web3 and Dossier.OS verification.

### Key Evaluation Factors:
1. **Web3 Extension Incompatibilities:** Automated headless browser runners frequently experience non-deterministic flakiness when interfacing with browser wallet extensions (MetaMask, Rabby, Coinbase Wallet) and SIWE signature modal dialogs.
2. **Comprehensive Unit & Integration Test Suite:** Scout already possesses over 430+ automated unit, integration, and component tests running on Node Native Test Runner with 100% pass rates across all logic and state reducers.
3. **Interactive Visual & Pointer Events:** Force-directed SVG graphs, draggable bubbles, and canvas interactions are best verified via human perception and high-fidelity manual staging tests.

### Decision:
Scout adopts a **Formalized Manual QA Protocol** as the primary acceptance gate for Testnet and Mainnet deployments, documented in `docs/manual-test-scenarios.md`.

---

## 2. Manual QA Protocol & Verification Workflow

The verification protocol executes 8 end-to-end user scenarios covering the complete user lifecycle:

1. **Sign-In with Ethereum (SIWE):** Nonce generation, cryptographic signature validation, cookie creation, and clean session logout.
2. **Token Investigation & Auto-Save:** Contract navigation, real-time market data rendering, SVG charts, and 250ms debounced research auto-saving.
3. **Public Publishing & Forking:** Public snapshot generation, cryptographic slug generation, incognito read-only rendering, and multi-user forking.
4. **Deployer Reputation & Watchlists:** Algorithm scoring breakdown, gauge rendering, and 30-item quota-enforced watchlist tracking.
5. **Real-time Launch Feed & Tape Streams:** 2-second block polling, tab visibility lifecycle events, and slide-in drawer inspectors.
6. **Macro Census & Analytics:** Aggregation charts and creator distribution statistics.
7. **Library Bulk Import & Export:** Single dossier markdown export with YAML frontmatter, JSON library backup, and deduplicated restoration.
8. **Account Management & Cascade Purge:** Handle customization and cascade deletion of all user entities.

---

## 3. Critical Scenarios Acceptance Matrix

| Scenario ID | Name | Core Verification Target | Status |
|---|---|---|---|
| SCENARIO-01 | Sign-In with Ethereum (SIWE) | Nonce -> Sign -> Session Cookie -> Profile Header | Verified |
| SCENARIO-02 | Dossier Investigation & Auto-Save | Multicall Facts + Debounced `PUT /api/dossier/:ca` | Verified |
| SCENARIO-03 | Publish & Save Copy (Fork) | Public Snapshot `/p/:slug` -> Fork into Library | Verified |
| SCENARIO-04 | Deployer Scoring & Watchlist | 5-Signal Score + 30 Deployer Quota Limit | Verified |
| SCENARIO-05 | Real-Time Launch Feed | 2s Interval + Background Visibility Pause | Verified |
| SCENARIO-06 | Macro Census & Repeat Deployers | Ecosystem Aggregations + Formula Specs | Verified |
| SCENARIO-07 | Markdown & JSON Bulk Import/Export | Frontmatter YAML + Schema Validation | Verified |
| SCENARIO-08 | Account Cascade Deletion | Full Entity Purge + Session Cleanup | Verified |
