import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { reviews, hasReviews, aggregateRating } from "@/lib/data/social-proof";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          key={i}
          name="sparkle"
          size={14}
          strokeWidth={1.2}
          className={i < rating ? "text-gold" : "text-taupe/60"}
        />
      ))}
    </span>
  );
}

/**
 * Customer reviews.
 *
 * There are no reviews yet and none may be invented, so this renders a designed
 * empty state rather than placeholder quotes attributed to imaginary people.
 * The moment a real, verified review is pushed into `reviews`, the grid below
 * takes over automatically - no template change needed.
 */
export function Reviews() {
  const summary = aggregateRating();

  return (
    <Section tone="ivory" spacing="lg" aria-labelledby="reviews-heading">
      <SectionHeading
        id="reviews-heading"
        eyebrow="Reviews"
        title="Memories Our Customers Love"
        lede={
          summary
            ? undefined
            : "We are just getting started. As customers receive their keepsakes, their verified reviews will appear here."
        }
      />

      {summary ? (
        <Reveal className="mt-8 flex items-center justify-center gap-3">
          <Stars rating={Math.round(summary.ratingValue)} />
          <span className="tabular text-[0.9375rem] text-ink-muted">
            {summary.ratingValue} out of 5 &middot; {summary.reviewCount}{" "}
            {summary.reviewCount === 1 ? "review" : "reviews"}
          </span>
        </Reveal>
      ) : null}

      {hasReviews() ? (
        <ul className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal
              as="li"
              key={review.id}
              delay={index * 60}
              className="flex h-full flex-col border border-taupe/45 bg-cream p-7"
            >
              <Stars rating={review.rating} />
              <span className="sr-only">{review.rating} out of 5 stars</span>

              {review.title ? (
                <h3 className="mt-4 font-display text-[1.25rem] leading-snug">
                  {review.title}
                </h3>
              ) : null}

              <blockquote className="mt-3 flex-1 text-[0.9375rem] leading-[1.8] text-ink-muted">
                {review.body}
              </blockquote>

              <footer className="mt-6 flex items-center gap-2 border-t border-taupe/45 pt-4">
                <cite className="not-italic text-[0.875rem] font-medium text-ink">
                  {review.author}
                </cite>
                {review.verifiedPurchase ? (
                  <span className="inline-flex items-center gap-1 text-[0.75rem] text-gold-ink">
                    <Icon name="check-circle" size={13} />
                    Verified
                  </span>
                ) : null}
              </footer>
            </Reveal>
          ))}
        </ul>
      ) : (
        <Reveal
          delay={80}
          className="mx-auto mt-12 flex max-w-[38rem] flex-col items-center border border-dashed border-gold/45 bg-cream/60 px-8 py-14 text-center"
        >
          <span
            aria-hidden="true"
            className="grid h-16 w-16 place-items-center rounded-full border border-gold/40 text-gold"
          >
            <Icon name="heart" size={26} strokeWidth={1.15} />
          </span>

          <p className="mt-6 font-display text-[1.5rem] leading-snug">
            No reviews yet
          </p>

          <p className="mt-3 text-[0.9375rem] leading-[1.8] text-ink-muted">
            Every review published here will come from a real customer with a
            verified order. Be one of the first, and tell us how your
            keepsake turned out.
          </p>

          <Button href="/shop" variant="outline" className="mt-8">
            Create Your First Keepsake
          </Button>
        </Reveal>
      )}
    </Section>
  );
}
