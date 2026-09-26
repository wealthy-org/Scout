import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import type { CookieStoreLike, LogoutResponseBody } from "@/types/auth";

export async function handleLogout(customCookies?: CookieStoreLike): Promise<NextResponse<LogoutResponseBody>> {
  try {
    const session = await getSession(customCookies);
    session.destroy();
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to destroy authentication session";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(): Promise<NextResponse<LogoutResponseBody>> {
  return handleLogout();
}
