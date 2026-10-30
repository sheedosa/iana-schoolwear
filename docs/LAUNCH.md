# I&A Schoolwear — launch checklist

Target: live on the client's domain between 9 and 16 November 2026. Work top to bottom; a step is done when the box is ticked and the check beside it passes.

## 1. From the client (blocking)

- [ ] **Shopify store access**: Shopify admin invite for the schoolwear store, or a Storefront API access token with `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`.
- [ ] **Products in Shopify**: the 78 products in `src/data/catalogue.json` exist in Shopify with the same handles, prices, sizes as variants, and a `school:<slug>` tag each. (Check: `npm run sync:brand` in the platform repo lists 78 products with a school.)
- [ ] **Collections in Shopify**: one collection per school (handle = school slug) and per product type, matching `COLLECTIONS` in `src/lib/shopify.ts`.
- [ ] **Policies**: delivery charges and cut-off times; returns window for plain items; exchange policy for embroidered items; which items each school lists as compulsory. These replace the entries in `SITE.toConfirm` and the copy in `About.tsx`, `ProductPage.tsx`.
- [ ] **Original logo files** (AI/EPS/SVG) for I&A Schoolwear and the marque, to replace the rebuilt SVGs in `public/img/logo/brand/`.
- [ ] **Agrandir web licence** (or a decision to keep Lexend). Swap by changing `--font-sans` in `src/index.css` only.
- [ ] **School crests** for Gatton, St Andrew's, Vauxhall and Penwortham, with written permission to show them.
- [ ] **Domain**: which hostname goes live (e.g. `shop.iafashions.co.uk` or `iaschoolwear.co.uk`) and DNS access.
- [ ] **Contact email** for the site footer and order queries (`SITE.email` is empty).

## 2. Switch to live Shopify

- [ ] Add repository secrets `VITE_SHOPIFY_DOMAIN` (e.g. `ia-schoolwear.myshopify.com`) and `VITE_SHOPIFY_STOREFRONT_TOKEN`. Empty values keep the preview catalogue.
- [ ] Push to `main`; the deploy workflow builds with the secrets. Confirm on the live site that the basket says "Shopify" in the footer debug line and that **Checkout** opens a `checkout.shopify.com` URL.
- [ ] Place a test order with Shopify's Bogus Gateway, then refund it.
- [ ] Confirm out-of-stock variants show "Out of stock online" and cannot be added.
- [ ] Confirm prices on three product pages match Shopify exactly (including a size-dependent price).

## 3. Domain cut-over

- [ ] Add `public/CNAME` with the hostname; set `base` in `vite.config.ts` to `/` and `basename` in `main.tsx` to `/`; update `SITE.url`, `robots.txt` sitemap line and `scripts/prerender.mjs` origin.
- [ ] DNS: CNAME the hostname to `sheedosa.github.io` (or the client's org Pages host); enable **Enforce HTTPS** in Pages settings once the certificate issues.
- [ ] Redirect the old `iafashions.co.uk/product-category/schoolwear/` URLs (WordPress) to the new school and product pages, or at least to `/schools`. List the top 20 old URLs from Search Console first.
- [ ] Re-run `npm run build` and spot-check `dist/sitemap.xml` and `dist/llms.txt` carry the new origin.
- [ ] Submit the sitemap in Google Search Console; verify the property with the DNS TXT record.

## 4. Pre-launch checks (run after the domain switch)

- [ ] Lighthouse on home, a school page, a product page: Performance ≥ 90 mobile, Accessibility ≥ 95, SEO 100.
- [ ] No console errors on any route (`scripts/prerender.mjs` logs them during build).
- [ ] 375px pass: no horizontal scroll on home, schools, a school page, a collection, a product, size guide, basket.
- [ ] Share preview: paste the home and one product URL into the OpenGraph debugger; image, title and description show.
- [ ] Forms: contact details on the About page are correct (84 Mitcham Road, 020 8767 8613, Mon–Sun 9–6).
- [ ] 404 page works for a wrong URL and keeps the header and footer.

## 5. Launch day

- [ ] Final `git tag v1.1.0-live`.
- [ ] Client walkthrough (30 min): how orders arrive in Shopify, how to mark a product out of stock, how to add a product to a school.
- [ ] Hand over `docs/HANDOVER.md` (platform repo) and this checklist with the ticks.
- [ ] 14 days' support starts: log issues in GitHub Issues, label `launch-support`.

## 6. After launch

- [ ] Hub connection: add the store to the I&A Hub via `npm run sync:brand -- --add` (platform repo) so the daily brief and order triage cover schoolwear.
- [ ] Month 1 review: Search Console queries by school name, top products, basket abandonment in Shopify analytics.
