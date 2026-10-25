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

## Go live on Shopify

1. In Shopify admin: Settings → Apps and sales channels → Develop apps → create app → Storefront API scopes `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`.
2. Add the token and domain as repository secrets `VITE_SHOPIFY_STOREFRONT_TOKEN` and `VITE_SHOPIFY_DOMAIN` (e.g. `iana-schoolwear.myshopify.com`).
3. Tag products `school:heathbrook` etc., set Product type (Sweatshirts, Knitwear, PE kit, Bags, Blazers, Trousers & shorts, Shirts, Polo shirts, Skirts & dresses, Accessories) and a Size option.
4. Push to `main`. The Action rebuilds and the site switches to live data; checkout goes to Shopify's hosted checkout.

Custom domain: set `VITE_BASE=/` in the workflow env and add a `CNAME` file in `public/`.
