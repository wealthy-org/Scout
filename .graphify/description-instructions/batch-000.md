# Node Description Batch 1 of 25

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
LANGUAGE: each entry has a `lang=` marker giving the language of its source.
Write that entry's description in EXACTLY that language. Do not translate to
a single common language — match each node's source language individually.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "branch:repo:github.com/wealthy-org/Scout#main": "main" | kind=Branch | source=git | neighbors=[004100e feat: make deployer profile com…, 006e480 feat(scout): implement siwe log…, 02618b0 refactor(how): replace repetiti…, 052102a fix: lock steady container heig…, 05d0de3 feat(scout): implement public a…, 06e5cce feat: replace symbols and emoji…] | lang=en
- "db_schema": "schema.ts" | kind=code-symbol | source=lib/db/schema.ts:L1 | neighbors=[page.tsx, route.ts, page.tsx, route.ts, compute.ts, page.tsx] | lang=en
- "tests_route_test": "route.test.ts" | kind=code-symbol | source=app/api/library/import/__tests__/route.test.ts:L1 | neighbors=[006e480 feat(scout): implement siwe log…, 07f29ab chore(scout): finalize scout do…, 09d22b5 feat(scout): implement api get …, 127516d feat(scout): implement api depl…, 155086e fix(lint): manually resolve all…, 2354fd8 feat(scout): implement siwe non…] | lang=en
- "icons_vectors": "Vectors.tsx" | kind=code-symbol | source=components/icons/Vectors.tsx:L1 | neighbors=[AccountClient.tsx, CensusView.tsx, 06e5cce feat: replace symbols and emoji…, 792164b feat: overhaul how methodology …, b05f2f9 feat(feed-dossier): implement l…, DeployerProfileView.tsx] | lang=en
- "commit:repo:github.com/wealthy-org/Scout@f92a361b9c13a890e157735e96cf9210f2de03d5": "f92a361 feat(ui): implement tosca canvas and colorful pop design system across …" | kind=Commit | source=git | neighbors=[588280e feat(design-system): overhaul t…, AccountClient.tsx, page.tsx, layout.tsx, loading.tsx, main] | lang=en
- "ca_route": "route.ts" | kind=code-symbol | source=app/api/publish/[ca]/route.ts:L1 | neighbors=[session.ts, getSession(), addressSchema, contractAddressSchema, DELETE(), generateSlug()] | lang=en
- "landing_landingclient": "LandingClient.tsx" | kind=code-symbol | source=components/landing/LandingClient.tsx:L1 | neighbors=[page.tsx, 06e5cce feat: replace symbols and emoji…, 0ec1fbb feat: implement pure vector 3D …, 17dcf97 feat(navigation): add top progr…, 22d2e90 feat(ui): redesign landing hero…, 2af4b43 feat(ui): add 3d planetary orbi…] | lang=en
- "ca_page": "page.tsx" | kind=code-symbol | source=app/d/[ca]/page.tsx:L1 | neighbors=[session.ts, getSession(), DossierPage(), DossierClientView.tsx, DossierClientView(), fetch.ts] | lang=en
- "db_index": "index.ts" | kind=code-symbol | source=lib/db/index.ts:L1 | neighbors=[page.tsx, route.ts, page.tsx, route.ts, compute.ts, page.tsx] | lang=en
- "address_route": "route.ts" | kind=code-symbol | source=app/api/watchlist/[address]/route.ts:L1 | neighbors=[addressSchema, DELETE(), DeleteWatchlistResponseBody, GET(), handleDeleteWatchlist(), handleGetDeployer()] | lang=en
- "dossier_fetch": "fetch.ts" | kind=code-symbol | source=lib/dossier/fetch.ts:L1 | neighbors=[page.tsx, 72063a3 feat(scout): assemble dossier p…, 8b6a97a feat: enhance research workspac…, b05f2f9 feat(feed-dossier): implement l…, DossierClientView.tsx, fetchDossierPageData()] | lang=en
- "tests_page_test": "page.test.tsx" | kind=code-symbol | source=app/watchlist/__tests__/page.test.tsx:L1 | neighbors=[17dcf97 feat(navigation): add top progr…, 1ec916f feat(scout): implement syntheti…, 238f483 feat(scout): assemble watchlist…, 2f8f708 feat(scout): assemble technical…, 42f1b99 fix(ui): refine anti-slop hones…, 5b836fa feat(scout): assemble deployer …] | lang=en
- "commit:repo:github.com/wealthy-org/Scout@6aec8fea2dd7d2a4e1ef36bc45fee504ff5fad79": "6aec8fe feat(ui): overhaul ui with chroma high-chroma colorful design system an…" | kind=Commit | source=git | neighbors=[17dcf97 feat(navigation): add top progr…, AccountClient.tsx, page.tsx, main, page.tsx, CensusView.tsx] | lang=en
- "feed_page": "page.tsx" | kind=code-symbol | source=app/feed/page.tsx:L1 | neighbors=[155086e fix(lint): manually resolve all…, 1a8ede4 feat(feed): implement continuou…, 42f1b99 fix(ui): refine anti-slop hones…, 6aec8fe feat(ui): overhaul ui with chro…, 7ab9268 feat(scout): assemble realtime …, 8b6a97a feat: enhance research workspac…] | lang=en
- "chain_events": "events.ts" | kind=code-symbol | source=lib/chain/events.ts:L1 | neighbors=[page.tsx, route.ts, client.ts, publicClient, ChainEventParseError, fetchCurveBuy()] | lang=en
- "e2e_chroma_visual_verification_test": "chroma-visual-verification.test.tsx" | kind=code-symbol | source=tests/e2e/chroma-visual-verification.test.tsx:L1 | neighbors=[6aec8fe feat(ui): overhaul ui with chro…, a35867f feat(ui): align all route loadi…, b55c1b8 feat(ui): elevate hero 3D gyros…, f92a361 feat(ui): implement tosca canva…, AccountClient.tsx, AccountClient()] | lang=en
- "auth_session": "session.ts" | kind=code-symbol | source=lib/auth/session.ts:L1 | neighbors=[page.tsx, route.ts, layout.tsx, page.tsx, getPassword(), getSession()] | lang=en
- "dossier_transform": "transform.ts" | kind=code-symbol | source=lib/dossier/transform.ts:L1 | neighbors=[2af4b43 feat(ui): add 3d planetary orbi…, 8b6a97a feat: enhance research workspac…, 97e2d76 fix(dossier): populate rich mul…, a1295a9 fix(dossier): resolve dynamic t…, b05f2f9 feat(feed-dossier): implement l…, fetch.ts] | lang=en
- "layout_header": "Header.tsx" | kind=code-symbol | source=components/layout/Header.tsx:L1 | neighbors=[loading.tsx, 155086e fix(lint): manually resolve all…, 17dcf97 feat(navigation): add top progr…, 2de890a refactor(layout): remove block …, 42f1b99 fix(ui): refine anti-slop hones…, 588280e feat(design-system): overhaul t…] | lang=en
- "census_censusview": "CensusView.tsx" | kind=code-symbol | source=components/census/CensusView.tsx:L1 | neighbors=[CensusView(), CensusViewProps, compute.ts, CensusPayload, Vectors.tsx, IconAlert()] | lang=en
- "db_index_db": "db" | kind=code-symbol | source=lib/db/index.ts:L26 | neighbors=[page.tsx, route.ts, page.tsx, route.ts, compute.ts, page.tsx] | lang=en
- "types_dossier": "dossier.ts" | kind=code-symbol | source=types/dossier.ts:L1 | neighbors=[route.ts, 07f29ab chore(scout): finalize scout do…, ResearchPanel.tsx, ScoutRemembers.tsx, transform.ts, route.ts] | lang=en
- "commit:repo:github.com/wealthy-org/Scout@8b6a97a6532b2488d5b3de4de0a2636055395078": "8b6a97a feat: enhance research workspace layout, deployer metrics & watchlist r…" | kind=Commit | source=git | neighbors=[page.tsx, route.ts, route.ts, main, page.tsx, compute.ts] | lang=pt
- "dossier_dossierclientview": "DossierClientView.tsx" | kind=code-symbol | source=components/dossier/DossierClientView.tsx:L1 | neighbors=[page.tsx, ConnectionsTimeline.tsx, ConnectionsTimeline(), ConstellationGraph.tsx, ConstellationGraph(), DeployerHistory.tsx] | lang=en
- "feed_feedtable": "FeedTable.tsx" | kind=code-symbol | source=components/feed/FeedTable.tsx:L1 | neighbors=[06e5cce feat: replace symbols and emoji…, 1a8ede4 feat(feed): implement continuou…, 2af4b43 feat(ui): add 3d planetary orbi…, 588280e feat(design-system): overhaul t…, 6aec8fe feat(ui): overhaul ui with chro…, 8b6a97a feat: enhance research workspac…] | lang=en
- "how_howclient": "HowClient.tsx" | kind=code-symbol | source=components/how/HowClient.tsx:L1 | neighbors=[02618b0 refactor(how): replace repetiti…, 155086e fix(lint): manually resolve all…, 19ac213 feat(docs,how): add sticky side…, 380c7ab style(how,docs): redesign /how …, 482dea9 perf(layout): optimize mobile a…, 58c326f style: apply neo-brutalist card…] | lang=en
- "layout_globalheader": "GlobalHeader.tsx" | kind=code-symbol | source=components/layout/GlobalHeader.tsx:L1 | neighbors=[AccountClient.tsx, loading.tsx, loading.tsx, CensusView.tsx, loading.tsx, 7deffdf feat(scout): implement global h…] | lang=en
- "library_libraryclient": "LibraryClient.tsx" | kind=code-symbol | source=components/library/LibraryClient.tsx:L1 | neighbors=[06e5cce feat: replace symbols and emoji…, 17dcf97 feat(navigation): add top progr…, 2af4b43 feat(ui): add 3d planetary orbi…, 6aec8fe feat(ui): overhaul ui with chro…, b05f2f9 feat(feed-dossier): implement l…, bb4acb3 style: apply neo-brutalist card…] | lang=en
- "score_calculate": "calculate.ts" | kind=code-symbol | source=lib/score/calculate.ts:L1 | neighbors=[page.tsx, route.ts, a5ce11b feat(scout): implement deployer…, b05f2f9 feat(feed-dossier): implement l…, score.ts, BAND_GREEN_MIN] | lang=en
- "commit:repo:github.com/wealthy-org/Scout@b05f2f9f3abed17f563d585a52fc25f49f77094b": "b05f2f9 feat(feed-dossier): implement live rpc feed polling, block telemetry, a…" | kind=Commit | source=git | neighbors=[AccountClient.tsx, page.tsx, route.ts, layout.tsx, wallet.ts, route.ts] | lang=en
- "map_page": "page.tsx" | kind=code-symbol | source=app/map/page.tsx:L1 | neighbors=[42f1b99 fix(ui): refine anti-slop hones…, 6aec8fe feat(ui): overhaul ui with chro…, 8b6a97a feat: enhance research workspac…, 8f33207 feat(scout): assemble connectio…, c9a3b60 fix(map): convert to server com…, f92a361 feat(ui): implement tosca canva…] | lang=en
- "watchlist_route": "route.ts" | kind=code-symbol | source=app/api/watchlist/route.ts:L1 | neighbors=[155086e fix(lint): manually resolve all…, 2af4b43 feat(ui): add 3d planetary orbi…, 4b3f020 feat(scout): implement api get …, 8b6a97a feat: enhance research workspac…, get-route.test.ts, post-route.test.ts] | lang=en
- "auth_session_getsession": "getSession()" | kind=code-symbol | source=lib/auth/session.ts:L28 | neighbors=[page.tsx, route.ts, layout.tsx, page.tsx, session.ts, page.tsx] | lang=en
- "docs_docsclient": "DocsClient.tsx" | kind=code-symbol | source=components/docs/DocsClient.tsx:L1 | neighbors=[19ac213 feat(docs,how): add sticky side…, 1a66628 fix(docs,how): update loading s…, 21c5bb2 feat: expand technical document…, 380c7ab style(how,docs): redesign /how …, 42f1b99 fix(ui): refine anti-slop hones…, 482dea9 perf(layout): optimize mobile a…] | lang=en
- "types_auth": "auth.ts" | kind=code-symbol | source=types/auth.ts:L1 | neighbors=[route.ts, session.ts, route.ts, 2354fd8 feat(scout): implement siwe non…, route.ts, route.ts] | lang=en
- "address_page": "page.tsx" | kind=code-symbol | source=app/deployer/[address]/page.tsx:L1 | neighbors=[DeployerPage(), generateMetadata(), PageProps, session.ts, getSession(), client.ts] | lang=en
- "commit:repo:github.com/wealthy-org/Scout@06e5cce971cdd9b96284a8f867110638583fb683": "06e5cce feat: replace symbols and emojis with custom SVG vector icons, fix marq…" | kind=Commit | source=git | neighbors=[AccountClient.tsx, loading.tsx, page.tsx, main, CensusView.tsx, 052102a fix: lock steady container heig…] | lang=en
- "slug_page": "page.tsx" | kind=code-symbol | source=app/p/[slug]/page.tsx:L1 | neighbors=[06e5cce feat: replace symbols and emoji…, 1ec916f feat(scout): implement syntheti…, 42f1b99 fix(ui): refine anti-slop hones…, 90f490e fix(ui): overhaul route loading…, e12a92e feat(scout): assemble public do…, f92a361 feat(ui): implement tosca canva…] | lang=en
- "commit:repo:github.com/wealthy-org/Scout@2af4b43240c7be9bed1ee802357275fae29298b0": "2af4b43 feat(ui): add 3d planetary orbital hero animation, fix dossier refresh …" | kind=Commit | source=git | neighbors=[layout.tsx, main, page.tsx, CensusView.tsx, compute.ts, events.ts] | lang=en
- "dossier_query": "query.ts" | kind=code-symbol | source=lib/dossier/query.ts:L1 | neighbors=[8b6a97a feat: enhance research workspac…, a1295a9 fix(dossier): resolve dynamic t…, b05f2f9 feat(feed-dossier): implement l…, fetch.ts, client.ts, publicClient] | lang=en

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
