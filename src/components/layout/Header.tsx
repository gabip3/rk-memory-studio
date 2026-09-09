"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav, type NavItem } from "@/lib/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { useCart } from "@/lib/cart/CartProvider";
import { MobileNav } from "./MobileNav";
import { SearchOverlay } from "./SearchOverlay";

/* ------------------------------------------------------------------------ */
/* Desktop dropdown                                                         */
/* ------------------------------------------------------------------------ */

function NavDropdown({
  item,
  isActive,
  openId,
  setOpenId,
}: {
  item: NavItem;
  isActive: boolean;
  openId: string | null;
  setOpenId: (id: string | null) => void;
}) {
  const isOpen = openId === item.label;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = `nav-panel-${item.label.toLowerCase().replace(/\s+/g, "-")}`;

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  // A short grace period stops the panel snapping shut while the pointer
  // travels diagonally from the trigger to the first link.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenId(null), 140);
  };

  useEffect(() => () => cancelClose(), []);

  return (
    <li
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpenId(item.label);
      }}
      onMouseLeave={scheduleClose}
    >
      <div className="flex items-center">
        <Link
          href={item.href}
          className={cn(
            "u-caps relative inline-flex min-h-11 items-center text-[0.6875rem] tracking-[0.16em] transition-colors duration-[var(--dur-base)]",
            isActive ? "text-ink" : "text-ink-muted hover:text-ink"
          )}
        >
          {item.label}
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-[var(--dur-base)] ease-out-soft",
              isActive ? "scale-x-100" : "scale-x-0"
            )}
          />
        </Link>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={`${item.label} menu`}
          onClick={() => setOpenId(isOpen ? null : item.label)}
          className="ml-1 grid h-11 w-6 place-items-center text-ink-muted transition-colors duration-[var(--dur-base)] hover:text-ink"
        >
          <Icon
            name="chevron-down"
            size={13}
            className={cn(
              "transition-transform duration-[var(--dur-base)] ease-out-soft",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      {isOpen && item.children ? (
        <div
          id={panelId}
          className="u-anim-drop absolute left-1/2 top-full z-[var(--z-dropdown)] w-[19rem] -translate-x-1/2 pt-4"
        >
          <div className="border border-taupe/50 bg-ivory p-2 shadow-lift">
            <ul>
              {item.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    onClick={() => setOpenId(null)}
                    className="group/link block px-4 py-3 transition-colors duration-[var(--dur-fast)] hover:bg-gold-wash focus-visible:bg-gold-wash"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-[1.0625rem] leading-snug text-ink">
                        {child.label}
                      </span>
                      <Icon
                        name="arrow-right"
                        size={14}
                        className="shrink-0 text-gold opacity-0 transition-all duration-[var(--dur-base)] group-hover/link:translate-x-0.5 group-hover/link:opacity-100"
                      />
                    </span>
                    {child.hint ? (
                      <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-muted">
                        {child.hint}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </li>
  );
}

/* ------------------------------------------------------------------------ */
/* Header                                                                   */
/* ------------------------------------------------------------------------ */

export function Header() {
  const pathname = usePathname();
  const { itemCount, hydrated, openCart } = useCart();

  const [condensed, setCondensed] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Condense the header once the announcement bar has scrolled away.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      // rAF-throttled so scrolling never does layout work per event.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setCondensed(window.scrollY > 40);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Any navigation closes every transient surface.
  //
  // Adjusted during render rather than in an effect: React's documented pattern
  // for "reset state when a prop changes". Doing it in an effect would render
  // the new page with the old menu still open, then immediately re-render.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenId(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }

  // Escape closes the open dropdown and returns focus to the page.
  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openId]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-[var(--z-header)] border-b bg-ivory/95 backdrop-blur-md",
          "transition-[border-color,box-shadow] duration-[var(--dur-base)]",
          condensed
            ? "border-taupe/50 shadow-[0_1px_18px_-8px_rgba(28,26,23,0.28)]"
            : "border-transparent"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[90rem] items-center gap-4 px-5 transition-[height] duration-[var(--dur-base)] ease-out-soft sm:px-8 lg:px-12",
            condensed ? "h-[4.25rem] lg:h-20" : "h-[4.75rem] lg:h-[6.25rem]"
          )}
        >
          {/* Mobile: menu trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label="Open menu"
            className="-ml-2.5 grid h-11 w-11 place-items-center text-ink transition-colors duration-[var(--dur-base)] hover:text-gold-display lg:hidden"
          >
            <Icon name="menu" size={22} />
          </button>

          {/* Logo - centred on mobile, leading on desktop */}
          <div className="flex flex-1 justify-center lg:flex-none lg:justify-start">
            <Logo size={condensed ? "sm" : "md"} />
          </div>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden flex-1 lg:block">
            {/* Poppins' uppercase is wider than a condensed grotesque, so the
                seven items only just fit at the 1024px breakpoint. Tighter
                gaps there, restored once there is room. */}
            <ul className="flex items-center justify-center gap-5 xl:gap-8">
              {mainNav.map((item) =>
                item.children ? (
                  <NavDropdown
                    key={item.label}
                    item={item}
                    isActive={isActive(item.href)}
                    openId={openId}
                    setOpenId={setOpenId}
                  />
                ) : (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "u-caps relative inline-flex min-h-11 items-center text-[0.6875rem] tracking-[0.16em] transition-colors duration-[var(--dur-base)]",
                        isActive(item.href)
                          ? "text-ink"
                          : "text-ink-muted hover:text-ink"
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-[var(--dur-base)] ease-out-soft",
                          isActive(item.href) ? "scale-x-100" : "scale-x-0"
                        )}
                      />
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid h-11 w-11 place-items-center text-ink transition-colors duration-[var(--dur-base)] hover:text-gold-display"
            >
              <Icon name="search" size={19} />
            </button>

            <Link
              href="/account"
              aria-label="Account"
              className="hidden h-11 w-11 place-items-center text-ink transition-colors duration-[var(--dur-base)] hover:text-gold-display sm:grid"
            >
              <Icon name="user" size={19} />
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={
                hydrated && itemCount > 0
                  ? `Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`
                  : "Cart, empty"
              }
              className="relative -mr-2.5 grid h-11 w-11 place-items-center text-ink transition-colors duration-[var(--dur-base)] hover:text-gold-display"
            >
              <Icon name="cart" size={20} />
              <span
                className={cn(
                  "tabular absolute right-1 top-1 grid h-[19px] min-w-[19px] place-items-center rounded-full px-1 text-[0.625rem] font-medium leading-none transition-opacity duration-[var(--dur-base)]",
                  hydrated && itemCount > 0
                    ? "bg-black text-ivory opacity-100"
                    : "bg-taupe/40 text-ink opacity-100"
                )}
                aria-hidden="true"
              >
                {hydrated ? itemCount : 0}
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
      />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
