"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One IntersectionObserver for every `[data-reveal]` block on the page.
 *
 * Mounted once in the root layout. Re-scans on route change and watches for
 * nodes added later (dropdowns, drawers, async product lists).
 *
 * Elements are unobserved as soon as they have revealed, so scrolling a long
 * page does not accumulate observer work on the main thread.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const revealAll = () =>
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => el.classList.add("is-visible"));

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Honour the OS setting: show everything immediately, observe nothing.
    // Same for a viewport with no height (prerenderers, hidden webviews,
    // print/screenshot contexts) - nothing can ever "intersect" it, so the
    // observer would leave the whole page at opacity 0.
    if (
      prefersReduced ||
      !("IntersectionObserver" in window) ||
      window.innerHeight === 0
    ) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      // Fire slightly before the block reaches the fold so the motion has
      // finished by the time the reader's eye arrives.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 }
    );

    const observe = (root: ParentNode) => {
      root
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)")
        .forEach((el) => {
          // Anything already on screen at load reveals without waiting.
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.92) {
            el.classList.add("is-visible");
          } else {
            observer.observe(el);
          }
        });
    };

    observe(document);

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.hasAttribute("data-reveal")) node.classList.add("is-visible");
            observe(node);
          }
        });
      }
    });

    mutations.observe(document.body, { childList: true, subtree: true });

    // Last-resort safety net. A decorative animation must never be able to
    // leave a storefront blank: if nothing at all has revealed after 2s, the
    // observer is not working in this environment, so show everything.
    // In the normal case at least the hero has revealed and this does nothing.
    const failsafe = window.setTimeout(() => {
      if (!document.querySelector("[data-reveal].is-visible")) revealAll();
    }, 2000);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [pathname]);

  return null;
}
