# RK Memory Studio

Premium e-commerce storefront for custom photo magnets and personalized
keepsakes. *Turning Moments Into Keepsakes.*

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4

---

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

---

## Read these first

| Document | Why |
|---|---|
| **[docs/check-cherry-integration.md](docs/check-cherry-integration.md)** | **What you need to provide** to switch checkout on |
| [docs/etsy-integration.md](docs/etsy-integration.md) | Dormant Etsy provider, if you open that channel later |
| [docs/design-system.md](docs/design-system.md) | Colour, type, motion and the rules behind them |
| [public/images/README.md](public/images/README.md) | How to drop in real photography |
| [.env.example](.env.example) | Every configuration value, annotated |

---

## What still needs real information

Nothing in this codebase invents business facts. These are the outstanding
items, each rendering an honest placeholder state until you supply the truth:

| Item | Where | Current behaviour |
|---|---|---|
| **Check Cherry checkout** | `.env.local` | `/checkout` explains it is not live and offers a contact route |
| **Business email** | `NEXT_PUBLIC_CONTACT_EMAIL` | Shows "email address is being set up", never a fake address |
| **Product photography** | `public/images/` | Designed on-brand placeholder frames |
| **Pricing** | `src/lib/data/products.ts` | "Confirmed at checkout": no invented figures |
| **Production times** | `src/lib/data/faq.ts` | FAQ marked *pending*, excluded from FAQ structured data |
| **Shipping costs** | `src/lib/data/policies.ts` | Policy page carries a visible "coming before launch" notice |
| **Reviews** | `src/lib/data/social-proof.ts` | Empty array → designed empty state. **No fake reviews.** |
| **Instagram account** | `NEXT_PUBLIC_INSTAGRAM_URL` | No account yet: the home gallery and every Instagram link stay hidden until it is set |
| **Instagram posts** | `src/lib/data/social-proof.ts` | Empty array → reserved frames + profile link (once the account is set) |
| **Terms / Refund policy** | `src/lib/data/policies.ts` | Honest placeholder; Privacy is a factual draft pending legal review |
| **Contact form delivery** | `ENQUIRY_TRANSPORT` | Form tells customers to email instead of failing silently |
| **Upload storage** | `UPLOAD_PROVIDER` | `local` writes to disk: **replace before deploying serverless** |

---

## Architecture

Content is separated from presentation throughout. Copy, products and policies
live in `src/lib/data/`; components never hard-code business text.

```
src/
├── app/                     Routes (App Router)
│   ├── shop/[slug]/         Product page + configurator
│   ├── events/[slug]/       Event landing pages
│   ├── help/[slug]/         Help articles
│   ├── policies/[slug]/     Policy pages
│   ├── api/
│   │   ├── uploads/         Photo upload endpoint (re-validates server-side)
│   │   ├── checkout/        Creates the provider handoff + reference
│   │   └── enquiries/       Contact + bulk order submissions
│   ├── sitemap.ts robots.ts
│   └── globals.css          ← the design system
├── components/
│   ├── ui/                  Button, Icon, Photo, Section, Field, Accordion…
│   ├── layout/              Header, MobileNav, Footer, CartDrawer, Search
│   ├── home/                Home page sections
│   ├── product/             Configurator, QuantitySelector, PhotoUploader
│   ├── forms/ cart/ checkout/ search/ seo/
└── lib/
    ├── data/                All copy and catalogue data
    ├── checkout/            Provider-agnostic checkout (Check Cherry / Etsy)
    ├── uploads/             Storage adapter + validation
    ├── enquiries/           Form delivery transport
    └── cart/                Cart state (localStorage-backed)
```

### Swappable integration points

Each is isolated behind an interface, selected by an environment variable, and
degrades to an honest message when unconfigured:

| Concern | Interface | Env var |
|---|---|---|
| Checkout | `CheckoutProvider` | `CHECKOUT_PROVIDER`, `CHECK_CHERRY_*` |
| Photo storage | `StorageAdapter` | `UPLOAD_PROVIDER` |
| Enquiry delivery | `deliverEnquiry` | `ENQUIRY_TRANSPORT` |

---

## The commerce flow

```
Choose product → Choose quantity → Upload photos → Personalize
   → Review → Add to cart → Checkout (Check Cherry)
```

Photos upload immediately on selection, so the customer never waits at the
"Add to Cart" step, and each file reports success or failure independently.
A short order reference (`RK-XXXXXX`) links the uploaded photos to the order.
With Check Cherry it rides in the checkout URL, so the customer never copies or
retypes it. See docs/check-cherry-integration.md.

---

## Mobile

Designed for the phone first, because the expected journey is
Instagram → phone → product → upload → checkout.

The mobile experience is not a narrowed desktop layout:

- Its own full-height navigation sheet with in-place expanding sections
- Quantity tiles in a two-column thumb-friendly grid
- The uploader opens the camera roll directly and accepts HEIC originals
- A sticky action bar with live photo count, clear of the home-gesture area
- 16px inputs so iOS never zooms on focus
- 44px minimum touch targets throughout

---

## Accessibility

Built in rather than retrofitted: verified colour contrast (see the gold-scale
note in the design system), one `<h1>` per page with no skipped levels, real
labels on every input, `role="alert"` errors wired with `aria-describedby`,
focus trapped and restored in every overlay, `prefers-reduced-motion` honoured
without exception, and pinch zoom never disabled.

---

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Before deploying

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain
- [ ] Set `NEXT_PUBLIC_SITE_INDEXABLE=true` **only on production** (staging
      otherwise serves a `Disallow: /` robots.txt)
- [ ] Configure Check Cherry: see the integration doc
- [ ] Confirm with Check Cherry that a booking-form field can be pre-filled
      from a URL parameter
- [ ] Replace the `local` upload provider with an object store if deploying
      serverless (Vercel/Netlify filesystems are ephemeral)
- [ ] Set `ENQUIRY_TRANSPORT` so the contact and bulk-order forms deliver
- [ ] Add the business email address
- [ ] Add real photography
- [ ] Have the Privacy Policy legally reviewed; publish Terms, Shipping, Refund
