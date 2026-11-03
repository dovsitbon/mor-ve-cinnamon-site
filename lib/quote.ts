import site from "@/data/site.json";
import calendar from "@/data/dates.json";
import type { Dict } from "@/lib/i18n";
import { intlLocale, type Locale } from "@/lib/locales";

// Les champs de leur message d'accueil WhatsApp : type d'événement, invités, date estimée,
// lieu (trouvé ou en recherche), casher ou non, comment ils nous ont connus ; puis prestations et budget.
export const EVENT_TYPES = ["wedding", "henna", "barmitzvah", "family", "corporate", "other"] as const;
export const VENUES = ["have", "search"] as const;
export const KOSHER = ["kosher", "not"] as const;
export const SOURCES = ["instagram", "facebook", "friends", "event", "supplier", "google", "other"] as const;
export const SERVICES = ["catering", "production", "both"] as const;
export type EventType = (typeof EVENT_TYPES)[number];
export type Venue = (typeof VENUES)[number];
export type Kosher = (typeof KOSHER)[number];
export type Source = (typeof SOURCES)[number];
export type Service = (typeof SERVICES)[number];

export type Quote = {
  eventType: EventType;
  guests: string;
  date: string;
  venue: Venue | "";
  venueName: string;
  kosher: Kosher | "";
  source: Source | "";
  service: Service;
  budget: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

export const bookedDates = new Set<string>(calendar.booked as string[]);

export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

/** Date du jour au format AAAA-MM-JJ, en heure d'Israël. */
export function isoDay(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function formatDay(iso: string, lang: Locale) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[lang], { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Récapitulatif envoyé sur WhatsApp et par e-mail, dans la langue du visiteur. */
export function quoteMessage(q: Quote, lang: Locale, d: Dict, ref?: string) {
  const m = d.quote.message;
  const f = d.quote.fields;
  // Espace insécable avant les deux-points en français
  const c = lang === "fr" ? "\u00a0:" : ":";
  const venue = q.venue ? [f.venues[q.venue], q.venueName].filter(Boolean).join(" · ") : q.venueName;
  const event = [
    `${m.event}${c} ${f.eventTypes[q.eventType]}`,
    q.guests ? `${m.guests}${c} ${q.guests}` : "",
    q.date ? `${m.date}${c} ${formatDay(q.date, lang)}` : "",
    venue ? `${m.venue}${c} ${venue}` : "",
    q.kosher ? `${m.kosher}${c} ${f.kosherOptions[q.kosher]}` : "",
    q.source ? `${m.source}${c} ${f.sources[q.source]}` : "",
  ];
  const service = [`${m.services}${c} ${f.serviceOptions[q.service]}`, q.budget ? `${m.budget}${c} ${q.budget}` : ""];
  const contact = [
    `${m.name}${c} ${q.name}`,
    `${m.phone}${c} ${q.phone}`,
    q.email ? `${m.email}${c} ${q.email}` : "",
    q.message ? `${m.notes}${c} ${q.message}` : "",
    ref ? `${m.ref}${c} ${ref}` : "",
  ];
  return [[`*${m.title}*`], event, service, contact, [m.closing]].map((block) => block.filter(Boolean).join("\n")).join("\n\n");
}
