# Graph Report - .  (2026-09-26)

## Corpus Check
- 243 files · ~82,956 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 766 nodes · 1829 edges · 28 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: imports: 528 · contains: 474 · imports_from: 324 · MODIFIES: 241 · ON_BRANCH: 97 · PARENT_OF: 95 · calls: 48 · inherits: 8 · references: 7 · method: 6 · re_exports: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 243 · Candidates: 336
- Excluded: 8 untracked · 43877 ignored · 0 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `17dcf97`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `db` - 28 edges
2. `getSession()` - 25 edges
3. `Database` - 22 edges
4. `CookieStoreLike` - 21 edges
5. `dossiers` - 14 edges
6. `Dossier` - 10 edges
7. `RequestQueue` - 8 edges
8. `deployerScores` - 8 edges
9. `TradeInspector()` - 7 edges
10. `scout.dossiers` - 7 edges

## Surprising Connections (you probably didn't know these)
- `DELETE()` --calls--> `handleDeleteDossier()`  [EXTRACTED]
  app/api/publish/[ca]/route.ts → app/api/dossier/[ca]/route.ts

## Communities

### Community 22 - "Community 22"
Cohesion: 0.31
Nodes (5): metadata, FeaturedDossier, LandingClientProps, LandingClient(), 6c18511 feat(scout): assemble landing page with live case files and census stats (TICKET-74)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (4): HeaderProps, Header(), 17dcf97 feat(navigation): add top progress bar, route skeletons, library page & mobile responsive optimization (TICKET-86, TICKET-87, TICKET-88), 7deffdf feat(scout): implement global header navigation component (TICKET-47)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (14): geistSans, geistMono, TopProgressBar(), siteMetadata, eslintConfig, nextConfig, config, 162f5fb feat(scout): setup dynamic sitemap, robots crawler rules, and seo metadata (TICKET-84) (+6 more)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (73): handleLogout(), POST(), handleNonce(), POST(), verifySchema, handleVerify(), POST(), addressSchema (+65 more)

### Community 23 - "Community 23"
Cohesion: 0.31
Nodes (8): GetCensusResponseBody, handleGetCensus(), GET(), CronCensusResponseBody, handleCronCensus(), POST(), 2c0260b feat(scout): implement api get census stats endpoint (TICKET-71), 4258d74 feat(scout): implement api cron census aggregation endpoint (TICKET-72)

### Community 13 - "Community 13"
Cohesion: 0.16
Nodes (19): DossierGraphNode, ConnectionsResponseBody, handleGetConnections(), GET(), addressSchema, handleGetDeployerConnected(), GET(), ConnectionType (+11 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (26): addressSchema, handleGetDeployer(), GET(), DeleteWatchlistResponseBody, handleDeleteWatchlist(), DELETE(), DeployerScore, DeployerLaunch (+18 more)

### Community 25 - "Community 25"
Cohesion: 0.29
Nodes (3): updateHandleSchema, deleteAccountSchema, users

### Community 18 - "Community 18"
Cohesion: 0.24
Nodes (10): PublicDossierResponseBody, handleGetPublicDossier(), GET(), SaveDossierResponseBody, handleSavePublicDossier(), POST(), globalForDb, Database (+2 more)

### Community 21 - "Community 21"
Cohesion: 0.22
Nodes (10): WatchlistEntryResult, GetWatchlistResponseBody, PostWatchlistResponseBody, postWatchlistSchema, handleGetWatchlist(), handlePostWatchlist(), GET(), POST() (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.18
Nodes (10): metadata, metadata, metadata, UserProfileData, AccountClientProps, AccountClient(), 1ec916f feat(scout): implement synthetic demo dossier fixtures and routes (TICKET-80), 2f8f708 feat(scout): assemble technical documentation and api reference page (TICKET-79) (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.21
Nodes (10): metadata, CensusViewProps, CensusView(), RepeatLauncherInfo, CensusPayload, computeCensusStats(), saveCensusSnapshot(), db (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (45): DossierPageView(), ConnectionItem, TimelineLogItem, ConnectionsTimelineProps, ConnectionsTimeline(), ConnectionType, ConstellationNode, ConstellationEdge (+37 more)

### Community 15 - "Community 15"
Cohesion: 0.16
Nodes (12): PageProps, generateMetadata(), PublicDossierPayload, PublicDossierClientProps, PublicDossierClient(), DemoItem, DemoSnapshot, DemoDossier (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (31): PageProps, DeployerLaunchItem, DeployerProfileProps, DeployerProfileView(), WEIGHT_GRAD_RATE, WEIGHT_NO_DOA, WEIGHT_NO_BURST, GRAD_NUMERATOR_ADD (+23 more)

### Community 19 - "Community 19"
Cohesion: 0.21
Nodes (6): metadata, LibraryDossierCard, LibraryClientProps, LibraryClient(), DossierStatus, d92eda6 feat(scout): assemble dossiers library management page (TICKET-75)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (45): initialFeedItems, initialTrades, initialGraduations, watchedDeployers, FeedPollerProps, FeedPoller(), FeedTableTab, FeedTableRowData (+37 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (31): defaultMockNodes, defaultMockEdges, ConnectionType, MapNode, MapEdge, ConnectionMapProps, CalculatedNode, ConnectionMap() (+23 more)

### Community 24 - "Community 24"
Cohesion: 0.36
Nodes (5): metadata, WatchlistItem, WatchlistClientProps, WatchlistClient(), 238f483 feat(scout): assemble watchlist monitor page (TICKET-69)

### Community 27 - "Community 27"
Cohesion: 0.60
Nodes (3): PublishDialogProps, PublishDialog(), 49106f2 feat(scout): implement publish dialog modal component (TICKET-63)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (24): ResearchPanelProps, ResearchPanel(), ScoutRemembersProps, ScoutRemembers(), DossierItemKind, ApiSuccessResponse, ApiErrorResponse, ApiResponse (+16 more)

### Community 9 - "Community 9"
Cohesion: 0.17
Nodes (20): SinceLastCheckProps, SinceLastCheck(), DIFF_MARKET_APPEARED, DIFF_CURVE_GRADUATED, DIFF_FEE_RECIPIENT_CHANGED, DIFF_NEW_REPO_COMMIT, DIFF_NEW_DEPLOYER_LAUNCH, DIFF_FIELD_KEYS (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (43): CHAIN_ID, DEFAULT_RPC_URL, FACTORY_ADDRESS, MULTICALL3_ADDRESS, FIRST_BLOCK, TOKEN_LAUNCHED_ABI, CURVE_BUY_ABI, CURVE_SELL_ABI (+35 more)

### Community 26 - "Community 26"
Cohesion: 0.60
Nodes (4): ExampleDeployer, EXAMPLE_DEPLOYERS, getExampleDeployerByArchetype(), a1128f0 feat(scout): define real archetype deployer example constants (TICKET-81)

### Community 20 - "Community 20"
Cohesion: 0.27
Nodes (11): scout.census_stats, scout.deployer_launches, scout.deployer_scores, scout.deployer_watchlist, scout.dossier_items, scout.dossier_log, scout.dossier_questions, scout.dossiers (+3 more)

### Community 17 - "Community 17"
Cohesion: 0.21
Nodes (6): RequestPriority, QueueOptions, QueueItem, RequestQueue, rpcQueue, 6d8ab15 feat(scout): setup 2-lane request queue (TICKET-11)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (25): scoutSchema, publishedDossiers, deployerLaunches, censusStats, usersRelations, dossiersRelations, dossierItemsRelations, dossierQuestionsRelations (+17 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (19): snapshots, SnapshotDataInput, SnapshotRecordLike, SaveSnapshotResult, stableStringify(), isSnapshotIdentical(), pruneSnapshots(), saveSnapshot() (+11 more)

## Knowledge Gaps
- **143 isolated node(s):** `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody`, `addressSchema`, `addressSchema` (+138 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `db` connect `Community 16` to `Community 5`, `Community 7`, `Community 22`, `Community 0`, `Community 23`, `Community 13`, `Community 18`, `Community 11`, `Community 1`, `Community 19`, `Community 14`, `Community 25`, `Community 10`, `Community 15`, `Community 24`, `Community 21`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `getSession()` connect `Community 0` to `Community 5`, `Community 7`, `Community 22`, `Community 16`, `Community 13`, `Community 14`, `Community 19`, `Community 25`, `Community 18`, `Community 24`, `Community 21`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody` to the rest of the system?**
  _143 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 12` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Community 8` be split into smaller, more focused modules?**
  _Cohesion score 0.0960591133004926 - nodes in this community are weakly interconnected._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05176116838487973 - nodes in this community are weakly interconnected._
- **Should `Community 7` be split into smaller, more focused modules?**
  _Cohesion score 0.08901515151515152 - nodes in this community are weakly interconnected._