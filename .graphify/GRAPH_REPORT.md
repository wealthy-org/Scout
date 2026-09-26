# Graph Report - .  (2026-09-26)

## Corpus Check
- 250 files · ~87,482 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 776 nodes · 1969 edges · 33 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: imports: 568 · contains: 474 · imports_from: 365 · MODIFIES: 294 · ON_BRANCH: 100 · PARENT_OF: 98 · calls: 48 · inherits: 8 · references: 7 · method: 6 · re_exports: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 250 · Candidates: 344
- Excluded: 4 untracked · 44078 ignored · 1 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `c82b046`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `db` - 28 edges
2. `getSession()` - 25 edges
3. `Database` - 22 edges
4. `CookieStoreLike` - 21 edges
5. `Header()` - 15 edges
6. `dossiers` - 14 edges
7. `Dossier` - 10 edges
8. `TradeInspector()` - 8 edges
9. `RequestQueue` - 8 edges
10. `deployerScores` - 8 edges

## Surprising Connections (you probably didn't know these)
- `DELETE()` --calls--> `handleDeleteDossier()`  [EXTRACTED]
  app/api/publish/[ca]/route.ts → app/api/dossier/[ca]/route.ts

## Communities

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (18): GetCensusResponseBody, handleGetCensus(), GET(), CronCensusResponseBody, handleCronCensus(), POST(), metadata, RepeatLauncherInfo (+10 more)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (41): metadata, PageProps, generateMetadata(), metadata, metadata, metadata, metadata, UserProfileData (+33 more)

### Community 25 - "Community 25"
Cohesion: 0.29
Nodes (3): siteMetadata, 162f5fb feat(scout): setup dynamic sitemap, robots crawler rules, and seo metadata (TICKET-84), 2d6e90d docs(scout): document third-party open source licenses and attributions (TICKET-83)

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (21): handleLogout(), POST(), contractAddressSchema, generateMarkdownDossier(), handleGetDossierMarkdown(), GET(), handleGetLibraryExport(), GET() (+13 more)

### Community 15 - "Community 15"
Cohesion: 0.21
Nodes (12): handleNonce(), POST(), verifySchema, handleVerify(), POST(), sessionOptions, SessionData, CookieStoreLike (+4 more)

### Community 11 - "Community 11"
Cohesion: 0.16
Nodes (19): DossierGraphNode, ConnectionsResponseBody, handleGetConnections(), GET(), addressSchema, handleGetDeployerConnected(), GET(), ConnectionType (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (16): addressSchema, handleGetDeployerDossiers(), GET(), ScoutRemembersProps, ScoutRemembers(), DossierItemKind, DossierQuestion, DossierItemData (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (26): addressSchema, handleGetDeployer(), GET(), DeleteWatchlistResponseBody, handleDeleteWatchlist(), DELETE(), DeployerScore, DeployerLaunch (+18 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (17): contractAddressSchema, putDossierSchema, handlePutDossier(), handleDeleteDossier(), PUT(), DELETE(), addressSchema, publishBodySchema (+9 more)

### Community 26 - "Community 26"
Cohesion: 0.27
Nodes (5): FieldCondition, handleGetDossier(), GET(), dossierLog, mockData

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (14): singleImportItemSchema, importPayloadSchema, handlePostLibraryImport(), POST(), querySchema, handleGetLibrary(), GET(), getSession() (+6 more)

### Community 30 - "Community 30"
Cohesion: 0.29
Nodes (3): updateHandleSchema, deleteAccountSchema, users

### Community 19 - "Community 19"
Cohesion: 0.23
Nodes (11): PublicDossierResponseBody, handleGetPublicDossier(), GET(), SaveDossierResponseBody, handleSavePublicDossier(), POST(), globalForDb, Database (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.12
Nodes (14): WatchlistEntryResult, GetWatchlistResponseBody, PostWatchlistResponseBody, postWatchlistSchema, handleGetWatchlist(), handlePostWatchlist(), GET(), POST() (+6 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (50): DossierPageView(), ConnectionItem, TimelineLogItem, ConnectionsTimelineProps, ConnectionsTimeline(), ConnectionType, ConstellationNode, ConstellationEdge (+42 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (45): initialFeedItems, initialTrades, initialGraduations, watchedDeployers, FeedPollerProps, FeedPoller(), FeedTableTab, FeedTableRowData (+37 more)

### Community 24 - "Community 24"
Cohesion: 0.24
Nodes (5): geistSans, geistMono, TopProgressBar(), 407b913 feat(scout): setup tailwind v4 tokens and theme configuration (TICKET-01), metadata

### Community 17 - "Community 17"
Cohesion: 0.22
Nodes (10): defaultMockNodes, defaultMockEdges, ConnectionType, MapNode, MapEdge, ConnectionMapProps, CalculatedNode, ConnectionMap() (+2 more)

### Community 32 - "Community 32"
Cohesion: 0.60
Nodes (3): PublishDialogProps, PublishDialog(), 49106f2 feat(scout): implement publish dialog modal component (TICKET-63)

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (20): SinceLastCheckProps, SinceLastCheck(), DIFF_MARKET_APPEARED, DIFF_CURVE_GRADUATED, DIFF_FEE_RECIPIENT_CHANGED, DIFF_NEW_REPO_COMMIT, DIFF_NEW_DEPLOYER_LAUNCH, DIFF_FIELD_KEYS (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (43): CHAIN_ID, DEFAULT_RPC_URL, FACTORY_ADDRESS, MULTICALL3_ADDRESS, FIRST_BLOCK, TOKEN_LAUNCHED_ABI, CURVE_BUY_ABI, CURVE_SELL_ABI (+35 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (25): WEIGHT_GRAD_RATE, WEIGHT_NO_DOA, WEIGHT_NO_BURST, GRAD_NUMERATOR_ADD, GRAD_DENOMINATOR_ADD, SERIAL_ZERO_GRAD_CAP, SERIAL_ZERO_GRAD_THRESHOLD, LABEL_FRESH_MAX (+17 more)

### Community 18 - "Community 18"
Cohesion: 0.20
Nodes (11): DemoItem, DemoSnapshot, DemoDossier, DEMO_DOSSIERS, DEMO_SLUGS, getDemoDossier(), ExampleDeployer, EXAMPLE_DEPLOYERS (+3 more)

### Community 23 - "Community 23"
Cohesion: 0.20
Nodes (6): 1252f8e fix(db): isolate scout schema, add rollback script, update vercel cron and env example, 53e773f feat(scout): configure vercel cron for automated census trigger (TICKET-M05), 79b63db chore(scout): install and verify core dependencies (TICKET-05), b736ccb feat(scout): generate initial drizzle migrations (TICKET-08), cbb07ba feat(scout): setup drizzle schema definitions (TICKET-06), cc33127 feat(scout): setup drizzle client and configuration (TICKET-07)

### Community 22 - "Community 22"
Cohesion: 0.27
Nodes (11): scout.census_stats, scout.deployer_launches, scout.deployer_scores, scout.deployer_watchlist, scout.dossier_items, scout.dossier_log, scout.dossier_questions, scout.dossiers (+3 more)

### Community 27 - "Community 27"
Cohesion: 0.28
Nodes (6): eslintConfig, nextConfig, config, ccae023 Initial commit from Create Next App, ccae023 Initial commit from Create Next App, main

### Community 28 - "Community 28"
Cohesion: 0.25
Nodes (4): ApiSuccessResponse, ApiErrorResponse, ApiResponse, 07f29ab chore(scout): finalize scout dossiers ecosystem infrastructure and docs

### Community 21 - "Community 21"
Cohesion: 0.21
Nodes (6): RequestPriority, QueueOptions, QueueItem, RequestQueue, rpcQueue, 6d8ab15 feat(scout): setup 2-lane request queue (TICKET-11)

### Community 12 - "Community 12"
Cohesion: 0.09
Nodes (22): scoutSchema, usersRelations, dossiersRelations, dossierItemsRelations, dossierQuestionsRelations, dossierLogRelations, snapshotsRelations, publishedDossiersRelations (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (19): snapshots, SnapshotDataInput, SnapshotRecordLike, SaveSnapshotResult, stableStringify(), isSnapshotIdentical(), pruneSnapshots(), saveSnapshot() (+11 more)

### Community 29 - "Community 29"
Cohesion: 0.29
Nodes (4): 3cdeeea feat(scout): conduct wcag aa accessibility audit and keyboard focus styling (TICKET-85), 4892043 docs(scout): create testnet manual testing scenarios guide (TICKET-T01), 4cbf7b6 test(scout): execute testnet manual verification suite (TICKET-T03), fe4f37a docs(scout): document e2e testing strategy and qa protocol decision (TICKET-T02)

### Community 31 - "Community 31"
Cohesion: 0.40
Nodes (2): 12c695d feat(scout): verify production database migration dry-run (TICKET-M02), 8dad13e feat(scout): configure production build settings and smoke verification (TICKET-M03)

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (13): 078bb6c feat(scout): implement api get dossier endpoint (TICKET-21), 0cd7581 feat(scout): create seed dummy data script and fixtures (TICKET-09), 238f483 feat(scout): assemble watchlist monitor page (TICKET-69), 32f2dc6 feat(scout): implement api post publish dossier endpoint (TICKET-59), 3f2b165 feat(scout): implement api delete watchlist endpoint (TICKET-68), 44759ab feat(scout): setup viem client for robinhood chain (TICKET-10), 4b3f020 feat(scout): implement api get watchlist endpoint (TICKET-66), 82f8774 feat(scout): create dossier page static prototype (TICKET-30) (+5 more)

## Knowledge Gaps
- **143 isolated node(s):** `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody`, `addressSchema`, `addressSchema` (+138 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 31`** (2 nodes): `12c695d feat(scout): verify production database migration dry-run (TICKET-M02)`, `8dad13e feat(scout): configure production build settings and smoke verification (TICKET-M03)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `db` connect `Community 6` to `Community 13`, `Community 4`, `Community 10`, `Community 11`, `Community 19`, `Community 9`, `Community 1`, `Community 14`, `Community 8`, `Community 16`, `Community 0`, `Community 30`, `Community 26`, `Community 15`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `getSession()` connect `Community 16` to `Community 13`, `Community 4`, `Community 6`, `Community 15`, `Community 10`, `Community 11`, `Community 0`, `Community 14`, `Community 8`, `Community 30`, `Community 19`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody` to the rest of the system?**
  _143 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 6` be split into smaller, more focused modules?**
  _Cohesion score 0.1354679802955665 - nodes in this community are weakly interconnected._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05418227215980025 - nodes in this community are weakly interconnected._
- **Should `Community 8` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._
- **Should `Community 14` be split into smaller, more focused modules?**
  _Cohesion score 0.14210526315789473 - nodes in this community are weakly interconnected._