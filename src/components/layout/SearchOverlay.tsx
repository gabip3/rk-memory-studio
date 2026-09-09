"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { searchSite, popularSearches } from "@/lib/search";
import { Icon } from "@/components/ui/Icon";
import { useDialog } from "@/lib/hooks/useDialog";

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const panelRef = useDialog<HTMLDivElement>(open, onClose);

  const results = useMemo(() => searchSite(query), [query]);
  const hasQuery = query.trim().length >= 2;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)]">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="u-anim-fade absolute inset-0 bg-charcoal/55 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        tabIndex={-1}
        className="u-anim-drop absolute inset-x-0 top-0 max-h-[min(90dvh,44rem)] overflow-y-auto overscroll-contain bg-ivory shadow-lift outline-none"
      >
        <div className="mx-auto w-full max-w-[52rem] px-5 py-6 sm:px-8 sm:py-10">
          <div className="flex items-center gap-3 border-b-2 border-gold pb-3">
            <Icon name="search" size={22} className="shrink-0 text-gold-ink" />

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              // Autofocus is correct here: the customer opened a search dialog.
              autoFocus
              placeholder="Search magnets, keychains, events..."
              aria-label="Search products, events and questions"
              aria-describedby="search-status"
              className="min-h-12 w-full bg-transparent font-display text-[1.5rem] text-ink outline-none placeholder:text-ink-subtle/60 sm:text-[1.875rem]"
            />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="-mr-2 grid h-11 w-11 shrink-0 place-items-center text-ink-muted transition-colors duration-[var(--dur-base)] hover:text-ink"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          {/* Announced politely so a screen reader is told the count changed */}
          <p id="search-status" role="status" aria-live="polite" className="sr-only">
            {hasQuery
              ? `${results.length} ${results.length === 1 ? "result" : "results"} for ${query}`
              : "Type at least two characters to search."}
          </p>

          {!hasQuery ? (
            <div className="pt-8">
              <p className="u-eyebrow mb-4">Popular searches</p>
              <ul className="flex flex-wrap gap-2.5">
                {popularSearches.map((term) => (
                  <li key={term}>
                    <button
                      type="button"
                      onClick={() => setQuery(term)}
                      className="min-h-11 border border-taupe px-4 text-[0.875rem] text-ink-muted transition-colors duration-[var(--dur-base)] hover:border-gold hover:bg-gold-wash hover:text-ink"
                    >
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : results.length === 0 ? (
            <div className="py-14 text-center">
              <p className="font-display text-[1.5rem] text-ink">
                Nothing matched &ldquo;{query}&rdquo;
              </p>
              <p className="u-measure mx-auto mt-3 text-[0.9375rem] text-ink-muted">
                Try a product name like &ldquo;magnets&rdquo; or an occasion like
                &ldquo;wedding&rdquo; - or{" "}
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="text-gold-ink underline underline-offset-4"
                >
                  ask us directly
                </Link>
                .
              </p>
            </div>
          ) : (
            <ul className="pt-6">
              {results.map((result) => (
                <li key={result.href} className="border-b border-taupe/40 last:border-0">
                  <Link
                    href={result.href}
                    onClick={onClose}
                    className="group flex items-center gap-5 py-4 transition-colors duration-[var(--dur-fast)] hover:bg-gold-wash/50"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[1.1875rem] text-ink">
                        {result.title}
                      </span>
                      <span className="mt-0.5 block truncate text-[0.875rem] text-ink-muted">
                        {result.description}
                      </span>
                    </span>

                    <span className="u-caps hidden shrink-0 text-[0.5625rem] tracking-[0.22em] text-ink-subtle sm:block">
                      {result.kind}
                    </span>

                    <Icon
                      name="arrow-right"
                      size={16}
                      className="shrink-0 text-gold transition-transform duration-[var(--dur-base)] group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
