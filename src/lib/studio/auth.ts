import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Access control for the studio's own order screen.
 *
 * One shared password, because there is one studio. It is deliberately simple,
 * but not careless: the password is never stored in a cookie, comparisons are
 * constant-time, and the session cookie is httpOnly so no script can read it.
 *
 * What it protects is customers' photographs and addresses, so the screen is
 * closed by default: with no STUDIO_PASSWORD set, nothing opens at all rather
 * than everything.
 */

const COOKIE = "rkms_studio";
const LABEL = "rk-memory-studio/studio-session/v1";

export function studioPasswordIsSet(): boolean {
  return (process.env.STUDIO_PASSWORD ?? "").trim().length > 0;
}

/** The cookie value for a given password. Changing the password logs everyone out. */
function sessionToken(): string {
  const password = (process.env.STUDIO_PASSWORD ?? "").trim();
  return createHmac("sha256", password).update(LABEL).digest("hex");
}

function sameString(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function passwordMatches(attempt: string): boolean {
  const password = (process.env.STUDIO_PASSWORD ?? "").trim();
  if (!password) return false;
  return sameString(attempt.trim(), password);
}

export async function isSignedIn(): Promise<boolean> {
  if (!studioPasswordIsSet()) return false;
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  return sameString(token, sessionToken());
}

export async function signIn(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function signOut(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}
