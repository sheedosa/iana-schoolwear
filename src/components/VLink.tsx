import type { ComponentProps, MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Link, useNavigate, type NavigateFunction } from "react-router-dom";

type Doc = Document & { startViewTransition?: (cb: () => void) => unknown };

const canTransition = () => typeof document !== "undefined" && !!(document as Doc).startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Change page and let shared elements travel (a school's tile, a product photo). Plain navigation where the browser
    has no view transitions, or under reduced motion. */
export function go(navigate: NavigateFunction, to: string) {
  if (!canTransition()) { navigate(to); return; }
  (document as Doc).startViewTransition!(() => flushSync(() => navigate(to)));
}

/** A link that carries shared elements across the page change. Falls back to a plain link on modified clicks. */
export function VLink({ to, onClick, ...rest }: ComponentProps<typeof Link> & { to: string }) {
  const navigate = useNavigate();
  const click = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!canTransition()) return;
    e.preventDefault();
    go(navigate, to);
  };
  return <Link to={to} onClick={click} {...rest} />;
}

/** The name a school's tile carries on a listing and on its own page, so one becomes the other. */
export const schoolVT = (slug: string) => ({ viewTransitionName: `school-${slug}` });
/** The same for a product's photo on a card and on its page. */
export const productVT = (handle: string) => ({ viewTransitionName: `product-${handle.replace(/[^a-zA-Z0-9_-]/g, "-")}` });

/** Scroll behaviour that respects reduced motion. */
export const scrollBehaviour = (): ScrollBehavior => (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
