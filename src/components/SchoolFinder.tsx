import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storefront, type School } from "../lib/shopify";

// The one control the whole site is built around. Large by design.
export function SchoolFinder({ size = "lg", autoFocus = false }: { size?: "lg" | "sm"; autoFocus?: boolean }) {
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
  return (
    <div ref={box} className="relative w-full">
      <label htmlFor="school-finder" className="sr-only">Find your school</label>
      <div className={`flex items-center gap-3 rounded-pill bg-white shadow-[0_8px_30px_rgba(69,53,58,0.14)] focus-within:ring-2 focus-within:ring-blue ${big ? "pl-6 pr-2 py-2" : "pl-4 pr-1.5 py-1.5"}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink/60 shrink-0" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input
          id="school-finder"
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, matches.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            if (e.key === "Enter" && matches[active]) go(matches[active]);
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={big ? "Which school? Start typing…" : "Find your school"}
          className={`w-full bg-transparent outline-none placeholder:text-ink/40 ${big ? "text-lg sm:text-xl py-2" : "text-base py-1.5"}`}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls="school-finder-list"
        />
        {big && <button type="button" onClick={() => matches[active] && go(matches[active])} className="btn btn-primary shrink-0">Find uniform</button>}
      </div>
      {open && matches.length > 0 && (
        <ul id="school-finder-list" role="listbox" className="absolute z-30 mt-2 w-full overflow-hidden rounded-md border border-line bg-white shadow-[0_16px_40px_rgba(69,53,58,0.16)]">
          {matches.map((s, i) => (
            <li key={s.slug} role="option" aria-selected={i === active}>
              <button type="button" onMouseEnter={() => setActive(i)} onClick={() => go(s)} className={`flex w-full items-center gap-3 px-4 py-3 text-left ${i === active ? "bg-chalk" : ""}`}>
                <span className="h-3 w-3 rounded-full" style={{ background: s.colour }} aria-hidden />
                <span className="font-normal">{s.name}</span>
                <span className="ml-auto text-sm text-ink/50">{s.area}</span>
              </button>
            </li>
          ))}
          <li className="border-t border-line px-4 py-2.5 text-sm text-ink/60">Not listed? <a href="tel:+442087678613" className="underline">Call 020 8767 8613</a> and ask about your school.</li>
        </ul>
      )}
    </div>
  );
}
