# Graph Report - .  (2026-09-30)

## Corpus Check
- 287 files · ~219,739 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 980 nodes · 2902 edges · 39 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: imports: 799 · MODIFIES: 616 · contains: 581 · imports_from: 496 · ON_BRANCH: 165 · PARENT_OF: 163 · calls: 55 · method: 11 · inherits: 8 · references: 7 · re_exports: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 287 · Candidates: 381
- Excluded: 0 untracked · 45319 ignored · 1 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `91e3780`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `db` - 32 edges
2. `getSession()` - 28 edges
3. `Database` - 23 edges
4. `CookieStoreLike` - 21 edges
5. `Header()` - 17 edges
6. `dossiers` - 17 edges
7. `IconArrowRight()` - 13 edges
8. `deployerLaunches` - 12 edges
9. `deployerScores` - 11 edges
10. `Dossier` - 11 edges

## Surprising Connections (you probably didn't know these)
- `DELETE()` --calls--> `handleDeleteDossier()`  [EXTRACTED]
  app/api/publish/[ca]/route.ts → app/api/dossier/[ca]/route.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (30): 0ec1fbb feat: implement pure vector 3D stacked discs and skymoney protocol showcase banner, 17dcf97 feat(navigation): add top progress bar, route skeletons, library page & mobile responsive optimization (TICKET-86, TICKET-87, TICKET-88), 22d2e90 feat(ui): redesign landing hero with 2-column layout and animated telemetry widget, harmonize tosca visuals, 2de890a refactor(layout): remove block height telemetry widget from header navbar, 2e3f0af fix(ui): eliminate focus-visible outline on text inputs and textareas, 3127053 feat: make landing ecosystem cards transparent with background image opacity (TICKET-140), 49106f2 feat(scout): implement publish dialog modal component (TICKET-63), 5142aa4 feat: align all route loading skeletons with exact view layouts (TICKET-141) (+22 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (52): main, 004100e feat: make deployer profile compact and fit viewport height (TICKET-136), 088ea34 test: add automated Playwright E2E evidence test runner, 0cd7581 feat(scout): create seed dummy data script and fixtures (TICKET-09), 1252f8e fix(db): isolate scout schema, add rollback script, update vercel cron and env example, 12c695d feat(scout): verify production database migration dry-run (TICKET-M02), 1c25d40 fix: resolve action button layout collision in DossierHeader (TICKET-130), 238f483 feat(scout): assemble watchlist monitor page (TICKET-69) (+44 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (41): geistMono, geistSans, metadata, checkWalletAvailability(), getEthereumProvider(), logoutWallet(), signInWithWallet(), WalletAvailability (+33 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (39): AccountClient(), AccountClientProps, DossierPageView(), 1ec916f feat(scout): implement synthetic demo dossier fixtures and routes (TICKET-80), 2f8f708 feat(scout): assemble technical documentation and api reference page (TICKET-79), 42f1b99 fix(ui): refine anti-slop honest demo states and token consistency, 5b836fa feat(scout): assemble deployer reputation profile page (TICKET-76), 6cc1ac5 feat(scout): implement full-page connection map svg component (TICKET-57) (+31 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (34): metadata, main, CensusView(), CensusPayload, computeCensusStats(), RepeatLauncherInfo, saveCensusSnapshot(), metadata (+26 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (32): 02618b0 refactor(how): replace repetitive glossary list with interactive two-pane forensic codex workbench and sync loading skeleton, 155086e fix(lint): manually resolve all 29 eslint issues without auto-fix, 19ac213 feat(docs,how): add sticky sidebar navigation to docs and non-card field manual layout to how, 1a66628 fix(docs,how): update loading skeletons and increase sticky sidebar top margin, 21c5bb2 feat: expand technical documentation with interactive rest api explorer and smart contract registry, 380c7ab style(how,docs): redesign /how with bespoke section layouts and fix /docs sidebar clipping, 482dea9 perf(layout): optimize mobile and tablet layout density for docs and how pages, 58c326f style: apply neo-brutalist card styling to /docs and /how pages (+24 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (31): DeployerScore, deployerWatchlistRelations, dossierItems, dossierItemsRelations, dossierLog, dossierLogRelations, dossierQuestions, dossierQuestionsRelations (+23 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (23): 16a3b8b feat(scout): setup diff thresholds configuration and triggers (TICKET-04), 919d12f feat(scout): implement since last check diff component (TICKET-40), 92cedc3 test(scout): add unit tests for diff comparison (TICKET-20), 9f360e4 feat(scout): implement snapshot diff comparison logic (TICKET-19), DIFF_BOOLEAN_TRIGGERS, DIFF_CURVE_GRADUATED, DIFF_FEE_RECIPIENT_CHANGED, DIFF_FIELD_KEYS (+15 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (25): 795ff3b feat(scout): setup score formula parameters and types (TICKET-03), a5ce11b feat(scout): implement deployer score calculation formula (TICKET-17), e9816df test(scout): add unit tests for deployer score formula (TICKET-18), FACTORY_ADDRESS, BAND_GREEN_MIN, BAND_YELLOW_MIN, GRAD_DENOMINATOR_ADD, GRAD_NUMERATOR_ADD (+17 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (22): GET(), handleGetDossier(), c9f59e2 feat(scout): implement api get public dossier endpoint (TICKET-61), dc8d660 feat(scout): implement api post save copy dossier endpoint (TICKET-62), Database, publishedDossiers, handleSavePublicDossier(), POST() (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (21): 261544b feat(scout): implement api get library export endpoint (TICKET-28), 3b9584c feat(scout): implement api get deployer dossiers endpoint (TICKET-25), 439c457 feat(scout): implement api post library import endpoint (TICKET-27), 9d2b0cc feat(scout): implement api get library endpoint (TICKET-26), fc157fe feat(scout): implement api get dossier markdown export (TICKET-29), Dossier, DOSSIER_STATUSES, DossierItem (+13 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (18): sessionOptions, 006e480 feat(scout): implement siwe logout endpoint (TICKET-14), 07f29ab chore(scout): finalize scout dossiers ecosystem infrastructure and docs, 2354fd8 feat(scout): implement siwe nonce endpoint (TICKET-12), 73c8e8a feat(scout): implement siwe verify endpoint (TICKET-13), handleLogout(), POST(), handleNonce() (+10 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (20): addressSchema, contractAddressSchema, DELETE(), generateSlug(), handleDeleteDossier(), handlePublishDossier(), handlePutDossier(), handleRevokePublish() (+12 more)

### Community 13 - "Community 13"
Cohesion: 0.12
Nodes (19): 247006d feat(scout): create landing page and feed static prototypes (TICKET-46), 7b6f3f4 feat(scout): implement dexscreener price quote fetcher (TICKET-44), fbcf2dd feat(scout): implement snapshot system helper and pruning (TICKET-45), isSnapshotIdentical(), pruneSnapshots(), saveSnapshot(), SaveSnapshotResult, SnapshotDataInput (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (13): 05d0de3 feat(scout): implement public api rate limiting middleware (TICKET-82), 162f5fb feat(scout): setup dynamic sitemap, robots crawler rules, and seo metadata (TICKET-84), 2d6e90d docs(scout): document third-party open source licenses and attributions (TICKET-83), a1128f0 feat(scout): define real archetype deployer example constants (TICKET-81), EXAMPLE_DEPLOYERS, ExampleDeployer, getExampleDeployerByArchetype(), siteMetadata (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.16
Nodes (22): ChainEventParseError, fetchCurveBuy(), fetchCurveSell(), fetchPoolGraduated(), fetchTokenLaunched(), getLogsWithSplitting(), isRangeSplittableError(), parseRequiredBlockNumber() (+14 more)

### Community 16 - "Community 16"
Cohesion: 0.16
Nodes (20): getSession(), 127516d feat(scout): implement api deployer connected dossiers graph (TICKET-56), 7588cce feat(scout): implement connection detection engine (TICKET-55), addressSchema, GET(), handleGetDeployerConnected(), ConnectionLink, ConnectionReason (+12 more)

### Community 17 - "Community 17"
Cohesion: 0.20
Nodes (16): 72063a3 feat(scout): assemble dossier page server component (TICKET-43), 8b6a97a feat: enhance research workspace layout, deployer metrics & watchlist real-time scoring, a1295a9 fix(dossier): resolve dynamic token metrics and deployer redirect for /d/[ca], f05e3e2 feat(scout): implement connections and timeline component (TICKET-42), deployerLaunches, deployerScores, Snapshot, snapshots (+8 more)

### Community 18 - "Community 18"
Cohesion: 0.10
Nodes (17): PageProps, addressSchema, DELETE(), DeleteWatchlistResponseBody, GET(), handleDeleteWatchlist(), handleGetDeployer(), DeployerLaunch (+9 more)

### Community 19 - "Community 19"
Cohesion: 0.11
Nodes (20): f7850db feat(scout): implement scout remembers connected dossiers component (TICKET-41), DossierItemKind, ScoutRemembers(), ScoutRemembersProps, ConnectedDossierSummary, DeleteDossierResponseBody, DossierData, DossierItemData (+12 more)

### Community 20 - "Community 20"
Cohesion: 0.15
Nodes (13): 052102a fix: lock steady container heights on trade and graduation tapes to eliminate hover layout shift, 06e5cce feat: replace symbols and emojis with custom SVG vector icons, fix marquee hover pause, and refine UI anti-slop, 1a8ede4 feat(feed): implement continuous marquee ticker and high density unique live launches terminal, 7ab9268 feat(scout): assemble realtime launch feed page (TICKET-54), b3e9616 feat(scout): implement live trade tape and graduation tape components (TICKET-53), bb4acb3 style: apply neo-brutalist card styling across feed, library, map, watchlist, and census, GraduationTapeItem, GraduationTapeProps (+5 more)

### Community 21 - "Community 21"
Cohesion: 0.19
Nodes (12): 71bcf5c feat(scout): implement trade flow panel component (TICKET-34), a5a987e feat(scout): implement dossier header component (TICKET-31), DossierClientView(), useSafeRouter(), DossierHeader(), DossierHeaderProps, DossierPagePropsData, fetchDossierPageData() (+4 more)

### Community 22 - "Community 22"
Cohesion: 0.17
Nodes (14): createTransport(), getPublicClient(), robinhoodChain, b84d454 feat(scout): setup chain configuration and abi constants (TICKET-02), CHAIN_ID, CURVE_BUY_ABI, CURVE_SELL_ABI, DEFAULT_RPC_URL (+6 more)

### Community 23 - "Community 23"
Cohesion: 0.19
Nodes (13): 4df7cfa feat(scout): implement feed summary metric tiles component (TICKET-50), 6aec8fe feat(ui): overhaul ui with chroma high-chroma colorful design system and fluid animations, cc4049d fix: make feed page cards compact, symmetrical, and eliminate empty spaces (TICKET-142), FeedTable(), FeedStatsData, FeedTiles(), FeedTilesProps, GraduationTape() (+5 more)

### Community 24 - "Community 24"
Cohesion: 0.16
Nodes (7): UserProfileData, db, globalForDb, users, metadata, deleteAccountSchema, updateHandleSchema

### Community 25 - "Community 25"
Cohesion: 0.19
Nodes (12): CensusViewProps, IconAlert(), IconCheck(), IconCode(), IconCpu(), IconDiamond(), IconGraph(), IconProps (+4 more)

### Community 26 - "Community 26"
Cohesion: 0.21
Nodes (6): QueueItem, QueueOptions, RequestPriority, RequestQueue, rpcQueue, 6d8ab15 feat(scout): setup 2-lane request queue (TICKET-11)

### Community 27 - "Community 27"
Cohesion: 0.21
Nodes (12): e9169fe feat(scout): implement centralized input sanitization and zod schema (TICKET-65), dossierItemsArraySchema, dossierItemStrictSchema, dossierPutStrictSchema, dossierQuestionsArraySchema, dossierQuestionStrictSchema, ethAddressSchema, importLibraryItemStrictSchema (+4 more)

### Community 28 - "Community 28"
Cohesion: 0.29
Nodes (9): 3b8f413 feat(scout): implement launch feed polling engine (TICKET-49), FeedPoller(), FeedPollerProps, FeedAction, FeedFilter, FeedLaunchItem, feedReducer(), FeedState (+1 more)

### Community 29 - "Community 29"
Cohesion: 0.23
Nodes (9): GET(), publicClient, batchGetTokenInfo(), ERC20_NAME_ABI, ERC20_SYMBOL_ABI, 2d05c9a feat(scout): implement multicall3 batch helpers (TICKET-15), GET_LAUNCHED_TOKEN_ABI, MulticallClient (+1 more)

### Community 30 - "Community 30"
Cohesion: 0.27
Nodes (11): scout.census_stats, scout.deployer_launches, scout.deployer_scores, scout.deployer_watchlist, scout.dossier_items, scout.dossier_log, scout.dossier_questions, scout.dossiers (+3 more)

### Community 31 - "Community 31"
Cohesion: 0.25
Nodes (8): f8e990e feat(scout): implement ticker tape marquee component (TICKET-48), DEFAULT_FALLBACK_ITEMS, TickerItemData, TickerTape(), TickerTapeProps, IconFlame(), IconGraduation(), IconShield()

### Community 32 - "Community 32"
Cohesion: 0.31
Nodes (9): formatCurrency(), formatPrice(), InspectorToken, renderSparklineSvg(), TradeInspector(), TradeInspectorProps, TradeItem, truncateAddress() (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.27
Nodes (8): 31392cc feat(scout): implement trade inspector drawer component (TICKET-52), b4b770e feat(scout): implement 4-tab filter feed table component (TICKET-51), FeedTableProps, FeedTableRowData, FeedTableTab, filterFeedItems(), IconBolt(), IconClipboard()

### Community 34 - "Community 34"
Cohesion: 0.27
Nodes (8): 3fbdf94 feat(scout): implement trade flow chart svg component (TICKET-33), ChartType, DrawingTool, OverlayIndicator, Timeframe, TradeCandleData, TradeFlowChart(), TradeFlowChartProps

### Community 35 - "Community 35"
Cohesion: 0.31
Nodes (7): 87705e2 feat(scout): implement constellation graph svg component (TICKET-38), ConnectionType, ConstellationEdge, ConstellationGraph(), ConstellationGraphProps, ConstellationNode, InternalConstellationNode

### Community 36 - "Community 36"
Cohesion: 0.39
Nodes (5): 24fabc4 feat(scout): implement interactive wallet map svg component (TICKET-35), InternalBubble, WalletBubbleItem, WalletMap(), WalletMapProps

### Community 37 - "Community 37"
Cohesion: 0.53
Nodes (4): ddea6df feat(scout): implement top wallets table component (TICKET-36), TopWalletRow, TopWalletsTable(), TopWalletsTableProps

### Community 38 - "Community 38"
Cohesion: 0.53
Nodes (4): fa969bc feat(scout): implement deployer history timeline component (TICKET-37), DeployerHistory(), DeployerHistoryProps, DeployerLaunchItem

## Knowledge Gaps
- **175 isolated node(s):** `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody`, `addressSchema`, `addressSchema` (+170 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `db` connect `Community 24` to `Community 18`, `Community 4`, `Community 12`, `Community 16`, `Community 13`, `Community 17`, `Community 10`, `Community 20`, `Community 6`, `Community 3`, `Community 9`, `Community 11`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `getSession()` connect `Community 16` to `Community 18`, `Community 2`, `Community 4`, `Community 11`, `Community 21`, `Community 12`, `Community 5`, `Community 10`, `Community 6`, `Community 24`, `Community 3`, `Community 9`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody` to the rest of the system?**
  _175 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07927565392354124 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05370843989769821 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.061343204653622425 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06558441558441558 - nodes in this community are weakly interconnected._