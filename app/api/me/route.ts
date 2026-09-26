import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, and, ne } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const updateHandleSchema = z.object({
  handle: z
    .string()
    .trim()
    .min(3, "Handle must be at least 3 characters")
    .max(30, "Handle cannot exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Handle may only contain letters, numbers, and underscores"
    ),
});

const deleteAccountSchema = z.object({
  confirm_address: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.wallet_address) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const walletAddress = session.wallet_address.toLowerCase();
    if (!db) {
      return NextResponse.json({
        ok: true,
        user: { walletAddress, handle: null, createdAt: new Date().toISOString() },
      });
    }

    const rows = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({
        ok: true,
        user: { walletAddress, handle: null, createdAt: new Date().toISOString() },
      });
    }

    return NextResponse.json({
      ok: true,
      user: {
        walletAddress: rows[0].walletAddress,
        handle: rows[0].handle,
        createdAt: rows[0].createdAt.toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.wallet_address) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const walletAddress = session.wallet_address.toLowerCase();
    const body = await req.json();
    const parsed = updateHandleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid handle format",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const newHandle = parsed.data.handle;

    if (db) {
      const existing = await db
        .select()
        .from(users)
        .where(
          and(eq(users.handle, newHandle), ne(users.walletAddress, walletAddress))
        )
        .limit(1);

      if (existing.length > 0) {
        return NextResponse.json(
          { ok: false, error: "Handle already taken by another user" },
          { status: 409 }
        );
      }

      await db
        .update(users)
        .set({ handle: newHandle })
        .where(eq(users.walletAddress, walletAddress));
    }

    return NextResponse.json({
      ok: true,
      user: {
        walletAddress,
        handle: newHandle,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.wallet_address) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const walletAddress = session.wallet_address.toLowerCase();
    const body = await req.json();
    const parsed = deleteAccountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid confirmation address" },
        { status: 400 }
      );
    }

    if (parsed.data.confirm_address.toLowerCase() !== walletAddress) {
      return NextResponse.json(
        { ok: false, error: "Confirmation address does not match your wallet" },
        { status: 400 }
      );
    }

    if (db) {
      await db.delete(users).where(eq(users.walletAddress, walletAddress));
    }

    session.destroy();

    return NextResponse.json({
      ok: true,
      deleted: true,
      message: "Account and all associated intelligence data deleted cleanly.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
