import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Route Loading Skeletons Verification (TICKET-86)", () => {
  const routes = [
    "app/loading.tsx",
    "app/library/loading.tsx",
    "app/watchlist/loading.tsx",
    "app/census/loading.tsx",
    "app/d/[ca]/loading.tsx",
    "app/feed/loading.tsx",
    "app/map/loading.tsx",
    "app/docs/loading.tsx",
  ];

  for (const route of routes) {
    test(`route skeleton ${route} must exist and contain shimmer or pulse loading classes`, () => {
      const filePath = path.resolve(process.cwd(), route);
      assert.ok(fs.existsSync(filePath), `${route} must exist on disk`);

      const content = fs.readFileSync(filePath, "utf-8");
      assert.ok(
        content.includes("animate-pulse") || content.includes("skeleton") || content.includes("shimmer") || content.includes("bg-bg-secondary"),
        `${route} must define skeleton visual loading indicators`
      );
    });
  }
});
