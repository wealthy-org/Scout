type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  key: string,
  maxRequests = 30,
  windowMs = 60000
): { limited: boolean; retryAfter: number; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfter: 0, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { limited: true, retryAfter: Math.max(retryAfter, 1), remaining: 0 };
  }

  entry.count += 1;
  return { limited: false, retryAfter: 0, remaining: maxRequests - entry.count };
}

export function resetRateLimitStore(): void {
  store.clear();
}
