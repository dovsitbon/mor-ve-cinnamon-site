import menusData from "@/data/menus.json";
import weddingsData from "@/data/weddings.json";
import partnersData from "@/data/partners.json";
import type { Dict } from "@/lib/i18n";
import { intlLocale, type Locale } from "@/lib/locales";

export type MenuId = "stations" | "served" | "desserts";
export type Menu = { id: MenuId; image: string; priceFrom: number | null };
export const menus = menusData.menus as Menu[];

export type Role = keyof Dict["weddings"]["roles"];
export type WeddingId = keyof Dict["weddings"]["names"];
export type Wedding = { id: WeddingId; date: string | null; cover: string; credits: [Role, string][]; photos: string[] };
export const weddings = weddingsData.weddings as Wedding[];

export type Partner = { handle: string; role: Role; show: boolean };
export const partners = (partnersData.partners as Partner[]).filter((p) => p.show);

export const instagramOf = (handle: string) => `https://www.instagram.com/${handle}/`;

/** Prix en shekels, au format de la langue. */
export const shekels = (n: number, lang: Locale) => new Intl.NumberFormat(intlLocale[lang], { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n);

/** Date d'un mariage au format court de la langue (ex. 9.10.2026 en hébreu). */
export function weddingDate(iso: string, lang: Locale) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[lang], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}
