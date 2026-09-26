import { test, describe } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

describe("Landing Page & Feed Prototype (TICKET-46)", () => {
  const prototypePath = path.resolve(process.cwd(), "prototypes/landing.html");

  test("prototypes/landing.html file must exist", () => {
    assert.strictEqual(fs.existsSync(prototypePath), true);
  });

  test("contains valid HTML structure and Dossier.OS visual styling", () => {
    const html = fs.readFileSync(prototypePath, "utf-8");
    assert.ok(html.includes("<!DOCTYPE html>"));
    assert.ok(html.includes("<html"));
    assert.ok(html.includes("<head>"));
    assert.ok(html.includes("<body>"));
    assert.ok(html.includes("Dossier.OS") || html.includes("Scout"));
  });

  test("contains all core Feed layout sections", () => {
    const html = fs.readFileSync(prototypePath, "utf-8");
    assert.ok(html.includes("Ticker Tape") || html.includes("ticker-tape"));
    assert.ok(html.includes("Launch Feed") || html.includes("feed-table"));
    assert.ok(html.includes("Trade Tape") || html.includes("trade-tape"));
    assert.ok(html.includes("Graduation") || html.includes("graduations"));
    assert.ok(html.includes("Trade Inspector") || html.includes("trade-inspector"));
  });

  test("strictly contains no external JavaScript scripts", () => {
    const html = fs.readFileSync(prototypePath, "utf-8");
    assert.strictEqual(html.includes("<script src="), false);
  });
});
