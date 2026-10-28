import { NextResponse } from "next/server";
import { activeProviderId } from "@/lib/checkout/config";
import { getStorageAdapter } from "@/lib/uploads/adapter";
import { orderingMode } from "@/lib/ordering";

/**
 * TEMPORARY. Reports which configuration the running server actually sees,
 * because an env var that is set in the dashboard but not reaching the app
 * looks identical, from outside, to one that was never set.
 *
 * It deliberately reports no secret: for the Stripe key it says only whether
 * one is present and which mode its prefix claims, never the key itself.
 *
 * Delete this route once the deployment is verified.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const key = (process.env.STRIPE_SECRET_KEY ?? "").trim();

  return NextResponse.json({
    orderingMode,
    checkoutProvider: {
      envValue: process.env.CHECKOUT_PROVIDER ?? null,
      resolved: activeProviderId(),
    },
    uploads: {
      envValue: process.env.UPLOAD_PROVIDER ?? null,
      resolved: getStorageAdapter().id,
      configured: getStorageAdapter().isConfigured,
    },
    stripeKey: {
      present: key.length > 0,
      kind: key.slice(0, 3),
      mode: /^(sk|rk)_live_/.test(key)
        ? "live"
        : /^(sk|rk)_test_/.test(key)
          ? "test"
          : key.length
            ? "unrecognised prefix"
            : "missing",
      length: key.length,
    },
    blobToken: { present: Boolean(process.env.BLOB_READ_WRITE_TOKEN) },
  });
}
