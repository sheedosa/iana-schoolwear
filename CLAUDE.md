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
6. Tap targets ≥ 44px; no horizontal overflow at 375px; body text 16px.

## Commands
```bash
npm run dev          # local
npm run build        # typecheck + vite build + prerender (needs Chromium; CI has it)
npm run build:spa    # build without prerender
```
