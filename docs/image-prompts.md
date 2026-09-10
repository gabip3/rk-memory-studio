# Image prompts

Prompts for generating the site photography in Google Flow.

## Why these are written the way they are

The first version produced images that looked obviously AI-generated. It was
stuffed with the words that cause that look: premium, elegant, editorial,
cinematic, shallow depth of field, bokeh, film grain, 85mm, photorealistic,
high detail. Generators read those as "make the perfect stock photo" and return
glossy, glowing, over-styled scenes.

These prompts do the opposite. They describe **a real photo someone took**:
ordinary daylight, real homes and venues, things slightly out of place, most
of the frame in focus, no colour grading. The site's typography, palette and
layout already carry the premium feel. The photos need to feel **true**.

## Rules

- **Never add back:** premium, luxury, elegant, cinematic, editorial, dreamy,
  bokeh, golden hour, glowing, photorealistic, 8k, ultra detailed, film grain.
- **Still too glossy?** Add `overcast day` or `slightly underexposed`.
- **Too casual?** Replace the phone ending with the camera ending below.
- **Pick the least perfect** of each batch of variations. Perfect is the tell.
- **Avoid upscalers and "enhance" filters.** They tend to add the plastic sheen
  back.
- **Faces inside the magnets look distorted?** Swap that snapshot for a pet, a
  landscape, or people seen from behind.
- **Magnets must match the real product:** 2x2 inch squares and 2.25 inch
  rounds only. Reject anything large or rectangular.
- **Never generate** Instagram posts, customer photos or review images.

### Endings

Every prompt ends with the phone ending. Swap it for the camera ending if a
shot feels too casual.

Phone (default):

```text
Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, everything reasonably in focus, small natural imperfections. No text.
```

Camera (a little more polished, still real):

```text
Real photo taken by a product photographer on a DSLR in natural daylight, no retouching, true-to-life colors, no color grading, most of the scene in focus. No text.
```

## Strong recommendation: photograph the real product

For **5, 6 and 7** (and ideally 8 and 10), shoot the real magnets instead.
A generator does not know the actual thickness, edge or finish, and a customer
who spots an AI product photo stops trusting the product itself, which is the
one thing a product photo exists to prove. A phone by a window is enough:

1. Daylight from a window, beside you. No flash, no overhead light.
2. A plain surface: light wood, linen or white paper.
3. Wipe the magnets. Dust shows.
4. Shoot from above, then at a low angle.
5. Take 20. Keep the 3 best.

---

## Home

### 1. `hero.jpg` (4:3)

```text
Straight-on phone photo of part of a cream refrigerator door in a bright, tidy home kitchen. About ten small photo magnets are stuck on it, a mix of 2x2-inch squares and 2.25-inch circles, placed a little unevenly, printed with ordinary family snapshots: a golden retriever, kids on a beach, a wedding couple, a sleeping baby, a sunset. The edge of a wooden countertop and the real kitchen are visible at the side. Soft, slightly uneven daylight from a nearby window. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, everything reasonably in focus, small natural imperfections. No text.
```

### 2. `made-for-you.jpg` (5:4)

```text
Candid phone photo of a woman's hand holding a small 2x2-inch square photo magnet printed with a snapshot of a dad and two kids. Real hand with visible skin texture, short natural nails, fingers relaxed. Behind it is her actual kitchen, a little out of focus but recognizable: a counter, a mug, a window. Ordinary indoor daylight. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, small natural imperfections. No text.
```

### 3. `keychains.jpg` (5:4)

```text
Phone photo looking down at two clear acrylic photo keychains lying on a wooden table next to a set of house keys. One shows a couple, the other a puppy. Metal key rings, a few fine scratches on the acrylic, light reflecting naturally off the surface. Daylight from a window. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, everything reasonably in focus, small natural imperfections. No text.
```

### 4. `about.jpg` (4:5)

```text
Photo of a small home studio work table in daylight: a photo cutter, a stack of printed photos, a shallow box of finished square and round photo magnets, some kraft boxes and a roll of tape. Tidy but clearly in use, a real workspace rather than a styled set. Taken from standing height looking down at an angle. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, everything reasonably in focus, small natural imperfections. No text.
```

---

## Products (photograph the real product if you can)

### 5. `product-magnets.jpg` (4:5)

```text
Overhead phone photo of personalized photo magnets laid out on a light wooden table in daylight: several 2x2-inch squares and several 2.25-inch circles, printed with everyday family snapshots, a pet and a wedding. Placed in loose rows, not perfectly aligned. Soft real shadows show that they are thin. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, everything in focus, small natural imperfections. No text.
```

### 6. `product-magnets-detail.jpg` (1:1)

```text
Close phone photo of a real hand holding one 2.25-inch round photo magnet printed with a snapshot of a toddler. Natural skin texture, short nails, the glossy surface showing a small window reflection. Plain light background. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, small natural imperfections. No text.
```

### 7. `product-keychains.jpg` (4:5)

```text
Overhead phone photo of three clear acrylic photo keychains on a light linen cloth: one with a single photo, one flipped to show a photo on its back, and one tall narrow keychain with three small photos stacked like a photo booth strip. Metal rings, natural reflections, a little dust on the acrylic. Daylight. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, everything in focus. No text.
```

### 8. `product-photo-strips.jpg` (4:5)

```text
Phone photo of a printed photo booth strip with three candid shots of a laughing couple, leaning against a glass jar on a kitchen shelf, next to a narrow magnet printed with the same strip. Ordinary daylight, one edge of the paper strip slightly curled. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, small natural imperfections. No text.
```

### 9. `product-event-keepsakes.jpg` (4:5)

```text
Photo taken at a real wedding reception of the favor table: small square photo magnets of the couple laid out in rows on a white tablecloth, a few already taken by guests so there are gaps, a blank folded card and a small vase of flowers. Mixed indoor venue light, a few guests out of focus in the far background. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, small natural imperfections. No text.
```

### 10. `product-gifts.jpg` (4:5)

```text
Phone photo of someone opening a small gift box on their lap: inside, on tissue paper, a 2x2-inch square photo magnet with a snapshot of a grandmother and grandchild. Hands visible with natural skin, a knit sweater sleeve, living room daylight. Candid and unposed. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, small natural imperfections. No text.
```

---

## Events (all square: the same image is cropped three ways on the site)

### 11. `event-weddings.jpg` (1:1)

```text
Phone photo of a 2x2-inch square photo magnet of a bride and groom placed on a white reception table next to a champagne glass and a folded napkin. Warm venue lighting, other tables faintly visible behind. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, small natural imperfections. No text.
```

### 12. `event-birthdays.jpg` (1:1)

```text
Phone photo of a round photo magnet of a child blowing out candles, lying on a kitchen table after a birthday party among a few paper plates, a cake knife and some confetti. Afternoon daylight. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, small natural imperfections. No text.
```

### 13. `event-baby-showers.jpg` (1:1)

```text
Phone photo of a square photo magnet with a newborn photo, resting on a baby blanket next to a pacifier and a small knit hat. Soft daylight from a nursery window. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, small natural imperfections. No text.
```

### 14. `event-graduations.jpg` (1:1)

```text
Phone photo of a round photo magnet of a graduate in cap and gown, stuck on a refrigerator next to a graduation tassel hanging from a hook. Kitchen daylight. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, small natural imperfections. No text.
```

### 15. `event-corporate.jpg` (1:1)

The dark one, to sit with the charcoal sections.

```text
Phone photo of a small stack of branded square magnets printed with a simple abstract black-and-gold shape, no letters, on a dark charcoal tablecloth at a corporate event registration table next to lanyards and a pen. Dim indoor venue lighting, attendees out of focus in the background. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, small natural imperfections. No text.
```

### 16. `event-memorial.jpg` (1:1)

```text
Phone photo of a square photo magnet with an old, faded snapshot of an elderly couple, on a wooden side table next to a lit candle and a pair of reading glasses. Quiet evening lamp light. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading, small natural imperfections. No text.
```

---

## Social share image

### 17. `og-image.jpg` (16:9, cropped to 1200x630)

Left side is left empty so the logo can be composited on afterwards.

```text
Overhead phone photo of a light linen tablecloth with a small loose pile of square and round photo magnets on the right side and plenty of plain empty linen on the left. Daylight. Real unretouched photo taken on an iPhone, true-to-life colors, no filter, no color grading. No text.
```
