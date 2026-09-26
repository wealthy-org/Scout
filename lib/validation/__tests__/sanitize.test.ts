import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeString,
  validateEthAddress,
  ethAddressSchema,
  dossierPutStrictSchema,
  publishBodyStrictSchema,
} from "../sanitize";

describe("Input Sanitization & Validation (TICKET-65)", () => {
  describe("sanitizeString", () => {
    it("should trim whitespace", () => {
      const result = sanitizeString("   hello world   ");
      assert.strictEqual(result, "hello world");
    });

    it("should escape dangerous HTML characters", () => {
      const dangerous = '<script>alert("xss")</script> & <img src=x onerror="hack()"/>';
      const sanitized = sanitizeString(dangerous);
      assert.ok(!sanitized.includes("<script>"));
      assert.ok(!sanitized.includes("<img"));
      assert.ok(sanitized.includes("&lt;script&gt;"));
      assert.ok(sanitized.includes("&quot;xss&quot;"));
      assert.ok(sanitized.includes("&amp;"));
    });

    it("should truncate string if exceeding maxLength", () => {
      const longStr = "abcdefghijklmnopqrstuvwxyz";
      const truncated = sanitizeString(longStr, 10);
      assert.strictEqual(truncated.length, 10);
      assert.strictEqual(truncated, "abcdefghij");
    });
  });

  describe("validateEthAddress", () => {
    it("should return true for valid Ethereum addresses", () => {
      assert.strictEqual(validateEthAddress("0x1234567890123456789012345678901234567890"), true);
      assert.strictEqual(validateEthAddress("0xAbCDEF123456789012345678901234567890abcd"), true);
    });

    it("should return false for invalid Ethereum addresses", () => {
      assert.strictEqual(validateEthAddress("0x1234"), false);
      assert.strictEqual(validateEthAddress("1234567890123456789012345678901234567890"), false);
      assert.strictEqual(validateEthAddress("0xGGGG567890123456789012345678901234567890"), false);
      assert.strictEqual(validateEthAddress(""), false);
    });
  });

  describe("ethAddressSchema", () => {
    it("should validate ethereum address with zod", () => {
      const valid = ethAddressSchema.safeParse("0x1234567890123456789012345678901234567890");
      assert.strictEqual(valid.success, true);

      const invalid = ethAddressSchema.safeParse("0xinvalid");
      assert.strictEqual(invalid.success, false);
    });
  });

  describe("Strict schemas rejection of unknown fields and length enforcement", () => {
    it("should reject payload with unknown extraneous fields (strict mode)", () => {
      const parseResult = dossierPutStrictSchema.safeParse({
        thesis: "Valid thesis",
        injectedMaliciousField: "malicious payload",
      });
      assert.strictEqual(parseResult.success, false);
    });

    it("should accept valid strict dossier payload within limits", () => {
      const parseResult = dossierPutStrictSchema.safeParse({
        status: "Watching",
        thesis: "Valid thesis within limit",
        notes: "Valid notes within limit",
        items: [{ kind: "pro", text: "Strong dev team", position: 0 }],
        questions: [{ text: "Audit status?", done: false, position: 0 }],
      });
      assert.strictEqual(parseResult.success, true);
    });

    it("should reject items exceeding 50 elements", () => {
      const fiftyOneItems = Array.from({ length: 51 }, (_, i) => ({
        kind: "pro" as const,
        text: `Item ${i}`,
        position: i,
      }));
      const parseResult = dossierPutStrictSchema.safeParse({
        items: fiftyOneItems,
      });
      assert.strictEqual(parseResult.success, false);
    });

    it("should reject item text exceeding 500 chars", () => {
      const longText = "a".repeat(501);
      const parseResult = dossierPutStrictSchema.safeParse({
        items: [{ kind: "pro", text: longText, position: 0 }],
      });
      assert.strictEqual(parseResult.success, false);
    });

    it("should reject thesis exceeding 4000 chars", () => {
      const longThesis = "a".repeat(4001);
      const parseResult = dossierPutStrictSchema.safeParse({
        thesis: longThesis,
      });
      assert.strictEqual(parseResult.success, false);
    });

    it("should reject notes exceeding 20000 chars", () => {
      const longNotes = "a".repeat(20001);
      const parseResult = dossierPutStrictSchema.safeParse({
        notes: longNotes,
      });
      assert.strictEqual(parseResult.success, false);
    });

    it("should enforce strict publish body schema", () => {
      const valid = publishBodyStrictSchema.safeParse({
        handle: "analyst123",
        include_notes: true,
      });
      assert.strictEqual(valid.success, true);

      const invalidStrict = publishBodyStrictSchema.safeParse({
        handle: "analyst123",
        unknownProp: "attack",
      });
      assert.strictEqual(invalidStrict.success, false);
    });
  });
});
