# Node Description Batch 1 of 20

Graphify is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the prompt below and write
your JSON answer to the answer file.

## Prompt

You are documenting nodes in a knowledge graph.
For each entry below, write ONE concise factual plain-language sentence
describing what it is or does. Use only the provided context.
For a code symbol (kind=code-symbol — a function, class, or constant),
describe what the function/symbol does based on its name, source location
and neighbors — e.g. "Resolves the configured ontology profile from graphify.yaml.".
For an entity node (any other kind — e.g. a person, place, event, object),
describe what the entity is and its role, grounded in its type, its
relations (neighbors) and the provided citations/evidence — e.g.
"Lady Carfax, a wealthy heiress who disappears en route to Lausanne.".
Ground entity descriptions in the citations/evidence when present; do not
speculate beyond the context, so a node with no supporting context may be
left out of the reply.
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "branch:repo:github.com/wealthy-org/Scout#main": "main" | kind=Branch | source=git | neighbors=[006e480 feat(scout): implement siwe log…, 05d0de3 feat(scout): implement public a…, 078bb6c feat(scout): implement api get …, 07f29ab chore(scout): finalize scout do…, 09d22b5 feat(scout): implement api get …, 0cd7581 feat(scout): create seed dummy …]
- "db_schema": "schema.ts" | kind=code-symbol | source=lib/db/schema.ts:L1 | neighbors=[page.tsx, route.ts, page.tsx, route.ts, compute.ts, page.tsx]
- "tests_route_test": "route.test.ts" | kind=code-symbol | source=app/api/library/import/__tests__/route.test.ts:L1 | neighbors=[006e480 feat(scout): implement siwe log…, 07f29ab chore(scout): finalize scout do…, 09d22b5 feat(scout): implement api get …, 127516d feat(scout): implement api depl…, 2354fd8 feat(scout): implement siwe non…, 261544b feat(scout): implement api get …]
- "ca_route": "route.ts" | kind=code-symbol | source=app/api/publish/[ca]/route.ts:L1 | neighbors=[session.ts, getSession(), addressSchema, contractAddressSchema, DELETE(), generateSlug()]
- "db_index": "index.ts" | kind=code-symbol | source=lib/db/index.ts:L1 | neighbors=[page.tsx, route.ts, page.tsx, route.ts, compute.ts, page.tsx]
- "commit:repo:github.com/wealthy-org/Scout@6aec8fea2dd7d2a4e1ef36bc45fee504ff5fad79": "6aec8fe feat(ui): overhaul ui with chroma high-chroma colorful design system an…" | kind=Commit | source=git | neighbors=[17dcf97 feat(navigation): add top progr…, AccountClient.tsx, page.tsx, main, page.tsx, CensusView.tsx]
- "tests_page_test": "page.test.tsx" | kind=code-symbol | source=app/watchlist/__tests__/page.test.tsx:L1 | neighbors=[17dcf97 feat(navigation): add top progr…, 1ec916f feat(scout): implement syntheti…, 238f483 feat(scout): assemble watchlist…, 2f8f708 feat(scout): assemble technical…, 5b836fa feat(scout): assemble deployer …, 63de350 feat(scout): assemble ecosystem…]
- "address_route": "route.ts" | kind=code-symbol | source=app/api/watchlist/[address]/route.ts:L1 | neighbors=[addressSchema, DELETE(), DeleteWatchlistResponseBody, GET(), handleDeleteWatchlist(), handleGetDeployer()]
- "ca_page": "page.tsx" | kind=code-symbol | source=app/d/[ca]/page.tsx:L1 | neighbors=[DossierPage(), DossierPageView(), ConnectionsTimeline.tsx, ConnectionsTimeline(), ConstellationGraph.tsx, ConstellationGraph()]
- "auth_session": "session.ts" | kind=code-symbol | source=lib/auth/session.ts:L1 | neighbors=[page.tsx, route.ts, page.tsx, getPassword(), getSession(), sessionOptions]
- "dossier_fetch": "fetch.ts" | kind=code-symbol | source=lib/dossier/fetch.ts:L1 | neighbors=[page.tsx, 72063a3 feat(scout): assemble dossier p…, index.ts, db, schema.ts, deployerLaunches]
- "types_dossier": "dossier.ts" | kind=code-symbol | source=types/dossier.ts:L1 | neighbors=[route.ts, 07f29ab chore(scout): finalize scout do…, fetch.ts, ResearchPanel.tsx, ScoutRemembers.tsx, route.ts]
- "chain_events": "events.ts" | kind=code-symbol | source=lib/chain/events.ts:L1 | neighbors=[client.ts, publicClient, fetchCurveBuy(), fetchCurveSell(), fetchPoolGraduated(), fetchTokenLaunched()]
- "db_index_db": "db" | kind=code-symbol | source=lib/db/index.ts:L26 | neighbors=[page.tsx, route.ts, page.tsx, route.ts, compute.ts, page.tsx]
- "types_auth": "auth.ts" | kind=code-symbol | source=types/auth.ts:L1 | neighbors=[route.ts, session.ts, route.ts, 2354fd8 feat(scout): implement siwe non…, route.ts, route.ts]
- "feed_page": "page.tsx" | kind=code-symbol | source=app/feed/page.tsx:L1 | neighbors=[6aec8fe feat(ui): overhaul ui with chro…, 7ab9268 feat(scout): assemble realtime …, FeedPoller.tsx, FeedPoller(), FeedTable.tsx, FeedTable()]
- "auth_session_getsession": "getSession()" | kind=code-symbol | source=lib/auth/session.ts:L28 | neighbors=[page.tsx, route.ts, page.tsx, session.ts, route.ts, page.tsx]
- "config_score": "score.ts" | kind=code-symbol | source=config/score.ts:L1 | neighbors=[795ff3b feat(scout): setup score formul…, BAND_GREEN_MIN, BAND_YELLOW_MIN, GRAD_DENOMINATOR_ADD, GRAD_NUMERATOR_ADD, LABEL_FRESH_MAX]
- "score_calculate": "calculate.ts" | kind=code-symbol | source=lib/score/calculate.ts:L1 | neighbors=[page.tsx, route.ts, a5ce11b feat(scout): implement deployer…, score.ts, BAND_GREEN_MIN, BAND_YELLOW_MIN]
- "tests_get_route_test": "get-route.test.ts" | kind=code-symbol | source=app/api/watchlist/__tests__/get-route.test.ts:L1 | neighbors=[078bb6c feat(scout): implement api get …, 4b3f020 feat(scout): implement api get …, c9f59e2 feat(scout): implement api get …, route.ts, GET(), handleGetDossier()]
- "commit:repo:github.com/wealthy-org/Scout@17dcf97efb549ee981364cfc9d9218c2cae38c15": "17dcf97 feat(navigation): add top progress bar, route skeletons, library page &…" | kind=Commit | source=git | neighbors=[1252f8e fix(db): isolate scout schema, …, layout.tsx, loading.tsx, main, loading.tsx, CensusView.tsx]
- "import_route": "route.ts" | kind=code-symbol | source=app/api/library/import/route.ts:L1 | neighbors=[439c457 feat(scout): implement api post…, session.ts, getSession(), index.ts, Database, db]
- "layout_globalheader": "GlobalHeader.tsx" | kind=code-symbol | source=components/layout/GlobalHeader.tsx:L1 | neighbors=[AccountClient.tsx, CensusView.tsx, 7deffdf feat(scout): implement global h…, DeployerProfileView.tsx, page.tsx, chroma-visual-verification.test.tsx]
- "watchlist_route": "route.ts" | kind=code-symbol | source=app/api/watchlist/route.ts:L1 | neighbors=[4b3f020 feat(scout): implement api get …, get-route.test.ts, post-route.test.ts, session.ts, getSession(), index.ts]
- "db_index_database": "Database" | kind=code-symbol | source=lib/db/index.ts:L27 | neighbors=[route.ts, route.ts, compute.ts, route.ts, route.ts, route.ts]
- "e2e_chroma_visual_verification_test": "chroma-visual-verification.test.tsx" | kind=code-symbol | source=tests/e2e/chroma-visual-verification.test.tsx:L1 | neighbors=[6aec8fe feat(ui): overhaul ui with chro…, AccountClient.tsx, AccountClient(), page.tsx, DossierPageView(), CensusView.tsx]
- "export_md_route": "route.ts" | kind=code-symbol | source=app/api/dossier/[ca]/export.md/route.ts:L1 | neighbors=[fc157fe feat(scout): implement api get …, session.ts, getSession(), index.ts, Database, db]
- "app_page": "page.tsx" | kind=code-symbol | source=app/page.tsx:L1 | neighbors=[HomePage(), metadata, session.ts, getSession(), compute.ts, CensusPayload]
- "dossiers_route": "route.ts" | kind=code-symbol | source=app/api/deployer/[address]/dossiers/route.ts:L1 | neighbors=[3b9584c feat(scout): implement api get …, session.ts, getSession(), index.ts, Database, db]
- "layout_header": "Header.tsx" | kind=code-symbol | source=components/layout/Header.tsx:L1 | neighbors=[loading.tsx, loading.tsx, loading.tsx, 17dcf97 feat(navigation): add top progr…, 588280e feat(design-system): overhaul t…, 6aec8fe feat(ui): overhaul ui with chro…]
- "slug_page": "page.tsx" | kind=code-symbol | source=app/p/[slug]/page.tsx:L1 | neighbors=[1ec916f feat(scout): implement syntheti…, 90f490e fix(ui): overhaul route loading…, e12a92e feat(scout): assemble public do…, demo.ts, DEMO_SLUGS, getDemoDossier()]
- "types_auth_cookiestorelike": "CookieStoreLike" | kind=code-symbol | source=types/auth.ts:L6 | neighbors=[route.ts, session.ts, route.ts, route.ts, route.ts, route.ts]
- "config_chain": "chain.ts" | kind=code-symbol | source=config/chain.ts:L1 | neighbors=[client.ts, events.ts, multicall.ts, b84d454 feat(scout): setup chain config…, CHAIN_ID, CURVE_BUY_ABI]
- "connected_route": "route.ts" | kind=code-symbol | source=app/api/deployer/[address]/connected/route.ts:L1 | neighbors=[127516d feat(scout): implement api depl…, session.ts, getSession(), addressSchema, GET(), handleGetDeployerConnected()]
- "connections_route": "route.ts" | kind=code-symbol | source=app/api/connections/route.ts:L1 | neighbors=[127516d feat(scout): implement api depl…, route.ts, session.ts, getSession(), engine.ts, ConnectionLink]
- "library_route": "route.ts" | kind=code-symbol | source=app/api/library/route.ts:L1 | neighbors=[9d2b0cc feat(scout): implement api get …, session.ts, getSession(), index.ts, Database, db]
- "scripts_seed": "seed.ts" | kind=code-symbol | source=scripts/seed.ts:L1 | neighbors=[0cd7581 feat(scout): create seed dummy …, index.ts, db, schema.ts, censusStats, deployerLaunches]
- "address_page": "page.tsx" | kind=code-symbol | source=app/deployer/[address]/page.tsx:L1 | neighbors=[DeployerPage(), generateMetadata(), PageProps, session.ts, getSession(), index.ts]
- "census_compute": "compute.ts" | kind=code-symbol | source=lib/census/compute.ts:L1 | neighbors=[page.tsx, CensusView.tsx, CensusPayload, computeCensusStats(), RepeatLauncherInfo, saveCensusSnapshot()]
- "config_diff": "diff.ts" | kind=code-symbol | source=config/diff.ts:L1 | neighbors=[16a3b8b feat(scout): setup diff thresho…, DIFF_BOOLEAN_TRIGGERS, DIFF_CURVE_GRADUATED, DIFF_FEE_RECIPIENT_CHANGED, DIFF_FIELD_KEYS, DIFF_MARKET_APPEARED]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/raka/Developer/repositories/projects/wealthy-people-org/scout-dir/scout/.graphify/description-instructions/batch-000.json

Keep each description factual and concise (one sentence). No markdown, no prose
outside the JSON object. It is acceptable to omit a node if context is
insufficient — but include every node you can ground confidently.

Example answer format:
```json
{
  "node_id_1": "Resolves the configured ontology profile from graphify.yaml.",
  "node_id_2": "Colonel James Barclay, an antagonist in The Crooked Man."
}
```
