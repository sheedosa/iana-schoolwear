# I&A Schoolwear storefront — guidance for Claude Code

Static React storefront (Vite + Tailwind) deployed to GitHub Pages; Shopify is the commerce backend via the Storefront API.

## Rules
1. **Facts come from `src/data/site.ts` and `src/data/catalogue.json`.** Never invent policies, prices, hours, delivery charges or claims. Anything not verified on iafashions.co.uk goes in `SITE.toConfirm`, not on the page.
2. **Commerce goes through `src/lib/shopify.ts` only.** Demo mode (catalogue JSON) and Shopify mode share one interface. Do not call Shopify from components.
3. **Every page sets `<Seo>`** (title, description, canonical, OG image, JSON-LD). `npm run build` prerenders all routes; check `dist/<route>/index.html` after adding a page and add it to `scripts/prerender.mjs`.
4. **No AI-generated children's faces.** Lifestyle imagery is shoulders-down or from behind.
5. **Follow the I&A brand guide 2022** (`docs/brand-guide-2022.pdf`):
   - Logo: official I & A Schoolwear lockups in `public/img/logo/brand/` (rebuilt SVG; replace with the client's originals when supplied). Never use another logo. Marque (I in a rectangle) for favicons and small spaces.
   - Colours: Ochre #45353a (text, dark areas), Sage #d8e2dc (section bands), White, School Blue #4169e1 (brand strip, panels, focus), School Yellow #ffde59 (primary buttons, Ochre text). Light Pink is the Fashions brand, not used here. School colours appear only on that school's page.
   - Type: Cormorant Garamond Bold for h1/h2 and display figures (sentence case). Agrandir for body and uppercase 0.15em-tracked labels; Lexend 400/500/600 stands in until the Agrandir web licence is bought (change `--font-sans` only). Caps labels are for controls, table heads and footer headings only, never as an eyebrow above a heading.
   - Corners: near-square (3px). No pills, no large radii, no drop shadows, no numbered markers, no card grids for prose, no middle-dot strings (write a sentence or use real structure).
6. Tap targets ≥ 44px; no horizontal overflow at 375px; body text 16px (12–14px only for uppercase labels, captions, legal lines).
7. **Schools are the core idea.** The finder is the one control; each school page leads with the one-tap essentials bundle (priced, photographed items only, sizes every item shares), then "From the school's uniform list" in two groups the data supports: "With the school crest" (products tagged `school:<slug>`) and "Plain items to go with it". Never label items compulsory or optional until the school's leaflet is in the data. Schools with fewer than three products online (`ONLINE_MIN`) are "In store" with a short visit page. School colours appear only on that school's page; Home and /schools use the Sage tiles in `public/img/tiles/sage/`, with one exception: the tile of the school the finder has matched takes its colour (`SchoolTile` `on`).
8. **Data hygiene lives in `tidyProduct()`** (`src/lib/shopify.ts`), used by both modes: one size vocabulary ("3–4 yrs"), spreadsheet-date repair, dedupe, descriptions trimmed to the last full sentence. `sizeMap` keeps the store's own option value for checkout; never send a display label to Shopify.
9. **Delivery and returns** are confirmed facts in `SITE.delivery` / `SITE.returns`; show them from there (header strip, product rows, footer line, `/delivery`). Never hard-code the figures in a page.
10. CSS: element and component rules live in `@layer base` / `@layer components` in `index.css` so utilities win; pressed chips use `.pill[aria-pressed="true"]`.

## Design system (v3)
- **Type scale:** one fluid scale in `index.css` (`--t-hero`, `--t-h1`, `--t-h2`, `--t-h3`, `--t-lede`, `--t-small`, with matching `.t-*` classes). `h1` and `h2` take their size from the base layer; never put a size utility on a heading. `.figure` is Cormorant for prices and totals. `.measure` caps a paragraph at 62 characters.
- **Motion:** tokens `--ease-out`, `--dur-1/2/3`. Motion answers an action (typing in the finder, choosing a size, opening the menu, basket or filters, changing page). The one unprompted moment is the home finder panel settling (`.rise`). Reduced motion switches all of it off.
- **The finder is the signature** (`src/components/SchoolFinder.tsx`). `SchoolFinder` is the hero on Home (`layout="rail"`: field, then the schools as tiles) and the whole of /schools (`layout="list"`); typing narrows the schools in place, the first match takes its school colour, Enter opens it. `SchoolSearch` is the compact drop-down version for the header and phone menu. Do not add a second way to choose a school.
- **Shared elements:** links into a school or product use `VLink` (or `go()`); the school's tile carries `schoolVT(slug)` and a product photo `productVT(handle)`, so the tile in the finder becomes the tile on the school page and a card photo becomes the product photo. Keep each name once per page.
- **Essentials bundle** reads as a packing list (`.packing`): the size is chosen once on the left, each line shows it, the total is the last line, then one button. Bundle selection logic in `SchoolPage.tsx` is unchanged.
- **Phones:** `StickyBar` shows the price and the action once the page's own button has scrolled away upwards and hides at the footer (school essentials, product page). Size chips use the `.sizes` grid (48px keys). The button stays enabled without a size and takes the shopper to the size chips.
- **Layout:** `.wrap` is 1200px; bands (Sage, Blue, Ochre) run full width; two-column sections use 5/7 or 7/5 splits. The header strip is a sentence, not a caps label. The footer opens with the delivery figures from `SITE`.

## Commands
```bash
npm run dev          # local
npm run build        # typecheck + vite build + prerender (needs Chromium; CI has it)
npm run build:spa    # build without prerender
```
