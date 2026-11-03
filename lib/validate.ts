import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { EVENT_TYPES, isEmail, isPhone, KOSHER, SERVICES, SOURCES, VENUES, type Quote } from "@/lib/quote";

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.slice(0, max).trim() : "");
const pick = <T extends string>(v: unknown, list: readonly T[]): T | "" => (list as readonly string[]).includes(str(v, 20)) ? (str(v, 20) as T) : "";

export function parseLang(v: unknown): Locale {
  return typeof v === "string" && isLocale(v) ? v : "he";
}

/** Revalide côté serveur tout ce qui vient du formulaire de devis. */
export function parseQuote(raw: unknown, lang: Locale): Quote | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const budget = str(r.budget, 60);
  const q: Quote = {
    eventType: pick(r.eventType, EVENT_TYPES) || "other",
    guests: str(r.guests, 6).replace(/\D/g, ""),
    date: /^\d{4}-\d{2}-\d{2}$/.test(str(r.date, 10)) ? str(r.date, 10) : "",
    venue: pick(r.venue, VENUES),
    venueName: str(r.venueName, 160),
    kosher: pick(r.kosher, KOSHER),
    source: pick(r.source, SOURCES),
    service: pick(r.service, SERVICES) || "both",
    budget: getDict(lang).quote.fields.budgets.includes(budget) ? budget : "",
    name: str(r.name, 120),
    phone: str(r.phone, 30),
    email: str(r.email, 160),
    message: str(r.message, 1500),
  };
  if (!q.name || !isPhone(q.phone)) return null;
  if (q.email && !isEmail(q.email)) q.email = "";
  return q;
}

export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
