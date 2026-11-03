// Langues du site, sans les textes : importable côté client sans embarquer les 4 dictionnaires.
export const locales = ["he", "en", "fr", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "he";

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);
export const dirOf = (lang: Locale) => (lang === "he" ? "rtl" : "ltr");

export const ogLocale: Record<Locale, string> = { he: "he_IL", en: "en_US", fr: "fr_FR", es: "es_ES" };
export const intlLocale: Record<Locale, string> = { he: "he-IL", en: "en-GB", fr: "fr-FR", es: "es-ES" };
