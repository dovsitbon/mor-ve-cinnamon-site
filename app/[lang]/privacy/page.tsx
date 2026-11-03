import type { Metadata } from "next";
import Link from "next/link";
import { Leaves } from "@/components/Logo";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMeta(lang, "/privacy", d.meta.legalTitle, d.meta.legalDescription);
}

// À COMPLÉTER quand Mor & Cinnamon les fournit : raison sociale, numéro d'entreprise (ע.מ / ח.פ), adresse, e-mail.
export default async function Privacy({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  const d = getDict(lang as Locale);
  return (
    <article className="mx-auto max-w-3xl px-5 pt-36 pb-28 md:pt-48 md:pb-40">
      <h1 className="display text-[1.7rem] md:text-[2.4rem] rtl:text-[2.6rem] md:rtl:text-[3.4rem]">{d.legal.title}</h1>
      <Leaves className="mt-8 h-8 w-auto text-cinnamon" strokeWidth={4} />
      <div className="mt-12 space-y-10">
        {d.legal.sections.map((s) => (
          <section key={s.title}>
            <h2 className="eyebrow">{s.title}</h2>
            <p className="lead mt-3">{s.text}</p>
          </section>
        ))}
      </div>
      <Link href={`/${lang}`} className="btn-line mt-16">
        {d.legal.back}
      </Link>
    </article>
  );
}
