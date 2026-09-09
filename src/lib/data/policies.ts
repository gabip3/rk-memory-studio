/**
 * Policy and help page content.
 *
 * Anything the business has not decided yet is marked `status: "pending"` and
 * renders a clearly-labelled placeholder. Nothing here invents a shipping cost,
 * a production time, a refund window or a legal commitment.
 *
 * The Privacy page is the one exception: it describes what this website
 * actually does technically (which is verifiable from the code), and is marked
 * as a draft requiring legal review before launch.
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

const CONTACT_NOTE =
  "If you need this information before it is published here, please contact us and we will confirm it for your specific order.";

export const policies: PolicyPage[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    eyebrow: "Policies",
    intro:
      "How RK Memory Studio handles your information and the photographs you upload.",
    status: "draft",
    notice:
      "This is a working draft describing how the website currently handles data. It is pending legal review before launch.",
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
    status: "pending",
    notice:
      "Our full terms of service are being finalised and will be published here before launch.",
    sections: [
      {
        heading: "In the meantime",
        body: [
          "If you have a question about how ordering works, what happens to your photographs, or anything else you would like confirmed in writing before you order, please contact us.",
          CONTACT_NOTE,
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
    intro: "How your keepsakes reach you.",
    status: "pending",
    notice:
      "Shipping options, costs and delivery timeframes are being confirmed and will be published here before launch. We have not published estimates we cannot yet guarantee.",
    sections: [
      {
        heading: "What we can confirm now",
        body: [
          "We are based in Atlanta, Georgia. Local pickup is available, and we ship orders to customers elsewhere.",
          "For event orders with a fixed date, tell us the date when you request your quote and we will confirm what is achievable for your order before you commit.",
          CONTACT_NOTE,
        ],
      },
    ],
    seo: {
      title: "Shipping Policy",
      description:
        "Shipping and local pickup information for RK Memory Studio orders.",
    },
  },

  {
    slug: "refund",
    title: "Refund Policy",
    eyebrow: "Policies",
    intro: "Returns, refunds and what happens if something is not right.",
    status: "pending",
    notice:
      "Our full refund policy is being finalised and will be published here before launch.",
    sections: [
      {
        heading: "What we can confirm now",
        body: [
          "Our products are made individually from the photographs you upload, which affects how returns work compared with off-the-shelf goods.",
          "If something arrives damaged or is not what you ordered, contact us and we will put it right.",
          CONTACT_NOTE,
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
    title: "Shipping & Pickup",
    eyebrow: "Help",
    intro: "How your order reaches you once it is made.",
    status: "pending",
    notice:
      "Shipping options and costs are being confirmed and will appear here before launch.",
    sections: [
      {
        heading: "Local pickup",
        body: [
          "We are based in Atlanta, Georgia, and local pickup is available. Contact us and we will arrange it around your order.",
        ],
      },
      {
        heading: "Event orders",
        body: [
          "If your order is for an event with a fixed date, tell us the date when you request your quote so we can confirm what is achievable before you commit.",
          CONTACT_NOTE,
        ],
      },
    ],
    seo: {
      title: "Shipping & Pickup",
      description:
        "Shipping and local pickup information for RK Memory Studio keepsake orders in Atlanta and nationwide.",
    },
  },

  {
    slug: "returns",
    title: "Returns & Refunds",
    eyebrow: "Help",
    intro: "What to do if something is not right with your order.",
    status: "pending",
    notice:
      "Our full returns policy is being finalised and will be published here before launch.",
    sections: [
      {
        heading: "If something is wrong",
        body: [
          "If your order arrives damaged, or it is not what you ordered, contact us with your order reference and a photo of the problem and we will put it right.",
          CONTACT_NOTE,
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
    status: "pending",
    notice:
      "Online order tracking is being set up. In the meantime, contact us with your order reference and we will update you directly.",
    sections: [
      {
        heading: "Your order reference",
        body: [
          "When you check out, we give you a reference that looks like RK-XXXXXX. It links the photographs you uploaded to your order, so please keep it.",
          "If you have lost it, contact us with the email address you ordered with and we will find your order.",
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
