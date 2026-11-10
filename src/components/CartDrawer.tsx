import { useCart } from "../lib/cart";
import { formatPrice, storefront } from "../lib/shopify";
import { Thumb } from "./ProductRow";
import { Stepper } from "./OrderTable";
import { SITE } from "../data/site";
import { useEffect } from "react";

export function CartDrawer() {
  const { cart, open, setOpen, update } = useCart();
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const box = () => document.querySelector<HTMLElement>('[role="dialog"][aria-label="Basket"] aside');
    box()?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      const el = box();
      if (e.key !== "Tab" || !el) return;
      // Keep Tab inside the basket while it is open.
      const stops = [...el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      const first = stops[0], last = stops[stops.length - 1], at = document.activeElement;
      if (e.shiftKey && (at === first || !el.contains(at))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (at === last || !el.contains(at))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); if (opener?.isConnected) opener.focus(); };
  }, [open, setOpen]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Basket">
      <button type="button" className="sheet-in absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} aria-label="Close basket" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l-2 border-blue bg-white drawer-in">
        <div className="flex items-center justify-between border-b-2 border-blue px-5 py-3">
          <h2>Your basket</h2>
          <button type="button" onClick={() => setOpen(false)} className="btn btn-line min-h-11 px-4">Close</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5">
          {cart.lines.length === 0 ? (
            <p className="py-4 text-mute">Nothing in the basket yet. Open your school's list and add what you need.</p>
          ) : (
            <ul>
              {cart.lines.map((l) => (
                <li key={l.id} className="flex gap-3.5 border-b border-line py-3">
                  <Thumb p={l.product} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-tight">{l.product.title}</p>
                    <p className="t-small text-mute">{l.size ? `Size ${l.size}` : "One size"}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Stepper value={l.quantity} onChange={(v) => update(l.id, v)} label={`${l.product.title}${l.size ? `, size ${l.size}` : ""}`} max={99} />
                      <span className="num ml-auto font-semibold">{formatPrice(l.product.priceMin * l.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t-2 border-blue px-5 py-4">
          <div className="flex items-baseline justify-between"><span className="font-semibold">Subtotal</span><span className="num text-2xl font-semibold">{formatPrice(cart.subtotal)}</span></div>
          <p className="mt-1 text-mute">{cart.subtotal >= SITE.delivery.freeOver ? "Free delivery on this order." : `Free delivery at £${SITE.delivery.freeOver}. School drop-off £${SITE.delivery.schoolDropOff}, or collect in Tooting.`}</p>
          {storefront.mode === "shopify" && cart.checkoutUrl ? (
            <a href={cart.checkoutUrl} className="btn btn-buy mt-4 w-full">Go to secure checkout</a>
          ) : (
            <button type="button" className="btn btn-buy mt-4 w-full" onClick={() => alert("Preview store: checkout opens on Shopify once the store is connected.")}>Go to secure checkout</button>
          )}
          <p className="t-small mt-3 text-mute">Payment options, including Klarna Pay in 3, are shown at checkout</p>
        </div>
      </aside>
    </div>
  );
}
