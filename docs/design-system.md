# RK Memory Studio: Design System

The single source of truth is `src/app/globals.css`. This document explains the
reasoning, so future changes stay consistent instead of drifting.

## The brief in one line

*Premium gifting brand + photography + memories + handcrafted product.*
Warm, editorial, restrained. Never a print shop, never a generic Shopify theme.

---

## Colour

A warm neutral ladder: every surface is tinted toward cream, never neutral grey.
Grey is what makes a "premium" palette look cheap; the warmth is the brand.

| Token | Hex | Use |
|---|---|---|
| `--color-ivory` | `#faf7f2` | Page ground |
| `--color-cream` | `#f5f0e7` | Alternating section band |
| `--color-beige` | `#ede4d6` | Panels, the "How It Works" tray |
| `--color-taupe` | `#c6b8a2` | Borders, dividers |
| `--color-charcoal` | `#1c1a17` | Editorial dark sections |
| `--color-black` | `#0e0d0b` | Announcement bar, solid buttons |

### Champagne gold is a **three-tier scale**, not one colour

This is the single most important rule in the system.

The brand gold `#b18f5f` reaches only **2.8:1** on ivory. That fails WCAG AA for
normal text (4.5:1) *and* for large text (3:1). Using it for copy would make the
site both inaccessible and, at small sizes, genuinely hard to read.

So the gold is split by job:

| Token | Hex | Contrast | Allowed use |
|---|---|---|---|
| `--color-gold` | `#b18f5f` | 2.8:1 on ivory | **Decorative only**: rules, icon strokes, borders, step markers |
| `--color-gold-display` | `#9c7a45` | **3.7:1** on ivory | Display text ≥24px (the hero's "Made to Keep.") |
| `--color-gold-ink` | `#7d5f2f` | **5.5 / 5.2 / 4.7:1** | Eyebrows, links, small text, solid gold buttons |
| `--color-gold-on-dark` | `#c9ac7e` | **8.0:1** on charcoal | Any gold text on a dark section |

**Never put text in `--color-gold`.** If you need gold type, pick the tier that
matches the size and the background.

`--color-gold-ink` is validated against **all three** light surfaces (ivory,
cream, beige), not just ivory. An earlier value, `#8a6a38`, passed on ivory at
4.7:1 but dropped to **4.4:1 on cream**, which is where most eyebrows actually
sit. When changing any small-text colour, check it on every surface it lands on.

### Ink

| Token | Hex | Contrast on ivory | Use |
|---|---|---|---|
| `--color-ink` | `#211e1a` | 14.8:1 | headings |
| `--color-ink-muted` | `#6b6259` | 5.6:1 | body copy |
| `--color-ink-subtle` | `#7d7568` | 4.5:1 | captions, meta |

All three clear AA. There is deliberately no lighter grey available, because
"grey text on cream" is the fastest way to make an elegant layout unreadable.

---

## Typography

**Bebas Neue** (display) + **Poppins** (sans). Both self-hosted via `next/font`,
so there is no request to Google and no layout shift.

**Both faces are taken directly from our sister brand, RK 360 Photo Booth
Rentals**, at the owner's explicit request, so the two sites read as one family.

Consequences to keep in mind when editing:

- **Bebas Neue is uppercase-only.** Headings render as caps regardless of the
  text you write. Keep the source text in normal sentence case anyway: screen
  readers and search engines read the DOM, not the rendered glyphs.
- **It ships a single weight (400).** There is no bold heading. Hierarchy comes
  from size and colour, never from weight.
- **Its metrics are unlike a serif**: very tall caps, no descenders, tight
  sidebearings. Headings therefore use `line-height: 0.95` and *positive*
  tracking (`0.015em`). Negative tracking jams the letters together.
- **Poppins' uppercase is wide.** The seven desktop nav items only just fit at
  the 1024px breakpoint. `Header.tsx` tightens the nav gap there and restores it
  at `xl`. **If you add a nav item, re-measure the header.**

### Display scale (fluid: no breakpoint jumps)

| Token | Range |
|---|---|
| `--text-display-xl` | 44 → 92px: hero h1 only |
| `--text-display-l` | 36 → 64px: page h1 |
| `--text-display-m` | 30 → 48px: section h2 |
| `--text-display-s` | 24 → 34px: sub-section h3 |

Used as Tailwind utilities: `text-display-xl`, `text-display-m`, etc.

### The UI voice

Letterspaced uppercase sans. Two utilities carry it everywhere:

- `.u-caps`: 0.18em tracking. Nav, buttons, labels.
- `.u-eyebrow`: 0.34em tracking, 11px, `--color-gold-ink`. Section eyebrows.

Body copy is 16px minimum (below that iOS zooms the page on focus) at 1.7
line-height, with measure constrained by `.u-measure` (62ch) or
`.u-measure-tight` (46ch).

---

## Motion

Restrained on purpose: the brief said *do not over-animate*.

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 160ms | Hover tints |
| `--dur-base` | 240ms | Buttons, dropdowns, state changes |
| `--dur-slow` | 420ms | Image zoom |
| `--dur-reveal` | 720ms | Scroll reveal |

Rules that are enforced, not just suggested:

- **Only `transform` and `opacity` animate.** Never width, height, top or left.
- **Scroll reveal degrades safely.** `[data-reveal]` is visible by default; it
  only starts hidden once an inline script has added `.js` to `<html>`. If
  JavaScript fails, the page is fully readable rather than blank.
- **One observer, not fifty.** `ScrollReveal.tsx` runs a single
  IntersectionObserver for every revealed block, unobserving each on reveal.
- **Stagger is 45 to 70ms per item.** Enough to read as sequence, not as a queue.
- **`prefers-reduced-motion` disables everything** and forces revealed content
  visible. There are no exceptions anywhere in the codebase.

---

## Layout

- Container: `max-w-[80rem]`, gutters widening `20 → 32 → 48 → 64px`.
- Section rhythm: `py-20 → py-36` (the `lg` tier). Generous by design.
- Touch targets: **44px minimum**, everywhere, including footer links.
- Z-index is a named scale (`--z-sticky` 20 → `--z-toast` 100). Never ad-hoc.

---

## Components

Everything composes from `src/components/ui`:

`Button` · `Icon` · `Photo` · `Section` / `Container` / `SectionHeading` /
`Eyebrow` · `Accordion` · `Field` (Text/TextArea/Select/RadioGroup) ·
`Logo` · `Reveal`

### Two that carry specific decisions

**`Icon`**: one family, 24×24, 1.4 stroke, round caps. Icons are `aria-hidden`
by default; pass `title` only when the icon is the sole carrier of meaning.
**No emoji is ever used as an icon**: they are font-dependent, inconsistent
across platforms and cannot be themed.

**`Photo`**: when `src` is `null` it renders a designed, on-brand placeholder
frame instead of a broken image or misleading stock photography. The aspect ratio
is reserved either way, so dropping in real photographs later causes **zero
layout shift**. See `public/images/README.md`.

---

## The accessibility rules this system will not bend on

1. Contrast ≥4.5:1 for body text, ≥3:1 for large text. Verified numerically, not
   by eye: the gold scale exists precisely because eyeballing it fails.
2. Focus rings are restyled, never removed.
3. Colour is never the only signal. Selected states also carry a check mark;
   errors also carry an icon and text.
4. Every input has a real visible `<label>`. Placeholders are never labels.
5. Errors sit beside their field, use `role="alert"`, and are wired with
   `aria-describedby` + `aria-invalid`.
6. Pinch zoom is never disabled.
7. One `<h1>` per page, no skipped heading levels.
