# Check Cherry Integration (active provider)

This site owns the **branded storefront**: browsing, product presentation,
quantity selection, photo upload and personalization.

**Check Cherry owns the order workflow**: pricing, payment, contracts and order
management. Nothing here duplicates that.

## Why Check Cherry and not Etsy

1. **RK 360 Photo Booth Rentals, the sister business, already runs it.** Same
   owner, same login, already paid for, no new subscription and no new tool to
   learn. Photo booth bookings and keepsake orders land in one place.
2. **The customer base overlaps exactly.** Someone who books a photo booth has
   an event, photographs and guests to give favours to. That is the natural
   first audience, and it is warm rather than cold.
3. **The event and bulk orders are the valuable ones**, and they are the worst
   fit for a marketplace: high ticket, quoted, contracted, date-driven.
4. **The order reference travels in the URL.** The customer never copies or
   retypes anything. On Etsy that is impossible, because no documented query
   parameter pre-fills the personalization field.

Etsy remains registered but dormant (see `docs/etsy-integration.md`). Switching
is `CHECKOUT_PROVIDER=etsy`, not a rewrite.

**Check Cherry is an order system, not a source of demand.** It will not bring
traffic. That has to come from RK 360's client base, Instagram and referrals.

---

## What this integration deliberately does NOT do

No Check Cherry REST endpoint, request payload or webhook route is implemented,
**because none has been verified against Check Cherry's documentation.** Guessing
at an API produces code that looks finished and fails silently in production.

What *is* implemented uses only mechanisms every Check Cherry account has:

1. **Hosted handoff**: redirect the customer to your Check Cherry booking /
   checkout page, carrying the order reference in the URL.
2. **Embed**: render the embed snippet from your Check Cherry dashboard on our
   `/checkout` page.

For a direct API integration, get the documented contract from Check Cherry
support first, then add a provider file. Do not add guessed endpoints.

---

## >>> WHAT I NEED FROM YOU <<<

Until these are set, `/checkout` shows customers an honest "not switched on yet"
message with a contact route. Never a dead button.

### 1. Which mode

| Mode | What the customer sees | Choose if |
|---|---|---|
| `hosted` | Clicks "Continue to Checkout" and lands on your Check Cherry page | **Recommended.** Simplest and most reliable |
| `embed` | Completes checkout inside a frame on our site | You have an embed snippet and want them to stay on-domain |

```
CHECK_CHERRY_MODE=hosted
```

### 2. Your URL or embed snippet

```
CHECK_CHERRY_BOOKING_URL=https://...        # hosted mode, must be https
CHECK_CHERRY_EMBED_HTML=<iframe src="..."></iframe>   # embed mode, one line
```

### 3. A reference field on your booking form: **the critical one**

Photographs are uploaded **on this website**, not in Check Cherry. We mint a
code (`RK-8819C4`) and pass it as a query parameter. That code is how you match
an incoming order to the customer's uploaded photos.

**You need to:**
1. Add a custom field to your Check Cherry booking form, e.g. "Order Reference".
2. Confirm the query-parameter name that pre-fills it.
3. Put that name in `CHECK_CHERRY_REFERENCE_PARAM` (default `reference`).

**Please confirm with Check Cherry support that a custom field can be pre-filled
from a URL parameter.** If it cannot, tell me: I will switch the flow to display
the code prominently and ask the customer to paste it, the way the Etsy path
works. It still functions, it is just less smooth. Either way, **do not launch
without a reference mechanism** or you will receive orders you cannot connect to
any photos.

### 4. Optional

| Variable | Purpose |
|---|---|
| `CHECK_CHERRY_EXTRA_PARAMS` | Extra query params, `key=value&key2=value2` |
| `NEXT_PUBLIC_ORDER_PORTAL_URL` | Customer portal URL, used on `/account` |

### 5. Package / item IDs

Each product in `src/lib/data/products.ts` has `checkCherryItemId`, currently
`null`. If Check Cherry accepts a package identifier via the booking URL, send
me the IDs and the parameter name and I will wire them through.

### 6. Pricing: your decision

Every product has `price: null`, so the site shows **"Confirmed at checkout"**
and no figure is invented anywhere.

- **Leave pricing in Check Cherry** (current). One source of truth, never wrong.
- **Mirror it on-site.** Fill `price` in **cents** in `products.ts` and the UI
  displays it everywhere automatically. You then have to keep it in sync by
  hand, and a stale price on your own site is worse than no price.

---

## The flow

```
Browse and choose a keepsake        ->  This site
Choose quantity                     ->  This site
Upload photographs                  ->  This site (full resolution preserved)
Add optional personalization        ->  This site
Review and add to cart              ->  This site
Continue to Checkout                ->  This site mints RK-XXXXXX
                                        and appends it to the URL
Payment, contract, order record     ->  Check Cherry, reference already filled
```

Event and bulk orders take a different, already-built path: the quote form at
`/bulk-orders` sends an enquiry, and you invoice from Check Cherry the same way
RK 360 already operates.

## Files involved

| File | Responsibility |
|---|---|
| `src/lib/checkout/types.ts` | The contract, provider-agnostic |
| `src/lib/checkout/config.ts` | Reads env vars for both providers |
| `src/lib/checkout/check-cherry.ts` | This provider |
| `src/lib/checkout/etsy.ts` | Dormant alternative |
| `src/lib/checkout/index.ts` | Public API, registry, reference generator |
| `src/app/api/checkout/route.ts` | Validates the cart, creates the handoff |
| `src/components/checkout/CheckoutClient.tsx` | The checkout screen |

The storefront only imports from `src/lib/checkout`, so switching provider
touches the registry, not the pages.

## Testing before launch

- [ ] Set the env vars, restart, add an item and reach `/checkout`.
- [ ] Confirm the reference arrives pre-filled on the Check Cherry side.
- [ ] Place one real test order and confirm you can find the uploaded photos
      from the reference.
- [ ] Unset `CHECK_CHERRY_MODE` and confirm the fallback message appears rather
      than an error.
