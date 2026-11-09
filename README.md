# I&A Schoolwear — storefront

Parent-first school uniform store for I&A (Stockwell, London). Static React site, deployed to GitHub Pages, with Shopify as the commerce backend through the Storefront API.

**Preview:** https://sheedosa.github.io/iana-schoolwear/

## How it works

- `src/lib/shopify.ts` is the only place that talks to commerce. With `VITE_SHOPIFY_DOMAIN` and `VITE_SHOPIFY_STOREFRONT_TOKEN` set it uses the Shopify Storefront API (products, collections, cart, checkout URL). Without them it runs on the preview catalogue in `src/data/catalogue.json` with a local basket.
- Every page is keyed by **school**: products carry a `school:<slug>` tag (set the same tag in Shopify) and `productType` drives the collections. School metadata (name, colour, tint, tile) lives in `catalogue.json` and stays in the repo.
- Images are in `public/img` (WebP, web-sized). Product and lifestyle imagery made from the client's real garments (disclosed in the footer).

## Run locally

```bash
npm install
npm run dev
```

## Version 1 demo notes

- All copy, prices, hours and company details were checked against iafashions.co.uk on 25 Oct 2026 (`src/data/site.ts`). Product prices and stock come from the live WooCommerce catalogue on that date.
- Confirmed by the client (Nov 2026) and in `SITE`: standard delivery £4.95 (5 working days), express £7.95 (48 hours), free over £100, drop-off to the child's school £2, click and collect; 28-day returns (suits, bridal and prom excluded group-wide); embroidered items exchanged for the same item in a different size. See `/delivery`.
- Still to confirm: see `SITE.toConfirm` (cut-off times, school drop-off details, refunds on embroidered items, the official school list, each school's uniform leaflet, crest artwork).
- School pages group items as "With the school crest" and "Plain items to go with it". Which items are compulsory waits for each school's leaflet.
- St Andrew's, Vauxhall and Penwortham have no stock online and show as "In store".
- 23 products have no photo on the current site; they show a designed tile (school colour, garment drawn in line, name in caps) until photographed.
- Checkout in demo mode shows a notice; with Shopify connected it goes to Shopify's hosted checkout.

## Brand

Follows the I&A brand guide 2022 (in `docs/`): official Schoolwear lockups rebuilt as outlined SVG from the guide (`public/img/logo/brand/`, regenerate with `docs/logo.py`), Ochre / Sage / School Blue / School Yellow palette, Cormorant Garamond headings, uppercase tracked labels. Agrandir is a commercial font (Pangram Pangram); Lexend is the stand-in until a web licence is bought.

## SEO and AI engines

Every route is prerendered to static HTML (`scripts/prerender.mjs`): per-page title, description, canonical, Open Graph and Twitter cards with a 1200×630 image, JSON-LD (ClothingStore with logo and opening hours, WebSite with SearchAction, BreadcrumbList, Product with Offer), `sitemap.xml`, `robots.txt` allowing GPTBot, ClaudeBot, PerplexityBot and others, and `llms.txt` summarising the business for AI assistants.

## Go live on Shopify

1. In Shopify admin: Settings → Apps and sales channels → Develop apps → create app → Storefront API scopes `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`.
2. Add the token and domain as repository secrets `VITE_SHOPIFY_STOREFRONT_TOKEN` and `VITE_SHOPIFY_DOMAIN` (e.g. `iana-schoolwear.myshopify.com`).
3. Tag products `school:heathbrook` etc., set Product type (Sweatshirts, Knitwear, PE kit, Bags, Blazers, Trousers & shorts, Shirts, Polo shirts, Skirts & dresses, Accessories) and a Size option.
4. Push to `main`. The Action rebuilds and the site switches to live data; checkout goes to Shopify's hosted checkout.

Custom domain: set `VITE_BASE=/` in the workflow env and add a `CNAME` file in `public/`.
