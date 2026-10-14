/**
 * FAQ content.
 *
 * IMPORTANT: entries flagged `pending: true` are awaiting confirmed business
 * information (production times, shipping costs). Their answers deliberately do
 * NOT state a timeframe or a price. The accordion renders them with a visible
 * "confirmed before launch" note so nothing invented reaches customers.
 * Remove the flag and write the real answer once the business supplies it.
 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  /** True while the real answer is still outstanding. */
  pending?: boolean;
  /** Groups questions on the FAQ page. */
  group: "Photos" | "Personalization" | "Events" | "Orders & Delivery";
};

export const faqs: FaqItem[] = [
  {
    id: "how-to-send-photos",
    question: "How do I send my photos?",
    answer:
      "You upload them directly on the product page while you are placing your order - from your phone's camera roll or from your computer. Drag and drop, or tap to browse. You will see a preview of every photo before you add the order to your cart.",
    group: "Photos",
  },
  {
    id: "different-photos",
    question: "Can I use different photos?",
    answer:
      "Yes. You can upload a different photograph for each piece in your order, use one photo across the whole set, or mix the two. The uploader shows how many photos you have added against the quantity you selected.",
    group: "Photos",
  },
  {
    id: "photo-quality",
    question: "What photo quality should I use?",
    answer:
      "Please upload the original, highest-resolution version of your photograph. Avoid screenshots, images saved from social media, and photos forwarded through messaging apps, as these are compressed and lose detail. If a file will not reproduce well, we will contact you before we produce your order.",
    group: "Photos",
  },
  {
    id: "event-keepsakes",
    question: "Can you make keepsakes for events?",
    answer:
      "Yes. We create keepsakes for weddings, birthdays, baby showers, graduations, corporate events and memorials. For larger celebrations, use our bulk order form to tell us about your event and we will put a quote together for you.",
    group: "Events",
  },
  {
    id: "names-and-dates",
    question: "Can I add names or dates?",
    answer:
      "Yes - personalization is optional on every product. When you order you can add a name, a date and a short message, and we will lay them out to suit the design and the photograph you have chosen.",
    group: "Personalization",
  },
  {
    id: "production-time",
    question: "How long does production take?",
    answer:
      "Every order is made after you place it. Production takes up to 5 business days before your keepsakes are handed to the carrier, and delivery time is added on top of that. Holidays and busy periods can add a little, and we will tell you if your order is affected.",
    group: "Orders & Delivery",
  },
  {
    id: "shipping-cost",
    question: "How much is shipping?",
    answer:
      "Standard shipping is free on orders over $49.99. Below that it is calculated at checkout from your delivery address and the service you choose. We ship anywhere in the United States, and everything is posted - we do not offer local collection.",
    group: "Orders & Delivery",
  },
];

export const faqGroups = [
  "Photos",
  "Personalization",
  "Events",
  "Orders & Delivery",
] as const;

export const faqsByGroup = () =>
  faqGroups
    .map((group) => ({
      group,
      items: faqs.filter((f) => f.group === group),
    }))
    .filter((g) => g.items.length > 0);

/**
 * Only fully-answered questions are eligible for FAQPage structured data.
 * Publishing a "we will confirm this later" answer to Google would be worse
 * than publishing nothing.
 */
export const faqsForStructuredData = () => faqs.filter((f) => !f.pending);
