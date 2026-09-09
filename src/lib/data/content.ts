/**
 * Editorial content blocks: brand principles, process steps, occasions and
 * values. Kept out of components so copy can be edited without touching JSX.
 */

import type { IconName } from "@/components/ui/Icon";

/* ---- Hero: four brand principles ---------------------------------------- */

export const brandPrinciples: { label: string; icon: IconName }[] = [
  { label: "Your Photos", icon: "camera" },
  { label: "Made With Care", icon: "heart" },
  { label: "Perfect For Gifting", icon: "gift" },
  { label: "Memories To Keep", icon: "sparkle" },
];

/* ---- How it works: four steps ------------------------------------------- */

export const processSteps: {
  step: string;
  title: string;
  description: string;
  icon: IconName;
}[] = [
  {
    step: "01",
    title: "Choose It",
    description: "Select your favorite keepsake and quantity.",
    icon: "cart",
  },
  {
    step: "02",
    title: "Upload It",
    description: "Upload the photos you'd like us to use.",
    icon: "upload",
  },
  {
    step: "03",
    title: "We Create It",
    description:
      "We carefully prepare and produce your personalized keepsakes.",
    icon: "hands",
  },
  {
    step: "04",
    title: "Love It",
    description:
      "Receive your memories transformed into something you can hold, display and enjoy.",
    icon: "heart",
  },
];

/* ---- "Made Just for You": occasions -------------------------------------- */

export const occasions: string[] = [
  "Family Memories",
  "Weddings",
  "Birthdays",
  "Graduations",
  "Baby Showers",
  "Anniversaries",
  "Pets",
  "Vacations",
  "Corporate Events",
  "Gifts",
];

/* ---- Keychain section: who it is for ------------------------------------- */

export const keychainAudiences: string[] = [
  "Family",
  "Couples",
  "Pets",
  "Weddings",
  "Graduations",
  "Gifts",
];

/* ---- Brand story: four values -------------------------------------------- */

export const brandValues: {
  title: string;
  description: string;
  icon: IconName;
}[] = [
  {
    title: "Made With Your Photos",
    description: "Every product is personalized using your memories.",
    icon: "camera",
  },
  {
    title: "Created With Care",
    description: "Each order receives individual attention during production.",
    icon: "hands",
  },
  {
    title: "Perfect For Gifting",
    description: "Create something personal instead of another ordinary gift.",
    icon: "gift",
  },
  {
    title: "Made For Celebrations",
    description: "From one special memory to hundreds of event favors.",
    icon: "sparkle",
  },
];

/* ---- Photo guidance (shown in the uploader and on the guidelines page) ---- */

export const photoGuidelines: { title: string; description: string }[] = [
  {
    title: "Use the original file",
    description:
      "Send the original, highest-resolution version straight from your camera roll rather than a screenshot or a re-saved copy.",
  },
  {
    title: "Avoid screenshots and downloads",
    description:
      "Screenshots, images saved from social media and photos sent through messaging apps are compressed and lose detail.",
  },
  {
    title: "Check the framing",
    description:
      "Keep faces away from the very edge of the frame - keepsakes are trimmed slightly during finishing.",
  },
  {
    title: "Good light helps",
    description:
      "Well-lit, in-focus photographs reproduce best. We will always let you know if a file will not work well.",
  },
];
