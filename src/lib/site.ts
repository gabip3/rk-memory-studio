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

/** Canonical origin. Set NEXT_PUBLIC_SITE_URL in every environment. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

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

  /** Contact. Email is a placeholder until the business address is provided. */
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? PLACEHOLDER,
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? PLACEHOLDER,
    location: "Atlanta, Georgia",
    /** Free-form service-area note; safe to edit. */
    serviceArea: "Serving Atlanta and shipping nationwide.",
  },

  social: {
    instagramHandle: "@RKMemoryStudio",
    /** Public Etsy storefront. Also set ETSY_SHOP_URL for the checkout handoff. */
    etsy: process.env.NEXT_PUBLIC_ETSY_SHOP_URL ?? PLACEHOLDER,
    instagram:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
      "https://www.instagram.com/rkmemorystudio/",
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
      { label: "Instagram", href: site.social.instagram },
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
