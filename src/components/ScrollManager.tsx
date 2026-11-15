import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Where the reader was on each page they have been to in this tab. A new page starts at the top (or at its
// #anchor); Back and Forward return to the place they left. Kept for the tab's lifetime in sessionStorage.
const STORE = "iana-scroll";
const seen = new Map<string, number>();
try { for (const [k, v] of Object.entries(JSON.parse(sessionStorage.getItem(STORE) ?? "{}") as Record<string, number>)) seen.set(k, v); } catch { /* nothing kept */ }
const keep = () => { try { sessionStorage.setItem(STORE, JSON.stringify(Object.fromEntries([...seen].slice(-60)))); } catch { /* ignore */ } };

/** Land on an #anchor. If its element is not on the page yet (the live shop is still answering), wait for it. */
function toAnchor(hash: string) {
  const land = () => { const el = document.getElementById(decodeURIComponent(hash.slice(1))); el?.scrollIntoView({ block: "start" }); return !!el; };
  if (land()) return;
  const main = document.getElementById("main");
  if (!main) return;
  const watch = new MutationObserver(() => { if (land()) stop(); });
  const timer = window.setTimeout(() => stop(), 4000);
  function stop() { watch.disconnect(); window.clearTimeout(timer); }
  watch.observe(main, { childList: true, subtree: true });
  return stop;
}

export function ScrollManager() {
  const { key, pathname, hash } = useLocation();
  const type = useNavigationType();
  const id = `${key}:${pathname}`;

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.addEventListener("pagehide", keep);
    return () => window.removeEventListener("pagehide", keep);
  }, []);

  // Note the position as the reader scrolls: one read per frame, nothing else.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; seen.set(id, window.scrollY); }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, [id]);

  useLayoutEffect(() => {
    if (type === "POP") {
      // The first page of a visit counts only when it is a reload or a step back into the site.
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const fresh = key === "default" && nav?.type !== "reload" && nav?.type !== "back_forward";
      const y = fresh ? undefined : seen.get(id);
      if (y !== undefined) { window.scrollTo(0, y); return; }
      if (!hash) { window.scrollTo(0, 0); return; }
      return toAnchor(hash);
    }
    if (!hash) { window.scrollTo(0, 0); return; }
    return toAnchor(hash);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
