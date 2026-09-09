/**
 * Check Cherry checkout provider. ACTIVE.
 *
 * SCOPE, read this before extending:
 *
 * This provider uses ONLY mechanisms every Check Cherry account has: a hosted
 * booking/checkout URL, or an embed snippet copied from the Check Cherry
 * dashboard. No REST endpoint, payload shape or webhook route is guessed at,
 * because guessing produces code that looks finished and fails silently in
 * production.
 *
 * The order reference is appended to the URL as a query parameter, so the
 * customer never copies or retypes anything. That is the whole reason this is
 * the default provider rather than Etsy, where no such parameter exists.
 *
 * If you later want a direct API integration, get the documented contract from
 * Check Cherry support first, then add a new provider file. Do not invent
 * endpoints here.
 */

import { getCheckCherryConfig } from "./config";
import type {
  CheckoutDraft,
  CheckoutHandoff,
  CheckoutProvider,
} from "./types";

/**
 * Appends our reference (and any configured extras) to the booking URL,
 * preserving query parameters the business already put there.
 */
function buildHostedUrl(
  bookingUrl: string,
  referenceParam: string,
  reference: string,
  extraParams: string
): string {
  const url = new URL(bookingUrl);
  url.searchParams.set(referenceParam, reference);

  if (extraParams) {
    for (const [key, value] of new URLSearchParams(extraParams)) {
      // Never let extras clobber the reference: it is how orders get matched.
      if (key !== referenceParam) url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

/** Pulls the src out of a plain iframe snippet so we can render it safely. */
function extractIframeSrc(snippet: string): string | null {
  const match = snippet.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  if (!match) return null;
  try {
    const url = new URL(match[1]);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export const checkCherryProvider: CheckoutProvider = {
  id: "check-cherry",

  get isConfigured() {
    return getCheckCherryConfig().isConfigured;
  },

  async createHandoff(draft: CheckoutDraft): Promise<CheckoutHandoff> {
    const config = getCheckCherryConfig();

    if (!config.isConfigured) {
      return {
        status: "unconfigured",
        reason: config.reason,
        reference: draft.reference,
      };
    }

    if (config.mode === "hosted") {
      return {
        status: "redirect",
        url: buildHostedUrl(
          config.bookingUrl,
          config.referenceParam,
          draft.reference,
          config.extraParams
        ),
        reference: draft.reference,
      };
    }

    return {
      status: "embed",
      embedHtml: config.embedHtml,
      embedUrl: extractIframeSrc(config.embedHtml),
      reference: draft.reference,
    };
  },
};
