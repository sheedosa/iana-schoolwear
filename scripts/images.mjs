// Pre-build: cut each product photo in public/img/products to the widths the pages show it at, so a 64px
// thumbnail is a few KB and not the full-size file. Output goes to public/img/products/w/<name>-<width>.webp
// (ignored by git: the build makes it). Skips files that are already up to date.
// The widths must match WIDTHS in src/lib/img.ts.
import sharp from "sharp";
import { readdirSync, mkdirSync, statSync, existsSync } from "node:fs";
import { join, parse } from "node:path";

const WIDTHS = [128, 192, 320, 640];
const src = new URL("../public/img/products/", import.meta.url).pathname;
const out = join(src, "w");
mkdirSync(out, { recursive: true });

let made = 0, kept = 0;
for (const file of readdirSync(src)) {
  if (!/\.(webp|png|jpe?g)$/i.test(file)) continue;
  const from = join(src, file);
  const mtime = statSync(from).mtimeMs;
  for (const w of WIDTHS) {
    const to = join(out, `${parse(file).name}-${w}.webp`);
    if (existsSync(to) && statSync(to).mtimeMs >= mtime) { kept++; continue; }
    await sharp(from)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: w <= 192 ? 78 : 80, effort: 5 })
      .toFile(to);
    made++;
  }
}
console.log(`images: ${made} made, ${kept} already up to date, widths ${WIDTHS.join(", ")}`);
