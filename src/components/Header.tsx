import { Link, NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { useCart } from "../lib/cart";
import { SchoolFinder } from "./SchoolFinder";
import { useState } from "react";

const nav = [
  { to: "/schools", label: "Schools" },
  { to: "/collections/boys", label: "Boys" },
  { to: "/collections/girls", label: "Girls" },
  { to: "/collections/pe-kit", label: "PE kit" },
  { to: "/collections/bags", label: "Bags" },
  { to: "/size-guide", label: "Size guide" },
];

export function Header() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="bg-blue text-white">
        <div className="wrap flex h-9 items-center justify-between label text-[0.6875rem] sm:text-xs">
          <span>Family-run in Tooting since 1993</span>
          <span className="hidden md:inline">Embroidered in house · Pay in 3 with Klarna · Click and collect</span>
        </div>
      </div>
      <div className="wrap flex h-[72px] items-center gap-3 sm:gap-6">
        <Link to="/" aria-label="I&A Schoolwear home" className="inline-flex min-h-11 shrink-0 items-center"><Logo className="h-5 sm:h-7" /></Link>
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 label text-xs whitespace-nowrap">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `py-1 border-b-2 ${isActive ? "border-ink" : "border-transparent hover:border-ink/30"}`}>{n.label}</NavLink>
          ))}
        </nav>
        <div className="ml-auto hidden lg:block w-[280px] xl:w-[340px]"><SchoolFinder size="sm" /></div>
        <button type="button" onClick={() => setOpen(true)} className="relative ml-auto lg:ml-2 inline-flex min-h-11 shrink-0 items-center rounded-pill border border-line bg-white px-3 sm:px-4 label" aria-label={`Basket, ${count} items`}>
          Basket{count > 0 && <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-pill bg-sun px-1.5 text-xs tracking-normal">{count}</span>}
        </button>
        <button type="button" onClick={() => setMenu(!menu)} className="lg:hidden inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-line bg-white" aria-expanded={menu} aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
      {menu && (
        <div className="lg:hidden border-t border-line bg-white">
          <div className="wrap py-4 space-y-3">
            <SchoolFinder size="sm" />
            <nav className="grid grid-cols-2 gap-2 pt-2">
              {nav.map((n) => <NavLink key={n.to} to={n.to} onClick={() => setMenu(false)} className="rounded border border-line px-4 py-3 label">{n.label}</NavLink>)}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
