// Post-build: render every route to static HTML inside dist/ so GitHub Pages serves real pages
// (titles, meta, JSON-LD and content) to Google, social scrapers and AI crawlers. Also writes sitemap.xml and llms.txt.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const BASE = "/iana-schoolwear";
const SITE = "https://sheedosa.github.io" + BASE;
const dist = new URL("../dist/", import.meta.url).pathname;
const cat = JSON.parse(readFileSync(new URL("../src/data/catalogue.json", import.meta.url)));

const routes = ["/", "/schools", "/size-guide", "/about",
  ...cat.schools.map((s) => `/schools/${s.slug}`),
  ...["boys", "girls", "pe-kit", "bags", "blazers", "all"].map((c) => `/collections/${c}`),
  ...cat.products.map((p) => `/products/${p.handle}`)];

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json", ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml", ".webmanifest": "application/manifest+json" };
const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]).replace(BASE, "") || "/";
  let f = join(dist, p);
  if (!existsSync(f) || statSync(f).isDirectory()) f = join(dist, "index.html");
  res.setHeader("Content-Type", types[extname(f)] ?? "application/octet-stream");
  res.end(readFileSync(f));
}).listen(4999);

const exe = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort()); // fonts aren't needed for markup
let n = 0;
for (const r of routes) {
  await page.goto(`http://localhost:4999${BASE}${r}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector("h1") && !document.body.innerText.includes("Loading"), null, { timeout: 10000 }).catch(() => {});
  let html = await page.content();
  html = html.replace("<html", '<html data-prerendered="1"'); // informational only
  const out = r === "/" ? join(dist, "index.html") : join(dist, r.slice(1), "index.html");
  mkdirSync(join(out, ".."), { recursive: true });
  writeFileSync(out, "<!doctype html>\n" + html.replace(/^<!doctype html>\s*/i, ""));
  n++;
}
await browser.close(); server.close();

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${SITE}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod><changefreq>${r.startsWith("/products") ? "weekly" : "monthly"}</changefreq><priority>${r === "/" ? "1.0" : r.startsWith("/schools/") ? "0.9" : "0.7"}</priority></url>`).join("\n")}\n</urlset>\n`);

const schools = cat.schools.map((s) => `- [${s.name}](${SITE}/schools/${s.slug}): ${s.area}, ${s.productCount} embroidered items`).join("\n");
writeFileSync(join(dist, "llms.txt"), `# I&A Schoolwear

> Family-run school uniform and clothing shop at 84 Mitcham Road, Tooting, London SW17 9NG, trading since 1993. Supplies embroidered uniform to nine south London schools and plain school basics for any school. In-house embroidery, eco uniform range, Klarna Pay in 3, click and collect. Open Monday to Sunday 9am to 6pm. Phone 020 8767 8613.

## Schools supplied
${schools}

## Collections
- [Boys](${SITE}/collections/boys)
- [Girls](${SITE}/collections/girls)
- [PE kit](${SITE}/collections/pe-kit)
- [Bags](${SITE}/collections/bags)
- [Blazers](${SITE}/collections/blazers)
- [All uniform](${SITE}/collections/all)

## Help
- [Size guide](${SITE}/size-guide): measure by height, chest, waist and inside leg; size up if between sizes
- [About, delivery, returns, eco uniform](${SITE}/about)

## Facts
- Legal name: I & A Fashions Limited, trading as I & A School Uniform. Company number 07202123.
- Member of the Schoolwear Association and the Federation of Small Businesses.
- Embroidered items are made to order and cannot be returned unless faulty. Plain items can be returned within 14 days.
- Prices are in GBP and include VAT. Product pages carry schema.org Product data.
`);
console.log(`prerendered ${n} routes, sitemap + llms.txt written`);
