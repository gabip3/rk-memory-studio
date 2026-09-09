# Photography

Every image slot currently renders a designed, on-brand placeholder because no
real photography has been supplied yet. Nothing here uses stock imagery that
would misrepresent the actual products.

## How to add real photographs

1. Drop the file into this folder (or a subfolder).
2. Set its path and a descriptive `alt` in the matching data file.

That is the whole change: no component edits.

| What | Data file | Field |
|---|---|---|
| Product photos | `src/lib/data/products.ts` | `images: [{ src, alt, width, height }]` |
| Event photos | `src/lib/data/events.ts` | `image: { src, alt }` |
| Instagram posts | `src/lib/data/social-proof.ts` | `instagramPosts` |

Example:

```ts
images: [
  {
    src: "/images/magnets-fridge-hero.jpg",
    alt: "Nine custom photo magnets arranged on a refrigerator door, showing a family at the beach, a wedding couple and a golden retriever.",
    width: 1600,
    height: 2000,
  },
],
```

Because every slot already reserves its aspect ratio, swapping placeholders for
real photographs causes **no layout shift**.

## Shot list (from the design direction)

| Slot | Ratio | Subject |
|---|---|---|
| Home hero | 4:3 | Magnets on a refrigerator or premium surface: family, wedding, baby, pet, couple, vacation |
| Custom Photo Magnets | 4:5 | Product set, plus a close-up held in hand |
| Photo Keychains | 4:5 | Two or three keychains on linen: a couple and a pet |
| Photo Strips | 4:5 | A booth strip finished as a keepsake |
| Event Keepsakes | 4:5 | A styled favour display with a thank-you card |
| "Made Just for You" | 5:4 | Hand holding a magnet, kitchen softly blurred |
| Event categories (×6) | 4:3 | One per event type |
| Instagram | 1:1 | Real customer orders only |

## Requirements

- **Format:** upload JPG or PNG. Next.js serves AVIF/WebP automatically.
- **Size:** at least 1600px on the long edge for hero and product shots.
- **Compression:** run them through Squoosh or similar; aim under ~400KB each.
- **`alt` text:** describe *the photograph*, not the layout. Say what is in the
  picture and who is in it.

## Open Graph image

Social previews currently use the text metadata only. To add a share image, put
a **1200×630** JPG at `public/og-image.jpg` and add to `src/app/layout.tsx`:

```ts
openGraph: {
  // ...existing
  images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "RK Memory Studio" }],
},
```

## A note on customer photos

Photographs customers upload are **not** stored here. They go to the upload
provider (`.uploads/` in development, an object store in production), outside
`public/`, because they are personal data and must never be publicly servable
from a guessable URL.
