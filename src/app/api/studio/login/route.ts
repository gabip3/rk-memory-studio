import { NextResponse } from "next/server";
import { passwordMatches, signIn, signOut } from "@/lib/studio/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Sign in to the studio screen. A wrong password is answered slowly and
 * vaguely: the delay blunts guessing, and "that password is not right" tells
 * an outsider nothing about whether a password is even configured.
 */
export async function POST(request: Request) {
  const form = await request.formData();

  // The same endpoint signs out, because an HTML form cannot send DELETE.
  if (form.get("signout")) {
    await signOut();
    return NextResponse.redirect(new URL("/studio", request.url), 303);
  }

  const attempt = String(form.get("password") ?? "");

  if (!passwordMatches(attempt)) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return NextResponse.redirect(new URL("/studio?error=1", request.url), 303);
  }

  await signIn();
  return NextResponse.redirect(new URL("/studio", request.url), 303);
}
