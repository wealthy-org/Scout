# Scout Dossier.OS — Comprehensive Feature Testing Scenarios & QA Protocol

This document provides the formalized, complete manual testing procedures and acceptance checklists for verifying every feature in Scout Dossier.OS across Local, Anvil Fork, Testnet, and Production environments.

---

## Scenario 01: Sign-In with Ethereum (SIWE) Authentication Flow
**Target Routes:** `/`, `/api/auth/nonce`, `/api/auth/verify`, `/api/auth/logout`

- [ ] **1.1 Unauthenticated Landing State:** Access `/` and verify header displays "Connect Wallet" button with zero console errors.
- [ ] **1.2 Nonce Generation:** Click "Connect Wallet" -> confirm client requests `POST /api/auth/nonce` and receives a cryptographically secure randomized nonce string.
- [ ] **1.3 EIP-4361 Signature Verification:** Sign message in MetaMask / Rabby / Phantom -> confirm `POST /api/auth/verify` validates signature, issues `scout_session` HTTP-only cookie, and handles EIP-55 checksum normalization.
- [ ] **1.4 Authenticated Header State:** Verify header transforms to display truncated wallet address (`0x...`), active status dot, and Logout button.
- [ ] **1.5 Phantom & EVM Wallet Connect Support:** Test authentication using Phantom (EVM mode) and Rabby wallet extensions to verify multi-provider compatibility.
- [ ] **1.6 Session Expiration & Logout Action:** Click Logout -> confirm `POST /api/auth/logout` clears session cookie and resets client state to guest mode immediately.

---

## Scenario 02: Token Case File Investigation & Auto-Save
**Target Routes:** `/d/[ca]`, `/api/dossier/[ca]`

- [ ] **2.1 Token Search & Routing:** Type valid contract address (`0x...`) into header search or landing input -> navigate directly to `/d/[ca]`.
- [ ] **2.2 Model 3 Split-View Master-Detail Console:**
  - Verify left master pane (`w-full lg:w-[360px] xl:w-[390px]`) renders DossierHeader, Market Flow 3x2 matrix, and ResearchPanel without vertical overlap.
  - Verify right detail pane renders Trade Flow Chart, Order Flow Panel, Wallet Map, Top Wallets Table, and Deployer History.
- [ ] **2.3 Market Flow 3x2 Structured Matrix:** Verify Market Cap, ATH, Curve Progress %, 24h Volume, Trade Count, and Unique Wallets populate with no NaN values or overflowing text.
- [ ] **2.4 Interactive Research Panel & Auto-Save:**
  - Change Status dropdown (`Watching`, `Researching`, `In position`, `Passed`).
  - Type thesis text into narrative textarea.
  - Select / type Decision Reason.
  - Confirm debounced `PUT /api/dossier/:ca` fires within 250ms and saves data to database without page reload.
- [ ] **2.5 Since Last Check Delta Trigger:** Refresh or revisit the dossier -> verify Since Last Check panel calculates metric deltas (FDV, Liquidity, Score) against prior snapshot.
- [ ] **2.6 Scout Remembers Local Persistence:** Add quick researcher notes -> verify notes persist across browser sessions.

---

## Scenario 03: Public Case File Snapshot Publishing & Forking
**Target Routes:** `/p/[slug]`, `/api/dossier/public/[slug]/publish`, `/api/dossier/public/[slug]/save-copy`, `/api/dossier/public/[slug]/revoke`

- [ ] **3.1 Open Publish Modal:** Click "Publish" button in dossier header -> confirm PublishDialog modal opens with clean backdrop.
- [ ] **3.2 Snapshot Generation & Slug Creation:** Fill researcher handle, toggle note visibility, and click "Confirm & Publish" -> receive unique `/p/[slug]` URL.
- [ ] **3.3 Public Route Read-Only Verification:** Open `/p/[slug]` in incognito / guest window:
  - Verify complete dossier renders read-only.
  - Verify author attribution badge displays configured handle.
  - Verify edit controls (auto-save inputs) are strictly hidden.
- [ ] **3.4 Save a Copy (Fork) Flow:** Log in with secondary wallet in incognito window -> click "Save a Copy" -> confirm copy is merged into secondary user's `/dossiers` library with attribution intact.
- [ ] **3.5 Revocation Flow:** From author wallet, invoke revocation -> reload public URL in incognito window -> confirm HTTP 410 Gone / Revoked state is rendered.

---

## Scenario 04: Deployer Reputation Profile & Watchlist Monitoring
**Target Routes:** `/deployer/[address]`, `/api/deployer/[address]`, `/watchlist`, `/api/watchlist`

- [ ] **4.1 Deployer Profile Sheet:** Click deployer address link -> navigate to `/deployer/[address]`.
- [ ] **4.2 Single-Viewport Compact Fit:** Verify page fits 100% within display height without outer page scrolling.
- [ ] **4.3 Reputation Scoring & 10-Bar Gauge:** Verify 0–100 score, 10-bar colored velocity gauge, status band badge (Green/Yellow/Red), and label (`fresh`/`repeat`/`serial`).
- [ ] **4.4 5 Core Laplace Algorithmic Signals:** Verify `Graduation Rate`, `DOA Rate`, `Burst Rate`, `Total Launches`, and `Graduated Count` populate cleanly.
- [ ] **4.5 Serial Rugger Penalty Cap:** Verify creators with ≥6 launches and 0 graduations are clamped to max 25 score (Red Band).
- [ ] **4.6 Why This Score Accordion:** Expand "Why this score?" accordion to review mathematical Laplace smoothing explanation.
- [ ] **4.7 Add to Watchlist Action:** Click "+ Add to Watchlist" -> confirm `POST /api/watchlist` succeeds and button toggles to "✓ In Watchlist".
- [ ] **4.8 Watchlist Management View (`/watchlist`):**
  - Verify tracked deployer card displays reputation band, total launches, and launch indicators.
  - Click "Remove" -> confirm deployer is deleted from watchlist immediately.
- [ ] **4.9 Quota Limit Check:** Attempt adding 31st deployer -> confirm HTTP 422 Unprocessable Entity quota limit error message.

---

## Scenario 05: Real-Time Launch Feed & Ticker Tape
**Target Routes:** `/feed`, `/api/feed/stream`

- [ ] **5.1 Live Ticker Tape:** Navigate to `/feed` -> verify top ticker tape scrolls continuously with recent token launches.
- [ ] **5.2 Live Block Polling:** Verify new block events and genesis deployments stream into the feed table automatically every 2 seconds.
- [ ] **5.3 Filter Tabs:** Toggle between "Most Traded", "New Launches", "Near Graduation", and "Repeat Deployers" -> confirm table filters accurately.
- [ ] **5.4 Tab Visibility Background Pausing:** Switch browser tabs for 20 seconds -> return to tab -> confirm poller resumes without duplicate events or memory leaks.
- [ ] **5.5 Trade Inspector Slide-In Drawer:** Click any token row in feed table -> confirm trade inspector slide-in drawer opens showing real-time transaction ledger.

---

## Scenario 06: Macro Census & Methodology Education
**Target Routes:** `/census`, `/api/census`, `/how`, `/docs`

- [ ] **6.1 Census Analytics (`/census`):** Verify macro KPIs (Total Deployers, Graduated Rate, Serial Ruggers, Total Tokens), SVG distribution bar chart, and Top 20 Repeat Creators table.
- [ ] **6.2 Methodology Guide (`/how`):** Verify 4-step research workflow, delta threshold definitions, and forensic playbook diagrams.
- [ ] **6.3 Technical Documentation (`/docs`):** Verify mathematical formula specifications, REST API samples, and rate limit tables.

---

## Scenario 07: Library Bulk Export, Markdown Export & JSON Import
**Target Routes:** `/dossiers`, `/api/library/export`, `/api/library/import`, `/api/dossier/[ca]/export-md`

- [ ] **7.1 Single Dossier Markdown Export:** In case file header, click "Export MD" -> confirm `.md` file downloads with complete YAML frontmatter.
- [ ] **7.2 Library Bulk Export:** In `/dossiers`, click "Export All" -> confirm JSON file containing all user case files downloads.
- [ ] **7.3 Library Import Restoration:** Click "+ Import" -> upload exported JSON -> confirm `POST /api/library/import` parses, validates schemas with Zod, and merges dossiers without data corruption.

---

## Scenario 08: Account Settings & Cascade Deletion
**Target Routes:** `/me`, `/api/me`

- [ ] **8.1 Researcher Handle Update:** Navigate to `/me` -> update handle to alphanumeric string -> click "Save Handle" -> confirm update.
- [ ] **8.2 Cascade Account Purge:** Click "Delete Account" -> type exact wallet address -> confirm deletion -> verify session is destroyed and all user dossiers, snapshots, and watchlist records are purged from database.

---

## Scenario 09: Constellation Network Topology & Wallet Interactive Map
**Target Routes:** `/map`, `/map/[address]`, `/d/[ca]`

- [ ] **9.1 Multi-Token Constellation Graph:** Navigate to `/map` -> verify SVG force-directed constellation graph renders deployer and token nodes with connecting edges.
- [ ] **9.2 Interactive Node Hover & Tooltips:** Hover over wallet nodes -> verify tooltip displays address and net flow; verify hover state does not flicker.
- [ ] **9.3 Connected Tokens Drawer:** Click deployer node -> verify connected token dossier list loads with direct links.

---

## Scenario 10: Trade Flow Candlestick Chart & Order Flow Dynamics
**Target Routes:** `/d/[ca]`

- [ ] **10.1 SVG Candlestick Rendering:** Verify 1m/5m/15m candlestick bars render with accurate open, high, low, close bounds.
- [ ] **10.2 Graduation Milestone Line:** For graduated tokens, verify horizontal milestone line indicates graduation block/price.
- [ ] **10.3 Order Flow Pressure Panel:** Verify buy volume vs sell volume pressure distribution bars calculate exact net balance.

---

## Scenario 11: Since Last Check Delta Tracking & Scout Remembers Persistence
**Target Routes:** `/d/[ca]`

- [ ] **11.1 Delta Evaluation:** Modify token market cap or score in test fixture -> reload page -> verify Since Last Check displays visual delta pills (e.g. `+14.2% FDV`, `+5 Score`).
- [ ] **11.2 Scout Remembers Note Caching:** Add note in Research Panel -> reload without session save -> confirm client restores unsaved scratchpad state.

---

## Scenario 12: Search & Fast Omnisearch Navigation
**Target Routes:** `/`, `/feed`, `/dossiers`, `/d/[ca]`

- [ ] **12.1 Global Search Input:** Enter contract address in header omnisearch -> press Enter -> navigates to `/d/[ca]`.
- [ ] **12.2 Deployer Address Search:** Enter deployer address -> navigates to `/deployer/[address]`.
- [ ] **12.3 Invalid Token Fallback:** Enter non-Pons V2 address -> verify graceful fallback page ("Not a Pons V2 Token") with return link.

---

## Scenario 13: Responsive Breakpoints & Mobile/Tablet Ergonomics
**Target Viewports:** 1920x1080 (Desktop), 1024x768 (Tablet), 375x812 (Mobile)

- [ ] **13.1 Desktop Viewport (1440p / 1080p):** Verify full 2-column split view and expanded `max-w-[1600px]` master-detail layouts render without horizontal clipping.
- [ ] **13.2 Tablet Viewport (768px–1024px):** Verify sidebars collapse into vertical stacking with touch-friendly targets.
- [ ] **13.3 Mobile Viewport (<640px):** Verify header collapses into hamburger/drawer, tables enable horizontal scroll, and buttons have minimum 44px tap targets.

---

## Scenario 14: Tosca Canvas Theme & WCAG AA Accessibility Compliance
**Target Standards:** WCAG AA Contrast, Reduced Motion, Keyboard Navigation

- [ ] **14.1 Contrast Ratio Verification:** Verify all text against Tosca Main (`#0D746E`) and Dark Slate (`#042F2E`) meets >4.5:1 contrast ratio.
- [ ] **14.2 Keyboard Navigation:** Tab through all interactive elements -> verify visible focus rings (`focus-visible:ring-2`).
- [ ] **14.3 Reduced Motion:** Enable `prefers-reduced-motion` in browser -> verify transitions and animations pause gracefully.

---

## Scenario 15: Security Guardrails, Rate Limiting & Input Sanitization
**Target Protection:** XSS, SQLi, Rate Limits, Schema Validation

- [ ] **15.1 XSS Sanitization:** Attempt submitting HTML / script tags in thesis or notes -> verify tags are sanitized.
- [ ] **15.2 Public API Rate Limiting:** Send 65 rapid requests to public API endpoints -> verify HTTP 429 Too Many Requests response.
- [ ] **15.3 Strict Schema Validation:** Attempt sending unexpected fields in POST body -> verify Zod strict schema rejection.
