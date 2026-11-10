import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { useCart } from "../lib/cart";
import { SchoolSearch } from "./SchoolFinder";
import { useEffect, useState } from "react";
import { storefront } from "../lib/shopify";
import { SITE } from "../data/site";

const nav = [
  { to: "/schools", label: "Schools" },
  { to: "/collections/boys", label: "Boys" },
  { to: "/collections/girls", label: "Girls" },
  { to: "/collections/pe-kit", label: "PE kit" },
  { to: "/collections/bags", label: "Bags" },
  { to: "/size-guide", label: "Size guide" },
  { to: "/delivery", label: "Delivery" },
];

export function Header() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenu(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menu]);
  const d = SITE.delivery;
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      {/* One strip: the delivery message on the left, the preview tag on the right. */}
      <div className="on-dark bg-blue text-white">
        <div className="wrap flex h-9 items-center justify-between gap-3">
          <Link to="/delivery" className="t-small relative flex h-9 min-w-0 items-center underline-offset-4 after:absolute after:inset-x-0 after:-bottom-2 after:top-0 hover:underline"><span className="truncate">
            <span className="sm:hidden">Free delivery from £{d.freeOver}</span>
            <span className="hidden sm:inline lg:hidden">Free delivery from £{d.freeOver}, or drop-off to school for £{d.schoolDropOff}</span>
            <span className="hidden lg:inline">Free delivery from £{d.freeOver}, drop-off to your child's school for £{d.schoolDropOff}, or click and collect in Tooting</span>
          </span></Link>
          {storefront.mode === "demo" && (
            <span className="label shrink-0 rounded-[3px] border border-white/80 px-2 py-0.5 text-[0.6875rem] leading-none" title="Preview catalogue: checkout opens once the shop is connected">Preview</span>
          )}
        </div>
      </div>
      <div className="wrap flex h-16 items-center gap-2.5 sm:gap-6 lg:h-[72px]">
        <Link to="/" aria-label="I&A Schoolwear home" className="inline-flex min-h-11 min-w-0 shrink items-center lg:shrink-0"><Logo className="h-auto max-h-7 w-full max-w-[200px] object-contain object-left sm:max-w-[233px]" /></Link>
        <nav aria-label="Main" className="label hidden items-center gap-4 whitespace-nowrap text-xs lg:flex xl:gap-6">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `inline-flex min-h-11 items-center border-b-2 border-t-2 border-t-transparent ${isActive ? "border-b-ink" : "border-b-transparent hover:border-b-ink/30"}`}>{n.label}</NavLink>
          ))}
        </nav>
        <div className="ml-auto hidden w-[230px] lg:block xl:w-[300px]"><SchoolSearch id="school-finder-header" /></div>
        <button type="button" onClick={() => setOpen(true)} className="label relative ml-auto inline-flex min-h-11 shrink-0 items-center rounded-pill border border-ink/25 bg-white px-3 hover:border-ink sm:px-4 lg:ml-2" aria-label={`Basket, ${count} ${count === 1 ? "item" : "items"}`}>
          Basket{count > 0 && <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-pill bg-sun px-1.5 text-xs font-medium tracking-normal">{count}</span>}
        </button>
        <button type="button" onClick={() => setMenu(!menu)} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-ink/25 bg-white lg:hidden" aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? "Close menu" : "Menu"}>
          {menu ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          )}
        </button>
      </div>
      {menu && (
        <div id="mobile-menu" className="panel-in absolute inset-x-0 top-full max-h-[calc(100dvh-6.25rem)] overflow-y-auto border-y border-ink bg-white lg:hidden">
          <div className="wrap pb-6 pt-4">
            <SchoolSearch id="school-finder-menu" onGo={() => setMenu(false)} />
            <nav aria-label="Main" className="mt-4 grid grid-cols-2 gap-x-6 border-t border-ink">
              {[...nav, { to: "/about", label: "About" }].map((n) => (
                <NavLink key={n.to} to={n.to} onClick={() => setMenu(false)} className={({ isActive }) => `flex min-h-12 items-center border-b border-line text-lg ${isActive ? "font-medium" : ""}`}>{n.label}</NavLink>
              ))}
            </nav>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink w-full">Call {SITE.phone}</a>
              <p className="text-ink/75">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
