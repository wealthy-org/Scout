import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  EXAMPLE_DEPLOYERS,
  getExampleDeployerByArchetype,
  type ExampleDeployer,
} from "@/config/examples";

describe("Example Deployers Constants (TICKET-81)", () => {
  it("exports exactly 3 deployer archetypes (fresh, repeat, serial)", () => {
    assert.equal(EXAMPLE_DEPLOYERS.length, 3);
    const archetypes = EXAMPLE_DEPLOYERS.map((d: ExampleDeployer) => d.archetype);
    assert.ok(archetypes.includes("fresh"));
    assert.ok(archetypes.includes("repeat"));
    assert.ok(archetypes.includes("serial"));
  });

  it("each example deployer has valid 42-character Ethereum address and score signals", () => {
    for (const d of EXAMPLE_DEPLOYERS) {
      assert.ok(/^0x[0-9a-fA-F]{40}$/.test(d.address));
      assert.ok(typeof d.score === "number" && d.score >= 0 && d.score <= 100);
      assert.ok(d.band === "green" || d.band === "yellow" || d.band === "red");
      assert.ok(d.description);
    }
  });

  it("helper getExampleDeployerByArchetype retrieves corresponding archetype correctly", () => {
    const serial = getExampleDeployerByArchetype("serial");
    assert.ok(serial);
    assert.equal(serial.band, "red");
    assert.ok(serial.score <= 25);

    const repeat = getExampleDeployerByArchetype("repeat");
    assert.ok(repeat);
    assert.equal(repeat.band, "green");

    const fresh = getExampleDeployerByArchetype("fresh");
    assert.ok(fresh);
  });
});
