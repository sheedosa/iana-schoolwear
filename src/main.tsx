import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// GitHub Pages SPA fallback: 404.html redirects to /?p=<path>; restore it before React mounts.
const params = new URLSearchParams(window.location.search);
const p = params.get("p");
if (p) window.history.replaceState(null, "", import.meta.env.BASE_URL.replace(/\/$/, "") + p);

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
