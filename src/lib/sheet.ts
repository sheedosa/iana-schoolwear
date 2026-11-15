import { useEffect, useRef } from "react";

/** What a basket or a size guide needs while it is open: the page behind stays still, and the phone's Back
    gesture (or the browser's Back button) closes it instead of leaving the page. Escape and focus are the
    sheet's own business. `id` names the sheet in the history entry it adds. */
export function useSheet(open: boolean, close: () => void, id: string) {
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    // Hold the page still. Where the scrollbar takes room (desktop), keep that room so nothing shifts sideways.
    const gap = window.innerWidth - root.clientWidth;
    root.classList.add("locked");
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    // One history entry for the open sheet. It copies the router's own state, so the router sees the same page.
    let pushed = false;
    const timer = window.setTimeout(() => {
      window.history.pushState({ ...(window.history.state ?? {}), sheet: id }, "");
      pushed = true;
    }, 0);
    const onPop = () => { pushed = false; closeRef.current(); };
    window.addEventListener("popstate", onPop);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("popstate", onPop);
      root.classList.remove("locked");
      document.body.style.paddingRight = "";
      // Closed by its button, Escape or a tap outside: take the sheet's entry back out of the history.
      if (pushed && (window.history.state as { sheet?: string } | null)?.sheet === id) window.history.back();
    };
  }, [open, id]);
}
