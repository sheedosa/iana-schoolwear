import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { asset, inStoreOnly, storefront, type School } from "../lib/shopify";
import { SITE } from "../data/site";
import { VLink, go as goTo, schoolVT, scrollBehaviour } from "./VLink";

const initials = (s: School) => s.short.replace(/[^A-Z]/g, "").slice(0, 2);

/** A school's square tile. Sage by default (Home, /schools, the finder); with `on`, the school's own colour arrives over it:
    the colour photograph where there is one, otherwise the solid school colour with the crest or initials. */
export function SchoolTile({ school, on = false, shared = false, className = "" }: { school: School; on?: boolean; shared?: boolean; className?: string }) {
  return (
    <span className={`tile ${className}`} data-on={on} style={shared ? schoolVT(school.slug) : undefined} aria-hidden>
      {school.tile ? (
        <>
          <img src={asset(school.tile.replace("/tiles/", "/tiles/sage/"))} alt="" />
          <img src={asset(school.tile)} alt="" className="tile-colour" loading={on ? undefined : "lazy"} />
        </>
      ) : (
        <>
          <span className="tile-ini text-ink">{initials(school)}</span>
          <span className="tile-ini tile-colour text-white" style={{ background: school.colour }}>
            {school.crest ? <img src={asset(school.crest)} alt="" className="h-1/2 w-1/2 object-contain" /> : initials(school)}
          </span>
        </>
      )}
    </span>
  );
}

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-ink/60" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);

function useSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  useEffect(() => { storefront.schools().then(setSchools); }, []);
  return schools;
}
const filter = (schools: School[], q: string) => {
  const t = q.trim().toLowerCase();
  return t ? schools.filter((s) => s.name.toLowerCase().includes(t) || s.area.toLowerCase().includes(t)) : schools;
};
const NotListed = () => <>Not listed? <a href={`tel:${SITE.phoneIntl}`} className="underline">Call {SITE.phone}</a> and ask about your school.</>;

/** The one control the whole site is built around: type or tap, and your school answers.
    `rail` (Home, 404) shows the schools as tiles under the field; `list` (/schools) shows every school as a row.
    Typing narrows them in place; the first match takes its school colour and Enter opens it. */
export function SchoolFinder({ layout = "rail", id = "school-finder", initialQuery = "" }: { layout?: "rail" | "list"; id?: string; initialQuery?: string }) {
  const schools = useSchools();
  const [q, setQ] = useState(initialQuery);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const matches = useMemo(() => filter(schools, q), [q, schools]);
  const typed = q.trim().length > 0;
  const hit = typed ? matches[Math.min(active, matches.length - 1)] : undefined;
  const open = (s: School) => goTo(navigate, `/schools/${s.slug}`);

  const status = !typed ? "" : matches.length === 0 ? `No school matches “${q.trim()}”.` : matches.length === 1 ? `${matches[0].name}, ${inStoreOnly(matches[0]) ? "in store" : matches[0].area}.` : `${matches.length} schools match.`;
  const tiles = typed ? matches : schools.filter((s) => s.tile);
  const others = typed ? [] : schools.filter((s) => !s.tile);

  return (
    <div className="w-full">
      <label htmlFor={id} className="sr-only">Find your school</label>
      <form role="search" className="flex scroll-mt-32 gap-2" onSubmit={(e) => { e.preventDefault(); if (hit) open(hit); else document.getElementById(id)?.focus(); }}>
        <div className="finder-field py-1.5 pl-4 pr-2">
          <SearchIcon />
          <input
            id={id}
            type="search"
            enterKeyHint="go"
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            onFocus={(e) => {
              // On phones, bring the field to the top so the schools have room below it, above the keyboard.
              if (window.matchMedia("(max-width: 639px)").matches) e.currentTarget.closest("form")?.scrollIntoView({ block: "start", behavior: scrollBehaviour() });
            }}
            onKeyDown={(e) => {
              if (!typed) return;
              if (e.key === "ArrowDown" || e.key === "ArrowRight" && e.currentTarget.selectionStart === q.length) { e.preventDefault(); setActive((a) => Math.min(a + 1, matches.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              if (e.key === "Escape") setQ("");
            }}
            placeholder="Type your school"
            className="min-h-11 w-full min-w-0 bg-transparent py-1.5 text-lg placeholder:text-ink/40 [&::-webkit-search-cancel-button]:hidden"
            autoComplete="off"
            autoCapitalize="words"
            spellCheck={false}
            aria-controls={`${id}-results`}
            aria-describedby={`${id}-status`}
          />
        </div>
        <button type="submit" className="btn btn-primary hidden shrink-0 sm:inline-flex">Find uniform</button>
      </form>

      <p id={`${id}-status`} role="status" className={`mt-3 ${typed ? "font-medium" : "text-ink/65"}`}>
        {typed ? status : layout === "rail" ? "or tap your school" : `${schools.length} schools`}
      </p>

      <div id={`${id}-results`}>
        {layout === "rail" ? (
          <>
            {tiles.length > 0 && (
              <ul className="rail mt-2">
                {tiles.map((s) => (
                  <li key={s.slug}>
                    <VLink to={`/schools/${s.slug}`} className="school-pick" data-match={s === hit}>
                      <SchoolTile school={s} on={s === hit} shared />
                      <span className="school-pick-name mt-2 block font-medium leading-tight">{s.short}</span>
                      <span className="t-small block text-ink/65">{inStoreOnly(s) ? "In store" : s.area}</span>
                    </VLink>
                  </li>
                ))}
              </ul>
            )}
            {others.length > 0 && (
              <p className="mt-3 border-t border-line pt-1.5">
                {[{ label: "Also ", list: others.filter((s) => !inStoreOnly(s)) }, { label: "In store only: ", list: others.filter(inStoreOnly) }].filter((g) => g.list.length).map((g, gi) => (
                  <span key={g.label}>
                    {gi > 0 && <span className="text-ink/65">. </span>}
                    <span className="text-ink/65">{g.label}</span>
                    {g.list.map((s, i) => (
                      <span key={s.slug}>
                        <VLink to={`/schools/${s.slug}`} className="inline-flex min-h-11 items-center font-medium underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{s.short}</VLink>
                        {i < g.list.length - 1 ? <span className="text-ink/65">, </span> : null}
                      </span>
                    ))}
                  </span>
                ))}
              </p>
            )}
          </>
        ) : (
          <ul className="mt-4 grid gap-x-8 border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((s) => (
              <li key={s.slug} className="border-b border-line">
                <VLink to={`/schools/${s.slug}`} className="school-pick flex items-center gap-4 py-3" data-match={s === hit}>
                  <SchoolTile school={s} on={s === hit} shared className="w-20 shrink-0" />
                  <span className="min-w-0">
                    <span className="school-pick-name block font-medium leading-tight">{s.name}</span>
                    <span className="mt-1 block text-ink/65">{s.area}{inStoreOnly(s) ? ", in store only" : `, ${s.productCount} items online`}</span>
                  </span>
                </VLink>
              </li>
            ))}
          </ul>
        )}
        {typed && matches.length === 0 && <p className="mt-2 text-ink/75"><NotListed /> <button type="button" className="min-h-11 underline" onClick={() => { setQ(""); document.getElementById(id)?.focus(); }}>Show every school</button></p>}
      </div>
    </div>
  );
}

/** The compact finder in the header and the phone menu: a field with a drop-down list. */
export function SchoolSearch({ id = "school-search", onGo }: { id?: string; onGo?: () => void }) {
  const schools = useSchools();
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

  const matches = useMemo(() => filter(schools, q).slice(0, 9), [q, schools]);
  const pick = (s: School) => { setOpen(false); setQ(""); onGo?.(); goTo(navigate, `/schools/${s.slug}`); };
  const listId = `${id}-list`;

  return (
    <div ref={box} className="relative w-full">
      <label htmlFor={id} className="sr-only">Find your school</label>
      <div className="finder-field py-1 pl-3 pr-1.5">
        <SearchIcon />
        <input
          id={id}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
          onClick={() => setOpen(true)}
          onFocus={() => { if (q) setOpen(true); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, matches.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            if (e.key === "Enter" && open && matches[active]) pick(matches[active]);
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder="Find your school"
          className="min-h-11 w-full min-w-0 bg-transparent py-1 text-base placeholder:text-ink/40"
          autoComplete="off"
          enterKeyHint="go"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && matches[active] ? `${id}-option-${matches[active].slug}` : undefined}
        />
      </div>
      {open && (
        <div className="panel-in absolute right-0 z-30 mt-2 w-full min-w-[300px] overflow-hidden rounded-[3px] border border-ink bg-white">
          <ul id={listId} role="listbox" aria-label="Matching schools">
            {matches.map((s, i) => (
              <li key={s.slug} id={`${id}-option-${s.slug}`} role="option" aria-selected={i === active} onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(s)} className={`flex min-h-11 w-full cursor-pointer items-center gap-3 px-3 py-2 text-left ${i === active ? "bg-sage-soft" : ""}`}>
                <SchoolTile school={s} on={i === active} className="w-9 shrink-0" />
                <span>{s.name}</span>
                <span className="t-small ml-auto shrink-0 text-ink/65">{inStoreOnly(s) ? "In store" : s.area}</span>
              </li>
            ))}
          </ul>
          <p className="border-t border-line px-3 py-2.5 text-ink/75"><NotListed /></p>
        </div>
      )}
    </div>
  );
}
