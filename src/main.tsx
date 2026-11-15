import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { preload } from "./lib/preload";

// GitHub Pages SPA fallback: 404.html redirects to /?p=<path>; restore it before React mounts.
const params = new URLSearchParams(window.location.search);
const p = params.get("p");
if (p) window.history.replaceState(null, "", import.meta.env.BASE_URL.replace(/\/$/, "") + p);

// The prerendered page stays on screen until the schools and products are in hand, so React's first render
// is the same finished page and nothing moves when it takes over.
void preload().then(() => {
  createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
  document.documentElement.removeAttribute("data-rerouting");
});
