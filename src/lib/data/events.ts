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
      src: null,
      alt: "A wedding keepsake magnet showing a bride and groom, resting on a linen surface.",
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
      src: null,
      alt: "A personalized birthday keepsake magnet with a name and celebration date.",
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
      src: null,
      alt: "A baby shower keepsake magnet featuring a newborn photograph.",
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
      src: null,
      alt: "A graduation keepsake magnet featuring a graduate in cap and gown.",
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
      src: null,
      alt: "A branded corporate event keepsake magnet featuring a company logo.",
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
      src: null,
      alt: "A memorial keepsake featuring a treasured family photograph.",
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
