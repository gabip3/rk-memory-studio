import { site, isPlaceholder } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

/**
 * The slim black bar above the header.
 *
 * The tagline is centred on every viewport; the social links sit on the right
 * from `sm` up and are hidden on the narrowest screens, where the row would
 * otherwise crowd the tagline. They remain reachable in the footer and the
 * mobile menu, so nothing is lost.
 */
export function AnnouncementBar() {
  const showInstagram = !isPlaceholder(site.social.instagram);
  const showFacebook = !isPlaceholder(site.social.facebook);

  return (
    <div className="relative z-[var(--z-header)] bg-black text-ivory">
      <div className="mx-auto flex h-9 max-w-[90rem] items-center justify-center px-5 sm:h-10 sm:px-8 lg:px-12">
        <p className="u-caps text-center text-[0.5625rem] tracking-[0.3em] text-ivory/90 sm:text-[0.625rem] sm:tracking-[0.34em]">
          {site.tagline}
        </p>

        {/* "Follow Us" with nothing to follow would be a dead end: no accounts, no group. */}
        {showInstagram || showFacebook ? (
          <div className="absolute right-5 hidden items-center gap-3 sm:flex sm:right-8 lg:right-12">
            <span className="u-caps text-[0.5625rem] tracking-[0.24em] text-ivory/55">
              Follow Us
            </span>

            {showInstagram ? (
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RK Memory Studio on Instagram (opens in a new tab)"
                className="grid h-11 w-11 -my-1.5 place-items-center rounded-full text-ivory/75 transition-colors duration-[var(--dur-base)] hover:text-gold-on-dark"
              >
                <Icon name="instagram" size={15} />
              </a>
            ) : null}

            {showFacebook ? (
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RK Memory Studio on Facebook (opens in a new tab)"
                className="grid h-11 w-11 -my-1.5 place-items-center rounded-full text-ivory/75 transition-colors duration-[var(--dur-base)] hover:text-gold-on-dark"
              >
                <Icon name="facebook" size={15} />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
