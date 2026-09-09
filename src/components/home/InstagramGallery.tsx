import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { site } from "@/lib/site";
import { instagramPosts, hasInstagram } from "@/lib/data/social-proof";

/**
 * Instagram / social proof gallery.
 *
 * No posts are fabricated. Until real posts are supplied (or the Instagram
 * Basic Display API is connected), the grid shows on-brand reserved frames that
 * clearly read as "gallery in progress", with a live link to the real account.
 *
 * The frames keep the exact 1:1 footprint the real posts will occupy, so
 * connecting the feed causes no layout shift.
 */
export function InstagramGallery() {
  return (
    <Section tone="cream" spacing="lg" aria-labelledby="instagram-heading">
      <SectionHeading
        id="instagram-heading"
        eyebrow="Made With Memories"
        title={
          <>
            Follow Along{" "}
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-display underline-offset-[6px] transition-colors duration-[var(--dur-base)] hover:text-gold-ink hover:underline"
            >
              {site.social.instagramHandle}
            </a>
          </>
        }
        lede="Real keepsakes, made from real customers' photographs."
      />

      {hasInstagram() ? (
        <ul className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {instagramPosts.slice(0, 6).map((post, index) => (
            <Reveal as="li" key={post.id} delay={index * 45}>
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden u-zoom-frame"
              >
                <Image
                  src={post.src}
                  alt={post.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover"
                />
                <span className="absolute inset-0 grid place-items-center bg-charcoal/0 text-ivory opacity-0 transition-all duration-[var(--dur-base)] group-hover:bg-charcoal/45 group-hover:opacity-100">
                  <Icon name="instagram" size={24} />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      ) : (
        <>
          <ul className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
            {Array.from({ length: 6 }, (_, index) => (
              <Reveal as="li" key={index} delay={index * 45}>
                <div
                  className="relative grid aspect-square place-items-center border border-dashed border-gold/40 bg-[linear-gradient(145deg,#f7f2e9_0%,#efe6d7_50%,#e6dbc9_100%)]"
                  aria-hidden="true"
                >
                  <LogoMark height={34} className="opacity-30" />
                </div>
              </Reveal>
            ))}
          </ul>

          <p className="mt-6 text-center text-[0.875rem] text-ink-muted">
            Our gallery is filling up. Follow along to see new keepsakes
            as they are made.
          </p>
        </>
      )}

      <Reveal delay={120} className="mt-10 flex justify-center">
        <Button href={site.social.instagram} variant="outline" size="lg">
          <Icon name="instagram" size={17} />
          Follow {site.social.instagramHandle}
        </Button>
      </Reveal>
    </Section>
  );
}
