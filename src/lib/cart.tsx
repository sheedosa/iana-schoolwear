import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { storefront, type Cart } from "./shopify";

type CartCtx = {
  cart: Cart;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (handle: string, size: string | null, qty?: number) => Promise<void>;
  update: (lineId: string, qty: number) => Promise<void>;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ lines: [], subtotal: 0, checkoutUrl: null });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    storefront.cart().then(setCart).catch(() => {});
    return storefront.subscribe(setCart);
  }, []);

  const add = useCallback(async (handle: string, size: string | null, qty = 1) => {
    await storefront.addToCart(handle, size, qty);
    setOpen(true);
  }, []);
  const update = useCallback(async (lineId: string, qty: number) => { await storefront.updateLine(lineId, qty); }, []);
  const count = useMemo(() => cart.lines.reduce((a, l) => a + l.quantity, 0), [cart]);

  return <Ctx.Provider value={{ cart, open, setOpen, add, update, count }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
