/**
 * Reviews and Instagram content.
 *
 * BOTH ARRAYS ARE INTENTIONALLY EMPTY.
 *
 * No customer names, quotes, ratings or Instagram posts have been supplied, and
 * none may be invented. The `ReviewsSection` and `InstagramGallery` components
 * detect the empty arrays and render a designed empty state instead.
 *
 * To go live: push real, verified entries into these arrays (or swap the
 * loaders for a reviews platform / the Instagram Basic Display API - the
 * component contracts stay the same).
 */

export type Review = {
  id: string;
  /** Customer's display name, exactly as they gave permission to publish. */
  author: string;
  /** 1-5. Only from a verified purchase. */
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  body: string;
  /** ISO date string. */
  date: string;
  /** Product slug the review refers to. */
  productSlug?: string;
  /** Only true where the order can actually be verified. */
  verifiedPurchase: boolean;
  /** Optional customer photo of their keepsake, with permission. */
  photo?: { src: string; alt: string };
};

export type InstagramPost = {
  id: string;
  permalink: string;
  /** Local or CDN image path. */
  src: string;
  /** Must describe the actual image. */
  alt: string;
  caption?: string;
};

/** Real, verified reviews only. Empty until the business supplies them. */
export const reviews: Review[] = [];

/** Real Instagram posts only. Empty until connected or supplied. */
export const instagramPosts: InstagramPost[] = [];

/* ---- Derived helpers ----------------------------------------------------- */

export const hasReviews = (): boolean => reviews.length > 0;
export const hasInstagram = (): boolean => instagramPosts.length > 0;

export const reviewsFor = (productSlug: string): Review[] =>
  reviews.filter((r) => r.productSlug === productSlug);

/**
 * Aggregate rating for structured data. Returns null when there is nothing to
 * aggregate - never emit an AggregateRating with zero reviews.
 */
export function aggregateRating(
  productSlug?: string
): { ratingValue: number; reviewCount: number } | null {
  const pool = productSlug ? reviewsFor(productSlug) : reviews;
  if (pool.length === 0) return null;
  const total = pool.reduce((sum, r) => sum + r.rating, 0);
  return {
    ratingValue: Math.round((total / pool.length) * 10) / 10,
    reviewCount: pool.length,
  };
}
