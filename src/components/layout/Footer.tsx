import Link from "next/link";
import { footerNav, site, isPlaceholder } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";

const year = new Date().getFullYear();

export function Footer() {
  const hasEmail = !isPlaceholder(site.contact.email);
  const hasInstagram = !isPlaceholder(site.social.instagram);
  const hasFacebook = !isPlaceholder(site.social.facebook);

  return (
    <footer className="bg-charcoal text-ivory">
      <Container width="wide" className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)] lg:gap-16">
          {/* Brand block */}
          <div>
            <Logo tone="dark" />

            <p className="u-measure-tight mt-6 text-[0.9375rem] leading-[1.8] text-ivory/70">
              Turning your favourite photographs into personalized keepsakes you
              can hold, display and give.
            </p>

            <div className="mt-7 flex flex-col gap-2.5 text-[0.9375rem] text-ivory/70">
              <span className="flex items-center gap-2.5">
                <Icon name="pin" size={16} className="shrink-0 text-gold-on-dark" />
                {site.contact.location}
              </span>

              {hasEmail ? (
                <a
                  href={`mailto:${site.contact.email}`}
                  className="flex w-fit items-center gap-2.5 transition-colors duration-[var(--dur-base)] hover:text-gold-on-dark"
                >
                  <Icon name="mail" size={16} className="shrink-0 text-gold-on-dark" />
                  {site.contact.email}
                </a>
              ) : (
                <span className="flex items-center gap-2.5 text-ivory/45">
                  <Icon name="mail" size={16} className="shrink-0 text-gold-on-dark/60" />
                  Email address coming soon
                </span>
              )}
            </div>

            {hasInstagram || hasFacebook ? (
              <div className="mt-7 flex items-center gap-3">
                {hasInstagram ? (
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`RK Memory Studio on Instagram, ${site.social.instagramHandle} (opens in a new tab)`}
                    className="grid h-11 w-11 place-items-center border border-ivory/20 text-ivory/80 transition-colors duration-[var(--dur-base)] hover:border-gold-on-dark hover:text-gold-on-dark"
                  >
                    <Icon name="instagram" size={18} />
                  </a>
                ) : null}

                {hasFacebook ? (
                  <a
                    href={site.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="RK Memory Studio on Facebook (opens in a new tab)"
                    className="grid h-11 w-11 place-items-center border border-ivory/20 text-ivory/80 transition-colors duration-[var(--dur-base)] hover:border-gold-on-dark hover:text-gold-on-dark"
                  >
                    <Icon name="facebook" size={18} />
                  </a>
                ) : null}

                {hasInstagram ? (
                  <span className="ml-1 text-[0.875rem] text-ivory/50">
                    {site.social.instagramHandle}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {footerNav.map((column) => (
              <div key={column.title}>
                <h2 className="u-caps mb-5 font-sans text-[0.625rem] tracking-[0.26em] text-gold-on-dark">
                  {column.title}
                </h2>

                <ul className="space-y-1">
                  {column.links.map((link) => {
                    const external = /^https?:\/\//i.test(link.href);

                    return (
                      <li key={link.label}>
                        {external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center text-[0.9375rem] text-ivory/70 transition-colors duration-[var(--dur-base)] hover:text-ivory"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="inline-flex min-h-11 items-center text-[0.9375rem] text-ivory/70 transition-colors duration-[var(--dur-base)] hover:text-ivory"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Sister brand */}
        <div className="mt-14 border-t border-ivory/12 pt-8">
          <p className="text-[0.875rem] leading-relaxed text-ivory/55">
            Sister company to{" "}
            <a
              href={site.sisterBrand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-on-dark underline-offset-4 transition-colors duration-[var(--dur-base)] hover:text-ivory hover:underline"
            >
              {site.sisterBrand.name}
            </a>
            .
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-ivory/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-ivory/50">
            &copy; {year} {site.name}. All Rights Reserved.
          </p>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerNav[3].links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.8125rem] text-ivory/50 transition-colors duration-[var(--dur-base)] hover:text-ivory/85"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
