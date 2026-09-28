# Graph Report - .  (2026-09-28)

## Corpus Check
- 264 files · ~189,287 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 841 nodes · 2305 edges · 36 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: imports: 657 · contains: 518 · MODIFIES: 426 · imports_from: 406 · ON_BRANCH: 115 · PARENT_OF: 113 · calls: 48 · inherits: 8 · references: 7 · method: 6 · re_exports: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 264 · Candidates: 358
- Excluded: 1 untracked · 44249 ignored · 1 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `42f1b99`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `db` - 29 edges
2. `getSession()` - 26 edges
3. `Database` - 22 edges
4. `CookieStoreLike` - 21 edges
5. `Header()` - 16 edges
6. `dossiers` - 15 edges
7. `IconArrowRight()` - 12 edges
8. `Dossier` - 10 edges
9. `TradeInspector()` - 8 edges
10. `RequestQueue` - 8 edges

## Surprising Connections (you probably didn't know these)
- `DELETE()` --calls--> `handleDeleteDossier()`  [EXTRACTED]
  app/api/publish/[ca]/route.ts → app/api/dossier/[ca]/route.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (46): DossierPageView(), 24fabc4 feat(scout): implement interactive wallet map svg component (TICKET-35), 36616f6 feat(scout): implement market and flow block component (TICKET-32), 3fbdf94 feat(scout): implement trade flow chart svg component (TICKET-33), 71bcf5c feat(scout): implement trade flow panel component (TICKET-34), 72063a3 feat(scout): assemble dossier page server component (TICKET-43), 82f8774 feat(scout): create dossier page static prototype (TICKET-30), 87705e2 feat(scout): implement constellation graph svg component (TICKET-38) (+38 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (26): AccountClient(), AccountClientProps, geistMono, geistSans, metadata, CensusView(), 17dcf97 feat(navigation): add top progress bar, route skeletons, library page & mobile responsive optimization (TICKET-86, TICKET-87, TICKET-88), 6aec8fe feat(ui): overhaul ui with chroma high-chroma colorful design system and fluid animations (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (42): createTransport(), getPublicClient(), publicClient, robinhoodChain, fetchCurveBuy(), fetchCurveSell(), fetchPoolGraduated(), fetchTokenLaunched() (+34 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (37): PageProps, addressSchema, DELETE(), DeleteWatchlistResponseBody, GET(), handleDeleteWatchlist(), handleGetDeployer(), DeployerLaunch (+29 more)

### Community 4 - "Community 4"
Cohesion: 0.10
Nodes (27): 162f5fb feat(scout): setup dynamic sitemap, robots crawler rules, and seo metadata (TICKET-84), 795ff3b feat(scout): setup score formula parameters and types (TICKET-03), e9816df test(scout): add unit tests for deployer score formula (TICKET-18), siteMetadata, BAND_GREEN_MIN, BAND_YELLOW_MIN, GRAD_DENOMINATOR_ADD, GRAD_NUMERATOR_ADD (+19 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (27): handlePutDossier(), PUT(), 07f29ab chore(scout): finalize scout dossiers ecosystem infrastructure and docs, 4a058d9 feat(scout): implement research panel component with debounced autosave (TICKET-39), f7850db feat(scout): implement scout remembers connected dossiers component (TICKET-41), DossierItemKind, ResearchPanel(), ResearchPanelProps (+19 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (30): 127516d feat(scout): implement api deployer connected dossiers graph (TICKET-56), 6cc1ac5 feat(scout): implement full-page connection map svg component (TICKET-57), 7588cce feat(scout): implement connection detection engine (TICKET-55), 8f33207 feat(scout): assemble connection map page (TICKET-58), addressSchema, GET(), handleGetDeployerConnected(), ConnectionLink (+22 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (30): 09d22b5 feat(scout): implement api get deployer profile endpoint (TICKET-24), 261544b feat(scout): implement api get library export endpoint (TICKET-28), 3b9584c feat(scout): implement api get deployer dossiers endpoint (TICKET-25), 439c457 feat(scout): implement api post library import endpoint (TICKET-27), 9d2b0cc feat(scout): implement api get library endpoint (TICKET-26), fc157fe feat(scout): implement api get dossier markdown export (TICKET-29), Dossier, DOSSIER_ITEM_KINDS (+22 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (26): addressSchema, contractAddressSchema, DELETE(), generateSlug(), GET(), handleDeleteDossier(), handleGetDossier(), handlePublishDossier() (+18 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (23): CensusViewProps, 684b980 feat: overhaul census page with 4-metric macro matrix, bespoke SVG histogram, ranked repeat launchers, and methodology architecture, 792164b feat: overhaul how methodology page into high craft architecture dossier manual, DocsClientProps, EndpointDoc, ENDPOINTS, GLOSSARY_DATA, GlossaryItem (+15 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (21): sessionOptions, 006e480 feat(scout): implement siwe logout endpoint (TICKET-14), 2354fd8 feat(scout): implement siwe nonce endpoint (TICKET-12), 73c8e8a feat(scout): implement siwe verify endpoint (TICKET-13), dc8d660 feat(scout): implement api post save copy dossier endpoint (TICKET-62), handleLogout(), POST(), handleNonce() (+13 more)

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (16): metadata, CensusPayload, computeCensusStats(), RepeatLauncherInfo, saveCensusSnapshot(), CronCensusResponseBody, GET(), GetCensusResponseBody (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.17
Nodes (20): 16a3b8b feat(scout): setup diff thresholds configuration and triggers (TICKET-04), 919d12f feat(scout): implement since last check diff component (TICKET-40), 92cedc3 test(scout): add unit tests for diff comparison (TICKET-20), 9f360e4 feat(scout): implement snapshot diff comparison logic (TICKET-19), DIFF_BOOLEAN_TRIGGERS, DIFF_CURVE_GRADUATED, DIFF_FEE_RECIPIENT_CHANGED, DIFF_FIELD_KEYS (+12 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (18): 05d0de3 feat(scout): implement public api rate limiting middleware (TICKET-82), 2d6e90d docs(scout): document third-party open source licenses and attributions (TICKET-83), a1128f0 feat(scout): define real archetype deployer example constants (TICKET-81), DEMO_DOSSIERS, DEMO_SLUGS, DemoDossier, DemoItem, DemoSnapshot (+10 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (19): 247006d feat(scout): create landing page and feed static prototypes (TICKET-46), 7b6f3f4 feat(scout): implement dexscreener price quote fetcher (TICKET-44), fbcf2dd feat(scout): implement snapshot system helper and pruning (TICKET-45), snapshots, isSnapshotIdentical(), pruneSnapshots(), saveSnapshot(), SaveSnapshotResult (+11 more)

### Community 15 - "Community 15"
Cohesion: 0.21
Nodes (17): main, 078bb6c feat(scout): implement api get dossier endpoint (TICKET-21), 0cd7581 feat(scout): create seed dummy data script and fixtures (TICKET-09), 238f483 feat(scout): assemble watchlist monitor page (TICKET-69), 2c0260b feat(scout): implement api get census stats endpoint (TICKET-71), 3f2b165 feat(scout): implement api delete watchlist endpoint (TICKET-68), 4258d74 feat(scout): implement api cron census aggregation endpoint (TICKET-72), 44759ab feat(scout): setup viem client for robinhood chain (TICKET-10) (+9 more)

### Community 16 - "Community 16"
Cohesion: 0.20
Nodes (12): metadata, 1ec916f feat(scout): implement synthetic demo dossier fixtures and routes (TICKET-80), 2f8f708 feat(scout): assemble technical documentation and api reference page (TICKET-79), 74ffacc feat(scout): assemble account settings page and delete account cascade (TICKET-77), d4fe349 feat(scout): assemble methodology and on-chain glossary page (TICKET-78), e12a92e feat(scout): assemble public dossier view page (TICKET-64), PublicDossierClient(), PublicDossierClientProps (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.19
Nodes (10): 052102a fix: lock steady container heights on trade and graduation tapes to eliminate hover layout shift, 06e5cce feat: replace symbols and emojis with custom SVG vector icons, fix marquee hover pause, and refine UI anti-slop, 1a8ede4 feat(feed): implement continuous marquee ticker and high density unique live launches terminal, f8e990e feat(scout): implement ticker tape marquee component (TICKET-48), GraduationTapeProps, DEFAULT_FALLBACK_ITEMS, TickerItemData, TickerTape() (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.16
Nodes (11): GraduationTape(), GraduationTapeItem, initialFeedItems, initialGraduations, initialTrades, watchedDeployers, TradeTape(), TradeTapeItem (+3 more)

### Community 19 - "Community 19"
Cohesion: 0.20
Nodes (14): 0ec1fbb feat: implement pure vector 3D stacked discs and skymoney protocol showcase banner, 22d2e90 feat(ui): redesign landing hero with 2-column layout and animated telemetry widget, harmonize tosca visuals, 2e3f0af fix(ui): eliminate focus-visible outline on text inputs and textareas, 588280e feat(design-system): overhaul to tosca canvas system and colorful pop accents, b55c1b8 feat(ui): elevate hero 3D gyroscope animations, replace banner image with forensic data terminal, clean AI slop, f224565 feat(landing): implement PRD thematic 3D cards and skymoney protocol showcase banner, IconCensus(), IconGraph() (+6 more)

### Community 20 - "Community 20"
Cohesion: 0.21
Nodes (6): QueueItem, QueueOptions, RequestPriority, RequestQueue, rpcQueue, 6d8ab15 feat(scout): setup 2-lane request queue (TICKET-11)

### Community 21 - "Community 21"
Cohesion: 0.21
Nodes (12): e9169fe feat(scout): implement centralized input sanitization and zod schema (TICKET-65), dossierItemsArraySchema, dossierItemStrictSchema, dossierPutStrictSchema, dossierQuestionsArraySchema, dossierQuestionStrictSchema, ethAddressSchema, importLibraryItemStrictSchema (+4 more)

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (9): 3b8f413 feat(scout): implement launch feed polling engine (TICKET-49), FeedPoller(), FeedPollerProps, FeedAction, FeedFilter, FeedLaunchItem, feedReducer(), FeedState (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.18
Nodes (6): UserProfileData, getSession(), users, metadata, deleteAccountSchema, updateHandleSchema

### Community 24 - "Community 24"
Cohesion: 0.27
Nodes (11): scout.census_stats, scout.deployer_launches, scout.deployer_scores, scout.deployer_watchlist, scout.dossier_items, scout.dossier_log, scout.dossier_questions, scout.dossiers (+3 more)

### Community 25 - "Community 25"
Cohesion: 0.25
Nodes (9): 31392cc feat(scout): implement trade inspector drawer component (TICKET-52), b4b770e feat(scout): implement 4-tab filter feed table component (TICKET-51), FeedTable(), FeedTableProps, FeedTableRowData, FeedTableTab, filterFeedItems(), IconClose() (+1 more)

### Community 26 - "Community 26"
Cohesion: 0.33
Nodes (8): formatCurrency(), formatPrice(), InspectorToken, renderSparklineSvg(), TradeInspector(), TradeInspectorProps, TradeItem, truncateAddress()

### Community 27 - "Community 27"
Cohesion: 0.28
Nodes (6): main, ccae023 Initial commit from Create Next App, ccae023 Initial commit from Create Next App, eslintConfig, nextConfig, config

### Community 28 - "Community 28"
Cohesion: 0.25
Nodes (5): 1252f8e fix(db): isolate scout schema, add rollback script, update vercel cron and env example, 79b63db chore(scout): install and verify core dependencies (TICKET-05), b736ccb feat(scout): generate initial drizzle migrations (TICKET-08), cbb07ba feat(scout): setup drizzle schema definitions (TICKET-06), cc33127 feat(scout): setup drizzle client and configuration (TICKET-07)

### Community 29 - "Community 29"
Cohesion: 0.28
Nodes (8): GET(), GetWatchlistResponseBody, handleGetWatchlist(), handlePostWatchlist(), POST(), PostWatchlistResponseBody, postWatchlistSchema, WatchlistEntryResult

### Community 30 - "Community 30"
Cohesion: 0.25
Nodes (4): 12c695d feat(scout): verify production database migration dry-run (TICKET-M02), 53e773f feat(scout): configure vercel cron for automated census trigger (TICKET-M05), 8dad13e feat(scout): configure production build settings and smoke verification (TICKET-M03), ede840a test(scout): execute production smoke test and latency verification (TICKET-M04)

### Community 31 - "Community 31"
Cohesion: 0.25
Nodes (5): 21c5bb2 feat: expand technical documentation with interactive rest api explorer and smart contract registry, 407b913 feat(scout): setup tailwind v4 tokens and theme configuration (TICKET-01), 42f1b99 fix(ui): refine anti-slop honest demo states and token consistency, DocsClient(), metadata

### Community 32 - "Community 32"
Cohesion: 0.36
Nodes (6): 4df7cfa feat(scout): implement feed summary metric tiles component (TICKET-50), FeedStatsData, FeedTiles(), FeedTilesProps, IconDiamond(), IconUsers()

### Community 33 - "Community 33"
Cohesion: 0.29
Nodes (4): 3cdeeea feat(scout): conduct wcag aa accessibility audit and keyboard focus styling (TICKET-85), 4892043 docs(scout): create testnet manual testing scenarios guide (TICKET-T01), 4cbf7b6 test(scout): execute testnet manual verification suite (TICKET-T03), fe4f37a docs(scout): document e2e testing strategy and qa protocol decision (TICKET-T02)

### Community 34 - "Community 34"
Cohesion: 0.47
Nodes (4): 49106f2 feat(scout): implement publish dialog modal component (TICKET-63), PublishDialog(), PublishDialogProps, IconRocket()

### Community 35 - "Community 35"
Cohesion: 0.50
Nodes (2): 5b836fa feat(scout): assemble deployer reputation profile page (TICKET-76), d92eda6 feat(scout): assemble dossiers library management page (TICKET-75)

## Knowledge Gaps
- **152 isolated node(s):** `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody`, `addressSchema`, `addressSchema` (+147 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 35`** (2 nodes): `5b836fa feat(scout): assemble deployer reputation profile page (TICKET-76)`, `d92eda6 feat(scout): assemble dossiers library management page (TICKET-75)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `db` connect `Community 11` to `Community 3`, `Community 8`, `Community 6`, `Community 14`, `Community 0`, `Community 7`, `Community 1`, `Community 23`, `Community 10`, `Community 16`, `Community 29`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `getSession()` connect `Community 23` to `Community 3`, `Community 11`, `Community 10`, `Community 8`, `Community 6`, `Community 31`, `Community 7`, `Community 9`, `Community 1`, `Community 29`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody` to the rest of the system?**
  _152 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05955734406438632 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0784313725490196 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07982583454281568 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.05919661733615222 - nodes in this community are weakly interconnected._