# Community Labeling

Graphify is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the community listing below
and write 2-5 word plain-language names for each.

## Language

Write every name in English (en). Do not switch languages.

## Communities

Community 0: geistSans, geistMono, metadata, layout.tsx, RootLayout(
Community 1: page.tsx, Home(, ccae023 Initial commit from Create Next App, main
Community 2: eslintConfig, eslint.config.mjs
Community 3: nextConfig, next.config.ts
Community 4: config, postcss.config.mjs

## Instructions

Write a single JSON object mapping each community id (as a string) to its
2-5 word name to: /Users/raka/Developer/repositories/projects/wealthy-people-org/scout-dir/scout/.graphify/label-instructions/communities.json

Example:
```json
{
  "0": "Authentication Flow",
  "1": "Authentication Flow",
  "2": "Authentication Flow"
}
```

Then re-run `graphify update` (or `graphify label`) to ingest the names.
