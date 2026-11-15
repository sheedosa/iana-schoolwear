import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { existsSync } from "node:fs";
import { extname, join } from "node:path";

const base = process.env.VITE_BASE ?? "/iana-schoolwear/";

// The two font files the first screen needs (Fredoka for the heading, Lexend for the text) are fetched
// alongside the stylesheet instead of after it. They are self-hosted: see the @font-face rules in index.css.
const preloadFonts = (): Plugin => ({
  name: "preload-fonts",
  transformIndexHtml: {
    order: "post",
    handler(_html, ctx) {
      return Object.keys(ctx.bundle ?? {})
        .filter((f) => /(fredoka|lexend)-latin-wght-normal[^/]*\.woff2$/.test(f))
        .sort()
        .map((f) => ({ tag: "link", attrs: { rel: "preload", as: "font", type: "font/woff2", href: base + f, crossorigin: "" }, injectTo: "head" as const }));
    },
  },
});

// `vite preview` only: answer /schools/heathbrook with the prerendered dist/schools/heathbrook/index.html, as
// GitHub Pages does (it redirects to the folder). Without this the preview serves the Home page for every route.
const previewPrerendered = (): Plugin => ({
  name: "preview-prerendered",
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      const [path, query] = (req.url ?? "").split("?");
      if (path.startsWith(base) && !extname(path) && !path.endsWith("/") && existsSync(join(server.config.root, server.config.build.outDir, path.slice(base.length), "index.html"))) {
        req.url = `${path}/${query ? `?${query}` : ""}`;
      }
      next();
    });
  },
});

// GitHub Pages serves the site at /<repo>/ — set VITE_BASE=/ for a custom domain.
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFonts(), previewPrerendered()],
  base,
});
