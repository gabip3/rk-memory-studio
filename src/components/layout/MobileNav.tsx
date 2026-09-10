"use client";

import Link from "next/link";
import { mainNav, site, isPlaceholder } from "@/lib/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useDialog } from "@/lib/hooks/useDialog";

/**
 * Mobile navigation.
 *
 * Designed for the phone, not scaled down from the desktop bar: full-height
 * sheet, large tap rows, sections that expand in place rather than pushing the
 * customer through a second screen, and the primary shopping action pinned
 * where a thumb can reach it.
 */
export function MobileNav({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const panelRef = useDialog<HTMLDivElement>(open, onClose);

  if (!open) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const hasEmail = !isPlaceholder(site.contact.email);
  const hasInstagram = !isPlaceholder(site.social.instagram);

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="u-anim-fade absolute inset-0 bg-charcoal/55 backdrop-blur-[2px]"
      />

      <div
        id="mobile-nav"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        tabIndex={-1}
        className="u-anim-drawer absolute inset-y-0 left-0 flex w-[min(23rem,90vw)] flex-col bg-ivory shadow-lift outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-taupe/45 px-5 py-4">
          <Logo size="sm" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-2 grid h-11 w-11 place-items-center text-ink transition-colors duration-[var(--dur-base)] hover:text-gold-display"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Scrollable link list */}
        <nav
          aria-label="Mobile"
          className="flex-1 overflow-y-auto overscroll-contain px-5 py-3"
        >
          <ul>
            {mainNav.map((item) =>
              item.children ? (
                <li key={item.label} className="border-b border-taupe/35">
                  <details
                    className="group/m"
                    open={isActive(item.href)}
                  >
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
                      <span
                        className={cn(
                          "font-display text-[1.375rem]",
                          isActive(item.href) ? "text-gold-display" : "text-ink"
                        )}
                      >
                        {item.label}
                      </span>
                      <Icon
                        name="chevron-down"
                        size={18}
                        className="shrink-0 text-gold transition-transform duration-[var(--dur-base)] group-open/m:rotate-180"
                      />
                    </summary>

                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[var(--dur-base)] ease-out-soft group-open/m:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <ul className="border-l border-gold/35 pb-4 pl-4">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={onClose}
                                aria-current={
                                  pathname === child.href ? "page" : undefined
                                }
                                className={cn(
                                  "flex min-h-12 items-center text-[0.9375rem] transition-colors duration-[var(--dur-base)]",
                                  pathname === child.href
                                    ? "text-gold-ink"
                                    : "text-ink-muted hover:text-ink"
                                )}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </details>
                </li>
              ) : (
                <li key={item.label} className="border-b border-taupe/35">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "flex min-h-14 items-center py-3 font-display text-[1.375rem] transition-colors duration-[var(--dur-base)]",
                      isActive(item.href)
                        ? "text-gold-display"
                        : "text-ink hover:text-gold-display"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Secondary */}
          <ul className="mt-6 space-y-1">
            <li>
              <Link
                href="/account"
                onClick={onClose}
                className="flex min-h-12 items-center gap-3 text-[0.9375rem] text-ink-muted transition-colors duration-[var(--dur-base)] hover:text-ink"
              >
                <Icon name="user" size={18} className="text-gold" />
                Account
              </Link>
            </li>
            <li>
              <Link
                href="/help/order-status"
                onClick={onClose}
                className="flex min-h-12 items-center gap-3 text-[0.9375rem] text-ink-muted transition-colors duration-[var(--dur-base)] hover:text-ink"
              >
                <Icon name="truck" size={18} className="text-gold" />
                Order Status
              </Link>
            </li>
            {hasEmail ? (
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="flex min-h-12 items-center gap-3 text-[0.9375rem] text-ink-muted transition-colors duration-[var(--dur-base)] hover:text-ink"
                >
                  <Icon name="mail" size={18} className="text-gold" />
                  {site.contact.email}
                </a>
              </li>
            ) : null}
            {hasInstagram ? (
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center gap-3 text-[0.9375rem] text-ink-muted transition-colors duration-[var(--dur-base)] hover:text-ink"
                >
                  <Icon name="instagram" size={18} className="text-gold" />
                  {site.social.instagramHandle}
                </a>
              </li>
            ) : null}
          </ul>
        </nav>

        {/* Thumb-reachable primary action, clear of the gesture bar */}
        <div className="border-t border-taupe/45 bg-cream px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          <Button
            href="/shop/custom-photo-magnets"
            variant="solid"
            fullWidth
            onClick={onClose}
          >
            Shop Photo Magnets
          </Button>
        </div>
      </div>
    </div>
  );
}
