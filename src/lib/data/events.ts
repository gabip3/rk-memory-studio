/**
 * Event categories. Copy is approved brand copy - no invented statistics,
 * turnaround times or pricing anywhere in this file.
 */

export type EventCategory = {
  slug: string;
  name: string;
  /** Short line used on the dark editorial home section. */
  blurb: string;
  /** Longer intro for the event landing page. */
  intro: string;
  /** What we typically make for this event type. */
  offerings: string[];
  /** Products most relevant to this event, by product slug. */
  relatedProducts: string[];
  image: { src: string | null; alt: string };
  /** Shown on the home page dark section (the four headline categories). */
  featuredOnHome: boolean;
  seo: { title: string; description: string };
};

export const eventCategories: EventCategory[] = [
  {
    slug: "weddings",
    name: "Weddings",
    blurb: "Custom photo magnets and keepsakes your guests can take home.",
    intro:
      "Give guests something from the day itself. We turn engagement photography, " +
      "booth strips and wedding details into keepsakes that leave with them and stay.",
    offerings: [
      "Photo magnets featuring the couple or each guest",
      "Photo strip keepsakes from the reception booth",
      "Favour sets personalized with names and the wedding date",
      "Thank-you keepsakes to send after the day",
    ],
    relatedProducts: ["custom-photo-magnets", "photo-strips", "event-keepsakes"],
    image: {
      src: "/images/event-weddings.webp",
      alt: "A square photo magnet of a bride and groom on a reception table beside a champagne glass, a candle and a folded napkin.",
    },
    featuredOnHome: true,
    seo: {
      title: "Wedding Keepsakes & Favours",
      description:
        "Custom wedding photo magnets, photo strip keepsakes and personalized favours your guests will actually take home and keep.",
    },
  },
  {
    slug: "birthdays",
    name: "Birthdays",
    blurb: "Personalized favors featuring photos, names and celebration dates.",
    intro:
      "From first birthdays to milestone years, we build favours around the photographs " +
      "and details that make the celebration specific to one person.",
    offerings: [
      "Photo magnets featuring the guest of honour",
      "Keychains personalized with names and the celebration date",
      "Matching favour sets for every place setting",
      "Milestone birthday keepsakes for family",
    ],
    relatedProducts: ["custom-photo-magnets", "photo-keychains", "event-keepsakes"],
    image: {
      src: "/images/event-birthdays.webp",
      alt: "A round photo magnet of a little girl blowing out birthday candles, on a table with leftover cake and party plates.",
    },
    featuredOnHome: true,
    seo: {
      title: "Birthday Keepsakes & Party Favours",
      description:
        "Personalized birthday favours featuring photographs, names and celebration dates - photo magnets and keychains made for the guest of honour.",
    },
  },
  {
    slug: "baby-showers",
    name: "Baby Showers",
    blurb: "Keepsakes for the people celebrating a new arrival.",
    intro:
      "Sonogram images, maternity photography and the first pictures of a new arrival, " +
      "turned into keepsakes for family and guests.",
    offerings: [
      "Announcement magnets for family and grandparents",
      "Shower favours personalized with the baby's name",
      "Keepsakes built around sonogram and maternity photography",
      "Matching sets for the gift table",
    ],
    relatedProducts: ["custom-photo-magnets", "event-keepsakes", "personalized-gifts"],
    image: {
      src: "/images/event-baby-showers.webp",
      alt: "A square photo magnet of a sleeping newborn on a muslin blanket beside a pacifier and a knit bear-ear hat.",
    },
    featuredOnHome: false,
    seo: {
      title: "Baby Shower Keepsakes & Favours",
      description:
        "Baby shower favours and announcement keepsakes personalized with sonogram, maternity and newborn photography.",
    },
  },
  {
    slug: "graduations",
    name: "Graduations",
    blurb:
      "Custom graduation magnets and keepsakes for graduates, families and guests.",
    intro:
      "Senior portraits and ceremony photography become keepsakes the whole family keeps - " +
      "and favours for everyone who came to celebrate.",
    offerings: [
      "Graduation magnets featuring the graduate's portrait",
      "Keepsakes personalized with the school, year and name",
      "Favour sets for the graduation party",
      "Keychains for family and close friends",
    ],
    relatedProducts: ["custom-photo-magnets", "photo-keychains", "event-keepsakes"],
    image: {
      src: "/images/event-graduations.webp",
      alt: "A round photo magnet of a smiling graduate in cap and gown on a refrigerator, next to a hanging graduation tassel.",
    },
    featuredOnHome: true,
    seo: {
      title: "Graduation Keepsakes & Favours",
      description:
        "Custom graduation photo magnets and keepsakes for graduates, families and guests - personalized with names, schools and graduation year.",
    },
  },
  {
    slug: "corporate-events",
    name: "Corporate Events",
    blurb:
      "Branded magnets and keepsakes featuring company logos, event graphics and custom designs.",
    intro:
      "Conference activations, holiday parties and brand events. We produce keepsakes that " +
      "carry your artwork and leave the venue in someone's pocket.",
    offerings: [
      "Branded magnets featuring company logos and event graphics",
      "Custom designs built from your brand artwork",
      "Activation keepsakes for conferences and trade shows",
      "Team and milestone keepsakes for staff events",
    ],
    relatedProducts: ["event-keepsakes", "custom-photo-magnets", "photo-strips"],
    image: {
      src: "/images/event-corporate.webp",
      alt: "Stacks of branded square magnets printed with a black and gold logo on a registration table at a corporate event, beside lanyards.",
    },
    featuredOnHome: true,
    seo: {
      title: "Corporate Event Keepsakes & Branded Favours",
      description:
        "Branded corporate event keepsakes featuring company logos, event graphics and custom designs for conferences, activations and staff celebrations.",
    },
  },
  {
    slug: "memorial-keepsakes",
    name: "Memorial Keepsakes",
    blurb: "A quiet way to keep someone close.",
    intro:
      "Memorial keepsakes made from the photographs a family wants to hold on to - " +
      "created carefully, and with as much or as little personalization as you would like.",
    offerings: [
      "Keepsakes made from treasured family photographs",
      "Keychains for family members to carry",
      "Sets for a memorial service or celebration of life",
      "Optional names, dates and short inscriptions",
    ],
    relatedProducts: ["custom-photo-magnets", "photo-keychains", "personalized-gifts"],
    image: {
      src: "/images/event-memorial.webp",
      alt: "A square photo magnet of an elderly couple smiling together, on a wooden side table beside a lit candle and reading glasses.",
    },
    featuredOnHome: false,
    seo: {
      title: "Memorial Keepsakes",
      description:
        "Memorial keepsakes made from treasured family photographs, with optional names, dates and short inscriptions.",
    },
  },
];

export const getEvent = (slug: string): EventCategory | undefined =>
  eventCategories.find((e) => e.slug === slug);

export const homeEvents = (): EventCategory[] =>
  eventCategories.filter((e) => e.featuredOnHome);

export const eventSlugs = (): string[] => eventCategories.map((e) => e.slug);

/** Event types offered in the bulk order form's select. */
export const eventTypeOptions = [
  ...eventCategories.map((e) => e.name),
  "Anniversary",
  "Holiday Party",
  "Other",
];
