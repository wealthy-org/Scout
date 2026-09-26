# Graph Report - .  (2026-09-26)

## Corpus Check
- 230 files · ~79,252 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 740 nodes · 1766 edges · 33 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: imports: 517 · contains: 463 · imports_from: 306 · MODIFIES: 220 · ON_BRANCH: 96 · PARENT_OF: 94 · calls: 48 · inherits: 8 · references: 7 · method: 6 · re_exports: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 230 · Candidates: 322
- Excluded: 15 untracked · 43591 ignored · 0 sensitive · 1 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `1252f8e`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `db` - 27 edges
2. `getSession()` - 24 edges
3. `Database` - 22 edges
4. `CookieStoreLike` - 21 edges
5. `dossiers` - 13 edges
6. `Dossier` - 10 edges
7. `RequestQueue` - 8 edges
8. `deployerScores` - 8 edges
9. `TradeInspector()` - 7 edges
10. `scout.dossiers` - 7 edges

## Surprising Connections (you probably didn't know these)
- `DELETE()` --calls--> `handleDeleteDossier()`  [EXTRACTED]
  app/api/publish/[ca]/route.ts → app/api/dossier/[ca]/route.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (73): getSession(), sessionOptions, addressSchema, contractAddressSchema, DELETE(), generateSlug(), GET(), handleDeleteDossier() (+65 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (45): 31392cc feat(scout): implement trade inspector drawer component (TICKET-52), 3b8f413 feat(scout): implement launch feed polling engine (TICKET-49), 4df7cfa feat(scout): implement feed summary metric tiles component (TICKET-50), 7ab9268 feat(scout): assemble realtime launch feed page (TICKET-54), b3e9616 feat(scout): implement live trade tape and graduation tape components (TICKET-53), b4b770e feat(scout): implement 4-tab filter feed table component (TICKET-51), f8e990e feat(scout): implement ticker tape marquee component (TICKET-48), FeedPoller() (+37 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (40): AccountClient(), AccountClientProps, UserProfileData, PageProps, 1ec916f feat(scout): implement synthetic demo dossier fixtures and routes (TICKET-80), 2f8f708 feat(scout): assemble technical documentation and api reference page (TICKET-79), 5b836fa feat(scout): assemble deployer reputation profile page (TICKET-76), 74ffacc feat(scout): assemble account settings page and delete account cascade (TICKET-77) (+32 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (35): main, 07f29ab chore(scout): finalize scout dossiers ecosystem infrastructure and docs, 0cd7581 feat(scout): create seed dummy data script and fixtures (TICKET-09), 1252f8e fix(db): isolate scout schema, add rollback script, update vercel cron and env example, 12c695d feat(scout): verify production database migration dry-run (TICKET-M02), 32f2dc6 feat(scout): implement api post publish dossier endpoint (TICKET-59), 3cdeeea feat(scout): conduct wcag aa accessibility audit and keyboard focus styling (TICKET-85), 3f2b165 feat(scout): implement api delete watchlist endpoint (TICKET-68) (+27 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (43): createTransport(), getPublicClient(), publicClient, robinhoodChain, fetchCurveBuy(), fetchCurveSell(), fetchPoolGraduated(), fetchTokenLaunched() (+35 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (26): addressSchema, DELETE(), DeleteWatchlistResponseBody, GET(), handleDeleteWatchlist(), handleGetDeployer(), 05d0de3 feat(scout): implement public api rate limiting middleware (TICKET-82), e9169fe feat(scout): implement centralized input sanitization and zod schema (TICKET-65) (+18 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (25): 795ff3b feat(scout): setup score formula parameters and types (TICKET-03), e9816df test(scout): add unit tests for deployer score formula (TICKET-18), BAND_GREEN_MIN, BAND_YELLOW_MIN, GRAD_DENOMINATOR_ADD, GRAD_NUMERATOR_ADD, LABEL_FRESH_MAX, LABEL_REPEAT_MAX (+17 more)

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (20): 16a3b8b feat(scout): setup diff thresholds configuration and triggers (TICKET-04), 919d12f feat(scout): implement since last check diff component (TICKET-40), 92cedc3 test(scout): add unit tests for diff comparison (TICKET-20), 9f360e4 feat(scout): implement snapshot diff comparison logic (TICKET-19), DIFF_BOOLEAN_TRIGGERS, DIFF_CURVE_GRADUATED, DIFF_FEE_RECIPIENT_CHANGED, DIFF_FIELD_KEYS (+12 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (25): censusStats, deployerLaunches, deployerWatchlistRelations, dossierItemsRelations, dossierLogRelations, dossierQuestionsRelations, dossiersRelations, NewCensusStats (+17 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (19): 247006d feat(scout): create landing page and feed static prototypes (TICKET-46), 7b6f3f4 feat(scout): implement dexscreener price quote fetcher (TICKET-44), fbcf2dd feat(scout): implement snapshot system helper and pruning (TICKET-45), snapshots, isSnapshotIdentical(), pruneSnapshots(), saveSnapshot(), SaveSnapshotResult (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.10
Nodes (13): geistMono, geistSans, metadata, main, 162f5fb feat(scout): setup dynamic sitemap, robots crawler rules, and seo metadata (TICKET-84), 2d6e90d docs(scout): document third-party open source licenses and attributions (TICKET-83), 407b913 feat(scout): setup tailwind v4 tokens and theme configuration (TICKET-01), ccae023 Initial commit from Create Next App (+5 more)

### Community 11 - "Community 11"
Cohesion: 0.16
Nodes (19): 127516d feat(scout): implement api deployer connected dossiers graph (TICKET-56), 7588cce feat(scout): implement connection detection engine (TICKET-55), addressSchema, GET(), handleGetDeployerConnected(), ConnectionLink, ConnectionReason, ConnectionType (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (15): f7850db feat(scout): implement scout remembers connected dossiers component (TICKET-41), DossierItemKind, ScoutRemembers(), ScoutRemembersProps, ConnectedDossierSummary, DossierData, DossierItemData, DossierLogData (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.21
Nodes (10): CensusView(), CensusViewProps, CensusPayload, computeCensusStats(), RepeatLauncherInfo, saveCensusSnapshot(), metadata, 63de350 feat(scout): assemble ecosystem census analytics page (TICKET-73) (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.27
Nodes (9): DossierPageView(), 72063a3 feat(scout): assemble dossier page server component (TICKET-43), f05e3e2 feat(scout): implement connections and timeline component (TICKET-42), ConnectionItem, ConnectionsTimeline(), ConnectionsTimelineProps, TimelineLogItem, DossierPagePropsData (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.21
Nodes (6): QueueItem, QueueOptions, RequestPriority, RequestQueue, rpcQueue, 6d8ab15 feat(scout): setup 2-lane request queue (TICKET-11)

### Community 16 - "Community 16"
Cohesion: 0.24
Nodes (10): c9f59e2 feat(scout): implement api get public dossier endpoint (TICKET-61), dc8d660 feat(scout): implement api post save copy dossier endpoint (TICKET-62), Database, globalForDb, handleSavePublicDossier(), POST(), SaveDossierResponseBody, GET() (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.27
Nodes (11): scout.census_stats, scout.deployer_launches, scout.deployer_scores, scout.deployer_watchlist, scout.dossier_items, scout.dossier_log, scout.dossier_questions, scout.dossiers (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.22
Nodes (10): deployerScores, deployerWatchlist, GET(), GetWatchlistResponseBody, handleGetWatchlist(), handlePostWatchlist(), POST(), PostWatchlistResponseBody (+2 more)

### Community 19 - "Community 19"
Cohesion: 0.31
Nodes (5): metadata, 6c18511 feat(scout): assemble landing page with live case files and census stats (TICKET-74), FeaturedDossier, LandingClient(), LandingClientProps

### Community 20 - "Community 20"
Cohesion: 0.31
Nodes (7): 87705e2 feat(scout): implement constellation graph svg component (TICKET-38), ConnectionType, ConstellationEdge, ConstellationGraph(), ConstellationGraphProps, ConstellationNode, InternalConstellationNode

### Community 21 - "Community 21"
Cohesion: 0.31
Nodes (8): CronCensusResponseBody, GET(), GetCensusResponseBody, handleCronCensus(), handleGetCensus(), POST(), 2c0260b feat(scout): implement api get census stats endpoint (TICKET-71), 4258d74 feat(scout): implement api cron census aggregation endpoint (TICKET-72)

### Community 22 - "Community 22"
Cohesion: 0.36
Nodes (5): 238f483 feat(scout): assemble watchlist monitor page (TICKET-69), metadata, WatchlistClient(), WatchlistClientProps, WatchlistItem

### Community 23 - "Community 23"
Cohesion: 0.39
Nodes (5): 24fabc4 feat(scout): implement interactive wallet map svg component (TICKET-35), InternalBubble, WalletBubbleItem, WalletMap(), WalletMapProps

### Community 24 - "Community 24"
Cohesion: 0.57
Nodes (5): 36616f6 feat(scout): implement market and flow block component (TICKET-32), formatCurrency(), formatNumber(), MarketFlowBlock(), MarketStatsProps

### Community 25 - "Community 25"
Cohesion: 0.38
Nodes (5): 4a058d9 feat(scout): implement research panel component with debounced autosave (TICKET-39), ResearchPanel(), ResearchPanelProps, PutDossierItemInput, PutDossierQuestionInput

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (3): users, deleteAccountSchema, updateHandleSchema

### Community 27 - "Community 27"
Cohesion: 0.53
Nodes (4): 3fbdf94 feat(scout): implement trade flow chart svg component (TICKET-33), TradeCandleData, TradeFlowChart(), TradeFlowChartProps

### Community 28 - "Community 28"
Cohesion: 0.53
Nodes (4): 71bcf5c feat(scout): implement trade flow panel component (TICKET-34), TradeFlowData, TradeFlowPanel(), TradeFlowPanelProps

### Community 29 - "Community 29"
Cohesion: 0.53
Nodes (4): ddea6df feat(scout): implement top wallets table component (TICKET-36), TopWalletRow, TopWalletsTable(), TopWalletsTableProps

### Community 30 - "Community 30"
Cohesion: 0.53
Nodes (4): fa969bc feat(scout): implement deployer history timeline component (TICKET-37), DeployerHistory(), DeployerHistoryProps, DeployerLaunchItem

### Community 31 - "Community 31"
Cohesion: 0.60
Nodes (3): 49106f2 feat(scout): implement publish dialog modal component (TICKET-63), PublishDialog(), PublishDialogProps

### Community 32 - "Community 32"
Cohesion: 0.60
Nodes (3): a5a987e feat(scout): implement dossier header component (TICKET-31), DossierHeader(), DossierHeaderProps

## Knowledge Gaps
- **143 isolated node(s):** `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody`, `addressSchema`, `addressSchema` (+138 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `db` connect `Community 13` to `Community 2`, `Community 5`, `Community 19`, `Community 0`, `Community 21`, `Community 11`, `Community 16`, `Community 9`, `Community 14`, `Community 26`, `Community 8`, `Community 22`, `Community 18`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `getSession()` connect `Community 0` to `Community 2`, `Community 5`, `Community 19`, `Community 13`, `Community 11`, `Community 26`, `Community 16`, `Community 22`, `Community 18`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody` to the rest of the system?**
  _143 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05176116838487973 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05311676909569798 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.052464947987336044 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.05451127819548872 - nodes in this community are weakly interconnected._