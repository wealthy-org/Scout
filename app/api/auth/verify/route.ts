import { NextResponse } from "next/server";
import { SiweMessage } from "siwe";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { db, type Database } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { CookieStoreLike, VerifyRequestBody, VerifyResponseBody } from "@/types/auth";

const verifySchema = z.object({
  message: z.string().min(1, "Message is required"),
  signature: z.string().min(1, "Signature is required"),
});

export async function handleVerify(
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db
): Promise<NextResponse<VerifyResponseBody>> {
  try {
    if (!req) {
      return NextResponse.json({ error: "Request object is required" }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parseResult = verifySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { message, signature }: VerifyRequestBody = parseResult.data;

    let session;
    try {
      session = await getSession(customCookies);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initialize session";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    const expectedNonce = session.nonce;
    if (!expectedNonce) {
      return NextResponse.json({ error: "Session nonce missing or expired" }, { status: 422 });
    }

    let siweMessage: SiweMessage;
    try {
      siweMessage = new SiweMessage(message);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Malformed SIWE message format";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    try {
      const verificationResult = await siweMessage.verify({
        signature,
        nonce: expectedNonce,
      });

      if (!verificationResult.success) {
        return NextResponse.json(
          { error: verificationResult.error?.type || "Signature verification failed" },
          { status: 422 }
        );
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Signature verification failed";
      return NextResponse.json({ error: errorMessage }, { status: 422 });
    }

    session.nonce = undefined;
    const walletAddress = siweMessage.address.toLowerCase();
    session.wallet_address = walletAddress;

    try {
      await session.save();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save session";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    if (!customDb) {
      return NextResponse.json({ error: "Database client is unavailable" }, { status: 500 });
    }

    try {
      await customDb
        .insert(users)
        .values({
          walletAddress,
        })
        .onConflictDoNothing();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Database error during user registration";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error during verification";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse<VerifyResponseBody>> {
  try {
    return await handleVerify(req);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
