/**
 * Policy and help page content.
 *
 * Every page here is now `published`, because the studio confirmed its terms
 * on 2026-10-14: production up to 5 business days, free standard shipping over
 * $49.99, personalized orders final sale, damaged or faulty items covered for
 * 7 days after delivery, and no local collection. Everything is posted.
 *
 * These are commitments to customers, not copy. Changing a number here changes
 * what the studio owes someone who already ordered, so change them only when
 * the studio says so, and never to match a competitor.
 *
 * `status: "pending"` and `draft` remain available for anything decided later:
 * they render a clearly-labelled notice rather than a silent guess.
 */

export type PolicySection = { heading: string; body: string[] };

export type PolicyPage = {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  status: "published" | "draft" | "pending";
  /** Shown in the notice band when status is not "published". */
  notice?: string;
  sections: PolicySection[];
  seo: { title: string; description: string };
};

export const policies: PolicyPage[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    eyebrow: "Policies",
    intro:
      "How RK Memory Studio handles your information and the photographs you upload.",
    status: "published",
    sections: [
      {
        heading: "The photographs you upload",
        body: [
          "When you order a personalized keepsake you upload photographs so that we can make it. Those files are stored so our studio can produce your order, and they are used for that purpose only.",
          "We do not sell your photographs, and we do not publish them - including on social media - without asking you first.",
        ],
      },
      {
        heading: "Information you give us",
        body: [
          "When you place an order or send an enquiry we collect the details you provide, such as your name, email address, phone number and any personalization text.",
          "We use these to produce and deliver your order and to reply to you.",
        ],
      },
      {
        heading: "Your cart",
        body: [
          "Your cart is stored in your own browser so it is still there when you come back. It stays on your device and is cleared when you empty your cart or clear your browser data.",
        ],
      },
      {
        heading: "Checkout and payment",
        body: [
          "Payment and order management are handled by our ordering system, Check Cherry. Your payment details are entered on their platform and RK Memory Studio never sees or stores your card information.",
        ],
      },
      {
        heading: "Getting in touch",
        body: [
          "You can ask us what information we hold about you, ask us to correct it, or ask us to delete your uploaded photographs after your order is complete. Contact us and we will help.",
        ],
      },
    ],
    seo: {
      title: "Privacy Policy",
      description:
        "How RK Memory Studio handles your personal information and the photographs you upload for personalized keepsakes.",
    },
  },

  {
    slug: "terms",
    title: "Terms of Service",
    eyebrow: "Policies",
    intro: "The terms that apply when you order from RK Memory Studio.",
    status: "published",
    sections: [
      {
        heading: "What ordering means",
        body: [
          "When you place an order you are asking us to make specific items from the photographs and details you provide. We make them exactly as submitted.",
          "Because each keepsake is made for one customer, an order can only be changed or cancelled before production begins.",
        ],
      },
      {
        heading: "The photographs you send",
        body: [
          "You need to own the photographs you upload, or have permission to use them. By uploading, you confirm that you do.",
          "We use your files only to produce your order. We do not sell them, and we do not publish them anywhere, including social media, without asking you first.",
        ],
      },
      {
        heading: "Personalization is printed as you type it",
        body: [
          "Names, dates and messages are reproduced exactly as submitted, including spelling. Please read them back before you order: a typo that reaches production is not something we can refund.",
        ],
      },
      {
        heading: "Prices and payment",
        body: [
          "Prices are shown with each product. Payment and your order record are handled by our ordering system, Check Cherry, and your card details are entered there rather than on this site.",
        ],
      },
      {
        heading: "Production and delivery times",
        body: [
          "Production and delivery timeframes are honest estimates, not guarantees, and once a parcel is with the carrier its progress is outside our control. Our Shipping Policy explains both timeframes.",
          "For an event with a fixed date, ask us before you order and we will confirm in writing what is achievable.",
        ],
      },
      {
        heading: "Returns",
        body: [
          "Personalized keepsakes are final sale. Items that arrive damaged, faulty or wrong are covered: see our Refund Policy for how that works and the 7 day window.",
        ],
      },
      {
        heading: "Changes to this site",
        body: [
          "We may change products, prices and these terms. Any order already placed keeps the terms that applied when it was placed.",
        ],
      },
      {
        heading: "Where we are",
        body: [
          "RK Memory Studio operates from Atlanta, Georgia, and these terms are governed by the laws of the State of Georgia.",
        ],
      },
    ],
    seo: {
      title: "Terms of Service",
      description: "Terms of service for RK Memory Studio.",
    },
  },

  {
    slug: "shipping",
    title: "Shipping Policy",
    eyebrow: "Policies",
    intro: "How your keepsakes are made, and how they reach you.",
    status: "published",
    sections: [
      {
        heading: "Made to order",
        body: [
          "Nothing here is pre-printed or waiting on a shelf. Every keepsake is made after you order, from the photographs you upload.",
          "Production takes up to 5 business days before your order is handed to the carrier. Holidays and busy periods can add to that, and we will tell you if your order is affected.",
        ],
      },
      {
        heading: "Where we ship",
        body: [
          "We ship anywhere in the United States, using UPS and USPS. We are based in Atlanta, Georgia, but we do not offer local collection: every order is posted, including local ones.",
          "The delivery estimate you see at checkout covers transit only. It starts the day your order ships, not the day you place it, so the two timeframes add up.",
        ],
      },
      {
        heading: "What shipping costs",
        body: [
          "Standard shipping is free on orders over $49.99.",
          "Below that, the cost is calculated at checkout from your address and the service you choose.",
        ],
      },
      {
        heading: "Tracking",
        body: [
          "You receive a confirmation email with a tracking number as soon as your order is on its way. Tracking becomes active once the carrier scans the parcel, which can take a few hours.",
        ],
      },
      {
        heading: "Your delivery address",
        body: [
          "Please check your address before you order. A parcel sent to an address entered incorrectly cannot be recovered, and reshipping it has to be paid for again.",
        ],
      },
      {
        heading: "Once it is with the carrier",
        body: [
          "From collection onwards, delivery is in the carrier's hands. Weather, holidays and peak volumes can delay a parcel, and those delays are outside our control.",
        ],
      },
      {
        heading: "Event orders",
        body: [
          "If your keepsakes are for an event, tell us the date when you request your quote. We will confirm what is achievable before you commit to anything.",
        ],
      },
    ],
    seo: {
      title: "Shipping Policy",
      description:
        "Production times, delivery, tracking and shipping costs for RK Memory Studio orders.",
    },
  },

  {
    slug: "refund",
    title: "Refund Policy",
    eyebrow: "Policies",
    intro: "Returns, replacements, and what happens when something is not right.",
    status: "published",
    sections: [
      {
        heading: "Made for you, so final sale",
        body: [
          "Every keepsake is made individually from your photographs and your personalization. It cannot be restocked or sold to anyone else, so personalized orders are final sale.",
        ],
      },
      {
        heading: "What we cannot refund",
        body: [
          "A spelling or typing mistake in a name, message or date that was submitted with the order.",
          "A photograph that was too low in resolution to print well.",
          "A change of mind after the order was placed.",
          "An incorrect delivery address entered at checkout.",
        ],
      },
      {
        heading: "Damaged, faulty or wrong",
        body: [
          "This is different, and it is on us. If your order arrives damaged, has a printing fault, or is not what you ordered, contact us within 7 days of delivery.",
          "Send your order reference, a short description of the problem, and clear photographs of both the keepsake and the packaging it arrived in. We will replace it or refund it.",
        ],
      },
      {
        heading: "Changing or cancelling an order",
        body: [
          "Production starts soon after an order is placed, so changes and cancellations are only possible before it begins. Once your keepsakes are in production the order cannot be changed.",
          "If you spot a mistake, contact us immediately rather than waiting. The sooner you tell us, the more likely we can still catch it.",
        ],
      },
      {
        heading: "Colour on screen and colour in print",
        body: [
          "Screens are backlit and no two are set up the same way. Small differences between the photograph on your screen and the printed keepsake are normal, and are not treated as a fault.",
        ],
      },
      {
        heading: "The photograph you send",
        body: [
          "We print what you give us, and we cannot add detail that is not in the file. Our Photo Guidelines explain how to send the best version of a photograph.",
          "We do review every file before printing. If one will not reproduce well, we contact you before making your order rather than printing it anyway.",
        ],
      },
    ],
    seo: {
      title: "Refund Policy",
      description: "Returns and refunds for RK Memory Studio orders.",
    },
  },
];

export const getPolicy = (slug: string) =>
  policies.find((policy) => policy.slug === slug);

export const policySlugs = () => policies.map((policy) => policy.slug);

/* ---- Help pages ---------------------------------------------------------- */

export const helpPages: PolicyPage[] = [
  {
    slug: "shipping",
    title: "Shipping",
    eyebrow: "Help",
    intro: "How your order reaches you once it is made.",
    status: "published",
    sections: [
      {
        heading: "Two timeframes, not one",
        body: [
          "Production takes up to 5 business days, because your keepsakes are made after you order. Delivery time is added on top of that and starts the day the parcel ships.",
        ],
      },
      {
        heading: "What it costs",
        body: [
          "Standard shipping is free on orders over $49.99. Below that, the cost is calculated at checkout from your address and the service you choose.",
        ],
      },
      {
        heading: "Where we ship",
        body: [
          "Anywhere in the United States, by UPS or USPS. Everything is posted: we do not offer local collection, even in Atlanta.",
          "You get a tracking number by email as soon as your order is on its way.",
        ],
      },
      {
        heading: "Event orders",
        body: [
          "If your order is for an event with a fixed date, tell us the date when you request your quote so we can confirm what is achievable before you commit.",
        ],
      },
    ],
    seo: {
      title: "Shipping",
      description:
        "Production times, delivery, tracking and shipping costs for RK Memory Studio keepsake orders.",
    },
  },

  {
    slug: "returns",
    title: "Returns & Refunds",
    eyebrow: "Help",
    intro: "What to do if something is not right with your order.",
    status: "published",
    sections: [
      {
        heading: "If something arrived damaged or wrong",
        body: [
          "Contact us within 7 days of delivery with your order reference, what the problem is, and photographs of the keepsake and the packaging it came in. We will replace it or refund it.",
        ],
      },
      {
        heading: "Why personalized orders are final sale",
        body: [
          "Each keepsake is made from your photograph and your personalization, so it cannot go back on a shelf. That means we cannot refund a typo, a wrong date, a photograph that was too low in resolution, a change of mind, or an address entered incorrectly.",
          "If you spot a mistake, tell us straight away. Before production starts we can still fix it.",
        ],
      },
      {
        heading: "Before you order",
        body: [
          "Read your personalization back, and send the best version of your photograph. Our Photo Guidelines explain what prints well and what does not.",
        ],
      },
    ],
    seo: {
      title: "Returns & Refunds",
      description: "How returns and refunds work for RK Memory Studio orders.",
    },
  },

  {
    slug: "photo-guidelines",
    title: "Photo Guidelines",
    eyebrow: "Help",
    intro:
      "Your keepsake can only be as good as the file it is made from. Here is how to give us the best one.",
    status: "published",
    sections: [
      {
        heading: "Send the original file",
        body: [
          "Upload the original, highest-resolution version straight from your camera roll. Screenshots, images saved from social media and photos forwarded through messaging apps are compressed and lose detail that cannot be recovered.",
          "On an iPhone, sharing directly from the Photos app gives us the original. On Android, choose the file from your gallery rather than a chat thread.",
        ],
      },
      {
        heading: "Check the framing",
        body: [
          "Keepsakes are trimmed slightly during finishing, so keep faces and anything important away from the very edge of the frame.",
          "If a photograph is very wide or very tall, tell us in the personalization notes how you would like it cropped.",
        ],
      },
      {
        heading: "Light and focus",
        body: [
          "Well-lit, in-focus photographs reproduce best. Very dark photos, heavy filters and motion blur all become more noticeable at keepsake size.",
        ],
      },
      {
        heading: "We check before we print",
        body: [
          "We review every photo before production. If a file will not reproduce well, we will contact you before we make your order rather than printing it anyway.",
        ],
      },
      {
        heading: "File types we accept",
        body: [
          "JPG, PNG, HEIC, HEIF, WEBP and TIFF. HEIC is the default on newer iPhones and is fine to send as-is.",
        ],
      },
    ],
    seo: {
      title: "Photo Guidelines",
      description:
        "How to choose and send the best version of your photograph for a personalized keepsake - resolution, framing, file types and what we check.",
    },
  },

  {
    slug: "order-status",
    title: "Order Status",
    eyebrow: "Help",
    intro: "Checking where your order has got to.",
    status: "published",
    sections: [
      {
        heading: "Your order reference",
        body: [
          "When you check out, we give you a reference that looks like RK-XXXXXX. It links the photographs you uploaded to your order, so please keep it.",
          "If you have lost it, contact us with the email address you ordered with and we will find your order.",
        ],
      },
      {
        heading: "While it is being made",
        body: [
          "Production takes up to 5 business days. During that time there is nothing to track yet, because the parcel does not exist until your keepsakes are finished.",
        ],
      },
      {
        heading: "Once it ships",
        body: [
          "You receive an email with a tracking number the moment your order is handed to the carrier. Tracking goes live once they scan the parcel, which can take a few hours.",
          "If the tracking has not moved for several days, contact us with your reference and we will chase it.",
        ],
      },
    ],
    seo: {
      title: "Order Status",
      description:
        "How to check the status of your RK Memory Studio order using your order reference.",
    },
  },
];

export const getHelpPage = (slug: string) =>
  helpPages.find((page) => page.slug === slug);

export const helpSlugs = () => helpPages.map((page) => page.slug);
