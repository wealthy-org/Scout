import { test, describe } from "node:test";
import assert from "node:assert";
import {
  detectConnections,
  type DossierWithSources,
} from "@/lib/connections/engine";

describe("Connection Detection Engine (TICKET-55)", () => {
  const dossierA: DossierWithSources = {
    contractAddress: "0x1111111111111111111111111111111111111111",
    symbol: "ALPHA",
    deployerAddress: "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    feeRecipientAddress: "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
    sources: ["https://github.com/project-team/alpha-core"],
    thesis: "Innovative decentralized exchange layer",
    notes: "Reviewing code against other deployers",
  };

  const dossierB: DossierWithSources = {
    contractAddress: "0x2222222222222222222222222222222222222222",
    symbol: "BETA",
    deployerAddress: "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    feeRecipientAddress: "0xEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
    sources: ["https://docs.beta.org"],
    thesis: "Second token from team A",
    notes: "No mentions yet",
  };

  test("detects confirmed connection for same deployer", () => {
    const links = detectConnections([dossierA, dossierB]);
    const sameDeployerLink = links.find((l) => l.reason === "same_deployer");

    assert.ok(sameDeployerLink);
    assert.strictEqual(sameDeployerLink.type, "confirmed");
  });

  test("detects confirmed connection for same fee recipient", () => {
    const dossierC: DossierWithSources = {
      contractAddress: "0x3333333333333333333333333333333333333333",
      symbol: "GAMMA",
      deployerAddress: "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
      feeRecipientAddress: "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
    };

    const links = detectConnections([dossierA, dossierC]);
    const feeLink = links.find((l) => l.reason === "same_fee_recipient");

    assert.ok(feeLink);
    assert.strictEqual(feeLink.type, "confirmed");
  });

  test("detects confirmed connection when deployer receives fees from another token", () => {
    const dossierD: DossierWithSources = {
      contractAddress: "0x4444444444444444444444444444444444444444",
      symbol: "DELTA",
      deployerAddress: "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
      feeRecipientAddress: "0x0000000000000000000000000000000000000001",
    };

    const links = detectConnections([dossierA, dossierD]);
    const deployerFeeLink = links.find((l) => l.reason === "deployer_receives_fees");

    assert.ok(deployerFeeLink);
    assert.strictEqual(deployerFeeLink.type, "confirmed");
  });

  test("detects confirmed connection for same GitHub repository in sources", () => {
    const dossierE: DossierWithSources = {
      contractAddress: "0x5555555555555555555555555555555555555555",
      symbol: "EPSILON",
      deployerAddress: "0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
      sources: [
        { url: "https://github.com/project-team/alpha-core/tree/main", kind: "source" },
      ],
    };

    const links = detectConnections([dossierA, dossierE]);
    const repoLink = links.find((l) => l.reason === "same_github_repo");

    assert.ok(repoLink);
    assert.strictEqual(repoLink.type, "confirmed");
  });

  test("detects hypothesis connection for symbol or CA mentions in thesis or notes", () => {
    const dossierF: DossierWithSources = {
      contractAddress: "0x6666666666666666666666666666666666666666",
      symbol: "ZETA",
      deployerAddress: "0xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
      thesis: "Linked to $ALPHA and [[BETA]] ecosystem",
      notes: "Contract address reference: 0x1111111111111111111111111111111111111111",
    };

    const links = detectConnections([dossierA, dossierF]);
    const mentionLink = links.find((l) => l.reason === "note_mention");

    assert.ok(mentionLink);
    assert.strictEqual(mentionLink.type, "hypothesis");
  });

  test("enforces symmetry without creating duplicate reversed links", () => {
    const links = detectConnections([dossierA, dossierB]);
    const sameDeployerLinks = links.filter((l) => l.reason === "same_deployer");

    assert.strictEqual(sameDeployerLinks.length, 1);
  });

  test("returns empty array when input is empty or single dossier", () => {
    assert.deepStrictEqual(detectConnections([]), []);
    assert.deepStrictEqual(detectConnections([dossierA]), []);
  });
});
