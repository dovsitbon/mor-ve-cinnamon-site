import type { Metadata } from "next";
import site from "@/data/site.json";
import reviewsData from "@/data/reviews.json";
import { menus, shekels } from "@/lib/catalog";
import { defaultLocale, getDict, locales, ogLocale, type Locale } from "@/lib/i18n";

export function pageMeta(lang: Locale, path: string, title: string, description: string, image = "/og.jpg"): Metadata {
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])) as Record<string, string>;
  languages["x-default"] = `/${defaultLocale}${path}`;
  return {
    title,
    description,
    alternates: { canonical: `/${lang}${path}`, languages },
    openGraph: {
      type: "website",
      siteName: site.nameLatin,
      title,
      description,
      url: `/${lang}${path}`,
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/**
 * Traiteur et producteur d'événements : schema.org n'a pas de type « Caterer » ni « EventPlanner »,
 * on décrit donc un LocalBusiness + FoodEstablishment précisé par additionalType (catering, wedding planner),
 * avec ses deux services, les avis réels (aucun pour l'instant) et la FAQ, dans un seul graphe JSON-LD.
 */
export function homeJsonLd(lang: Locale) {
  const d = getDict(lang);
  const id = `${site.url}/#business`;
  const [catering, production] = d.pillars.items;
  const reviews = (reviewsData.reviews as { published?: boolean; text: string; author?: string }[])
    .filter((r) => r.published)
    .map((r) => ({ "@type": "Review", reviewBody: r.text, author: { "@type": "Person", name: r.author ?? site.nameLatin } }));
  const service = (name: string, text: string, type: string) => ({
    "@type": "Service",
    name,
    description: text,
    serviceType: type,
    provider: { "@id": id },
    areaServed: { "@type": "Country", name: "Israel" },
  });
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "FoodEstablishment"],
        "@id": id,
        name: lang === "he" ? site.name : site.nameLatin,
        alternateName: [site.name, site.nameLatin, "Mor ve Cinnamon", "מור וקינמון"],
        additionalType: ["http://www.productontology.org/id/Catering", "http://www.productontology.org/id/Wedding_planner"],
        description: d.meta.description,
        slogan: d.hero.title,
        url: `${site.url}/${lang}`,
        image: [`${site.url}/og.jpg`, `${site.url}/media/couples/hila-rotem-marche.jpg`],
        logo: `${site.url}/logo.svg`,
        telephone: site.phoneIntl,
        sameAs: [site.instagram, ...(site.facebook ? [site.facebook] : [])],
        servesCuisine: ["Israeli", "Mediterranean", "Seasonal"],
        address: { "@type": "PostalAddress", addressCountry: "IL" },
        areaServed: { "@type": "Country", name: "Israel" },
        knowsLanguage: ["he", "en", "fr", "es"],
        contactPoint: { "@type": "ContactPoint", telephone: site.phoneIntl, contactType: "customer service", availableLanguage: ["Hebrew", "English"] },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: d.catering.menusTitle,
          itemListElement: menus.map((m) => ({
            "@type": "Offer",
            name: d.catering.menus[m.id].name,
            description: d.catering.menus[m.id].text,
            ...(m.priceFrom ? { priceSpecification: { "@type": "UnitPriceSpecification", minPrice: m.priceFrom, priceCurrency: "ILS", unitText: shekels(m.priceFrom, lang) } } : {}),
          })),
        },
        ...(reviews.length ? { review: reviews } : {}),
      },
      service(catering.name, catering.text, "Catering"),
      service(production.name, production.text, "Wedding and event production"),
      {
        "@type": "FAQPage",
        mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}

export const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
