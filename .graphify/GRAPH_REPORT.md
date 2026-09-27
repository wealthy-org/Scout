# Graph Report - .  (2026-09-27)

## Corpus Check
- 261 files · ~176,556 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 788 nodes · 2069 edges · 29 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: imports: 569 · contains: 477 · imports_from: 377 · MODIFIES: 366 · ON_BRANCH: 106 · PARENT_OF: 104 · calls: 48 · inherits: 8 · references: 7 · method: 6 · re_exports: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 261 · Candidates: 355
- Excluded: 0 untracked · 44170 ignored · 1 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `2e3f0af`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `db` - 28 edges
2. `getSession()` - 25 edges
3. `Database` - 22 edges
4. `CookieStoreLike` - 21 edges
5. `Header()` - 16 edges
6. `dossiers` - 14 edges
7. `Dossier` - 10 edges
8. `TradeInspector()` - 8 edges
9. `RequestQueue` - 8 edges
10. `deployerScores` - 8 edges

## Surprising Connections (you probably didn't know these)
- `DELETE()` --calls--> `handleDeleteDossier()`  [EXTRACTED]
  app/api/publish/[ca]/route.ts → app/api/dossier/[ca]/route.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (51): AccountClient(), AccountClientProps, UserProfileData, main, CensusView(), CensusViewProps, metadata, 078bb6c feat(scout): implement api get dossier endpoint (TICKET-21) (+43 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (45): 31392cc feat(scout): implement trade inspector drawer component (TICKET-52), 3b8f413 feat(scout): implement launch feed polling engine (TICKET-49), 4df7cfa feat(scout): implement feed summary metric tiles component (TICKET-50), 7ab9268 feat(scout): assemble realtime launch feed page (TICKET-54), b3e9616 feat(scout): implement live trade tape and graduation tape components (TICKET-53), b4b770e feat(scout): implement 4-tab filter feed table component (TICKET-51), f8e990e feat(scout): implement ticker tape marquee component (TICKET-48), FeedPoller() (+37 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (44): createTransport(), getPublicClient(), publicClient, robinhoodChain, fetchCurveBuy(), fetchCurveSell(), fetchPoolGraduated(), fetchTokenLaunched() (+36 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (37): PageProps, addressSchema, DELETE(), DeleteWatchlistResponseBody, GET(), handleDeleteWatchlist(), handleGetDeployer(), 795ff3b feat(scout): setup score formula parameters and types (TICKET-03) (+29 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (35): 261544b feat(scout): implement api get library export endpoint (TICKET-28), 3b9584c feat(scout): implement api get deployer dossiers endpoint (TICKET-25), 439c457 feat(scout): implement api post library import endpoint (TICKET-27), 9d2b0cc feat(scout): implement api get library endpoint (TICKET-26), deployerLaunches, Dossier, DOSSIER_ITEM_KINDS, DOSSIER_STATUSES (+27 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (23): geistMono, geistSans, metadata, main, 05d0de3 feat(scout): implement public api rate limiting middleware (TICKET-82), 162f5fb feat(scout): setup dynamic sitemap, robots crawler rules, and seo metadata (TICKET-84), 2d6e90d docs(scout): document third-party open source licenses and attributions (TICKET-83), 3cdeeea feat(scout): conduct wcag aa accessibility audit and keyboard focus styling (TICKET-85) (+15 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (24): 07f29ab chore(scout): finalize scout dossiers ecosystem infrastructure and docs, 1252f8e fix(db): isolate scout schema, add rollback script, update vercel cron and env example, 12c695d feat(scout): verify production database migration dry-run (TICKET-M02), 53e773f feat(scout): configure vercel cron for automated census trigger (TICKET-M05), 79b63db chore(scout): install and verify core dependencies (TICKET-05), 8dad13e feat(scout): configure production build settings and smoke verification (TICKET-M03), b736ccb feat(scout): generate initial drizzle migrations (TICKET-08), cbb07ba feat(scout): setup drizzle schema definitions (TICKET-06) (+16 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (26): handlePutDossier(), PUT(), 4a058d9 feat(scout): implement research panel component with debounced autosave (TICKET-39), f7850db feat(scout): implement scout remembers connected dossiers component (TICKET-41), DossierItemKind, ResearchPanel(), ResearchPanelProps, ScoutRemembers() (+18 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (21): 1ec916f feat(scout): implement synthetic demo dossier fixtures and routes (TICKET-80), 49106f2 feat(scout): implement publish dialog modal component (TICKET-63), a1128f0 feat(scout): define real archetype deployer example constants (TICKET-81), e12a92e feat(scout): assemble public dossier view page (TICKET-64), DEMO_DOSSIERS, DEMO_SLUGS, DemoDossier, DemoItem (+13 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (18): metadata, CensusPayload, computeCensusStats(), RepeatLauncherInfo, saveCensusSnapshot(), CronCensusResponseBody, GET(), GetCensusResponseBody (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (22): addressSchema, contractAddressSchema, DELETE(), generateSlug(), GET(), handleDeleteDossier(), handleGetDossier(), handlePublishDossier() (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.17
Nodes (20): 16a3b8b feat(scout): setup diff thresholds configuration and triggers (TICKET-04), 919d12f feat(scout): implement since last check diff component (TICKET-40), 92cedc3 test(scout): add unit tests for diff comparison (TICKET-20), 9f360e4 feat(scout): implement snapshot diff comparison logic (TICKET-19), DIFF_BOOLEAN_TRIGGERS, DIFF_CURVE_GRADUATED, DIFF_FEE_RECIPIENT_CHANGED, DIFF_FIELD_KEYS (+12 more)

### Community 12 - "Community 12"
Cohesion: 0.07
Nodes (25): deployerScores, deployerWatchlistRelations, dossierItemsRelations, dossierLogRelations, dossierQuestionsRelations, dossiersRelations, NewCensusStats, NewDeployerLaunch (+17 more)

### Community 13 - "Community 13"
Cohesion: 0.16
Nodes (18): getSession(), sessionOptions, 006e480 feat(scout): implement siwe logout endpoint (TICKET-14), 2354fd8 feat(scout): implement siwe nonce endpoint (TICKET-12), 73c8e8a feat(scout): implement siwe verify endpoint (TICKET-13), dc8d660 feat(scout): implement api post save copy dossier endpoint (TICKET-62), handleLogout(), POST() (+10 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (17): 7b6f3f4 feat(scout): implement dexscreener price quote fetcher (TICKET-44), fbcf2dd feat(scout): implement snapshot system helper and pruning (TICKET-45), isSnapshotIdentical(), pruneSnapshots(), saveSnapshot(), SaveSnapshotResult, SnapshotDataInput, SnapshotRecordLike (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.16
Nodes (19): 127516d feat(scout): implement api deployer connected dossiers graph (TICKET-56), 7588cce feat(scout): implement connection detection engine (TICKET-55), addressSchema, GET(), handleGetDeployerConnected(), ConnectionLink, ConnectionReason, ConnectionType (+11 more)

### Community 16 - "Community 16"
Cohesion: 0.22
Nodes (10): 36616f6 feat(scout): implement market and flow block component (TICKET-32), 82f8774 feat(scout): create dossier page static prototype (TICKET-30), a5a987e feat(scout): implement dossier header component (TICKET-31), fc157fe feat(scout): implement api get dossier markdown export (TICKET-29), DossierHeader(), DossierHeaderProps, formatCurrency(), formatNumber() (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.22
Nodes (10): 6cc1ac5 feat(scout): implement full-page connection map svg component (TICKET-57), 8f33207 feat(scout): assemble connection map page (TICKET-58), CalculatedNode, ConnectionMap(), ConnectionMapProps, ConnectionType, MapEdge, MapNode (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.27
Nodes (9): DossierPageView(), 72063a3 feat(scout): assemble dossier page server component (TICKET-43), f05e3e2 feat(scout): implement connections and timeline component (TICKET-42), ConnectionItem, ConnectionsTimeline(), ConnectionsTimelineProps, TimelineLogItem, DossierPagePropsData (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.21
Nodes (6): QueueItem, QueueOptions, RequestPriority, RequestQueue, rpcQueue, 6d8ab15 feat(scout): setup 2-lane request queue (TICKET-11)

### Community 20 - "Community 20"
Cohesion: 0.21
Nodes (12): e9169fe feat(scout): implement centralized input sanitization and zod schema (TICKET-65), dossierItemsArraySchema, dossierItemStrictSchema, dossierPutStrictSchema, dossierQuestionsArraySchema, dossierQuestionStrictSchema, ethAddressSchema, importLibraryItemStrictSchema (+4 more)

### Community 21 - "Community 21"
Cohesion: 0.31
Nodes (7): 87705e2 feat(scout): implement constellation graph svg component (TICKET-38), ConnectionType, ConstellationEdge, ConstellationGraph(), ConstellationGraphProps, ConstellationNode, InternalConstellationNode

### Community 22 - "Community 22"
Cohesion: 0.28
Nodes (8): GET(), GetWatchlistResponseBody, handleGetWatchlist(), handlePostWatchlist(), POST(), PostWatchlistResponseBody, postWatchlistSchema, WatchlistEntryResult

### Community 23 - "Community 23"
Cohesion: 0.39
Nodes (5): 24fabc4 feat(scout): implement interactive wallet map svg component (TICKET-35), InternalBubble, WalletBubbleItem, WalletMap(), WalletMapProps

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (3): users, deleteAccountSchema, updateHandleSchema

### Community 25 - "Community 25"
Cohesion: 0.53
Nodes (4): 3fbdf94 feat(scout): implement trade flow chart svg component (TICKET-33), TradeCandleData, TradeFlowChart(), TradeFlowChartProps

### Community 26 - "Community 26"
Cohesion: 0.53
Nodes (4): 71bcf5c feat(scout): implement trade flow panel component (TICKET-34), TradeFlowData, TradeFlowPanel(), TradeFlowPanelProps

### Community 27 - "Community 27"
Cohesion: 0.53
Nodes (4): ddea6df feat(scout): implement top wallets table component (TICKET-36), TopWalletRow, TopWalletsTable(), TopWalletsTableProps

### Community 28 - "Community 28"
Cohesion: 0.53
Nodes (4): fa969bc feat(scout): implement deployer history timeline component (TICKET-37), DeployerHistory(), DeployerHistoryProps, DeployerLaunchItem

## Knowledge Gaps
- **143 isolated node(s):** `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody`, `addressSchema`, `addressSchema` (+138 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `db` connect `Community 9` to `Community 3`, `Community 10`, `Community 15`, `Community 14`, `Community 18`, `Community 4`, `Community 0`, `Community 24`, `Community 13`, `Community 8`, `Community 12`, `Community 22`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `getSession()` connect `Community 13` to `Community 3`, `Community 9`, `Community 10`, `Community 15`, `Community 0`, `Community 4`, `Community 24`, `Community 12`, `Community 22`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody` to the rest of the system?**
  _143 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05531135531135531 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05583972719522592 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07609427609427609 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.08244680851063829 - nodes in this community are weakly interconnected._