import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit, resetRateLimitStore } from "@/lib/security/ratelimit";

describe("Public API Rate Limiter (TICKET-82)", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it("allows requests within the 30 requests per minute limit", () => {
    const ip = "192.168.1.100";
    for (let i = 1; i <= 30; i++) {
      const res = checkRateLimit(ip, 30, 60000);
      assert.equal(res.limited, false);
      assert.equal(res.remaining, 30 - i);
    }
  });

  it("rejects 31st request with limited: true and Retry-After header calculation", () => {
    const ip = "192.168.1.101";
    for (let i = 1; i <= 30; i++) {
      checkRateLimit(ip, 30, 60000);
    }

    const exceeded = checkRateLimit(ip, 30, 60000);
    assert.equal(exceeded.limited, true);
    assert.equal(exceeded.remaining, 0);
    assert.ok(exceeded.retryAfter > 0 && exceeded.retryAfter <= 60);
  });

  it("isolates rate limits between distinct client IP addresses", () => {
    const ipA = "10.0.0.1";
    const ipB = "10.0.0.2";

    for (let i = 1; i <= 30; i++) {
      checkRateLimit(ipA, 30, 60000);
    }

    const resA = checkRateLimit(ipA, 30, 60000);
    assert.equal(resA.limited, true);

    const resB = checkRateLimit(ipB, 30, 60000);
    assert.equal(resB.limited, false);
    assert.equal(resB.remaining, 29);
  });

  it("resets limit window after expiration", () => {
    const ip = "10.0.0.3";
    checkRateLimit(ip, 2, 10);
    checkRateLimit(ip, 2, 10);

    const blocked = checkRateLimit(ip, 2, 10);
    assert.equal(blocked.limited, true);

    const start = Date.now();
    while (Date.now() - start < 20) {
      // Synchronous wait
    }

    const renewed = checkRateLimit(ip, 2, 10);
    assert.equal(renewed.limited, false);
  });
});
