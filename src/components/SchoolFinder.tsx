import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { inStoreOnly, storefront, type School } from "../lib/shopify";
import { SITE } from "../data/site";

// The one control the whole site is built around. Large by design.
// Opens only when the shopper types (or refocuses with text in it), so it never covers a page on load.
export function SchoolFinder({ size = "lg", id = "school-finder" }: { size?: "lg" | "sm"; id?: string }) {
  const [schools, setSchools] = useState<School[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const nav = useNavigate();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => { storefront.schools().then(setSchools); }, []);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const matches = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = t ? schools.filter((s) => s.name.toLowerCase().includes(t) || s.area.toLowerCase().includes(t)) : schools;
    return list.slice(0, 9);
  }, [q, schools]);

  const go = (s: School) => { setOpen(false); setQ(""); nav(`/schools/${s.slug}`); };

  const big = size === "lg";
  const listId = `${id}-list`;
  return (
    <div ref={box} className="relative w-full">
      <label htmlFor={id} className="sr-only">Find your school</label>
      <div className={big ? "flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0 sm:rounded-pill sm:border sm:border-ink/20 sm:bg-white sm:p-1.5 sm:shadow-[0_8px_30px_rgba(69,53,58,0.10)] sm:focus-within:ring-2 sm:focus-within:ring-blue" : ""}>
        <div className={`flex min-w-0 flex-1 items-center gap-3 rounded-pill bg-white ${big ? "border border-ink/20 pl-4 pr-2 py-1.5 focus-within:ring-2 focus-within:ring-blue sm:border-0 sm:pl-4 sm:focus-within:ring-0" : "border border-ink/20 pl-3 pr-1.5 py-1 focus-within:ring-2 focus-within:ring-blue"}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink/60 shrink-0" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input
            id={id}
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
            onClick={() => setOpen(true)}
            onFocus={(e) => {
              if (q) setOpen(true);
              // On phones, bring the field to the top so the list has room below it.
              if (big && window.matchMedia("(max-width: 639px)").matches) e.currentTarget.closest("div")?.scrollIntoView({ block: "start", behavior: "smooth" });
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, matches.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              if (e.key === "Enter" && open && matches[active]) go(matches[active]);
              if (e.key === "Escape") setOpen(false);
            }}
            placeholder={big ? "Type your school" : "Find your school"}
            className={`min-h-11 w-full min-w-0 bg-transparent outline-none placeholder:text-ink/40 ${big ? "text-lg py-1.5" : "text-base py-1"}`}
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && matches[active] ? `${id}-option-${matches[active].slug}` : undefined}
          />
        </div>
        {big && <button type="button" onClick={() => { if (q && matches[active]) go(matches[active]); else { setOpen(true); document.getElementById(id)?.focus(); } }} className="btn btn-primary w-full shrink-0 sm:w-auto">Find uniform</button>}
      </div>
      {open && matches.length > 0 && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-md border border-line bg-white shadow-[0_16px_40px_rgba(69,53,58,0.16)]">
          <ul id={listId} role="listbox" aria-label="Matching schools">
            {matches.map((s, i) => (
              <li key={s.slug} id={`${id}-option-${s.slug}`} role="option" aria-selected={i === active} onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => go(s)} className={`flex min-h-11 w-full cursor-pointer items-center gap-3 px-4 py-3 text-left ${i === active ? "bg-sage-soft" : ""}`}>
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: s.colour }} aria-hidden />
                <span className="font-normal">{s.name}</span>
                <span className="ml-auto shrink-0 text-sm text-ink/60">{inStoreOnly(s) ? "In store" : s.area}</span>
              </li>
            ))}
          </ul>
          <p className="border-t border-line px-4 py-2.5 text-ink/60">Not listed? <a href={`tel:${SITE.phoneIntl}`} className="underline">Call {SITE.phone}</a> and ask about your school.</p>
        </div>
      )}
    </div>
  );
}
