# I&A Schoolwear storefront — guidance for Claude Code

Static React storefront (Vite + Tailwind) deployed to GitHub Pages; Shopify is the commerce backend via the Storefront API.
Version 4: **the shop is an order form.** A parent has a list and wants it done. Every page is rows, sizes and one button.

## Rules
1. **Facts come from `src/data/site.ts` and `src/data/catalogue.json`.** Never invent policies, prices, hours, delivery charges, stock levels or claims. Anything not verified on iafashions.co.uk goes in `SITE.toConfirm`, not on the page. There is no peak-season notice in `SITE`: do not write one.
2. **Commerce goes through `src/lib/shopify.ts` and `src/lib/cart.tsx` only.** Demo mode (catalogue JSON) and Shopify mode share one interface. Do not call Shopify from components. Adding several sizes calls the basket's own `add(handle, size, qty)` once per size, in order (`OrderTable`).
3. **Every page sets `<Seo>`** (title, description, canonical, OG image, JSON-LD). `npm run build` prerenders all routes; check `dist/<route>/index.html` after adding a page and add it to `scripts/prerender.mjs`.
4. **Pictures are the shop's own product photos, shown as cut-outs** (64px in a row, 320px on the product page). No lifestyle photographs, no hero image, no banners, no generated pictures, no children's faces. A product with no photo gets a small garment outline in its row and no picture column on its page. The share image is built by `/home/claude/builds/v4/iana-schoolwear/_scripts/og.cjs` from the lockup and type.
5. **Look:**
   - Logo: the official I & A Schoolwear lockups in `public/img/logo/brand/` (white on the blue bar). They do not change. Cormorant exists only inside the lockup.
   - Colours (tokens in `index.css`): White ground; School Blue `#4169e1` for the bar, field borders, table rules and focus; `#2f55c8` for link text and pressed keys; Blue tint `#edf1fd` for hover, the chosen school and a size line with a quantity; line `#cfd6ea`; Ochre `#45353a` text, `#665359` secondary text. School Yellow `#ffde59` is the add-to-basket button and the basket count, nothing else. No Sage, no brown bands, no dark footer.
   - Type: Lexend only. Headings 600 (h1 26 to 32px, h2 20 to 22px, h3 17px), body 16px/400, prices in tabular figures (`.num`). Sentence case everywhere, buttons included. No caps labels, no eyebrows, no italics.
   - Shape: 6px corners on controls (`rounded-ctl`), 2px blue borders on fields and steppers, a 2px blue rule on top of a table and 1px lines between rows. No tiles, no cards, no shadows, no gradients, no pills, no arrows on links, no middle-dot strings.
6. Tap targets ≥ 44px; no horizontal overflow at 375px; body text 16px (14px only for table heads, meta lines and the legal line).
7. **Schools are the core idea, and the header is the school search** (`SchoolSearch` in `src/components/SchoolFinder.tsx`): a solid blue bar with the lockup, the field and the basket. Do not put category links in the bar and do not add a second way to search. `SchoolTable` (Home, /schools, 404) is the same list written out: mark, name, area, "N items online" or "In store only". Under the bar, one white line names the chosen school and links to "Change school"; the choice is saved on the device (`src/lib/school.tsx`, key `iana-school`) and is made by picking a school or opening its page.
   - A school's mark (`SchoolMark`) is a real photo of one of its crested garments where one is online, otherwise its initials on the school colour; schools that are in store only get an outlined mark.
   - A school page: the essentials (priced, photographed crested items; sizes every item shares; one size chosen once; rows with one total and one button; bundle logic in `SchoolPage.tsx` is unchanged), then "From the school's uniform list" in the two groups the data supports: "With the school crest" and "Plain items to go with it". Never label items compulsory or optional until the school's leaflet is in the data. Schools with fewer than three products online (`ONLINE_MIN`) keep their short in-store page.
8. **The product unit is a row** (`ProductRow`): picture, name, size range, price, Add. "Add" opens the size and quantity table under the row; an item with one size or none is added with one tap. There is no product card and no grid: do not bring one back. Listings (`Collection.tsx`) are grouped by garment type with sticky group heads and a jump-list; `/collections/plain` is every item without a crest.
9. **The product page is the size and quantity table** (`OrderTable`): one line per size with a stepper, a "Size guide" link in the table head, then one yellow button that says how many and how much ("Add 3 to basket, £29.97"; "from" when prices vary by size, because the data has only a minimum and maximum). The button stays enabled with nothing chosen and asks for a quantity. The total and button stick to the bottom of the screen while the table is in view. The fitting line ("bring your child to the shop and we measure them: no appointment needed") sits under the table.
10. **Data hygiene lives in `tidyProduct()`** (`src/lib/shopify.ts`), used by both modes. `sizeMap` keeps the store's own option value for checkout; never send a display label to Shopify.
11. **Delivery and returns** are confirmed facts in `SITE.delivery` / `SITE.returns`; show them from there: one sentence on Home, the rows on every product page, the side column of a school page, the basket, and `/delivery`. Never hard-code the figures in a page. There is no header strip.
12. **Phones:** a fixed bottom bar with Schools, Plain basics and Basket (with the count) (`TabBar`). The header is not sticky on phones. Sticky totals sit above the bar (`--tabbar`) and the footer pads itself so its last line clears it.
13. **Footer:** white, a 2px blue rule, three lines (the shop, the links, the legal line with the imagery disclosure). No columns, no figures, no lockup.
14. **Voice:** instructions. "Pick the school." "Choose one size for all three, then add them together." No slogans, no paired-phrase headings, no benefit lines repeated across pages.
15. CSS: element and component rules live in `@layer base` / `@layer components` in `index.css` so utilities win. Motion answers an action (the school list opening, the basket, a row's sizes, changing page with `VLink`); there is no unprompted motion. Reduced motion switches all of it off. Shared elements: the school's mark (`schoolVT`) and a product's picture (`productVT`), one name per page.

## Commands
```bash
npm run dev          # local
npm run build        # typecheck + vite build + prerender (needs Chromium; CI has it)
npm run build:spa    # build without prerender
node /home/claude/builds/v4/iana-schoolwear/_scripts/basket.cjs   # basket tests against `vite preview --port 4411`
```
