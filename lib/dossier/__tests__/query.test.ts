import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Dossier Query Data Integrity (TICKET-142)", () => {
  it("ensures query.ts does not contain seed-based defaultDeployerHex generation", () => {
    const filePath = path.join(process.cwd(), "lib/dossier/query.ts");
    const content = fs.readFileSync(filePath, "utf-8");
    assert.strictEqual(content.includes("defaultDeployerHex"), false);
    assert.strictEqual(content.includes("seed"), false);
  });
});
