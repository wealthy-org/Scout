import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import {
  AccountClient,
  type UserProfileData,
} from "@/components/account/AccountClient";

export const metadata: Metadata = {
  title: "Account Settings | Scout",
  description: "Manage researcher identity, username alias, and account security preferences.",
};

export default async function AccountPage() {
  let isAuthenticated = false;
  let userData: UserProfileData | null = null;

  try {
    const session = await getSession();
    if (session && session.wallet_address) {
      isAuthenticated = true;
      const walletAddress = session.wallet_address.toLowerCase();

      if (db) {
        const rows = await db
          .select()
          .from(users)
          .where(eq(users.walletAddress, walletAddress))
          .limit(1);

        if (rows.length > 0) {
          userData = {
            walletAddress: rows[0].walletAddress,
            handle: rows[0].handle,
            createdAt: rows[0].createdAt.toISOString(),
          };
        } else {
          userData = {
            walletAddress,
            handle: null,
            createdAt: new Date().toISOString(),
          };
        }
      } else {
        userData = {
          walletAddress,
          handle: null,
          createdAt: new Date().toISOString(),
        };
      }
    }
  } catch {
  }

  return <AccountClient isAuthenticated={isAuthenticated} user={userData} />;
}
