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
   - Type: Cormorant Garamond Bold for h1/h2 (sentence case). Agrandir for body and uppercase 0.15em-tracked labels; Lexend stands in until the Agrandir web licence is bought (change `--font-sans` only). Thin weight only at 18px and above.
   - Corners: near-square (3–6px). No pills, no large radii. No numbered markers, no card grids for prose, motion only in response to a user action.
6. Tap targets ≥ 44px; no horizontal overflow at 375px; body text 16px (12–14px only for uppercase labels, captions, legal lines).
7. **Schools are the core idea.** The finder is the one control; each school page leads with the one-tap essentials bundle (priced, photographed items only, sizes every item shares), then "From the school's uniform list" in two groups the data supports: "With the school crest" (products tagged `school:<slug>`) and "Plain items to go with it". Never label items compulsory or optional until the school's leaflet is in the data. Schools with fewer than three products online (`ONLINE_MIN`) are "In store" with a short visit page. School colours appear only on that school's page; Home and /schools use the Sage tiles in `public/img/tiles/sage/`.
8. **Data hygiene lives in `tidyProduct()`** (`src/lib/shopify.ts`), used by both modes: one size vocabulary ("3–4 yrs"), spreadsheet-date repair, dedupe, descriptions trimmed to the last full sentence. `sizeMap` keeps the store's own option value for checkout; never send a display label to Shopify.
9. **Delivery and returns** are confirmed facts in `SITE.delivery` / `SITE.returns`; show them from there (header strip, product rows, footer line, `/delivery`). Never hard-code the figures in a page.
10. CSS: element and component rules live in `@layer base` / `@layer components` in `index.css` so utilities win; pressed chips use `.pill[aria-pressed="true"]`.

## Commands
```bash
npm run dev          # local
npm run build        # typecheck + vite build + prerender (needs Chromium; CI has it)
npm run build:spa    # build without prerender
```
