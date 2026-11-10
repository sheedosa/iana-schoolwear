import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { asset, inStoreOnly, type School } from "../lib/shopify";
import { useSchools } from "../lib/school";
import { SITE } from "../data/site";
import { VLink, go as goTo, schoolVT } from "./VLink";

const initials = (s: School) => s.short.replace(/[^A-Z]/g, "").slice(0, 2);
const plural = (n: number, one: string) => `${n} ${n === 1 ? one : `${one}s`}`;

/** What a school has online, in words the data supports. */
export const schoolStatus = (s: School) => (inStoreOnly(s) ? "In store only" : `${plural(s.productCount, "item")} online`);

/** A school's mark. A photo of its crested garment where one is online; otherwise its initials on the school colour.
    Schools that are in store only get an outlined mark, so the filled and the outlined square mean two different things. */
export function SchoolMark({ school, size = "", shared = false }: { school: School; size?: "" | "mark-sm" | "mark-lg"; shared?: boolean }) {
  const { marks } = useSchools();
  const photo = marks[school.slug];
  return (
    <span className={`mark ${size}`} data-instore={inStoreOnly(school)} style={{ background: school.colour, ...(shared ? schoolVT(school.slug) : {}) }} aria-hidden>
      {initials(school)}
      {photo && !inStoreOnly(school) && <img src={asset(photo)} alt="" loading="lazy" />}
    </span>
  );
}

const match = (schools: School[], q: string) => {
  const t = q.trim().toLowerCase();
  return t ? schools.filter((s) => s.name.toLowerCase().includes(t) || s.area.toLowerCase().includes(t)) : schools;
};

export const NotListed = () => <>School not listed? Call <a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a> and ask.</>;

/** The school field in the blue bar. Type, pick with the arrow keys or a tap, and the school's list opens.
    This is the one way to choose a school; the tables on Home and /schools are the same list written out. */
export function SchoolSearch({ id = "school-search" }: { id?: string }) {
  const { schools, choose } = useSchools();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const matches = useMemo(() => match(schools, q), [q, schools]);
  const pick = (s: School) => { setOpen(false); setQ(""); choose(s.slug); (document.activeElement as HTMLElement | null)?.blur(); goTo(navigate, `/schools/${s.slug}`); };
  const listId = `${id}-list`;

  return (
    <div ref={box} className="relative w-full">
      <label htmlFor={id} className="sr-only">Type your school</label>
      <div className="field">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" className="shrink-0 text-blue-deep" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input
          id={id}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
          onClick={() => setOpen(true)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, matches.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            if (e.key === "Enter" && open && matches[active]) { e.preventDefault(); pick(matches[active]); }
            if (e.key === "Escape") setOpen(false);
            if (e.key === "Tab") setOpen(false);
          }}
          placeholder="Type your school"
          autoComplete="off"
          autoCapitalize="words"
          spellCheck={false}
          enterKeyHint="go"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && matches[active] ? `${id}-option-${matches[active].slug}` : undefined}
        />
      </div>
      {open && (
        <div className="options panel-in">
          <ul id={listId} role="listbox" aria-label="Schools" className="max-h-[min(60vh,26rem)] overflow-y-auto">
            {matches.map((s, i) => (
              <li key={s.slug} id={`${id}-option-${s.slug}`} role="option" aria-selected={i === active} onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(s)} className="option">
                <SchoolMark school={s} size="mark-sm" />
                <span className="min-w-0 flex-1 font-medium leading-tight">{s.name}</span>
                <span className="t-small shrink-0 text-mute">{inStoreOnly(s) ? "In store only" : s.area}</span>
              </li>
            ))}
          </ul>
          {matches.length === 0 && <p className="px-3 pt-3 font-medium">No school matches “{q.trim()}”.</p>}
          <p className="px-3 py-3 text-mute"><NotListed /></p>
        </div>
      )}
    </div>
  );
}

/** Every school as one line of a table: mark, name, area, what is online. The whole line opens the school. */
export function SchoolTable({ query = "" }: { query?: string }) {
  const { schools, chosen, choose } = useSchools();
  const rows = match(schools, query);
  if (schools.length === 0) return <p className="py-6 text-mute">Loading schools…</p>;
  return (
    <>
      <div className="sheet-head" aria-hidden>
        <span>School</span>
        <span>Online</span>
      </div>
      <ul className="sheet">
        {rows.map((s) => (
          <li key={s.slug}>
            <VLink to={`/schools/${s.slug}`} onClick={() => choose(s.slug)} className={`school-line line-link ${chosen?.slug === s.slug ? "bg-tint" : ""}`}>
              <SchoolMark school={s} shared />
              <span className="min-w-0 font-semibold leading-tight">
                {s.name}
                <span className="t-small block font-normal text-mute sm:hidden">{s.area}</span>
              </span>
              <span className="hidden text-mute sm:block">{s.area}</span>
              <span className="num text-right leading-tight">{schoolStatus(s)}{chosen?.slug === s.slug && <span className="t-small block text-mute">Your school</span>}</span>
            </VLink>
          </li>
        ))}
      </ul>
      {rows.length === 0 && <p className="py-4 font-medium">No school matches “{query.trim()}”.</p>}
      <p className="mt-3 text-mute"><NotListed /></p>
    </>
  );
}
