import { NextResponse } from "next/server";
import { getStorageAdapter } from "@/lib/uploads/adapter";
import { isSignedIn } from "@/lib/studio/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Serves one uploaded photograph to the signed-in studio.
 *
 * The blob store is private, so this route is the only way in, and it checks
 * the session before touching storage. The file is streamed rather than
 * buffered: a phone photograph can be 30MB and there is no reason to hold it
 * in memory.
 *
 * `?download=1` asks the browser to save the file instead of displaying it.
 */
export async function GET(request: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const name = url.searchParams.get("name");

  if (!key) {
    return NextResponse.json({ error: "No photo requested." }, { status: 400 });
  }

  const photo = await getStorageAdapter().readPhoto(key);
  if (!photo) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  const headers = new Headers({
    "Content-Type": photo.contentType,
    // Customers' photographs: never cached by a proxy, only by this browser.
    "Cache-Control": "private, max-age=3600",
  });
  if (photo.size != null) headers.set("Content-Length", String(photo.size));
  if (url.searchParams.get("download")) {
    const safeName = (name ?? key.split("/").pop() ?? "photo").replace(
      /[^A-Za-z0-9._-]/g,
      "_"
    );
    headers.set("Content-Disposition", `attachment; filename="${safeName}"`);
  }

  return new NextResponse(photo.body, { headers });
}
