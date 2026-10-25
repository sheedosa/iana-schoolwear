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
    <header className="sticky top-0 z-40 border-b border-line bg-chalk/90 backdrop-blur">
      <div className="bg-ink text-white text-sm">
        <div className="wrap flex h-9 items-center justify-between">
          <span>Free size exchanges · 30-day returns</span>
          <span className="hidden sm:inline">Next-day delivery across London · Pay in 3 with Klarna</span>
        </div>
      </div>
      <div className="wrap flex h-[72px] items-center gap-6">
        <Link to="/" aria-label="I&A Schoolwear home" className="shrink-0"><Logo /></Link>
        <nav className="hidden lg:flex items-center gap-6 text-[15px] font-medium">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `py-1 border-b-2 ${isActive ? "border-ink" : "border-transparent hover:border-ink/30"}`}>{n.label}</NavLink>
          ))}
        </nav>
        <div className="ml-auto hidden lg:block w-[360px]"><SchoolFinder size="sm" /></div>
        <button type="button" onClick={() => setOpen(true)} className="relative ml-auto lg:ml-2 inline-flex min-h-11 items-center rounded-pill border border-line bg-white px-4 font-semibold" aria-label={`Basket, ${count} items`}>
          Basket{count > 0 && <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-pill bg-sun px-1.5 text-sm">{count}</span>}
        </button>
        <button type="button" onClick={() => setMenu(!menu)} className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-pill border border-line bg-white" aria-expanded={menu} aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
      {menu && (
        <div className="lg:hidden border-t border-line bg-white">
          <div className="wrap py-4 space-y-3">
            <SchoolFinder size="sm" />
            <nav className="grid grid-cols-2 gap-2 pt-2">
              {nav.map((n) => <NavLink key={n.to} to={n.to} onClick={() => setMenu(false)} className="rounded-xl border border-line px-4 py-3 font-medium">{n.label}</NavLink>)}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
