import { useCart } from "../lib/cart";
import { asset, formatPrice, storefront } from "../lib/shopify";

export function CartDrawer() {
  const { cart, open, setOpen, update } = useCart();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Basket">
      <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} aria-label="Close basket" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold">Your basket</h2>
          <button type="button" onClick={() => setOpen(false)} className="rounded-pill border border-line px-3 py-1.5 text-sm">Close</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.lines.length === 0 ? (
            <p className="text-ink/60">Nothing in here yet. Find your school and add the essentials, or browse the plain basics.</p>
          ) : (
            <ul className="space-y-4">
              {cart.lines.map((l) => (
                <li key={l.id} className="flex gap-4">
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-line bg-chalk">
                    {l.product.images[0] && <img src={asset(l.product.images[0])} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold leading-tight">{l.product.title}</p>
                    <p className="text-sm text-ink/55">{l.size ? `Size ${l.size}` : "One size"}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button type="button" onClick={() => update(l.id, l.quantity - 1)} className="h-8 w-8 rounded-pill border border-line" aria-label="Decrease">−</button>
                      <span className="w-6 text-center">{l.quantity}</span>
                      <button type="button" onClick={() => update(l.id, l.quantity + 1)} className="h-8 w-8 rounded-pill border border-line" aria-label="Increase">+</button>
                      <span className="ml-auto font-semibold">{formatPrice(l.product.priceMin * l.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-line px-5 py-4">
          <div className="flex justify-between text-lg font-bold"><span>Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
          <p className="mt-1 text-sm text-ink/55">Delivery, collection and any discounts are worked out at checkout.</p>
          {storefront.mode === "shopify" && cart.checkoutUrl ? (
            <a href={cart.checkoutUrl} className="btn btn-primary mt-4 w-full">Go to secure checkout</a>
          ) : (
            <button type="button" className="btn btn-primary mt-4 w-full" onClick={() => alert("Preview store: checkout opens on Shopify once the store is connected.")}>Go to secure checkout</button>
          )}
          <p className="mt-3 text-center text-xs text-ink/50">Apple Pay · Google Pay · PayPal · Klarna</p>
        </div>
      </aside>
    </div>
  );
}
