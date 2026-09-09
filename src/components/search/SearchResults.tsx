"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { searchSite, popularSearches } from "@/lib/search";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

/** Full-page search, deep-linkable via /search?q=magnets. */
export function SearchResults() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const results = useMemo(() => searchSite(query, 20), [query]);
  const hasQuery = query.trim().length >= 2;

  return (
    <div>
      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="flex items-center gap-3 border-b-2 border-gold pb-3"
      >
        <Icon name="search" size={22} className="shrink-0 text-gold-ink" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search magnets, keychains, events..."
          aria-label="Search products, events and questions"
          className="min-h-12 w-full bg-transparent font-display text-[1.5rem] text-ink outline-none placeholder:text-ink-subtle/60"
        />
      </form>

      <p role="status" aria-live="polite" className="sr-only">
        {hasQuery
          ? `${results.length} ${results.length === 1 ? "result" : "results"}`
          : ""}
      </p>

      {!hasQuery ? (
        <div className="pt-10">
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
        <div className="py-16 text-center">
          <p className="font-display text-[1.75rem]">
            Nothing matched &ldquo;{query}&rdquo;
          </p>
          <p className="u-measure mx-auto mt-4 text-[1rem] leading-[1.8] text-ink-muted">
            Try a product name like &ldquo;magnets&rdquo; or an occasion like
            &ldquo;wedding&rdquo;. If you are looking for something specific, we
            are happy to help.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/shop" variant="solid">
              Browse All Keepsakes
            </Button>
            <Button href="/contact" variant="outline">
              Ask Us
            </Button>
          </div>
        </div>
      ) : (
        <ul className="mt-8 border-t border-taupe/45">
          {results.map((result) => (
            <li key={result.href} className="border-b border-taupe/45">
              <Link
                href={result.href}
                className="group flex items-center gap-5 py-5 transition-colors duration-[var(--dur-fast)] hover:bg-gold-wash/40"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[1.25rem] text-ink">
                    {result.title}
                  </span>
                  <span className="mt-1 block text-[0.9375rem] leading-relaxed text-ink-muted">
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
  );
}
