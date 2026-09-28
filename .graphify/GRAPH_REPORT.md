# Graph Report - .  (2026-09-28)

## Corpus Check
- 276 files · ~196,153 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 880 nodes · 2496 edges · 45 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: imports: 742 · contains: 544 · MODIFIES: 457 · imports_from: 448 · ON_BRANCH: 118 · PARENT_OF: 116 · calls: 49 · inherits: 8 · references: 7 · method: 6 · re_exports: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 276 · Candidates: 370
- Excluded: 0 untracked · 44274 ignored · 1 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `b05f2f9`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `db` - 31 edges
2. `getSession()` - 27 edges
3. `Database` - 22 edges
4. `CookieStoreLike` - 21 edges
5. `dossiers` - 17 edges
6. `Header()` - 16 edges
7. `IconArrowRight()` - 13 edges
8. `Dossier` - 11 edges
9. `deployerScores` - 10 edges
10. `deployerLaunches` - 9 edges

## Surprising Connections (you probably didn't know these)
- `DELETE()` --calls--> `handleDeleteDossier()`  [EXTRACTED]
  app/api/publish/[ca]/route.ts → app/api/dossier/[ca]/route.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (45): AccountClient(), geistMono, geistSans, metadata, checkWalletAvailability(), getEthereumProvider(), logoutWallet(), signInWithWallet() (+37 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (44): PageProps, addressSchema, DELETE(), DeleteWatchlistResponseBody, GET(), handleDeleteWatchlist(), handleGetDeployer(), 05d0de3 feat(scout): implement public api rate limiting middleware (TICKET-82) (+36 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (46): GET(), createTransport(), getPublicClient(), publicClient, robinhoodChain, fetchCurveBuy(), fetchCurveSell(), fetchPoolGraduated() (+38 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (33): 127516d feat(scout): implement api deployer connected dossiers graph (TICKET-56), 6cc1ac5 feat(scout): implement full-page connection map svg component (TICKET-57), 7588cce feat(scout): implement connection detection engine (TICKET-55), 8f33207 feat(scout): assemble connection map page (TICKET-58), c9a3b60 fix(map): convert to server component with auth gate to prevent 401 on unauthenticated load, addressSchema, GET(), handleGetDeployerConnected() (+25 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (32): 261544b feat(scout): implement api get library export endpoint (TICKET-28), 3b9584c feat(scout): implement api get deployer dossiers endpoint (TICKET-25), 439c457 feat(scout): implement api post library import endpoint (TICKET-27), 9d2b0cc feat(scout): implement api get library endpoint (TICKET-26), fc157fe feat(scout): implement api get dossier markdown export (TICKET-29), DeployerLaunch, DeployerScore, Dossier (+24 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (26): deployerScores, deployerWatchlist, deployerWatchlistRelations, dossierItemsRelations, dossierLogRelations, dossierQuestionsRelations, dossiersRelations, NewCensusStats (+18 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (21): sessionOptions, 006e480 feat(scout): implement siwe logout endpoint (TICKET-14), 2354fd8 feat(scout): implement siwe nonce endpoint (TICKET-12), 73c8e8a feat(scout): implement siwe verify endpoint (TICKET-13), dc8d660 feat(scout): implement api post save copy dossier endpoint (TICKET-62), handleLogout(), POST(), handleNonce() (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (16): metadata, CensusPayload, computeCensusStats(), RepeatLauncherInfo, saveCensusSnapshot(), CronCensusResponseBody, GET(), GetCensusResponseBody (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.17
Nodes (20): 16a3b8b feat(scout): setup diff thresholds configuration and triggers (TICKET-04), 919d12f feat(scout): implement since last check diff component (TICKET-40), 92cedc3 test(scout): add unit tests for diff comparison (TICKET-20), 9f360e4 feat(scout): implement snapshot diff comparison logic (TICKET-19), DIFF_BOOLEAN_TRIGGERS, DIFF_CURVE_GRADUATED, DIFF_FEE_RECIPIENT_CHANGED, DIFF_FIELD_KEYS (+12 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (20): addressSchema, contractAddressSchema, DELETE(), generateSlug(), handleDeleteDossier(), handlePublishDossier(), handlePutDossier(), handleRevokePublish() (+12 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (18): CensusViewProps, 684b980 feat: overhaul census page with 4-metric macro matrix, bespoke SVG histogram, ranked repeat launchers, and methodology architecture, 792164b feat: overhaul how methodology page into high craft architecture dossier manual, GLOSSARY_DATA, GlossaryItem, HowClient(), HowClientProps, metadata (+10 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (18): 247006d feat(scout): create landing page and feed static prototypes (TICKET-46), 7b6f3f4 feat(scout): implement dexscreener price quote fetcher (TICKET-44), fbcf2dd feat(scout): implement snapshot system helper and pruning (TICKET-45), isSnapshotIdentical(), pruneSnapshots(), saveSnapshot(), SaveSnapshotResult, SnapshotDataInput (+10 more)

### Community 12 - "Community 12"
Cohesion: 0.15
Nodes (13): 052102a fix: lock steady container heights on trade and graduation tapes to eliminate hover layout shift, 06e5cce feat: replace symbols and emojis with custom SVG vector icons, fix marquee hover pause, and refine UI anti-slop, 1a8ede4 feat(feed): implement continuous marquee ticker and high density unique live launches terminal, deployerLaunches, GraduationTape(), GraduationTapeItem, GraduationTapeProps, GET() (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.21
Nodes (13): ddea6df feat(scout): implement top wallets table component (TICKET-36), fa969bc feat(scout): implement deployer history timeline component (TICKET-37), DossierStatus, DeployerHistory(), DeployerHistoryProps, DeployerLaunchItem, fetchDossierPageData(), TopWalletRow (+5 more)

### Community 14 - "Community 14"
Cohesion: 0.19
Nodes (13): AccountClientProps, metadata, 1ec916f feat(scout): implement synthetic demo dossier fixtures and routes (TICKET-80), 2f8f708 feat(scout): assemble technical documentation and api reference page (TICKET-79), 5b836fa feat(scout): assemble deployer reputation profile page (TICKET-76), 74ffacc feat(scout): assemble account settings page and delete account cascade (TICKET-77), d4fe349 feat(scout): assemble methodology and on-chain glossary page (TICKET-78), e12a92e feat(scout): assemble public dossier view page (TICKET-64) (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.18
Nodes (15): 0ec1fbb feat: implement pure vector 3D stacked discs and skymoney protocol showcase banner, 22d2e90 feat(ui): redesign landing hero with 2-column layout and animated telemetry widget, harmonize tosca visuals, 2e3f0af fix(ui): eliminate focus-visible outline on text inputs and textareas, 588280e feat(design-system): overhaul to tosca canvas system and colorful pop accents, b55c1b8 feat(ui): elevate hero 3D gyroscope animations, replace banner image with forensic data terminal, clean AI slop, f224565 feat(landing): implement PRD thematic 3D cards and skymoney protocol showcase banner, IconBolt(), IconCensus() (+7 more)

### Community 16 - "Community 16"
Cohesion: 0.13
Nodes (9): 1252f8e fix(db): isolate scout schema, add rollback script, update vercel cron and env example, 12c695d feat(scout): verify production database migration dry-run (TICKET-M02), 53e773f feat(scout): configure vercel cron for automated census trigger (TICKET-M05), 79b63db chore(scout): install and verify core dependencies (TICKET-05), 8dad13e feat(scout): configure production build settings and smoke verification (TICKET-M03), b736ccb feat(scout): generate initial drizzle migrations (TICKET-08), cbb07ba feat(scout): setup drizzle schema definitions (TICKET-06), cc33127 feat(scout): setup drizzle client and configuration (TICKET-07) (+1 more)

### Community 17 - "Community 17"
Cohesion: 0.15
Nodes (14): f7850db feat(scout): implement scout remembers connected dossiers component (TICKET-41), DossierItemKind, ScoutRemembers(), ScoutRemembersProps, ConnectedDossierSummary, DossierItemData, DossierLogData, DossierQuestionData (+6 more)

### Community 18 - "Community 18"
Cohesion: 0.21
Nodes (15): main, 0cd7581 feat(scout): create seed dummy data script and fixtures (TICKET-09), 238f483 feat(scout): assemble watchlist monitor page (TICKET-69), 2c0260b feat(scout): implement api get census stats endpoint (TICKET-71), 3f2b165 feat(scout): implement api delete watchlist endpoint (TICKET-68), 4258d74 feat(scout): implement api cron census aggregation endpoint (TICKET-72), 44759ab feat(scout): setup viem client for robinhood chain (TICKET-10), 4b3f020 feat(scout): implement api get watchlist endpoint (TICKET-66) (+7 more)

### Community 19 - "Community 19"
Cohesion: 0.17
Nodes (11): GET(), handleGetDossier(), 32f2dc6 feat(scout): implement api post publish dossier endpoint (TICKET-59), c9f59e2 feat(scout): implement api get public dossier endpoint (TICKET-61), d0dc453 feat(scout): implement api delete publish revoke endpoint (TICKET-60), publishedDossiers, mockData, GET() (+3 more)

### Community 20 - "Community 20"
Cohesion: 0.21
Nodes (6): QueueItem, QueueOptions, RequestPriority, RequestQueue, rpcQueue, 6d8ab15 feat(scout): setup 2-lane request queue (TICKET-11)

### Community 21 - "Community 21"
Cohesion: 0.21
Nodes (12): e9169fe feat(scout): implement centralized input sanitization and zod schema (TICKET-65), dossierItemsArraySchema, dossierItemStrictSchema, dossierPutStrictSchema, dossierQuestionsArraySchema, dossierQuestionStrictSchema, ethAddressSchema, importLibraryItemStrictSchema (+4 more)

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (8): 36616f6 feat(scout): implement market and flow block component (TICKET-32), a5a987e feat(scout): implement dossier header component (TICKET-31), DossierHeader(), DossierHeaderProps, formatCurrency(), formatNumber(), MarketFlowBlock(), MarketStatsProps

### Community 23 - "Community 23"
Cohesion: 0.29
Nodes (9): 3b8f413 feat(scout): implement launch feed polling engine (TICKET-49), FeedPoller(), FeedPollerProps, FeedAction, FeedFilter, FeedLaunchItem, feedReducer(), FeedState (+1 more)

### Community 24 - "Community 24"
Cohesion: 0.18
Nodes (6): UserProfileData, getSession(), users, metadata, deleteAccountSchema, updateHandleSchema

### Community 25 - "Community 25"
Cohesion: 0.26
Nodes (8): DossierPageView(), 72063a3 feat(scout): assemble dossier page server component (TICKET-43), f05e3e2 feat(scout): implement connections and timeline component (TICKET-42), ConnectionItem, ConnectionsTimeline(), ConnectionsTimelineProps, TimelineLogItem, DossierPagePropsData

### Community 26 - "Community 26"
Cohesion: 0.24
Nodes (8): 4df7cfa feat(scout): implement feed summary metric tiles component (TICKET-50), FeedStatsData, FeedTiles(), FeedTilesProps, initialFeedItems, initialGraduations, initialTrades, watchedDeployers

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
Cohesion: 0.25
Nodes (9): 31392cc feat(scout): implement trade inspector drawer component (TICKET-52), b4b770e feat(scout): implement 4-tab filter feed table component (TICKET-51), FeedTable(), FeedTableProps, FeedTableRowData, FeedTableTab, filterFeedItems(), IconCheck() (+1 more)

### Community 31 - "Community 31"
Cohesion: 0.25
Nodes (8): f8e990e feat(scout): implement ticker tape marquee component (TICKET-48), DEFAULT_FALLBACK_ITEMS, TickerItemData, TickerTape(), TickerTapeProps, IconFlame(), IconGraduation(), IconShield()

### Community 32 - "Community 32"
Cohesion: 0.31
Nodes (9): formatCurrency(), formatPrice(), InspectorToken, renderSparklineSvg(), TradeInspector(), TradeInspectorProps, TradeItem, truncateAddress() (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.31
Nodes (7): 87705e2 feat(scout): implement constellation graph svg component (TICKET-38), ConnectionType, ConstellationEdge, ConstellationGraph(), ConstellationGraphProps, ConstellationNode, InternalConstellationNode

### Community 34 - "Community 34"
Cohesion: 0.28
Nodes (8): GET(), GetWatchlistResponseBody, handleGetWatchlist(), handlePostWatchlist(), POST(), PostWatchlistResponseBody, postWatchlistSchema, WatchlistEntryResult

### Community 35 - "Community 35"
Cohesion: 0.39
Nodes (5): 24fabc4 feat(scout): implement interactive wallet map svg component (TICKET-35), InternalBubble, WalletBubbleItem, WalletMap(), WalletMapProps

### Community 36 - "Community 36"
Cohesion: 0.36
Nodes (6): DEMO_DOSSIERS, DEMO_SLUGS, DemoDossier, DemoItem, DemoSnapshot, getDemoDossier()

### Community 37 - "Community 37"
Cohesion: 0.29
Nodes (4): 3cdeeea feat(scout): conduct wcag aa accessibility audit and keyboard focus styling (TICKET-85), 4892043 docs(scout): create testnet manual testing scenarios guide (TICKET-T01), 4cbf7b6 test(scout): execute testnet manual verification suite (TICKET-T03), fe4f37a docs(scout): document e2e testing strategy and qa protocol decision (TICKET-T02)

### Community 38 - "Community 38"
Cohesion: 0.38
Nodes (5): 4a058d9 feat(scout): implement research panel component with debounced autosave (TICKET-39), ResearchPanel(), ResearchPanelProps, PutDossierItemInput, PutDossierQuestionInput

### Community 39 - "Community 39"
Cohesion: 0.53
Nodes (4): 3fbdf94 feat(scout): implement trade flow chart svg component (TICKET-33), TradeCandleData, TradeFlowChart(), TradeFlowChartProps

### Community 40 - "Community 40"
Cohesion: 0.53
Nodes (4): 71bcf5c feat(scout): implement trade flow panel component (TICKET-34), TradeFlowData, TradeFlowPanel(), TradeFlowPanelProps

### Community 41 - "Community 41"
Cohesion: 0.60
Nodes (4): a1128f0 feat(scout): define real archetype deployer example constants (TICKET-81), EXAMPLE_DEPLOYERS, ExampleDeployer, getExampleDeployerByArchetype()

### Community 42 - "Community 42"
Cohesion: 0.60
Nodes (3): 49106f2 feat(scout): implement publish dialog modal component (TICKET-63), PublishDialog(), PublishDialogProps

### Community 43 - "Community 43"
Cohesion: 0.50
Nodes (4): DOSSIER_STATUSES, GET(), handleGetLibrary(), querySchema

### Community 44 - "Community 44"
Cohesion: 0.67
Nodes (1): d92eda6 feat(scout): assemble dossiers library management page (TICKET-75)

## Knowledge Gaps
- **157 isolated node(s):** `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody`, `addressSchema`, `addressSchema` (+152 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 44`** (1 nodes): `d92eda6 feat(scout): assemble dossiers library management page (TICKET-75)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `db` connect `Community 7` to `Community 1`, `Community 9`, `Community 3`, `Community 11`, `Community 4`, `Community 12`, `Community 0`, `Community 43`, `Community 24`, `Community 6`, `Community 5`, `Community 14`, `Community 19`, `Community 34`, `Community 13`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `getSession()` connect `Community 24` to `Community 1`, `Community 0`, `Community 7`, `Community 6`, `Community 9`, `Community 3`, `Community 29`, `Community 4`, `Community 10`, `Community 43`, `Community 5`, `Community 34`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody` to the rest of the system?**
  _157 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05757286192068801 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05920745920745921 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.0629800307219662 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.08748615725359911 - nodes in this community are weakly interconnected._