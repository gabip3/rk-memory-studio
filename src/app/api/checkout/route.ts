import { NextResponse } from "next/server";
import { buildCart, createDraft, createHandoff } from "@/lib/checkout";
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
