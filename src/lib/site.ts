/**
 * Global site configuration.
 *
 * PLACEHOLDERS: values wrapped in `PLACEHOLDER` are not yet supplied by the
 * business. They are surfaced through `isPlaceholder()` so the UI can render a
 * tasteful "coming soon" state instead of publishing invented information.
 * Replace them via environment variables (see .env.example) or edit directly.
 */

export const PLACEHOLDER = "__PLACEHOLDER__" as const;

export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || value === PLACEHOLDER || value.startsWith("__");
}

/**
 * `tel:` href for a number written for humans, e.g. "678-800-0811".
 * Ten digits are assumed to be US and get the +1 country code, so the link
 * works from a phone abroad as well as at home.
 */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `tel:+1${digits}` : `tel:${digits}`;
}

/** Canonical origin. Set NEXT_PUBLIC_SITE_URL in every environment. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

/**
 * The image shown when a link to the site is shared (WhatsApp, Facebook, X).
 *
 * An absolute URL on purpose. Next's file-based opengraph-image convention was
 * tried first, but under the GitHub Pages basePath it produced
 * /rk-memory-studio/rk-memory-studio/opengraph-image.jpg: Next prefixes the
 * basePath onto the route, then joins it to metadataBase, which already
 * contains it. An absolute URL is never joined, so it is right everywhere.
 *
 * Every page that sets its own `openGraph` must include it: a page's
 * openGraph object REPLACES the layout's rather than merging with it.
 */
export const OG_IMAGE = {
  url: `${SITE_URL}/images/og-image.jpg`,
  width: 1200,
  height: 630,
  alt: "RK Memory Studio logo beside personalized square and round photo magnets on a linen tablecloth.",
};

export const site = {
  name: "RK Memory Studio",
  shortName: "RK Memory Studio",
  tagline: "Turning Moments Into Keepsakes",
  positioning: "Custom Photo Magnets & Personalized Keepsakes",
  description:
    "RK Memory Studio turns your favourite photographs into personalized keepsakes " +
    "you can hold, display and give - custom photo magnets, photo keychains and " +
    "event keepsakes made from your own memories.",
  url: SITE_URL,
  locale: "en_US",

  /**
   * Contact, as published on the studio's own business card. These are code
   * defaults rather than env-only values: a forgotten variable on a live host
   * would otherwise show customers a "coming soon" state. Env still wins.
   *
   * >>> THE EMAIL DOES NOT RECEIVE MAIL YET. <<<
   * info@rkmemorystudio.com is the address the studio prints on its card and
   * intends to use, but the mailbox has not been bought: rkmemorystudio.com
   * has no MX record, so anything sent there is rejected by the sender's own
   * mail server, silently as far as the customer is concerned.
   *
   * That is harmless while the site is only a preview nobody is emailing, and
   * unacceptable the day the domain points at it. Before launch: buy the
   * mailbox, send a test message, confirm it arrives. Until then
   * NEXT_PUBLIC_CONTACT_EMAIL=rkmemorystudio@gmail.com switches every contact
   * surface back to the working Gmail address without a code change.
   *
   * The street address is deliberately absent. The registered address is a
   * home, and the card itself says "Atlanta, GA", so the city is all we show.
   */
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@rkmemorystudio.com",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "678-800-0811",
    location: "Atlanta, Georgia",
    /** Free-form service-area note; safe to edit. */
    serviceArea: "Serving Atlanta and shipping nationwide.",
  },

  social: {
    instagramHandle: "@RKMemoryStudio",
    /** Public Etsy storefront. Also set ETSY_SHOP_URL for the checkout handoff. */
    etsy: process.env.NEXT_PUBLIC_ETSY_SHOP_URL ?? PLACEHOLDER,
    /**
     * No account exists yet, so every Instagram surface (home gallery, header
     * bar, footer, mobile menu, contact page) stays hidden until this is set.
     */
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? PLACEHOLDER,
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? PLACEHOLDER,
  },

  /** Sister brand - referenced in the About page, not imitated. */
  sisterBrand: {
    name: "RK 360 Photo Booth Rentals",
    url: "https://www.rk360photoboothrentals.com/",
    blurb:
      "Our sister company, bringing 360 photo booth experiences to events across Atlanta.",
  },
} as const;

/* ------------------------------------------------------------------------ */
/* Navigation                                                               */
/* ------------------------------------------------------------------------ */

export type NavChild = {
  label: string;
  href: string;
  /** Optional one-line description shown in the mega-dropdown. */
  hint?: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Shop",
    href: "/shop",
    children: [
      {
        label: "Custom Photo Magnets",
        href: "/shop/custom-photo-magnets",
        hint: "Your memories, on display every day",
      },
      {
        label: "Photo Keychains",
        href: "/shop/photo-keychains",
        hint: "Carry a moment everywhere you go",
      },
      {
        label: "Photo Strips",
        href: "/shop/photo-strips",
        hint: "The classic booth strip, made to last",
      },
      {
        label: "Event Keepsakes",
        href: "/shop/event-keepsakes",
        hint: "Favours guests actually keep",
      },
      {
        label: "Personalized Gifts",
        href: "/shop/personalized-gifts",
        hint: "Something personal, not ordinary",
      },
      {
        label: "Bulk Orders",
        href: "/bulk-orders",
        hint: "50, 100, 250 or more",
      },
    ],
  },
  {
    label: "Events",
    href: "/events",
    children: [
      { label: "Weddings", href: "/events/weddings" },
      { label: "Birthdays", href: "/events/birthdays" },
      { label: "Baby Showers", href: "/events/baby-showers" },
      { label: "Graduations", href: "/events/graduations" },
      { label: "Corporate Events", href: "/events/corporate-events" },
      { label: "Memorial Keepsakes", href: "/events/memorial-keepsakes" },
    ],
  },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: NavChild[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Custom Magnets", href: "/shop/custom-photo-magnets" },
      { label: "Photo Keychains", href: "/shop/photo-keychains" },
      { label: "Event Keepsakes", href: "/shop/event-keepsakes" },
      { label: "Personalized Gifts", href: "/shop/personalized-gifts" },
      { label: "Bulk Orders", href: "/bulk-orders" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping", href: "/help/shipping" },
      { label: "Returns & Refunds", href: "/help/returns" },
      { label: "Photo Guidelines", href: "/help/photo-guidelines" },
      { label: "Order Status", href: "/help/order-status" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Events", href: "/events" },
      ...(isPlaceholder(site.social.instagram)
        ? []
        : [{ label: "Instagram", href: site.social.instagram }]),
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy Policy", href: "/policies/privacy" },
      { label: "Terms of Service", href: "/policies/terms" },
      { label: "Shipping Policy", href: "/policies/shipping" },
      { label: "Refund Policy", href: "/policies/refund" },
    ],
  },
];
