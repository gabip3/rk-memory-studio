import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { brandPrinciples } from "@/lib/data/content";

/**
 * Home hero.
 *
 * Desktop: an asymmetric split - editorial copy on a cream panel, photography
 * running full-bleed to the right edge.
 * Mobile: copy first (so the LCP element is text, which paints immediately),
 * then the photograph, then the principles rail.
 *
 * The headline is the only h1 on the page.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative bg-cream">
      <div className="lg:grid lg:min-h-[38rem] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:min-h-[42rem]">
        {/* ---- Copy panel ------------------------------------------------ */}
        <div className="flex flex-col justify-center px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20 lg:py-20 lg:pl-12 lg:pr-14 xl:pl-16 xl:pr-20">
          <div className="mx-auto w-full max-w-[34rem] lg:mx-0 lg:ml-auto">
            <Reveal>
              <h1
                id="hero-heading"
                className="text-display-xl leading-[0.92] tracking-[0.012em]"
              >
                <span className="block text-ink">Your Memories.</span>
                <span className="mt-1 block text-gold-display">
                  Made to Keep.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={90}>
              <p className="u-measure-tight mt-7 text-[1.0625rem] leading-[1.75] text-ink-muted sm:text-[1.125rem]">
                Turn your favorite photos into beautiful personalized keepsakes
                made especially for you.
              </p>
            </Reveal>

            <Reveal delay={170}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button href="/shop/custom-photo-magnets" variant="solid" size="lg">
                  Shop Photo Magnets
                </Button>
                <Button href="/shop" variant="outline" size="lg">
                  Shop All Keepsakes
                </Button>
              </div>
            </Reveal>

            {/* ---- Brand principles rail --------------------------------- */}
            <Reveal delay={250}>
              <ul className="mt-11 grid grid-cols-2 gap-y-7 border-t border-taupe/50 pt-8 sm:grid-cols-4 sm:gap-y-0">
                {brandPrinciples.map((principle, index) => (
                  <li
                    key={principle.label}
                    className={
                      // Hairline separators between items, never a trailing one
                      "flex flex-col items-center gap-2.5 px-2 text-center sm:items-start sm:text-left " +
                      (index > 0
                        ? "sm:border-l sm:border-taupe/50 sm:pl-4"
                        : "sm:pr-4")
                    }
                  >
                    <Icon
                      name={principle.icon}
                      size={26}
                      strokeWidth={1.2}
                      className="text-gold"
                    />
                    <span className="u-caps text-[0.5625rem] leading-[1.5] tracking-[0.2em] text-ink">
                      {principle.label}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* ---- Photography ------------------------------------------------ */}
        <div className="relative lg:h-full">
          <Photo
            src="/images/hero.webp"
            alt="Six personalized photo magnets, squares and rounds, on a stainless steel refrigerator door: a golden retriever, a palm tree sunset, a laughing couple, a sleeping newborn, a wedding portrait and a family walking on the beach."
            placeholderLabel="Hero photography"
            ratio="4 / 3"
            className="h-full lg:absolute lg:inset-0 lg:aspect-auto"
            sizes="(max-width: 1024px) 100vw, 55vw"
            // The only image on the page allowed to preload - it is the LCP
            // candidate on desktop. Everything else stays lazy.
            priority
          />
        </div>
      </div>
    </section>
  );
}
