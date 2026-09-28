# Graph Report - .  (2026-09-28)

## Corpus Check
- 265 files · ~191,628 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 845 nodes · 2328 edges · 46 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: imports: 668 · contains: 520 · MODIFIES: 429 · imports_from: 411 · ON_BRANCH: 116 · PARENT_OF: 114 · calls: 48 · inherits: 8 · references: 7 · method: 6 · re_exports: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 265 · Candidates: 359
- Excluded: 0 untracked · 44252 ignored · 1 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `c9a3b60`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `db` - 29 edges
2. `getSession()` - 26 edges
3. `Database` - 22 edges
4. `CookieStoreLike` - 21 edges
5. `Header()` - 16 edges
6. `dossiers` - 15 edges
7. `IconArrowRight()` - 13 edges
8. `Dossier` - 10 edges
9. `TradeInspector()` - 8 edges
10. `RequestQueue` - 8 edges

## Surprising Connections (you probably didn't know these)
- `DELETE()` --calls--> `handleDeleteDossier()`  [EXTRACTED]
  app/api/publish/[ca]/route.ts → app/api/dossier/[ca]/route.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (23): AccountClient(), AccountClientProps, geistMono, geistSans, metadata, CensusView(), 17dcf97 feat(navigation): add top progress bar, route skeletons, library page & mobile responsive optimization (TICKET-86, TICKET-87, TICKET-88), 6aec8fe feat(ui): overhaul ui with chroma high-chroma colorful design system and fluid animations (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (46): createTransport(), getPublicClient(), publicClient, robinhoodChain, fetchCurveBuy(), fetchCurveSell(), fetchPoolGraduated(), fetchTokenLaunched() (+38 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (30): PageProps, 162f5fb feat(scout): setup dynamic sitemap, robots crawler rules, and seo metadata (TICKET-84), 795ff3b feat(scout): setup score formula parameters and types (TICKET-03), e9816df test(scout): add unit tests for deployer score formula (TICKET-18), siteMetadata, BAND_GREEN_MIN, BAND_YELLOW_MIN, GRAD_DENOMINATOR_ADD (+22 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (33): 127516d feat(scout): implement api deployer connected dossiers graph (TICKET-56), 6cc1ac5 feat(scout): implement full-page connection map svg component (TICKET-57), 7588cce feat(scout): implement connection detection engine (TICKET-55), 8f33207 feat(scout): assemble connection map page (TICKET-58), c9a3b60 fix(map): convert to server component with auth gate to prevent 401 on unauthenticated load, addressSchema, GET(), handleGetDeployerConnected() (+25 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (25): metadata, CensusPayload, computeCensusStats(), RepeatLauncherInfo, saveCensusSnapshot(), CronCensusResponseBody, GET(), GetCensusResponseBody (+17 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (28): 261544b feat(scout): implement api get library export endpoint (TICKET-28), 3b9584c feat(scout): implement api get deployer dossiers endpoint (TICKET-25), 439c457 feat(scout): implement api post library import endpoint (TICKET-27), 9d2b0cc feat(scout): implement api get library endpoint (TICKET-26), fc157fe feat(scout): implement api get dossier markdown export (TICKET-29), Dossier, DOSSIER_ITEM_KINDS, DOSSIER_STATUSES (+20 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (23): addressSchema, contractAddressSchema, DELETE(), generateSlug(), handleDeleteDossier(), handlePublishDossier(), handlePutDossier(), handleRevokePublish() (+15 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (21): sessionOptions, 006e480 feat(scout): implement siwe logout endpoint (TICKET-14), 2354fd8 feat(scout): implement siwe nonce endpoint (TICKET-12), 73c8e8a feat(scout): implement siwe verify endpoint (TICKET-13), dc8d660 feat(scout): implement api post save copy dossier endpoint (TICKET-62), handleLogout(), POST(), handleNonce() (+13 more)

### Community 8 - "Community 8"
Cohesion: 0.17
Nodes (20): 16a3b8b feat(scout): setup diff thresholds configuration and triggers (TICKET-04), 919d12f feat(scout): implement since last check diff component (TICKET-40), 92cedc3 test(scout): add unit tests for diff comparison (TICKET-20), 9f360e4 feat(scout): implement snapshot diff comparison logic (TICKET-19), DIFF_BOOLEAN_TRIGGERS, DIFF_CURVE_GRADUATED, DIFF_FEE_RECIPIENT_CHANGED, DIFF_FIELD_KEYS (+12 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (19): GET(), handleGetDossier(), deployerScores, deployerWatchlist, dossierLog, publishedDossiers, Snapshot, mockData (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (19): 247006d feat(scout): create landing page and feed static prototypes (TICKET-46), 7b6f3f4 feat(scout): implement dexscreener price quote fetcher (TICKET-44), fbcf2dd feat(scout): implement snapshot system helper and pruning (TICKET-45), snapshots, isSnapshotIdentical(), pruneSnapshots(), saveSnapshot(), SaveSnapshotResult (+11 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (15): 052102a fix: lock steady container heights on trade and graduation tapes to eliminate hover layout shift, 06e5cce feat: replace symbols and emojis with custom SVG vector icons, fix marquee hover pause, and refine UI anti-slop, 1a8ede4 feat(feed): implement continuous marquee ticker and high density unique live launches terminal, GraduationTape(), GraduationTapeItem, GraduationTapeProps, initialFeedItems, initialGraduations (+7 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (16): CensusViewProps, FeedTable(), FeedTableProps, FeedTableRowData, FeedTableTab, filterFeedItems(), IconAlert(), IconArrowRight() (+8 more)

### Community 13 - "Community 13"
Cohesion: 0.09
Nodes (22): deployerWatchlistRelations, dossierItemsRelations, dossierLogRelations, dossierQuestionsRelations, dossiersRelations, NewCensusStats, NewDeployerLaunch, NewDeployerScore (+14 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (15): f7850db feat(scout): implement scout remembers connected dossiers component (TICKET-41), DossierItemKind, ScoutRemembers(), ScoutRemembersProps, ConnectedDossierSummary, DossierData, DossierItemData, DossierLogData (+7 more)

### Community 15 - "Community 15"
Cohesion: 0.13
Nodes (9): 1252f8e fix(db): isolate scout schema, add rollback script, update vercel cron and env example, 12c695d feat(scout): verify production database migration dry-run (TICKET-M02), 53e773f feat(scout): configure vercel cron for automated census trigger (TICKET-M05), 79b63db chore(scout): install and verify core dependencies (TICKET-05), 8dad13e feat(scout): configure production build settings and smoke verification (TICKET-M03), b736ccb feat(scout): generate initial drizzle migrations (TICKET-08), cbb07ba feat(scout): setup drizzle schema definitions (TICKET-06), cc33127 feat(scout): setup drizzle client and configuration (TICKET-07) (+1 more)

### Community 16 - "Community 16"
Cohesion: 0.20
Nodes (14): 0ec1fbb feat: implement pure vector 3D stacked discs and skymoney protocol showcase banner, 22d2e90 feat(ui): redesign landing hero with 2-column layout and animated telemetry widget, harmonize tosca visuals, 2e3f0af fix(ui): eliminate focus-visible outline on text inputs and textareas, 588280e feat(design-system): overhaul to tosca canvas system and colorful pop accents, b55c1b8 feat(ui): elevate hero 3D gyroscope animations, replace banner image with forensic data terminal, clean AI slop, f224565 feat(landing): implement PRD thematic 3D cards and skymoney protocol showcase banner, IconCensus(), IconGraph() (+6 more)

### Community 17 - "Community 17"
Cohesion: 0.24
Nodes (9): 36616f6 feat(scout): implement market and flow block component (TICKET-32), 82f8774 feat(scout): create dossier page static prototype (TICKET-30), a5a987e feat(scout): implement dossier header component (TICKET-31), DossierHeader(), DossierHeaderProps, formatCurrency(), formatNumber(), MarketFlowBlock() (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.24
Nodes (14): main, 0cd7581 feat(scout): create seed dummy data script and fixtures (TICKET-09), 1ec916f feat(scout): implement synthetic demo dossier fixtures and routes (TICKET-80), 238f483 feat(scout): assemble watchlist monitor page (TICKET-69), 2f8f708 feat(scout): assemble technical documentation and api reference page (TICKET-79), 3f2b165 feat(scout): implement api delete watchlist endpoint (TICKET-68), 44759ab feat(scout): setup viem client for robinhood chain (TICKET-10), 4b3f020 feat(scout): implement api get watchlist endpoint (TICKET-66) (+6 more)

### Community 19 - "Community 19"
Cohesion: 0.27
Nodes (9): DossierPageView(), 72063a3 feat(scout): assemble dossier page server component (TICKET-43), f05e3e2 feat(scout): implement connections and timeline component (TICKET-42), ConnectionItem, ConnectionsTimeline(), ConnectionsTimelineProps, TimelineLogItem, DossierPagePropsData (+1 more)

### Community 20 - "Community 20"
Cohesion: 0.21
Nodes (6): QueueItem, QueueOptions, RequestPriority, RequestQueue, rpcQueue, 6d8ab15 feat(scout): setup 2-lane request queue (TICKET-11)

### Community 21 - "Community 21"
Cohesion: 0.21
Nodes (12): e9169fe feat(scout): implement centralized input sanitization and zod schema (TICKET-65), dossierItemsArraySchema, dossierItemStrictSchema, dossierPutStrictSchema, dossierQuestionsArraySchema, dossierQuestionStrictSchema, ethAddressSchema, importLibraryItemStrictSchema (+4 more)

### Community 22 - "Community 22"
Cohesion: 0.26
Nodes (6): metadata, d92eda6 feat(scout): assemble dossiers library management page (TICKET-75), LibraryClient(), LibraryClientProps, LibraryDossierCard, metadata

### Community 23 - "Community 23"
Cohesion: 0.27
Nodes (10): 31392cc feat(scout): implement trade inspector drawer component (TICKET-52), b4b770e feat(scout): implement 4-tab filter feed table component (TICKET-51), formatCurrency(), formatPrice(), InspectorToken, renderSparklineSvg(), TradeInspector(), TradeInspectorProps (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (9): 3b8f413 feat(scout): implement launch feed polling engine (TICKET-49), FeedPoller(), FeedPollerProps, FeedAction, FeedFilter, FeedLaunchItem, feedReducer(), FeedState (+1 more)

### Community 25 - "Community 25"
Cohesion: 0.18
Nodes (6): UserProfileData, getSession(), users, metadata, deleteAccountSchema, updateHandleSchema

### Community 26 - "Community 26"
Cohesion: 0.24
Nodes (7): 05d0de3 feat(scout): implement public api rate limiting middleware (TICKET-82), 2d6e90d docs(scout): document third-party open source licenses and attributions (TICKET-83), config, checkRateLimit(), RateLimitRecord, resetRateLimitStore(), store

### Community 27 - "Community 27"
Cohesion: 0.27
Nodes (11): scout.census_stats, scout.deployer_launches, scout.deployer_scores, scout.deployer_watchlist, scout.dossier_items, scout.dossier_log, scout.dossier_questions, scout.dossiers (+3 more)

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (7): main, 407b913 feat(scout): setup tailwind v4 tokens and theme configuration (TICKET-01), ccae023 Initial commit from Create Next App, ccae023 Initial commit from Create Next App, eslintConfig, nextConfig, config

### Community 29 - "Community 29"
Cohesion: 0.24
Nodes (8): 21c5bb2 feat: expand technical documentation with interactive rest api explorer and smart contract registry, 42f1b99 fix(ui): refine anti-slop honest demo states and token consistency, DocsClient(), DocsClientProps, EndpointDoc, ENDPOINTS, metadata, IconArrowLeft()

### Community 30 - "Community 30"
Cohesion: 0.22
Nodes (8): 684b980 feat: overhaul census page with 4-metric macro matrix, bespoke SVG histogram, ranked repeat launchers, and methodology architecture, 792164b feat: overhaul how methodology page into high craft architecture dossier manual, GLOSSARY_DATA, GlossaryItem, HowClient(), HowClientProps, metadata, IconLock()

### Community 31 - "Community 31"
Cohesion: 0.31
Nodes (7): 87705e2 feat(scout): implement constellation graph svg component (TICKET-38), ConnectionType, ConstellationEdge, ConstellationGraph(), ConstellationGraphProps, ConstellationNode, InternalConstellationNode

### Community 32 - "Community 32"
Cohesion: 0.27
Nodes (6): e12a92e feat(scout): assemble public dossier view page (TICKET-64), PublicDossierClient(), PublicDossierClientProps, PublicDossierPayload, generateMetadata(), PageProps

### Community 33 - "Community 33"
Cohesion: 0.29
Nodes (7): f8e990e feat(scout): implement ticker tape marquee component (TICKET-48), DEFAULT_FALLBACK_ITEMS, TickerItemData, TickerTape(), TickerTapeProps, IconFlame(), IconShield()

### Community 34 - "Community 34"
Cohesion: 0.28
Nodes (8): addressSchema, DELETE(), DeleteWatchlistResponseBody, GET(), handleDeleteWatchlist(), handleGetDeployer(), DeployerLaunch, DeployerScore

### Community 35 - "Community 35"
Cohesion: 0.31
Nodes (7): 4df7cfa feat(scout): implement feed summary metric tiles component (TICKET-50), FeedStatsData, FeedTiles(), FeedTilesProps, IconDiamond(), IconGraduation(), IconUsers()

### Community 36 - "Community 36"
Cohesion: 0.31
Nodes (7): DEMO_DOSSIERS, DEMO_SLUGS, DemoDossier, DemoItem, DemoSnapshot, getDemoDossier(), DossierStatus

### Community 37 - "Community 37"
Cohesion: 0.39
Nodes (5): 24fabc4 feat(scout): implement interactive wallet map svg component (TICKET-35), InternalBubble, WalletBubbleItem, WalletMap(), WalletMapProps

### Community 38 - "Community 38"
Cohesion: 0.29
Nodes (4): 3cdeeea feat(scout): conduct wcag aa accessibility audit and keyboard focus styling (TICKET-85), 4892043 docs(scout): create testnet manual testing scenarios guide (TICKET-T01), 4cbf7b6 test(scout): execute testnet manual verification suite (TICKET-T03), fe4f37a docs(scout): document e2e testing strategy and qa protocol decision (TICKET-T02)

### Community 39 - "Community 39"
Cohesion: 0.38
Nodes (5): 4a058d9 feat(scout): implement research panel component with debounced autosave (TICKET-39), ResearchPanel(), ResearchPanelProps, PutDossierItemInput, PutDossierQuestionInput

### Community 40 - "Community 40"
Cohesion: 0.53
Nodes (4): 3fbdf94 feat(scout): implement trade flow chart svg component (TICKET-33), TradeCandleData, TradeFlowChart(), TradeFlowChartProps

### Community 41 - "Community 41"
Cohesion: 0.47
Nodes (4): 49106f2 feat(scout): implement publish dialog modal component (TICKET-63), PublishDialog(), PublishDialogProps, IconRocket()

### Community 42 - "Community 42"
Cohesion: 0.53
Nodes (4): 71bcf5c feat(scout): implement trade flow panel component (TICKET-34), TradeFlowData, TradeFlowPanel(), TradeFlowPanelProps

### Community 43 - "Community 43"
Cohesion: 0.60
Nodes (4): a1128f0 feat(scout): define real archetype deployer example constants (TICKET-81), EXAMPLE_DEPLOYERS, ExampleDeployer, getExampleDeployerByArchetype()

### Community 44 - "Community 44"
Cohesion: 0.53
Nodes (4): ddea6df feat(scout): implement top wallets table component (TICKET-36), TopWalletRow, TopWalletsTable(), TopWalletsTableProps

### Community 45 - "Community 45"
Cohesion: 0.53
Nodes (4): fa969bc feat(scout): implement deployer history timeline component (TICKET-37), DeployerHistory(), DeployerHistoryProps, DeployerLaunchItem

## Knowledge Gaps
- **153 isolated node(s):** `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody`, `addressSchema`, `addressSchema` (+148 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `db` connect `Community 4` to `Community 2`, `Community 34`, `Community 6`, `Community 3`, `Community 10`, `Community 19`, `Community 5`, `Community 22`, `Community 25`, `Community 7`, `Community 9`, `Community 32`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `getSession()` connect `Community 25` to `Community 2`, `Community 34`, `Community 4`, `Community 7`, `Community 6`, `Community 3`, `Community 29`, `Community 5`, `Community 30`, `Community 22`, `Community 9`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody` to the rest of the system?**
  _153 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08672659968270756 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06398730830248546 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08502415458937199 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.08748615725359911 - nodes in this community are weakly interconnected._