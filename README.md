# I&A Schoolwear — storefront

Parent-first school uniform store for I&A (Stockwell, London). Static React site, deployed to GitHub Pages, with Shopify as the commerce backend through the Storefront API.

**Preview:** https://sheedosa.github.io/iana-schoolwear/

## How it works

- `src/lib/shopify.ts` is the only place that talks to commerce. With `VITE_SHOPIFY_DOMAIN` and `VITE_SHOPIFY_STOREFRONT_TOKEN` set it uses the Shopify Storefront API (products, collections, cart, checkout URL). Without them it runs on the preview catalogue in `src/data/catalogue.json` with a local basket.
- Every page is keyed by **school**: products carry a `school:<slug>` tag (set the same tag in Shopify) and `productType` drives the collections. School metadata (name, colour, tint, tile) lives in `catalogue.json` and stays in the repo.
- Images are in `public/img` (WebP, web-sized). Generated with Higgsfield from the client's real garments; see `docs/` in the platform repo for the asset system.

## Run locally

```bash
npm install
npm run dev
```

## Version 1 demo notes

- All copy, prices, hours and company details were checked against iafashions.co.uk on 25 Oct 2026 (`src/data/site.ts`). Product prices and stock come from the live WooCommerce catalogue on that date.
- Still to confirm with the client before launch: delivery charges and cut-offs, returns window, exchange policy for embroidered items, which items each school lists as compulsory, logo files for Gatton, St Andrew's, Vauxhall and Penwortham.
- 23 products have no photo on the current site; they show a school-tinted placeholder until photographed or generated.
- Checkout in demo mode shows a notice; with Shopify connected it goes to Shopify's hosted checkout.

## SEO and AI engines

Every route is prerendered to static HTML (`scripts/prerender.mjs`): per-page title, description, canonical, Open Graph and Twitter cards with a 1200×630 image, JSON-LD (ClothingStore with logo and opening hours, WebSite with SearchAction, BreadcrumbList, Product with Offer), `sitemap.xml`, `robots.txt` allowing GPTBot, ClaudeBot, PerplexityBot and others, and `llms.txt` summarising the business for AI assistants.

## Go live on Shopify

1. In Shopify admin: Settings → Apps and sales channels → Develop apps → create app → Storefront API scopes `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`.
2. Add the token and domain as repository secrets `VITE_SHOPIFY_STOREFRONT_TOKEN` and `VITE_SHOPIFY_DOMAIN` (e.g. `iana-schoolwear.myshopify.com`).
3. Tag products `school:heathbrook` etc., set Product type (Sweatshirts, Knitwear, PE kit, Bags, Blazers, Trousers & shorts, Shirts, Polo shirts, Skirts & dresses, Accessories) and a Size option.
4. Push to `main`. The Action rebuilds and the site switches to live data; checkout goes to Shopify's hosted checkout.

Custom domain: set `VITE_BASE=/` in the workflow env and add a `CNAME` file in `public/`.
