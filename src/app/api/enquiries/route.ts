import { NextResponse } from "next/server";
import { deliverEnquiry, type EnquiryKind } from "@/lib/enquiries";
import { createOrderReference } from "@/lib/checkout";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REQUIRED: Record<EnquiryKind, string[]> = {
  contact: ["name", "email", "message"],
  "bulk-order": ["name", "email", "eventType", "quantity", "product"],
};

const MAX_FIELD_LENGTH = 4000;

export async function POST(request: Request) {
  let payload: { kind?: string; fields?: Record<string, string>; company?: string };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not read that submission." },
      { status: 400 }
    );
  }

  // Honeypot: a hidden field no human sees. Silently accept so bots do not
  // learn they were caught, but deliver nothing.
  if (payload.company) {
    return NextResponse.json({ ok: true });
  }

  const kind = payload.kind as EnquiryKind;
  if (kind !== "contact" && kind !== "bulk-order") {
    return NextResponse.json(
      { ok: false, error: "Unknown enquiry type." },
      { status: 400 }
    );
  }

  const fields = payload.fields ?? {};

  const missing = REQUIRED[kind].filter((key) => !fields[key]?.trim());
  if (missing.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "Some required details are missing.",
        fields: missing,
      },
      { status: 400 }
    );
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email.trim())) {
    return NextResponse.json(
      {
        ok: false,
        error: "That email address does not look right.",
        fields: ["email"],
      },
      { status: 400 }
    );
  }

  // Clamp every value so an oversized payload cannot be forwarded downstream.
  const clean = Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      String(value ?? "").slice(0, MAX_FIELD_LENGTH).trim(),
    ])
  );

  const reference = kind === "bulk-order" ? createOrderReference() : undefined;

  const result = await deliverEnquiry({
    kind,
    fields: clean,
    submittedAt: new Date().toISOString(),
    reference,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.error,
        ...(process.env.NODE_ENV !== "production" && { reason: result.reason }),
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, reference });
}
