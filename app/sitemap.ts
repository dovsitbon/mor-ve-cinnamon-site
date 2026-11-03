import type { MetadataRoute } from "next";
import site from "@/data/site.json";
import { defaultLocale, locales } from "@/lib/locales";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/privacy"].flatMap((path) =>
    locales.map((lang) => ({
      url: `${site.url}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: path ? ("yearly" as const) : ("weekly" as const),
      priority: path ? 0.2 : lang === defaultLocale ? 1 : 0.8,
      alternates: { languages: { ...Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}`])), "x-default": `${site.url}/${defaultLocale}${path}` } },
    })),
  );
}
