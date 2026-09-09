/**
 * Checkout configuration, read exclusively from environment variables.
 * No URL, snippet, item id or credential is hard-coded in this repository.
 *
 * See docs/check-cherry-integration.md (active) and docs/etsy-integration.md
 * (dormant) for what to supply.
 */

const trim = (v: string | undefined) => (v ?? "").trim();

/** Which provider is live. Check Cherry by default. */
export function activeProviderId(): string {
  return trim(process.env.CHECKOUT_PROVIDER) || "check-cherry";
}

/* ------------------------------------------------------------------------ */
/* Check Cherry (active)                                                    */
/* ------------------------------------------------------------------------ */

export type CheckCherryMode = "hosted" | "embed" | "unconfigured";

export type CheckCherryConfig = {
  mode: CheckCherryMode;
  /** Hosted booking/checkout URL supplied by Check Cherry. */
  bookingUrl: string;
  /** Embed snippet copied from the Check Cherry dashboard. */
  embedHtml: string;
  /**
   * Query parameter Check Cherry receives our order reference in. Must match a
   * field configured on their booking form, otherwise an incoming order cannot
   * be matched to the uploaded photos.
   */
  referenceParam: string;
  /** Optional extra query params, as `key=value&key2=value2`. */
  extraParams: string;
  isConfigured: boolean;
  reason: string;
};

export function getCheckCherryConfig(): CheckCherryConfig {
  const rawMode = trim(process.env.CHECK_CHERRY_MODE).toLowerCase();
  const bookingUrl = trim(process.env.CHECK_CHERRY_BOOKING_URL);
  const embedHtml = trim(process.env.CHECK_CHERRY_EMBED_HTML);
  const referenceParam =
    trim(process.env.CHECK_CHERRY_REFERENCE_PARAM) || "reference";
  const extraParams = trim(process.env.CHECK_CHERRY_EXTRA_PARAMS);

  let mode: CheckCherryMode =
    rawMode === "hosted" || rawMode === "embed" ? rawMode : "unconfigured";
  let reason = "";

  if (mode === "hosted") {
    if (!bookingUrl) {
      mode = "unconfigured";
      reason =
        "CHECK_CHERRY_MODE is 'hosted' but CHECK_CHERRY_BOOKING_URL is not set.";
    } else if (!/^https:\/\//i.test(bookingUrl)) {
      mode = "unconfigured";
      reason = "CHECK_CHERRY_BOOKING_URL must be an absolute https:// URL.";
    }
  } else if (mode === "embed") {
    if (!embedHtml) {
      mode = "unconfigured";
      reason =
        "CHECK_CHERRY_MODE is 'embed' but CHECK_CHERRY_EMBED_HTML is not set.";
    }
  } else {
    reason =
      "CHECK_CHERRY_MODE is not set. Set it to 'hosted' or 'embed' and supply " +
      "the matching values (see docs/check-cherry-integration.md).";
  }

  return {
    mode,
    bookingUrl,
    embedHtml,
    referenceParam,
    extraParams,
    isConfigured: mode !== "unconfigured",
    reason,
  };
}

/* ------------------------------------------------------------------------ */
/* Etsy (dormant, kept so switching is one env var)                         */
/* ------------------------------------------------------------------------ */

export type EtsyConfig = {
  shopUrl: string;
  isConfigured: boolean;
  reason: string;
};

const ETSY_HOST = /^https:\/\/(www\.)?etsy\.com\//i;

export function getEtsyConfig(): EtsyConfig {
  const shopUrl = trim(process.env.ETSY_SHOP_URL);

  if (!shopUrl) {
    return {
      shopUrl: "",
      isConfigured: false,
      reason: "ETSY_SHOP_URL is not set (see docs/etsy-integration.md).",
    };
  }

  if (!ETSY_HOST.test(shopUrl)) {
    return {
      shopUrl: "",
      isConfigured: false,
      reason: `ETSY_SHOP_URL must be an https://www.etsy.com/... URL. Got: ${shopUrl}`,
    };
  }

  return { shopUrl: shopUrl.replace(/\/$/, ""), isConfigured: true, reason: "" };
}

/**
 * Canonical Etsy listing URL. The slug is optional; Etsy redirects to it.
 * No query parameter is appended claiming to pre-fill personalization, because
 * Etsy documents none and inventing one would silently do nothing.
 */
export function listingUrl(listingId: string | null): string | null {
  const id = trim(listingId ?? undefined);
  if (!id || !/^\d+$/.test(id)) return null;
  return `https://www.etsy.com/listing/${id}`;
}

/* ------------------------------------------------------------------------ */
/* Client-safe status                                                       */
/* ------------------------------------------------------------------------ */

export type PublicCheckoutStatus = {
  ready: boolean;
  provider: "check-cherry" | "etsy";
  /** Only populated for Etsy; never leak Check Cherry URLs to the browser. */
  shopUrl: string;
};

export function getPublicCheckoutStatus(): PublicCheckoutStatus {
  if (activeProviderId() === "etsy") {
    const etsy = getEtsyConfig();
    return { ready: etsy.isConfigured, provider: "etsy", shopUrl: etsy.shopUrl };
  }

  return {
    ready: getCheckCherryConfig().isConfigured,
    provider: "check-cherry",
    shopUrl: "",
  };
}
