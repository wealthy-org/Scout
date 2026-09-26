import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DEMO_DOSSIERS, getDemoDossier, DEMO_SLUGS } from "@/config/demo";

describe("Demo Dossiers Synthetic Fixtures (TICKET-80)", () => {
  it("exports 4 synthetic demo fixtures with valid slugs", () => {
    assert.equal(Object.keys(DEMO_DOSSIERS).length, 4);
    assert.deepEqual(DEMO_SLUGS.sort(), ["active", "hold", "passed", "rugged"].sort());
  });

  it("contains complete snapshot, deployer, and thesis details for each demo fixture", () => {
    for (const slug of DEMO_SLUGS) {
      const dossier = getDemoDossier(slug);
      assert.ok(dossier, `Expected demo dossier for slug ${slug}`);
      assert.ok(dossier.contractAddress.startsWith("0x"));
      assert.ok(dossier.symbol);
      assert.ok(dossier.name);
      assert.ok(dossier.status);
      assert.ok(dossier.thesis);
      assert.ok(typeof dossier.deployerScore === "number");
      assert.ok(Array.isArray(dossier.items));
      assert.ok(dossier.snapshot);
    }
  });

  it("returns null for non-existent demo slug", () => {
    assert.equal(getDemoDossier("unknown-slug"), null);
  });
});
