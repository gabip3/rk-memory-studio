/**
 * Product catalogue - the single source of truth for everything the storefront
 * renders. Presentation components must never hard-code product copy.
 *
 * PRICING: intentionally `null`. The checkout provider owns pricing, so the UI
 * renders a "Confirmed at checkout" state whenever `price` is null and no
 * invented figure is ever shown. To mirror prices on-site, fill `price` in (in
 * cents) and the UI picks it up automatically, but you must then keep it in
 * sync with the provider by hand.
 */

/**
 * The studio sells one product line. Keychains, photo strips, event keepsakes
 * and gifts were removed on 2026-10-23 at the owner's request: those are
 * quoted per event rather than sold from a shelf, and the keychains moved to
 * the photo booth business. Adding a category back means adding it here and
 * giving it an icon in ProductCard.
 */
export type ProductCategory = "magnets";

export type QuantityOption = {
  /** Number of finished pieces. */
  count: number;
  /** Short label, e.g. "9 Magnets". */
  label: string;
  /** Optional flag, e.g. "Event Pack". Never used for fake discounts. */
  note?: string | null;
  /** Per-option price in cents. Null while the provider owns pricing. */
  price?: number | null;
  /** Marks the option pre-selected on load. */
  default?: boolean;
};

/**
 * A physical variant of a product, e.g. magnet shape and size.
 *
 * Only facts the business has actually supplied belong here. `dimensions` is
 * the measurement they gave us and nothing more: no material, thickness or
 * finish claims are invented.
 */
export type ProductVariant = {
  id: string;
  /** Short label used on the selector, e.g. "2x2 Square". */
  name: string;
  /** Human-readable measurement, e.g. "2 x 2 inches". */
  dimensions: string;
  /** Drives the shape drawn on the selector so the choice reads visually. */
  shape: "square" | "round";
  default?: boolean;
  /** Cents. Null while the checkout provider owns pricing. */
  price?: number | null;
  /** Per-variant provider ids, when the business sells them separately. */
  checkCherryItemId?: string | null;
  etsyListingId?: string | null;
};

export type PersonalizationField = {
  id: "name" | "date" | "message";
  label: string;
  /** Shown persistently beneath the input, not as a placeholder. */
  helper: string;
  maxLength: number;
  multiline?: boolean;
  /** Personalization is always optional on these products. */
  required: false;
};

export type ProductImage = {
  /** Path under /public. `null` renders the branded placeholder frame. */
  src: string | null;
  /** Required. Describes the photograph for screen readers. */
  alt: string;
  width: number;
  height: number;
};

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  /** One-line positioning used on cards. */
  tagline: string;
  /** Card copy - matches the approved brand copy deck. */
  cardDescription: string;
  /** Product-page headline (editorial, longer than the name). */
  headline: string;
  /** Product-page body copy. */
  description: string;
  /** Bulleted detail points. Only facts the business has confirmed. */
  details: string[];
  /** Physical options such as shape and size. Omit when there is only one. */
  variants?: ProductVariant[];
  quantityOptions: QuantityOption[];
  /** How many distinct photographs the customer may upload. */
  photoPolicy: {
    min: number;
    /** `"quantity"` means the cap follows the selected quantity. */
    max: number | "quantity";
    helper: string;
  };
  personalization: PersonalizationField[];
  images: ProductImage[];
  /** Price in cents for the whole configuration; null = confirmed at checkout. */
  price: number | null;
  /** Check Cherry package/item id. Supplied by the business. */
  checkCherryItemId: string | null;
  /**
   * Etsy listing id, only used if the dormant Etsy provider is switched on.
   * Null until a listing exists; the UI then falls back to the shop front.
   */
  etsyListingId: string | null;
  featured: boolean;
  bestSeller: boolean;
  seo: { title: string; description: string };
};

const STANDARD_PERSONALIZATION: PersonalizationField[] = [
  {
    id: "name",
    label: "Name",
    helper: "A name, couple or family to print on your keepsake.",
    maxLength: 40,
    required: false,
  },
  {
    id: "date",
    label: "Date",
    helper: "A wedding, birthday or celebration date.",
    maxLength: 24,
    required: false,
  },
  {
    id: "message",
    label: "Short Message",
    helper: "A few words - a toast, a thank you, or a nickname.",
    maxLength: 90,
    multiline: true,
    required: false,
  },
];

export const products: Product[] = [
  {
    slug: "custom-photo-magnets",
    name: "Custom Photo Magnets",
    category: "magnets",
    tagline: "Your memories, on display every day",
    cardDescription:
      "Your favorite memories transformed into beautiful magnets you can enjoy every day.",
    headline: "Turn Your Favorite Photos Into Memories You Can See Every Day",
    description:
      "Create personalized photo magnets using your favorite family moments, vacations, " +
      "weddings, pets, celebrations and everyday memories.",
    details: [
      "Available as a 2x2 square or a 2.25 round",
      "Individually made from the photographs you upload",
      "Optional name, date or short message on each design",
      "Mix different photos within a single order",
      "Available in event quantities for weddings and celebrations",
    ],
    variants: [
      {
        id: "square-2x2",
        name: "2x2 Square",
        dimensions: "2 x 2 inches",
        shape: "square",
        default: true,
        price: null,
        checkCherryItemId: null,
        etsyListingId: null,
      },
      {
        id: "round-2-25",
        name: "2.25 Round",
        dimensions: "2.25 inch diameter",
        shape: "round",
        price: null,
        checkCherryItemId: null,
        etsyListingId: null,
      },
    ],
    quantityOptions: [
      { count: 9, label: "9 Magnets" },
      { count: 12, label: "12 Magnets", default: true },
      { count: 18, label: "18 Magnets" },
      { count: 24, label: "24 Magnets" },
      { count: 36, label: "36 Magnets" },
      { count: 50, label: "50 Magnets" },
      { count: 100, label: "100 Magnets", note: "Event Pack" },
    ],
    photoPolicy: {
      min: 1,
      max: "quantity",
      helper:
        "Upload one photo to repeat across the set, or up to one photo per magnet.",
    },
    personalization: STANDARD_PERSONALIZATION,
    images: [
      {
        src: "/images/product-magnets.webp",
        alt: "Twelve personalized photo magnets, six 2x2 inch squares and six 2.25 inch rounds, laid out on a wooden table and printed with family portraits, a golden retriever, a cat, wedding couples, babies and travel photos.",
        width: 1448,
        height: 1086,
      },
      {
        src: "/images/product-magnets-detail.webp",
        alt: "A hand holding a 2.25 inch round photo magnet printed with a smiling toddler at the beach.",
        width: 1295,
        height: 1214,
      },
    ],
    price: null,
    checkCherryItemId: null,
    etsyListingId: null,
    featured: true,
    bestSeller: true,
    seo: {
      title: "Custom Photo Magnets",
      description:
        "Turn your favourite photographs into personalized custom photo magnets. Upload your photos, add an optional name or date, and we make them individually for you.",
    },
  },
];

/* ---- Selectors ---------------------------------------------------------- */

export const getProduct = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const bestSellers = (): Product[] => products.filter((p) => p.bestSeller);

export const featuredProduct = (): Product =>
  products.find((p) => p.featured) ?? products[0];

export const productSlugs = (): string[] => products.map((p) => p.slug);

/** The variant selected on first load, or undefined when there are none. */
export function defaultVariant(product: Product): ProductVariant | undefined {
  if (!product.variants?.length) return undefined;
  return product.variants.find((v) => v.default) ?? product.variants[0];
}

/** Resolves the photo upload ceiling for a chosen quantity. */
export function maxPhotosFor(product: Product, quantity: number): number {
  return product.photoPolicy.max === "quantity"
    ? quantity
    : product.photoPolicy.max;
}
