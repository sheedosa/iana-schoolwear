import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { useCart } from "../lib/cart";
import { useSchools } from "../lib/school";
import { SchoolMark, SchoolSearch, schoolStatus } from "./SchoolFinder";
import { VLink } from "./VLink";
import { storefront } from "../lib/shopify";

const places = [
  { to: "/collections/plain", label: "Plain basics" },
  { to: "/size-guide", label: "Size guide" },
  { to: "/delivery", label: "Delivery and returns" },
];

/** The header is the school search: a solid blue bar with the lockup, the field and the basket.
    Under it, one white line names the school you chose (remembered on this device). */
export function Header() {
  const { count, setOpen } = useCart();
  const { chosen } = useSchools();
  return (
    <header className="z-40 lg:sticky lg:top-0">
      <div className="bar on-blue">
        <div className="wrap grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 py-2.5 lg:h-16 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-x-8 lg:py-0">
          <Link to="/" aria-label="I&A Schoolwear home" className="tap min-w-0"><Logo white className="h-auto w-full max-w-[212px]" /></Link>
          {storefront.mode === "demo" && <span className="t-small font-medium lg:hidden" title="Preview catalogue: checkout opens once the shop is connected">Preview</span>}
          <div className="col-span-2 lg:col-span-1 lg:max-w-[640px]"><SchoolSearch id="school-field" /></div>
          <div className="hidden items-center gap-4 lg:flex">
            {storefront.mode === "demo" && <span className="t-small font-medium" title="Preview catalogue: checkout opens once the shop is connected">Preview</span>}
            <button type="button" onClick={() => setOpen(true)} className="bar-btn" aria-label={`Basket, ${count} ${count === 1 ? "item" : "items"}`}>
              Basket <span className="count">{count}</span>
            </button>
          </div>
        </div>
      </div>
      <div className={`schoolbar ${chosen ? "" : "hidden lg:block"}`}>
        <div className="wrap flex min-h-11 items-center gap-x-6">
          {chosen ? (
            <p className="flex min-w-0 flex-1 items-center gap-2.5">
              <SchoolMark school={chosen} size="mark-sm" />
              <VLink to={`/schools/${chosen.slug}`} className="tap min-w-0 font-semibold"><span className="truncate">{chosen.short}, {chosen.area}</span></VLink>
              <span className="hidden text-mute sm:inline">{schoolStatus(chosen)}</span>
              <VLink to="/schools" className="link tap shrink-0">Change school</VLink>
            </p>
          ) : (
            <p className="flex-1 text-mute">Type your school in the blue bar, or <VLink to="/schools" className="link">pick it from the list</VLink>.</p>
          )}
          <nav aria-label="Main" className="hidden shrink-0 gap-6 lg:flex">
            {places.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `tap ${isActive ? "font-semibold underline decoration-2 underline-offset-4" : "hover:underline hover:underline-offset-4"}`}>{n.label}</NavLink>)}
          </nav>
        </div>
      </div>
    </header>
  );
}

/** Phones: three places, fixed at the bottom. Pages and the footer leave room for it. */
export function TabBar() {
  const { count, setOpen } = useCart();
  const { pathname } = useLocation();
  const onSchools = pathname === "/" || pathname.startsWith("/schools");
  const onPlain = pathname === "/collections/plain";
  return (
    <nav className="tabbar" aria-label="Shop">
      <VLink to="/schools" aria-current={onSchools ? "page" : undefined}>Schools</VLink>
      <VLink to="/collections/plain" aria-current={onPlain ? "page" : undefined}>Plain basics</VLink>
      <button type="button" onClick={() => setOpen(true)} aria-label={`Basket, ${count} ${count === 1 ? "item" : "items"}`}>Basket <span className="count">{count}</span></button>
    </nav>
  );
}
