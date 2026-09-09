# Etsy Integration (DORMANT)

> **Not the active provider.** Check Cherry is live (see
> `check-cherry-integration.md`), because the sister business RK 360 already
> runs it and its order reference travels in the URL with no copy-paste.
> This provider stays registered so opening Etsy as an acquisition channel
> later is `CHECKOUT_PROVIDER=etsy`, not a rewrite. Everything below still
> applies if you switch.

This site owns the **branded storefront**: browsing, product presentation,
quantity selection, photo upload and personalization.

**Etsy owns the transaction**: pricing, payment, order records and reviews.

---

## Two hard constraints, verified against Etsy's own API reference

These are not opinions or caution. They were checked directly against the
published Etsy Open API v3 endpoint reference.

### 1. Checkout cannot happen on this site

There is **no cart, checkout, basket or payment-intent endpoint** anywhere in
the Etsy API. The endpoints that mention payment are read-only lookups of sales
that already completed:

- `getPayments`
- `getShopPaymentByReceiptId`
- `getShopPaymentAccountLedgerEntries`

None of them charge a customer. Payment happens on etsy.com, full stop. Any
"headless Etsy checkout" plan is not buildable.

### 2. Buyers cannot upload photos to Etsy

Etsy's upload endpoints are **seller-side only**, for attaching assets to your
own listing:

- `uploadListingImage`
- `uploadListingFile`
- `uploadListingVideo`

Etsy's buyer-facing personalization is a **text field**. A buyer cannot attach a
wedding photo at checkout.

That second constraint is the important one for this business, because every
product here is made from a customer photograph.

---

## How we solve it: the order code

```
Customer configures the keepsake and uploads photos    ->  This site
Site issues an order code, e.g.  RK-8819C4             ->  This site
Customer opens the Etsy listing and checks out         ->  Etsy
Customer pastes RK-8819C4 into "Personalization"       ->  Etsy
You receive the Etsy order and match it to the photos  ->  by the code
```

Why this and not "ask for photos in Etsy Messages afterwards":

- You get the photos **before** payment, so nothing is chased afterwards.
- Full resolution is preserved. Etsy Messages compresses images, which is
  exactly what ruins a keepsake print.
- The customer does the matching work at the moment they are already engaged,
  not days later.

The code is deliberately short and unambiguous: it uses a Crockford-style
alphabet with no I, L, O or U, because a human has to read it off one screen and
type it into another.

---

## >>> WHAT I NEED FROM YOU <<<

### 1. Your Etsy shop URL (required)

```
ETSY_SHOP_URL=https://www.etsy.com/shop/YourShopName
NEXT_PUBLIC_ETSY_SHOP_URL=https://www.etsy.com/shop/YourShopName
```

Both are the same value. The first is used server-side to build the handoff; the
second is exposed to the browser for shop links.

Until this is set, `/checkout` tells customers the shop is not connected yet and
offers a contact route. It never shows a dead button.

### 2. One Etsy listing id per product (strongly recommended)

Each product in `src/lib/data/products.ts` has `etsyListingId`, currently `null`.

Find the id in the listing's URL:

```
https://www.etsy.com/listing/1234567890/custom-photo-magnets
                             ^^^^^^^^^^
```

Then set it:

```ts
etsyListingId: "1234567890",
```

With it set, the checkout screen sends the customer straight to that listing.
Without it, the button falls back to your shop front and the customer has to
find the item themselves. It still works, it is just more friction.

### 3. Add a Personalization field to each Etsy listing (required)

On each listing, turn **Personalization** on and use a prompt like:

> Paste the order code from rkmemorystudio.com here (looks like RK-8819C4).
> This links your order to the photos you uploaded.

**Without this field the whole flow breaks**, because the customer will have
nowhere to put the code and you will receive orders you cannot match to photos.

Note: Etsy's personalization field has a character limit, which is far more than
a 9-character code needs. No problem here.

### 4. Pricing: a decision for you

Every product has `price: null`, so the site shows **"Confirmed at checkout"**
and no figure is invented anywhere. If you switch to Etsy, consider changing
that string in `src/lib/format.ts` to point at the listing instead.

- **Leave it on Etsy** (current behaviour). One source of truth, never wrong.
- **Mirror prices on-site.** Fill `price` in **cents** in `products.ts` and the
  UI displays them everywhere automatically. You must then keep them in sync
  with Etsy by hand, and a stale price on your own site is worse than no price.

---

## A note on Etsy's off-platform rules

The direction here is **your site -> Etsy**, which is traffic you are sending to
Etsy. That is the direction Etsy encourages, and sellers link to their shops from
their own sites routinely.

What Etsy restricts is the opposite: taking a buyer who found you *on Etsy* and
moving them off-platform to avoid fees. Nothing in this integration does that.

Since policies change, confirm the current wording on Etsy's Seller Policy
yourself before launch rather than relying on this note.

---

## What is NOT built (and what it would take)

**Listing sync via the Etsy API.** Pulling titles, prices, images and stock from
Etsy so the site can never drift out of date. This is genuinely supported:
`getListingsByShop`, `getListingInventory`, `updateListing` and friends all
exist.

It is not built because it needs things only you can create:

1. An Etsy developer app (an API keystring).
2. OAuth 2.0 authorisation against your shop, with token refresh.
3. A sync job or cache, since the API is rate-limited and should not be called
   on every page render.

If you want it, say so and provide the keystring. It slots in as a separate
server-side module and does **not** change the checkout handoff above.

---

## Files involved

| File | Responsibility |
|---|---|
| `src/lib/checkout/types.ts` | The contract, plus the documented constraints |
| `src/lib/checkout/config.ts` | Reads `ETSY_SHOP_URL`, builds listing URLs |
| `src/lib/checkout/etsy.ts` | The Etsy provider |
| `src/lib/checkout/index.ts` | Public API, provider registry, code generator |
| `src/app/api/checkout/route.ts` | Validates the cart, creates the handoff |
| `src/components/checkout/CheckoutClient.tsx` | The two-step handoff screen |

The storefront only ever imports from `src/lib/checkout`, so changing provider
touches the registry, not the pages.

---

## Testing before launch

- [ ] Set `ETSY_SHOP_URL`, restart, add an item and reach `/checkout`.
- [ ] Confirm the order code appears large and the Copy button works.
- [ ] Set one real `etsyListingId` and confirm "Open on Etsy" lands on it.
- [ ] Place a real test order pasting the code into Personalization, and confirm
      the code arrives on the Etsy receipt.
- [ ] Unset `ETSY_SHOP_URL` and confirm the fallback message appears rather than
      an error.
