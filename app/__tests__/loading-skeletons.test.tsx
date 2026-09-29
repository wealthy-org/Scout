import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Pixel-Perfect Route Loading Skeletons Verification (TICKET-100 & TICKET-141)", () => {
  const routes = [
    "app/loading.tsx",
    "app/feed/loading.tsx",
    "app/library/loading.tsx",
    "app/watchlist/loading.tsx",
    "app/census/loading.tsx",
    "app/map/loading.tsx",
    "app/d/[ca]/loading.tsx",
    "app/docs/loading.tsx",
    "app/how/loading.tsx",
    "app/me/loading.tsx",
    "app/deployer/[address]/loading.tsx",
    "app/p/[slug]/loading.tsx",
  ];

  for (const route of routes) {
    test(`route skeleton ${route} must exist and contain pulse or shimmer animation`, () => {
      const filePath = path.resolve(process.cwd(), route);
      assert.ok(fs.existsSync(filePath), `${route} must exist on disk`);

      const content = fs.readFileSync(filePath, "utf-8");
      assert.ok(
        content.includes("animate-pulse") || content.includes("skeleton") || content.includes("shimmer"),
        `${route} must define skeleton visual loading indicators`
      );
      assert.ok(
        content.includes("#0D746E") || content.includes("canvas-main"),
        `${route} must use Tosca Canvas Main background`
      );
    });
  }

  test("app/feed/loading.tsx matches exact FeedPage 12-col layout with TickerTape, 5 FeedTiles, and FeedTable", () => {
    const content = fs.readFileSync(path.resolve(process.cwd(), "app/feed/loading.tsx"), "utf-8");
    assert.ok(content.includes("lg:grid-cols-5"), "Feed loading skeleton must define 5-column FeedTiles grid");
    assert.ok(content.includes("lg:col-span-8"), "Feed loading skeleton must define 8-col FeedTable container");
    assert.ok(content.includes("lg:col-span-4"), "Feed loading skeleton must define 4-col TradeTape and GraduationTape container");
  });

  test("app/loading.tsx matches LandingClient layout with 2-column hero, 4 macro metrics, 3 module cards, and showcase banner", () => {
    const content = fs.readFileSync(path.resolve(process.cwd(), "app/loading.tsx"), "utf-8");
    assert.ok(content.includes("pt-28") || content.includes("pt-24"), "Root loading skeleton must match LandingClient top padding");
    assert.ok(content.includes("lg:grid-cols-12"), "Root loading skeleton must match 2-column hero layout");
    assert.ok(content.includes("md:grid-cols-4"), "Root loading skeleton must match 4 macro stats grid");
    assert.ok(content.includes("md:grid-cols-3"), "Root loading skeleton must match 3 modules 3D grid");
  });

  test("app/library/loading.tsx matches LibraryClient layout with 4 status metric cards and 3-column card grid", () => {
    const content = fs.readFileSync(path.resolve(process.cwd(), "app/library/loading.tsx"), "utf-8");
    assert.ok(content.includes("md:grid-cols-4"), "Library loading skeleton must define 4 status metric cards grid");
    assert.ok(content.includes("lg:grid-cols-3"), "Library loading skeleton must define 3-column dossier cards grid");
  });

  test("app/watchlist/loading.tsx matches WatchlistClient layout with max-w-7xl and 3-column cards grid", () => {
    const content = fs.readFileSync(path.resolve(process.cwd(), "app/watchlist/loading.tsx"), "utf-8");
    assert.ok(content.includes("max-w-7xl"), "Watchlist loading skeleton must match max-w-7xl container");
    assert.ok(content.includes("lg:grid-cols-3") || content.includes("md:grid-cols-2"), "Watchlist loading skeleton must define cards grid");
  });

  test("app/census/loading.tsx matches CensusView layout with 4 macro cards and histogram & repeat launchers cards", () => {
    const content = fs.readFileSync(path.resolve(process.cwd(), "app/census/loading.tsx"), "utf-8");
    assert.ok(content.includes("md:grid-cols-4"), "Census loading skeleton must define 4 macro radar cards grid");
  });

  test("app/map/loading.tsx matches ConnectionMap layout with 650px canvas container", () => {
    const content = fs.readFileSync(path.resolve(process.cwd(), "app/map/loading.tsx"), "utf-8");
    assert.ok(content.includes("650px") || content.includes("min-h-[600px]"), "Map loading skeleton must define connection canvas height");
  });

  test("app/d/[ca]/loading.tsx matches DossierPageView split console layout", () => {
    const content = fs.readFileSync(path.resolve(process.cwd(), "app/d/[ca]/loading.tsx"), "utf-8");
    assert.ok(content.includes("max-w-[1520px]"), "Dossier loading skeleton must define max-w-[1520px] layout");
    assert.ok(content.includes("lg:w-[360px]") || content.includes("xl:w-[390px]"), "Dossier loading skeleton must define sidebar width");
  });

  test("app/docs/loading.tsx matches DocsPage layout width", () => {
    const content = fs.readFileSync(path.resolve(process.cwd(), "app/docs/loading.tsx"), "utf-8");
    assert.ok(content.includes("max-w-5xl") || content.includes("max-w-7xl"), "Docs loading skeleton must match layout width");
  });

  test("app/how/loading.tsx matches HowPage layout and workflow section", () => {
    const content = fs.readFileSync(path.resolve(process.cwd(), "app/how/loading.tsx"), "utf-8");
    assert.ok(content.includes("max-w-5xl") || content.includes("max-w-6xl"), "How loading skeleton must match max-w layout");
  });

  test("app/me/loading.tsx matches AccountClient max-w-4xl width and identity 2-column grid", () => {
    const content = fs.readFileSync(path.resolve(process.cwd(), "app/me/loading.tsx"), "utf-8");
    assert.ok(content.includes("max-w-4xl"), "Account loading skeleton must match max-w-4xl layout");
    assert.ok(content.includes("md:grid-cols-2"), "Account loading skeleton must match 2-column identity grid");
  });

  test("app/deployer/[address]/loading.tsx matches DeployerProfileView workbench layout and 6 signals grid", () => {
    const content = fs.readFileSync(path.resolve(process.cwd(), "app/deployer/[address]/loading.tsx"), "utf-8");
    assert.ok(content.includes("max-w-[1600px]"), "Deployer loading skeleton must match max-w-[1600px] layout");
    assert.ok(content.includes("lg:grid-cols-12"), "Deployer loading skeleton must match 12-column grid");
    assert.ok(content.includes("sm:grid-cols-3"), "Deployer loading skeleton must match signals grid");
  });

  test("app/p/[slug]/loading.tsx matches PublicDossierClient max-w-5xl layout", () => {
    const content = fs.readFileSync(path.resolve(process.cwd(), "app/p/[slug]/loading.tsx"), "utf-8");
    assert.ok(content.includes("max-w-5xl"), "Public dossier loading skeleton must match max-w-5xl layout");
  });
});
