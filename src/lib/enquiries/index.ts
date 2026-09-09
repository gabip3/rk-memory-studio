/**
 * Where contact and bulk-order enquiries go.
 *
 * Three delivery modes, chosen with ENQUIRY_TRANSPORT:
 *
 *   webhook  POSTs the enquiry as JSON to ENQUIRY_WEBHOOK_URL. This is the
 *            recommended production setting - point it at Zapier, Make, an
 *            inbox automation, or any endpoint your CRM exposes.
 *   log      Writes to the server log. Development only.
 *   none     Rejects the submission and the form tells the customer to email
 *            instead. This is the default, so nothing is ever silently lost.
 *
 * No email provider is hard-wired: adding Resend/SendGrid/SES later means
 * adding one branch here, not touching the forms.
 */

export type EnquiryKind = "contact" | "bulk-order";

export type Enquiry = {
  kind: EnquiryKind;
  fields: Record<string, string>;
  submittedAt: string;
  /** Set for bulk orders so the studio can quote against a stable id. */
  reference?: string;
};

export type EnquiryResult = {
  ok: boolean;
  error?: string;
  /** Staff-facing diagnostic, only surfaced outside production. */
  reason?: string;
};

const trim = (v: string | undefined) => (v ?? "").trim();

export async function deliverEnquiry(enquiry: Enquiry): Promise<EnquiryResult> {
  const transport = trim(process.env.ENQUIRY_TRANSPORT).toLowerCase() || "none";

  if (transport === "webhook") {
    const url = trim(process.env.ENQUIRY_WEBHOOK_URL);

    if (!/^https:\/\//i.test(url)) {
      return {
        ok: false,
        error: "We could not send your message. Please email us instead.",
        reason:
          "ENQUIRY_TRANSPORT is 'webhook' but ENQUIRY_WEBHOOK_URL is missing or not https.",
      };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.ENQUIRY_WEBHOOK_SECRET && {
            "X-RKMS-Secret": process.env.ENQUIRY_WEBHOOK_SECRET,
          }),
        },
        body: JSON.stringify(enquiry),
        // Never let a slow third party hang the customer's submit button.
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        return {
          ok: false,
          error: "We could not send your message. Please email us instead.",
          reason: `Webhook responded ${response.status}.`,
        };
      }

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: "We could not send your message. Please email us instead.",
        reason: error instanceof Error ? error.message : "Webhook request failed.",
      };
    }
  }

  if (transport === "log") {
    console.info("[enquiry]", JSON.stringify(enquiry, null, 2));
    return { ok: true };
  }

  return {
    ok: false,
    error:
      "Our contact form is not connected yet. Please email us and we will reply personally.",
    reason:
      "ENQUIRY_TRANSPORT is not set. Set it to 'webhook' (with ENQUIRY_WEBHOOK_URL) before launch.",
  };
}

/** True when the form can actually deliver, used to pre-empt dead submits. */
export function enquiriesConfigured(): boolean {
  const transport = trim(process.env.ENQUIRY_TRANSPORT).toLowerCase();
  if (transport === "log") return true;
  if (transport === "webhook") {
    return /^https:\/\//i.test(trim(process.env.ENQUIRY_WEBHOOK_URL));
  }
  return false;
}
