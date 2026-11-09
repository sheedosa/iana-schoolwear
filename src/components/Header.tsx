import { Link, NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { useCart } from "../lib/cart";
import { SchoolFinder } from "./SchoolFinder";
import { useState } from "react";
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
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      {/* One strip: the message on the left, the preview tag on the right. */}
      <div className="bg-blue text-white">
        <div className="wrap flex h-9 items-center justify-between gap-3">
          <Link to="/delivery" className="label truncate text-[0.6875rem] hover:underline sm:text-xs">
            <span className="sm:hidden">Free delivery from £{SITE.delivery.freeOver}</span>
            <span className="hidden sm:inline lg:hidden">Free delivery from £{SITE.delivery.freeOver} · School drop-off £{SITE.delivery.schoolDropOff}</span>
            <span className="hidden lg:inline">Free delivery from £{SITE.delivery.freeOver} · Drop-off to your child's school £{SITE.delivery.schoolDropOff} · Click and collect in Tooting</span>
          </Link>
          {storefront.mode === "demo" && (
            <span className="label shrink-0 rounded-[3px] border border-white/80 px-2 py-0.5 text-[0.6875rem] leading-none" title="Preview catalogue: checkout opens once the shop is connected">Preview</span>
          )}
        </div>
      </div>
      <div className="wrap flex h-[72px] items-center gap-3 sm:gap-6">
        <Link to="/" aria-label="I&A Schoolwear home" className="inline-flex min-h-11 shrink-0 items-center"><Logo className="h-6 sm:h-7" /></Link>
        <nav aria-label="Main" className="hidden lg:flex items-center gap-4 xl:gap-6 label text-xs whitespace-nowrap">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `py-1 border-b-2 ${isActive ? "border-ink" : "border-transparent hover:border-ink/30"}`}>{n.label}</NavLink>
          ))}
        </nav>
        <div className="ml-auto hidden lg:block w-[240px] xl:w-[300px]"><SchoolFinder size="sm" id="school-finder-header" /></div>
        <button type="button" onClick={() => setOpen(true)} className="relative ml-auto lg:ml-2 inline-flex min-h-11 shrink-0 items-center rounded-pill border border-line bg-white px-3 sm:px-4 label" aria-label={`Basket, ${count} items`}>
          Basket{count > 0 && <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-pill bg-sun px-1.5 text-xs tracking-normal">{count}</span>}
        </button>
        <button type="button" onClick={() => setMenu(!menu)} className="lg:hidden inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-line bg-white" aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? "Close menu" : "Menu"}>
          {menu ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          )}
        </button>
      </div>
      {menu && (
        <div id="mobile-menu" className="lg:hidden border-t border-line bg-white">
          <div className="wrap py-4 space-y-3">
            <SchoolFinder size="sm" id="school-finder-menu" />
            <nav aria-label="Main" className="grid grid-cols-2 gap-2 pt-2">
              {nav.map((n) => <NavLink key={n.to} to={n.to} onClick={() => setMenu(false)} className="flex min-h-11 items-center rounded-[3px] border border-line px-4 py-3 label">{n.label}</NavLink>)}
              <NavLink to="/about" onClick={() => setMenu(false)} className="flex min-h-11 items-center rounded-[3px] border border-line px-4 py-3 label">About</NavLink>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
