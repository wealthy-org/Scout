import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { SessionData, CookieStoreLike } from "@/types/auth";

export type { SessionData, CookieStoreLike };

const getPassword = (): string => {
  const secret = process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : "012345678901234567890123456789012345");
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is required");
  }
  if (secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters long");
  }
  return secret;
};

export const sessionOptions: SessionOptions = {
  password: getPassword(),
  cookieName: "scout_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  },
};

export async function getSession(customCookies?: CookieStoreLike) {
  const cookieStore = customCookies ?? (await cookies());
  if (!cookieStore) {
    throw new Error("Cookie store is required to initialize session");
  }
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
