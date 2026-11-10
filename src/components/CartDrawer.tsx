import { useCart } from "../lib/cart";
import { asset, formatPrice, storefront } from "../lib/shopify";
import { SITE } from "../data/site";
import { useEffect } from "react";

export function CartDrawer() {
  const { cart, open, setOpen, update } = useCart();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Basket">
      <button type="button" className="sheet-in absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} aria-label="Close basket" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-ink bg-white drawer-in">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="t-h3">Your basket</h2>
          <button type="button" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center rounded-pill border border-ink/25 px-4 hover:border-ink">Close</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.lines.length === 0 ? (
            <p className="text-ink/60">Nothing in here yet. Find your school and add the essentials, or browse the plain basics.</p>
          ) : (
            <ul className="space-y-4">
              {cart.lines.map((l) => (
                <li key={l.id} className="flex gap-4">
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded border border-line bg-chalk">
                    {l.product.images[0] && <img src={asset(l.product.images[0])} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium leading-tight">{l.product.title}</p>
                    <p className="text-ink/65">{l.size ? `Size ${l.size}` : "One size"}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button type="button" onClick={() => update(l.id, l.quantity - 1)} className="h-11 w-11 rounded-pill border border-ink/25 hover:border-ink" aria-label={`One fewer ${l.product.title}`}>−</button>
                      <span className="w-6 text-center" aria-live="polite">{l.quantity}</span>
                      <button type="button" onClick={() => update(l.id, l.quantity + 1)} className="h-11 w-11 rounded-pill border border-ink/25 hover:border-ink" aria-label={`One more ${l.product.title}`}>+</button>
                      <span className="ml-auto font-medium">{formatPrice(l.product.priceMin * l.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-line px-5 py-4">
          <div className="flex items-baseline justify-between"><span className="font-medium">Subtotal</span><span className="figure text-[1.75rem]">{formatPrice(cart.subtotal)}</span></div>
          <p className="mt-1 text-ink/65">{cart.subtotal >= SITE.delivery.freeOver ? "Free delivery on this order." : `Free delivery at £${SITE.delivery.freeOver}. School drop-off £${SITE.delivery.schoolDropOff}, or collect in Tooting.`}</p>
          {storefront.mode === "shopify" && cart.checkoutUrl ? (
            <a href={cart.checkoutUrl} className="btn btn-primary mt-4 w-full">Go to secure checkout</a>
          ) : (
            <button type="button" className="btn btn-primary mt-4 w-full" onClick={() => alert("Preview store: checkout opens on Shopify once the store is connected.")}>Go to secure checkout</button>
          )}
          <p className="t-small mt-3 text-center text-ink/65">Payment options, including Klarna Pay in 3, are shown at checkout</p>
        </div>
      </aside>
    </div>
  );
}
