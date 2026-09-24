import { NextResponse } from "next/server";
import { buildCart, createDraft, createHandoff } from "@/lib/checkout";
import { buildOrderManifest, unstoredPhotos } from "@/lib/checkout/manifest";
import { getStorageAdapter } from "@/lib/uploads/adapter";
import type { CartLine } from "@/lib/checkout/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Creates an order draft and returns the provider handoff.
 *
 * The reference code minted here ties the photos uploaded on this site to the
 * order the customer completes with the provider. With Check Cherry it rides
 * in the URL automatically; the customer never sees or retypes it.
 */
export async function POST(request: Request) {
  let payload: { lines?: CartLine[]; customer?: Record<string, string> };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not read the order." },
      { status: 400 }
    );
  }

  const lines = Array.isArray(payload.lines) ? payload.lines : [];

  if (lines.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Your cart is empty." },
      { status: 400 }
    );
  }

  // Every line must carry at least one photo - these are personalized products.
  const missingPhotos = lines.filter((line) => !line.photos?.length);
  if (missingPhotos.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Every item needs at least one photo before checkout. Please add photos to your order.",
      },
      { status: 400 }
    );
  }

  const draft = createDraft(buildCart(lines), payload.customer);

  // Photos the browser lists but storage never received. Taking this order
  // would mean taking money for photographs the studio does not have.
  const missing = unstoredPhotos(draft);
  if (missing.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error:
          missing.length === 1
            ? `"${missing[0]}" did not finish uploading. Please remove it or add it again before checking out.`
            : "Some of your photos did not finish uploading. Please add them again before checking out.",
      },
      { status: 400 }
    );
  }

  // The provider only ever receives the reference, never the photographs, so
  // the record tying the two together must exist BEFORE the customer is handed
  // over to pay. Without it an order arrives that nobody can fulfil.
  const manifest = await getStorageAdapter().storeOrder(
    draft.reference,
    JSON.stringify(buildOrderManifest(draft), null, 2)
  );

  if (!manifest.ok) {
    console.error(
      `[checkout] could not record order ${draft.reference}: ${manifest.error}`
    );
    return NextResponse.json(
      {
        ok: false,
        reference: draft.reference,
        error:
          "We could not start your order just now. Nothing has been charged. " +
          "Please try again, or contact us and we will complete it with you.",
        ...(process.env.NODE_ENV !== "production" && { reason: manifest.error }),
      },
      { status: 503 }
    );
  }

  const handoff = await createHandoff(draft);

  if (handoff.status === "unconfigured") {
    return NextResponse.json(
      {
        ok: false,
        status: "unconfigured",
        reference: handoff.reference,
        error:
          "Online checkout is not switched on yet. Your order details are saved, so please contact us and we will complete it with you.",
        ...(process.env.NODE_ENV !== "production" && { reason: handoff.reason }),
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, handoff });
}
