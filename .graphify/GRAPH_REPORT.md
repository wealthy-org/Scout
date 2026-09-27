# Graph Report - .  (2026-09-27)

## Corpus Check
- 258 files · ~204,268 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 780 nodes · 2042 edges · 24 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: imports: 568 · contains: 474 · imports_from: 373 · MODIFIES: 351 · ON_BRANCH: 104 · PARENT_OF: 102 · calls: 48 · inherits: 8 · references: 7 · method: 6 · re_exports: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 258 · Candidates: 352
- Excluded: 3 untracked · 44160 ignored · 1 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `f92a361`
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

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (37): AccountClient(), AccountClientProps, UserProfileData, CensusView(), CensusViewProps, metadata, 0ec1fbb feat: implement pure vector 3D stacked discs and skymoney protocol showcase banner, 17dcf97 feat(navigation): add top progress bar, route skeletons, library page & mobile responsive optimization (TICKET-86, TICKET-87, TICKET-88) (+29 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (45): DossierPageView(), 24fabc4 feat(scout): implement interactive wallet map svg component (TICKET-35), 36616f6 feat(scout): implement market and flow block component (TICKET-32), 3fbdf94 feat(scout): implement trade flow chart svg component (TICKET-33), 71bcf5c feat(scout): implement trade flow panel component (TICKET-34), 72063a3 feat(scout): assemble dossier page server component (TICKET-43), 87705e2 feat(scout): implement constellation graph svg component (TICKET-38), a5a987e feat(scout): implement dossier header component (TICKET-31) (+37 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (45): 31392cc feat(scout): implement trade inspector drawer component (TICKET-52), 3b8f413 feat(scout): implement launch feed polling engine (TICKET-49), 4df7cfa feat(scout): implement feed summary metric tiles component (TICKET-50), 7ab9268 feat(scout): assemble realtime launch feed page (TICKET-54), b3e9616 feat(scout): implement live trade tape and graduation tape components (TICKET-53), b4b770e feat(scout): implement 4-tab filter feed table component (TICKET-51), f8e990e feat(scout): implement ticker tape marquee component (TICKET-48), FeedPoller() (+37 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (42): createTransport(), getPublicClient(), publicClient, robinhoodChain, fetchCurveBuy(), fetchCurveSell(), fetchPoolGraduated(), fetchTokenLaunched() (+34 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (34): main, 078bb6c feat(scout): implement api get dossier endpoint (TICKET-21), 07f29ab chore(scout): finalize scout dossiers ecosystem infrastructure and docs, 09d22b5 feat(scout): implement api get deployer profile endpoint (TICKET-24), 0cd7581 feat(scout): create seed dummy data script and fixtures (TICKET-09), 1252f8e fix(db): isolate scout schema, add rollback script, update vercel cron and env example, 12c695d feat(scout): verify production database migration dry-run (TICKET-M02), 238f483 feat(scout): assemble watchlist monitor page (TICKET-69) (+26 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (28): PageProps, 795ff3b feat(scout): setup score formula parameters and types (TICKET-03), e9816df test(scout): add unit tests for deployer score formula (TICKET-18), BAND_GREEN_MIN, BAND_YELLOW_MIN, GRAD_DENOMINATOR_ADD, GRAD_NUMERATOR_ADD, LABEL_FRESH_MAX (+20 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (26): handlePutDossier(), PUT(), 4a058d9 feat(scout): implement research panel component with debounced autosave (TICKET-39), f7850db feat(scout): implement scout remembers connected dossiers component (TICKET-41), DossierItemKind, ResearchPanel(), ResearchPanelProps, ScoutRemembers() (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (26): addressSchema, DELETE(), DeleteWatchlistResponseBody, GET(), handleDeleteWatchlist(), handleGetDeployer(), 05d0de3 feat(scout): implement public api rate limiting middleware (TICKET-82), e9169fe feat(scout): implement centralized input sanitization and zod schema (TICKET-65) (+18 more)

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (19): metadata, CensusPayload, computeCensusStats(), RepeatLauncherInfo, saveCensusSnapshot(), CronCensusResponseBody, GET(), GetCensusResponseBody (+11 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (21): 1ec916f feat(scout): implement synthetic demo dossier fixtures and routes (TICKET-80), 49106f2 feat(scout): implement publish dialog modal component (TICKET-63), a1128f0 feat(scout): define real archetype deployer example constants (TICKET-81), e12a92e feat(scout): assemble public dossier view page (TICKET-64), DEMO_DOSSIERS, DEMO_SLUGS, DemoDossier, DemoItem (+13 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (21): getSession(), sessionOptions, 006e480 feat(scout): implement siwe logout endpoint (TICKET-14), 2354fd8 feat(scout): implement siwe nonce endpoint (TICKET-12), 73c8e8a feat(scout): implement siwe verify endpoint (TICKET-13), generateMarkdownDossier(), GET(), handleGetDossierMarkdown() (+13 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (23): GET(), handleGetDossier(), c9f59e2 feat(scout): implement api get public dossier endpoint (TICKET-61), dc8d660 feat(scout): implement api post save copy dossier endpoint (TICKET-62), Database, publishedDossiers, Snapshot, handleSavePublicDossier() (+15 more)

### Community 12 - "Community 12"
Cohesion: 0.07
Nodes (26): deployerScores, deployerWatchlist, deployerWatchlistRelations, dossierItemsRelations, dossierLogRelations, dossierQuestionsRelations, dossiersRelations, NewCensusStats (+18 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (20): 16a3b8b feat(scout): setup diff thresholds configuration and triggers (TICKET-04), 919d12f feat(scout): implement since last check diff component (TICKET-40), 92cedc3 test(scout): add unit tests for diff comparison (TICKET-20), 9f360e4 feat(scout): implement snapshot diff comparison logic (TICKET-19), DIFF_BOOLEAN_TRIGGERS, DIFF_CURVE_GRADUATED, DIFF_FEE_RECIPIENT_CHANGED, DIFF_FIELD_KEYS (+12 more)

### Community 14 - "Community 14"
Cohesion: 0.10
Nodes (13): geistMono, geistSans, metadata, main, 162f5fb feat(scout): setup dynamic sitemap, robots crawler rules, and seo metadata (TICKET-84), 2d6e90d docs(scout): document third-party open source licenses and attributions (TICKET-83), 407b913 feat(scout): setup tailwind v4 tokens and theme configuration (TICKET-01), ccae023 Initial commit from Create Next App (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.12
Nodes (18): 247006d feat(scout): create landing page and feed static prototypes (TICKET-46), 7b6f3f4 feat(scout): implement dexscreener price quote fetcher (TICKET-44), fbcf2dd feat(scout): implement snapshot system helper and pruning (TICKET-45), isSnapshotIdentical(), pruneSnapshots(), saveSnapshot(), SaveSnapshotResult, SnapshotDataInput (+10 more)

### Community 16 - "Community 16"
Cohesion: 0.16
Nodes (19): 127516d feat(scout): implement api deployer connected dossiers graph (TICKET-56), 7588cce feat(scout): implement connection detection engine (TICKET-55), addressSchema, GET(), handleGetDeployerConnected(), ConnectionLink, ConnectionReason, ConnectionType (+11 more)

### Community 17 - "Community 17"
Cohesion: 0.19
Nodes (13): deployerLaunches, DossierItem, dossierItems, DossierQuestion, dossierQuestions, dossiers, snapshots, addressSchema (+5 more)

### Community 18 - "Community 18"
Cohesion: 0.19
Nodes (12): addressSchema, contractAddressSchema, DELETE(), generateSlug(), handleDeleteDossier(), handlePublishDossier(), handleRevokePublish(), POST() (+4 more)

### Community 19 - "Community 19"
Cohesion: 0.22
Nodes (10): 6cc1ac5 feat(scout): implement full-page connection map svg component (TICKET-57), 8f33207 feat(scout): assemble connection map page (TICKET-58), CalculatedNode, ConnectionMap(), ConnectionMapProps, ConnectionType, MapEdge, MapNode (+2 more)

### Community 20 - "Community 20"
Cohesion: 0.21
Nodes (6): QueueItem, QueueOptions, RequestPriority, RequestQueue, rpcQueue, 6d8ab15 feat(scout): setup 2-lane request queue (TICKET-11)

### Community 21 - "Community 21"
Cohesion: 0.19
Nodes (11): Dossier, DOSSIER_ITEM_KINDS, DOSSIER_STATUSES, dossierLog, handlePostLibraryImport(), importPayloadSchema, POST(), singleImportItemSchema (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.27
Nodes (11): scout.census_stats, scout.deployer_launches, scout.deployer_scores, scout.deployer_watchlist, scout.dossier_items, scout.dossier_log, scout.dossier_questions, scout.dossiers (+3 more)

### Community 23 - "Community 23"
Cohesion: 0.29
Nodes (3): users, deleteAccountSchema, updateHandleSchema

## Knowledge Gaps
- **143 isolated node(s):** `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody`, `addressSchema`, `addressSchema` (+138 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `db` connect `Community 8` to `Community 5`, `Community 7`, `Community 18`, `Community 16`, `Community 15`, `Community 1`, `Community 17`, `Community 21`, `Community 0`, `Community 23`, `Community 11`, `Community 9`, `Community 10`, `Community 12`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `getSession()` connect `Community 10` to `Community 5`, `Community 7`, `Community 8`, `Community 18`, `Community 16`, `Community 0`, `Community 17`, `Community 21`, `Community 23`, `Community 11`, `Community 12`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `verifySchema`, `GetCensusResponseBody`, `CronCensusResponseBody` to the rest of the system?**
  _143 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06741250717154332 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06223358908780904 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05583972719522592 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.07982583454281568 - nodes in this community are weakly interconnected._