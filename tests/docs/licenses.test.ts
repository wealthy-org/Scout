import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Third Party Licenses Documentation (TICKET-83)", () => {
  const filePath = path.resolve(process.cwd(), "THIRD_PARTY.md");

  it("ensures THIRD_PARTY.md exists at project root", () => {
    assert.ok(fs.existsSync(filePath), "THIRD_PARTY.md must exist in root");
  });

  it("contains licensing notices and links for core open source libraries", () => {
    const content = fs.readFileSync(filePath, "utf-8");

    assert.ok(content.includes("Next.js"));
    assert.ok(content.includes("React"));
    assert.ok(content.includes("Tailwind CSS") || content.includes("tailwindcss"));
    assert.ok(content.includes("Viem") || content.includes("viem"));
    assert.ok(content.includes("Drizzle") || content.includes("drizzle-orm"));
    assert.ok(content.includes("iron-session"));
    assert.ok(content.includes("Zod") || content.includes("zod"));
    assert.ok(content.includes("MIT License") || content.includes("Apache-2.0"));
  });
});
