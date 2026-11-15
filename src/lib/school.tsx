import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { storefront, type Product, type School } from "./shopify";
import { boot, savedSchool, SCHOOL_KEY } from "./preload";

// The school a parent chose, remembered on this device only, and the list of schools every page reads.
const KEY = SCHOOL_KEY;

type SchoolCtx = {
  schools: School[];
  /** School slug -> a real photo of one of its crested garments, where one is online. */
  marks: Record<string, string>;
  chosen: School | undefined;
  choose: (slug: string) => void;
};

const Ctx = createContext<SchoolCtx | null>(null);

const MARK_ORDER = ["Sweatshirts", "Knitwear", "Blazers", "PE kit", "Polo shirts", "Bags"];
function marksFrom(products: Product[]): Record<string, string> {
  const out: Record<string, string> = {};
  const rank = (p: Product) => { const i = MARK_ORDER.indexOf(p.productType); return i < 0 ? MARK_ORDER.length : i; };
  for (const p of [...products].sort((a, b) => rank(a) - rank(b))) {
    if (p.school && p.logoItem && p.images[0] && !out[p.school]) out[p.school] = p.images[0];
  }
  return out;
}

export function SchoolProvider({ children }: { children: ReactNode }) {
  // Start from what was fetched before React began (lib/preload.ts), so the first render is the finished page.
  const [schools, setSchools] = useState<School[]>(() => boot.schools);
  const [marks, setMarks] = useState<Record<string, string>>(() => marksFrom(boot.products));
  // A school's own page chooses that school (SchoolPage does it too): start there, so the line under the bar does not change after the first render.
  const [slug, setSlug] = useState<string | null>(() => {
    const onPage = /\/schools\/([^/?#]+)/.exec(window.location.pathname)?.[1];
    return onPage && boot.schools.some((s) => s.slug === onPage) ? onPage : savedSchool();
  });

  useEffect(() => {
    if (!boot.schools.length) storefront.schools().then(setSchools).catch(() => {});
    if (!boot.products.length) storefront.products().then((ps) => setMarks(marksFrom(ps))).catch(() => {});
  }, []);

  const choose = useCallback((s: string) => {
    setSlug(s);
    try { localStorage.setItem(KEY, s); } catch { /* ignore */ }
  }, []);
  const chosen = useMemo(() => schools.find((s) => s.slug === slug), [schools, slug]);

  return <Ctx.Provider value={{ schools, marks, chosen, choose }}>{children}</Ctx.Provider>;
}

export function useSchools() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSchools outside SchoolProvider");
  return c;
}
