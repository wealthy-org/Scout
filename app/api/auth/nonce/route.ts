import { NextResponse } from "next/server";
import { generateNonce } from "siwe";
import { getSession } from "@/lib/auth/session";
import type { CookieStoreLike, NonceResponseBody } from "@/types/auth";

export async function handleNonce(customCookies?: CookieStoreLike): Promise<NextResponse<NonceResponseBody>> {
  try {
    const nonce = generateNonce();
    const session = await getSession(customCookies);
    session.nonce = nonce;
    await session.save();

    return NextResponse.json({ nonce });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to generate authentication nonce";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(): Promise<NextResponse<NonceResponseBody>> {
  return handleNonce();
}
