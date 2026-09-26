import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db, type Database } from "@/lib/db";
import { deployerWatchlist } from "@/lib/db/schema";
import type { CookieStoreLike } from "@/types/auth";
import { validateEthAddress } from "@/lib/validation/sanitize";

export interface DeleteWatchlistResponseBody {
  ok: boolean;
  error?: string;
}

export async function handleDeleteWatchlist(
  address: string,
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse<DeleteWatchlistResponseBody>> {
  try {
    let wallet = authenticatedWallet;

    if (!wallet) {
      try {
        const session = await getSession(customCookies);
        if (session && session.wallet_address) {
          wallet = session.wallet_address;
        }
      } catch {
        wallet = undefined;
      }

      if (!wallet) {
        return NextResponse.json(
          {
            ok: false,
            error: "Authentication required",
          },
          { status: 401 }
        );
      }
    }

    if (!address || !validateEthAddress(address)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid deployer address format",
        },
        { status: 400 }
      );
    }

    const deployerAddress = address.toLowerCase();

    if (!customDb) {
      return NextResponse.json(
        {
          ok: true,
        },
        { status: 200 }
      );
    }

    const existing = await customDb
      .select({ id: deployerWatchlist.id })
      .from(deployerWatchlist)
      .where(
        and(
          eq(deployerWatchlist.walletAddress, wallet),
          eq(deployerWatchlist.deployerAddress, deployerAddress)
        )
      );

    if (!existing || existing.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Deployer not found in user watchlist",
        },
        { status: 404 }
      );
    }

    await customDb
      .delete(deployerWatchlist)
      .where(
        and(
          eq(deployerWatchlist.walletAddress, wallet),
          eq(deployerWatchlist.deployerAddress, deployerAddress)
        )
      );

    return NextResponse.json(
      {
        ok: true,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error deleting deployer from watchlist",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ address: string }> }
) {
  const { address } = await props.params;
  return handleDeleteWatchlist(address, req);
}
