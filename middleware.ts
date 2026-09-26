import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/security/ratelimit";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/deployer/")) {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      "127.0.0.1";

    const rateResult = checkRateLimit(`mw_${clientIp}`, 30, 60000);
    if (rateResult.limited) {
      return NextResponse.json(
        { ok: false, error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateResult.retryAfter),
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/deployer/:path*"],
};
