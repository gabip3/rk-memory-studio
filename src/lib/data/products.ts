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

export type ProductCategory =
  | "magnets"
  | "keychains"
  | "photo-strips"
  | "event-keepsakes"
  | "gifts";

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

  {
    slug: "photo-keychains",
    name: "Personalized Photo Keychains",
    category: "keychains",
    tagline: "Carry a moment everywhere you go",
    cardDescription: "Take your favorite memories everywhere you go.",
    headline: "Carry Your Memories Everywhere",
    description:
      "Transform your favorite photographs into personalized photo keychains - made for " +
      "family, couples, pets, weddings, graduations and gifts.",
    details: [
      "Single photo, double-sided and photo strip styles",
      "Optional name, date or short message",
      "Available as event packs for guests and party favours",
      "Made individually from the photographs you upload",
    ],
    quantityOptions: [
      { count: 1, label: "1 Keychain", default: true },
      { count: 2, label: "2 Keychains" },
      { count: 4, label: "4 Keychains" },
      { count: 6, label: "6 Keychains" },
      { count: 12, label: "12 Keychains" },
      { count: 25, label: "25 Keychains", note: "Event Pack" },
      { count: 50, label: "50 Keychains", note: "Event Pack" },
    ],
    photoPolicy: {
      min: 1,
      max: "quantity",
      helper:
        "Upload one photo per keychain, or a single photo to use across the whole set.",
    },
    personalization: STANDARD_PERSONALIZATION,
    images: [
      {
        src: "/images/product-keychains.webp",
        alt: "Three clear acrylic photo keychains on linen: a mother and daughter at the beach, a golden retriever, and a three-photo strip keychain.",
        width: 1312,
        height: 1199,
      },
    ],
    price: null,
    checkCherryItemId: null,
    etsyListingId: null,
    featured: false,
    bestSeller: true,
    seo: {
      title: "Personalized Photo Keychains",
      description:
        "Personalized photo keychains made from your own photographs. Single photo, double-sided and photo strip styles for family, couples, pets and events.",
    },
  },

  {
    slug: "photo-strips",
    name: "Photo Strip Keepsakes",
    category: "photo-strips",
    tagline: "The classic booth strip, made to last",
    cardDescription:
      "The photo strip you love, reprinted as a keepsake built to survive the fridge door.",
    headline: "The Photo Strip, Made Permanent",
    description:
      "Turn photo booth strips and favourite photo sequences into lasting keepsakes - as " +
      "magnets, keychains or standalone strips your guests can take home.",
    details: [
      "Works with photo booth strips and your own photo sequences",
      "Available as a magnet, keychain or standalone strip",
      "Optional names, dates and event details",
      "A natural pairing with an RK 360 photo booth event",
    ],
    quantityOptions: [
      { count: 6, label: "6 Strips", default: true },
      { count: 12, label: "12 Strips" },
      { count: 24, label: "24 Strips" },
      { count: 50, label: "50 Strips" },
      { count: 100, label: "100 Strips", note: "Event Pack" },
    ],
    photoPolicy: {
      min: 1,
      max: "quantity",
      helper:
        "Upload the strip itself, or up to four individual photos and we will arrange them.",
    },
    personalization: STANDARD_PERSONALIZATION,
    images: [
      {
        src: null,
        alt: "A photo strip keepsake card showing three photographs of a couple with a handwritten thank you message.",
        width: 1200,
        height: 1500,
      },
    ],
    price: null,
    checkCherryItemId: null,
    etsyListingId: null,
    featured: false,
    bestSeller: false,
    seo: {
      title: "Photo Strip Keepsakes",
      description:
        "Turn photo booth strips and photo sequences into lasting keepsakes - magnets, keychains and standalone strips personalized with names and dates.",
    },
  },

  {
    slug: "event-keepsakes",
    name: "Event Keepsakes",
    category: "event-keepsakes",
    tagline: "Favours guests actually keep",
    cardDescription:
      "Personalized favors your guests will actually want to keep.",
    headline: "Make Your Celebration Unforgettable",
    description:
      "Custom photo magnets and keepsakes created for weddings, birthdays, graduations " +
      "and corporate events - personalized with photographs, names, dates and designs.",
    details: [
      "Designed around your event photography and details",
      "Names, dates and event branding available",
      "Coordinated sets for guest tables and favour displays",
      "Larger celebrations are quoted through our bulk order form",
    ],
    quantityOptions: [
      { count: 25, label: "25 Keepsakes" },
      { count: 50, label: "50 Keepsakes", default: true },
      { count: 75, label: "75 Keepsakes" },
      { count: 100, label: "100 Keepsakes", note: "Event Pack" },
      { count: 150, label: "150 Keepsakes", note: "Event Pack" },
      { count: 250, label: "250 Keepsakes", note: "Request a quote" },
    ],
    photoPolicy: {
      min: 1,
      max: 25,
      helper:
        "Upload the photographs and any event artwork you would like us to work from.",
    },
    personalization: STANDARD_PERSONALIZATION,
    images: [
      {
        src: "/images/product-event-keepsakes.webp",
        alt: "A wedding reception favor table covered in square photo magnets of the couple and their guests, beside candles and a vase of white flowers.",
        width: 1312,
        height: 1199,
      },
    ],
    price: null,
    checkCherryItemId: null,
    etsyListingId: null,
    featured: false,
    bestSeller: true,
    seo: {
      title: "Event Keepsakes & Favours",
      description:
        "Personalized event keepsakes for weddings, birthdays, graduations and corporate events. Custom photo magnets and favours your guests will keep.",
    },
  },

  {
    slug: "personalized-gifts",
    name: "Personalized Gifts",
    category: "gifts",
    tagline: "Something personal, not ordinary",
    cardDescription:
      "Give something made from a memory instead of another ordinary gift.",
    headline: "A Gift Made From a Memory",
    description:
      "Create a keepsake built around a photograph that means something - for birthdays, " +
      "anniversaries, holidays, new parents, or simply because.",
    details: [
      "Built from the photograph you choose",
      "Optional name, date or short message",
      "Presented as a finished keepsake, ready to give",
      "Mix products to build a personalized gift set",
    ],
    quantityOptions: [
      { count: 1, label: "Single Gift", default: true },
      { count: 2, label: "Gift Pair" },
      { count: 4, label: "Gift Set of 4" },
      { count: 6, label: "Gift Set of 6" },
      { count: 12, label: "Gift Set of 12" },
    ],
    photoPolicy: {
      min: 1,
      max: "quantity",
      helper: "Upload the photograph you would like the gift built around.",
    },
    personalization: STANDARD_PERSONALIZATION,
    images: [
      {
        src: "/images/product-gifts.webp",
        alt: "Hands opening a kraft gift box holding a square photo magnet of a grandmother and granddaughter cheek to cheek.",
        width: 1312,
        height: 1199,
      },
    ],
    price: null,
    checkCherryItemId: null,
    etsyListingId: null,
    featured: false,
    bestSeller: false,
    seo: {
      title: "Personalized Photo Gifts",
      description:
        "Personalized photo gifts made from your own photographs - keepsakes for birthdays, anniversaries, holidays and new parents.",
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

/* ---- Keychain sub-styles (presented on the keychain section) ------------- */

export const keychainStyles = [
  {
    name: "Single Photo Keychain",
    description: "One photograph, finished on both sides.",
  },
  {
    name: "Double-Sided Photo Keychain",
    description: "A different memory on each side.",
  },
  {
    name: "Photo Strip Keychain",
    description: "A full booth strip, shrunk to pocket size.",
  },
  {
    name: "Event Keychain Pack",
    description: "Matching keychains for every guest.",
  },
] as const;
