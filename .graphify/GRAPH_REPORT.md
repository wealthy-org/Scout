# Graph Report - .  (2026-09-26)

## Corpus Check
- Corpus is ~1,082 words - fits in a single context window. You may not need a graph.

## Summary
- 15 nodes · 14 edges · 5 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: contains: 8 · MODIFIES: 5 · ON_BRANCH: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 13 · Candidates: 19
- Excluded: 66 untracked · 43379 ignored · 0 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `ccae023`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `geistSans` - 1 edges
2. `geistMono` - 1 edges
3. `metadata` - 1 edges
4. `eslintConfig` - 1 edges
5. `nextConfig` - 1 edges
6. `config` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.40
Nodes (3): geistSans, geistMono, metadata

### Community 1 - "Community 1"
Cohesion: 0.50
Nodes (2): ccae023 Initial commit from Create Next App, main

### Community 2 - "Community 2"
Cohesion: 1.00
Nodes (1): eslintConfig

### Community 3 - "Community 3"
Cohesion: 1.00
Nodes (1): nextConfig

### Community 4 - "Community 4"
Cohesion: 1.00
Nodes (1): config

## Knowledge Gaps
- **6 isolated node(s):** `geistSans`, `geistMono`, `metadata`, `eslintConfig`, `nextConfig` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 1`** (2 nodes): `ccae023 Initial commit from Create Next App`, `main`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 2`** (1 nodes): `eslintConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 3`** (1 nodes): `nextConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (1 nodes): `config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `geistSans`, `geistMono`, `metadata` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._