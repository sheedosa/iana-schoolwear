// Whether search engines may list the site. `src/data/site.ts` is protected (live checkout facts), so the switch lives here.
// While false, every page carries <meta name="robots" content="noindex, follow">: titles, descriptions, canonicals,
// Open Graph and Twitter tags, JSON-LD and the sitemap all stay, so link previews keep working. robots.txt stays open
// (link-preview bots obey a Disallow). Flip to true when the client confirms the facts and wants the site in search.
// The 404 page keeps "noindex,nofollow" and /brief/ keeps its own "noindex, nofollow" whatever this says.
export const INDEXABLE = false;

/** The robots meta for an ordinary page. */
export const ROBOTS = INDEXABLE ? "index,follow,max-image-preview:large" : "noindex, follow";
