# SPORTBUK image asset guide

All dimensions below are **width × height in pixels**. These are recommended export sizes, not fixed upload requirements. The site resizes images responsively and usually uses `object-fit: cover`, so parts of an image may be cropped.

## Recommended sizes

| Asset / placement | Recommended export | Ratio | Composition notes |
| --- | --- | --- | --- |
| Homepage slideshow / main banner | **2400 × 1350** | 16:9 | Keep the left side quiet for the headline and button. Place the main subject near the center-right. |
| Product main photo | **1600 × 1600** | 1:1 | Center the whole product with 10–15% breathing room. Use consistent backgrounds and scale. |
| Product gallery / alternate views | **1600 × 1600** | 1:1 | Use the same canvas as the main photo. Include front, back, details, and color-specific views. |
| Category photo tile on Products page | **1200 × 750** | 16:10 | Center the subject; category labels appear outside the photo. |
| Collection image: shared across listing, homepage, and detail banner | **2400 × 1500** | 16:10 | Use a scene that survives both a tall homepage crop and a wide detail-banner crop. Keep important subjects near the center and leave the bottom clear for overlaid text. |
| Homepage collection tile, if preparing a dedicated design reference | **1600 × 1600** | 1:1 | The two tiles have equal width and a minimum height of 570px; their actual ratio changes with screen size. This is a composition reference, not a separate image field in the current app. |
| Homepage journal promo image | **1600 × 1200** | 4:3 | Center important kit or people. Display height is 520px on desktop and 360px on mobile; width varies. |
| Journal lead / article cover, shared image | **2000 × 1500** | 4:3 | Keep the subject centered; the lead section can crop differently from the article page. |
| Journal article cards | **1600 × 1200** | 4:3 | Cards use a fixed 4:3 frame. Avoid essential details close to the edges. |
| Sign-in / registration photo | **1200 × 1600** | 3:4 | Portrait composition works best in the desktop side panel. Center the subject. |

### Banner behavior on mobile

The homepage banner has a responsive, viewport-based height rather than a fixed 16:9 frame. On mobile it becomes tall and crops the same desktop image heavily, with `object-position: 62% center`. Text sits near the bottom.

- Keep the main subject around the horizontal 60–65% region of the desktop image.
- Avoid essential details along the outer edges or at the bottom where text appears.
- A dedicated **1200 × 1600** mobile banner would offer better composition, but the current slideshow uses one image per slide; a separate mobile file would require a code change.
- Do not bake headings or buttons into banner images; the app renders them separately.

## Current static asset files

Files live under `frontend/public/images/football/`. Their public URLs omit `frontend/public`.

| File | Used for | Recommended export |
| --- | --- | --- |
| `matchday.png` | Homepage slideshow, slide 1 | 2400 × 1350 |
| `training.png` | Homepage slideshow, slide 2 | 2400 × 1350 |
| `goalkeeper.png` | Homepage slideshow, slide 3 | 2400 × 1350 |
| `locker.png` | Homepage journal promo | 1600 × 1200 |
| `kit.png` | Journal lead and “Build a matchday kit” article | 2000 × 1500 |
| `gloves.png` | Journal card and goalkeeper-glove article | 1600 × 1200 |
| `shirts.png` | Journal card and football-shirt-care article | 1600 × 1200 |
| `tunnel.png` | Sign-in / registration side panel | 1200 × 1600 |

These filenames currently end in `.png`. Keep that format when replacing them directly. To use WebP or JPEG instead, update the corresponding image paths in the source as well.

## Admin-managed images

- **Products:** upload through Admin → Products → Preview images. One gallery supports up to **20 images**. Assign the correct color, alt text, and primary image.
- **Categories:** upload through Admin → Categories. Prepare a 16:10 image for the customer-facing category tile; the admin preview itself is square.
- **Collections:** upload through Admin → Collections. The same image is reused in the homepage tile, collection listing, and collection detail hero. There are no separate images for these placements.
- Bundled catalog photos live under `frontend/public/assets/images/catalog/`.
- Admin-uploaded image bytes live under `backend/uploads/`; database records store their URLs.

### Product crop editor

The admin crop tool exports a **square** image, up to **1200 × 1200**, without enlarging the cropped source region. It normally produces WebP at 90% quality, with PNG fallback when the browser does not support WebP export.

Use **Crop → drag or arrow keys → adjust Zoom → Use crop → Save product**. Applying a crop updates the gallery draft; saving the product uploads it.

## Format and file weight

Admin uploads accept **JPEG, PNG, GIF, and WebP**, with a hard limit of **5 MB per file**. Static public assets do not pass through that upload limit, but should still be compressed.

Suggested delivery targets, not enforced limits:

| Image type | Suggested file weight |
| --- | --- |
| Main banner / collection hero | 300–700 KB |
| Product photo / gallery image | 100–300 KB |
| Category tile | 80–200 KB |
| Journal / authentication photo | 150–400 KB |

- Prefer WebP or JPEG for photographs; use PNG when transparency or lossless detail is needed.
- Export in sRGB. Keep high-resolution originals separately.
- Use lowercase ASCII filenames with hyphens, such as `barcelona-home-front.webp`.
- Keep product backgrounds, framing, and lighting consistent across colors and views.

## Quick handoff list

For a new image batch, prepare:

1. **3 homepage banners:** 2400 × 1350 each.
2. **Product images:** 1600 × 1600 each, grouped by product and color.
3. **Category images:** 1200 × 750 each.
4. **Collection images:** 2400 × 1500 each, with center-safe composition.
5. **Homepage journal promo:** 1600 × 1200.
6. **Journal covers:** 2000 × 1500 for the lead; 1600 × 1200 for other articles.
7. **Authentication photo:** 1200 × 1600.

Layout references: `frontend/src/styles/global.css`, `frontend/src/components/home/HeroSlideshow.tsx`, and the home, collections, journal, and authentication pages. Upload limits: `backend/src/middleware/upload.js`.
