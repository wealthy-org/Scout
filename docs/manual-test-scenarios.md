# Scout Dossier.OS — End-to-End Manual Testing Scenarios (Testnet & Staging)

This document provides structured manual testing procedures and acceptance checklists for verifying Scout across Testnet, Anvil Fork, and Staging environments prior to mainnet production deployment.

---

## Scenario 01: Sign-In with Ethereum (SIWE) Authentication Flow

- [ ] **1.1 Unauthenticated Landing State:** Access `/` and verify header displays "Connect Wallet" button.
- [ ] **1.2 Nonce Generation:** Click "Connect Wallet" -> confirm client requests `POST /api/auth/nonce` and receives randomized nonce string.
- [ ] **1.3 Signature Verification:** Sign EIP-4361 message in MetaMask / Rabby -> confirm `POST /api/auth/verify` validates signature and sets `scout_session` cookie.
- [ ] **1.4 Authenticated State Display:** Verify header transforms to display truncated wallet address (`0x...`) and Logout button.
- [ ] **1.5 Logout Action:** Click Logout -> confirm `POST /api/auth/logout` clears session and page resets cleanly without errors.

---

## Scenario 02: Token Case File Investigation & Auto-Save

- [ ] **2.1 Token Search & Routing:** Type valid contract address (`0x...`) into header search or landing input -> navigate to `/d/[ca]`.
- [ ] **2.2 Metric Hydration:** Verify Market Cap, 24h Volume, Trade Count, and Bonding Curve Progress populate with no NaN values.
- [ ] **2.3 Trade Flow & Candle Chart:** Inspect Trade Flow SVG candles and buy/sell pressure distribution bars.
- [ ] **2.4 Interactive Wallet Map:** Hover over bubble nodes to view wallet address tooltips; drag bubbles to confirm pointer events.
- [ ] **2.5 Research Panel Editing & Debounced Auto-Save:**
  - Type thesis narrative into Thesis textarea.
  - Change Decision dropdown to `In position`.
  - Add For/Against evidence checkpoint items.
  - Confirm debounced `PUT /api/dossier/:ca` fires after 250ms and saves data to database without page reload.
- [ ] **2.6 Since Last Check Trigger:** Refresh the dossier -> verify Since Last Check panel evaluates metric deltas against prior snapshot.

---

## Scenario 03: Public Case File Snapshot Publishing & Forking

- [ ] **3.1 Open Publish Modal:** Click "Publish" button in dossier header -> confirm PublishDialog opens.
- [ ] **3.2 Snapshot Generation:** Fill researcher handle and toggle note visibility -> click "Confirm & Publish".
- [ ] **3.3 Public Route Verification:** Copy generated public URL (`/p/[slug]`) and open in incognito window:
  - Verify full dossier renders read-only.
  - Verify author attribution badge displays configured handle.
- [ ] **3.4 Save a Copy (Fork) Flow:** Log into secondary wallet in incognito window -> click "Save a Copy" -> confirm copy is merged into secondary user's `/dossiers` library with attribution intact.
- [ ] **3.5 Revocation Verification:** From original author wallet, invoke revocation -> reload public URL in incognito window -> confirm HTTP 410 Gone / Revoked state is rendered.

---

## Scenario 04: Deployer Reputation Profile & Watchlist Monitoring

- [ ] **4.1 Deployer Profile Page:** Click deployer address link -> navigate to `/deployer/[address]`.
- [ ] **4.2 Reputation Breakdown:** Verify 0–100 score, 10-bar visual SVG gauge, and 5 core signals (`grad_rate`, `doa_rate`, `burst_rate`, `total_launches`, `graduated_count`).
- [ ] **4.3 Why This Score Accordion:** Expand "Why this score?" accordion to review algorithmic explanation.
- [ ] **4.4 Add to Watchlist Action:** Click "+ Add to Watchlist" -> confirm `POST /api/watchlist` succeeds and button toggles to "✓ In Watchlist".
- [ ] **4.5 Watchlist Management View:** Navigate to `/watchlist`:
  - Verify tracked deployer card displays reputation band, total launches, and new genesis launch indicator.
  - Click "Remove" -> confirm deployer is deleted from watchlist immediately.
- [ ] **4.6 Quota Limit Check:** Attempt adding 31st deployer -> confirm HTTP 422 Unprocessable Entity quota limit error message.

---

## Scenario 05: Real-Time Launch Feed & Ticker Tape

- [ ] **5.1 Feed Poller Activity:** Navigate to `/feed` -> verify ticker tape scrolls continuously.
- [ ] **5.2 Tab Visibility Pausing:** Switch browser tabs for 15 seconds -> return to tab -> confirm poller gracefully resumes without duplicate genesis events.
- [ ] **5.3 Filter Tabs:** Toggle between "Most Traded", "New Launches", "Near Graduation", and "Repeat Deployers".
- [ ] **5.4 Trade Inspector Drawer:** Click any token row in feed table -> confirm trade inspector slide-in drawer displays recent transactions.

---

## Scenario 06: Macro Census & Methodology Education

- [ ] **6.1 Census Analytics:** Navigate to `/census` -> verify macro bar charts, repeat launcher share, and top 20 creators table populate cleanly.
- [ ] **6.2 Methodology Exploration:** Navigate to `/how` -> verify 4-step workflow, Since Last Check delta thresholds, and on-chain glossary definitions.
- [ ] **6.3 Technical Documentation:** Navigate to `/docs` -> verify mathematical formula specifications, REST API samples, and rate limit tables.

---

## Scenario 07: Library Bulk Export, Markdown Export & JSON Import

- [ ] **7.1 Single Dossier Markdown Export:** In case file header, click "Export MD" -> confirm `.md` file downloads with complete YAML frontmatter.
- [ ] **7.2 Library Bulk Export:** In `/dossiers`, click "Export All" -> confirm JSON file containing all user case files downloads.
- [ ] **7.3 Library Import Restoration:** Click "+ Import" -> upload exported JSON -> confirm `POST /api/library/import` parses and merges dossiers cleanly without duplicates.

---

## Scenario 08: Account Settings & Cascade Deletion

- [ ] **8.1 Handle Update:** Navigate to `/me` -> update handle to valid alphanumeric string -> click "Save Handle" -> confirm update.
- [ ] **8.2 Cascade Account Purge:** Click "Delete Account" -> type exact wallet address -> confirm deletion -> verify session is destroyed and all user dossiers/watchlist items are wiped from database.
