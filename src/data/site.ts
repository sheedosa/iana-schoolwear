// Verified against iafashions.co.uk on 25 Oct 2026 (About, Contact, Terms, Size Guide, Want-us-to-supply pages).
// Delivery, returns and exchanges confirmed by the client in November 2026.
export const SITE = {
  name: "I&A Schoolwear",
  legalName: "I & A Fashions Limited, trading as I & A School Uniform",
  companyNumber: "07202123",
  vat: "338770178",
  since: 1993,
  address: { street: "84 Mitcham Road", area: "Tooting", city: "London", postcode: "SW17 9NG" },
  phone: "020 8767 8613",
  phoneIntl: "+442087678613",
  hours: "Monday to Sunday, 9am to 6pm",
  email: "", // no public email on the current site; contact is by phone or form
  social: { instagram: "https://instagram.com/iafashions", facebook: "https://facebook.com/iafashions" },
  url: "https://sheedosa.github.io/iana-schoolwear",
  currentSite: "https://iafashions.co.uk",
  memberships: ["Schoolwear Association", "Federation of Small Businesses"],
  delivery: {
    standard: { price: 4.95, time: "5 working days" },
    express: { price: 7.95, time: "48 hours" },
    freeOver: 100,
    schoolDropOff: 2,
    collect: "Click and collect from 84 Mitcham Road, Tooting",
  },
  returns: {
    days: 28,
    excluded: ["suits", "bridal dresses", "prom dresses"],
    embroidered: "Embroidered items can be exchanged for the same item in a different size.",
  },
  // Things the client should confirm before launch (not stated on the current site):
  toConfirm: [
    "delivery cut-off times for express and standard",
    "school drop-off: which schools, and on which days",
    "whether embroidered items can be refunded, or exchanged for size only, and within how long",
    "which schools I&A officially supplies (the list on the site is from the current website)",
    "uniform leaflet for each school, showing compulsory and optional items (the client will send these; until then school pages group items as crested or plain only)",
    "click and collect: confirm there is no charge (the delivery page shows no price for it until then)",
    "school crest artwork, with each school's permission",
  ],
};

export const money = (n: number) => `£${n.toFixed(2)}`;
/** The one-line delivery summary used in the header strip, footer and product pages. */
export const DELIVERY_LINE = `Free delivery from £${SITE.delivery.freeOver} · School drop-off £${SITE.delivery.schoolDropOff}`;
