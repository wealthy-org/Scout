export interface SessionData {
  wallet_address?: string;
  nonce?: string;
}

export interface CookieStoreLike {
  get(name: string): { name: string; value: string } | undefined;
  set(name: string, value: string): void;
  delete(name: string): void;
}

export interface VerifyRequestBody {
  message: string;
  signature: string;
}

export type VerifyResponseBody =
  | { ok: true }
  | { error: string; details?: unknown };

export type NonceResponseBody =
  | { nonce: string }
  | { error: string };

export type LogoutResponseBody =
  | { ok: true }
  | { error: string };
