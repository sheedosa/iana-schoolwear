import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../lib/cart";
import { formatPrice, sortSizes, StorefrontError, type Product } from "../lib/shopify";
import { SITE } from "../data/site";

const ONE = "One size";

/** A plus and minus pair around a number. 44px keys. */
export function Stepper({ value, onChange, label, disabled = false, max = 20 }: { value: number; onChange: (n: number) => void; label: string; disabled?: boolean; max?: number }) {
  return (
    <span className="qty" data-off={disabled} role="group" aria-label={`Quantity, ${label}`}>
      <button type="button" disabled={disabled || value <= 0} onClick={() => onChange(value - 1)} aria-label={`One fewer, ${label}`}>−</button>
      <output aria-live="polite">{value}</output>
      <button type="button" disabled={disabled || value >= max} onClick={() => onChange(value + 1)} aria-label={`One more, ${label}`}>+</button>
    </span>
  );
}

export function SizeGuideLink({ onOpen }: { onOpen?: () => void }) {
  return onOpen
    ? <button type="button" onClick={onOpen} className="link tap">Size guide</button>
    : <Link to="/size-guide" className="link tap">Size guide</Link>;
}

/** The size and quantity table for one product. Set a quantity against each size you need, then one button adds them.
    Each size is sent through the basket's own add, one after the other; a size that fails keeps its quantity in the table
    and the message says which sizes did go in. */
export function OrderTable({ p, sticky = false, onGuide, idPrefix = "order" }: { p: Product; sticky?: boolean; onGuide?: () => void; idPrefix?: string }) {
  const { add } = useCart();
  const sizes = p.sizes.length ? sortSizes(p.sizes) : [ONE];
  const single = sizes.length === 1;
  const [qty, setQty] = useState<Record<string, number>>(() => (single ? { [sizes[0]]: 1 } : {}));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [nudge, setNudge] = useState(false);
  const table = useRef<HTMLUListElement>(null);

  // A product with one size (or none) starts at 1: there is nothing to choose.
  useEffect(() => { setQty(single ? { [sizes[0]]: 1 } : {}); setErr(null); setNudge(false); }, [p.handle]); // eslint-disable-line react-hooks/exhaustive-deps

  const soldOut = (s: string) => p.soldOutSizes?.includes(s) ?? false;
  const n = sizes.reduce((a, s) => a + (qty[s] ?? 0), 0);
  const flat = p.priceMax <= p.priceMin; // one price for every size
  const priced = p.priceMin > 0;
  const sum = priced ? `${flat ? "" : "from "}${formatPrice(p.priceMin * n)}` : "";

  const set = (s: string, v: number) => { setQty((q) => ({ ...q, [s]: Math.max(0, v) })); setErr(null); setNudge(false); };

  const submit = async () => {
    if (n === 0) {
      setNudge(true);
      table.current?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      table.current?.querySelector<HTMLElement>("button:not([disabled])")?.focus({ preventScroll: true });
      return;
    }
    setBusy(true); setErr(null);
    const done: string[] = [];
    try {
      for (const s of sizes) {
        const k = qty[s] ?? 0;
        if (!k) continue;
        await add(p.handle, p.sizes.length ? s : null, k);
        done.push(s);
        setQty((q) => ({ ...q, [s]: single ? 1 : 0 }));
      }
    } catch (e) {
      const why = e instanceof StorefrontError ? e.message : "Couldn't add that to your basket. Please try again.";
      setErr(done.length ? `${done.join(", ")} added. ${why}` : why);
    } finally { setBusy(false); }
  };

  return (
    <div className="order">
      <div className="sheet-head">
        <span>{single ? "Size" : "Size, and how many"}</span>
        {p.sizes.length > 0 && <span className="-my-2"><SizeGuideLink onOpen={onGuide} /></span>}
      </div>
      <ul ref={table} className="sizes" data-cols={sizes.length > 6 ? 2 : 1} id={`${idPrefix}-sizes`}>
        {sizes.map((s) => (
          <li key={s} className="size-line" data-on={(qty[s] ?? 0) > 0}>
            <span className="min-w-0 leading-tight">
              <span className="font-medium">{s}</span>
              {soldOut(s) && <span className="t-small block text-mute">Out of stock online</span>}
            </span>
            <Stepper value={qty[s] ?? 0} onChange={(v) => set(s, v)} label={s === ONE ? p.title : `size ${s}`} disabled={!p.available || soldOut(s) || busy} />
          </li>
        ))}
      </ul>
      <div className="order-foot" data-plain={!sticky}>
        {nudge && <p role="alert" className="mb-2 font-medium">Set how many you need against a size, then add.</p>}
        <button type="button" onClick={submit} disabled={busy || !p.available} aria-disabled={n === 0} className="btn btn-buy w-full">
          {!p.available ? "Out of stock online" : busy ? "Adding…" : n === 0 ? "Add to basket" : `Add ${n} to basket${sum ? `, ${sum}` : ""}`}
        </button>
        {err && <p role="alert" className="mt-2 font-medium">{err} {/stock/.test(err) ? <>Call <a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a> to check the shelf in Tooting.</> : null}</p>}
        {!p.available && <p className="mt-2 text-mute">Call <a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a> to check what is in the shop.</p>}
      </div>
    </div>
  );
}
