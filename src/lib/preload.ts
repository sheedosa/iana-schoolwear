import { storefront, type Product, type School } from "./shopify";

// What the first screen needs, fetched once before React starts so its first render is the finished page:
// the same content the prerendered HTML already shows, with nothing loading and nothing moving.
// Pages still ask the storefront for their own data; this only gives them something to start from.
export const boot: { schools: School[]; products: Product[] } = { schools: [], products: [] };

const WAIT = 2500; // the live shop answers over the network: start anyway after this long

export function preload(): Promise<void> {
  const all = Promise.all([
    storefront.schools().then((s) => { boot.schools = s; }),
    storefront.products().then((p) => { boot.products = p; }),
  ]).then(() => undefined, () => undefined);
  return Promise.race([all, new Promise<void>((ok) => setTimeout(ok, WAIT))]);
}

/** The school remembered on this device (see school.tsx). */
export const SCHOOL_KEY = "iana-school";
export function savedSchool(): string | null {
  try { return localStorage.getItem(SCHOOL_KEY); } catch { return null; }
}

/** The products a page starts from: the same choice the storefront makes for a school or a garment type. */
export const bootProducts = (f: { school?: string; type?: string } = {}) =>
  boot.products.filter((p) => (!f.school || p.school === f.school) && (!f.type || p.productType === f.type));
