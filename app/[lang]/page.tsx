import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import site from "@/data/site.json";
import reviewsData from "@/data/reviews.json";
import { HeroMedia } from "@/components/HeroMedia";
import { InstagramIcon, MinusIcon, PhoneIcon, PlusIcon, WhatsAppIcon } from "@/components/icons";
import { Leaf, Leaves } from "@/components/Logo";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal } from "@/components/Reveal";
import { UpClose } from "@/components/UpClose";
import { Weddings, type WeddingCard } from "@/components/Weddings";
import { instagramOf, menus, partners, shekels, weddingDate, weddings } from "@/lib/catalog";
import { altOf, fill, getDict, isLocale, type Dict, type Locale } from "@/lib/i18n";
import { img } from "@/lib/media";
import { waLink } from "@/lib/quote";
import { homeJsonLd, jsonLd, pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMeta(lang, "", d.meta.title, d.meta.description);
}

/** Photo de public/media avec son texte alternatif dans la langue de la page. */
function Photo({ d, src, sizes, className = "", quality = 70 }: { d: Dict; src: string; sizes: string; className?: string; quality?: number }) {
  return <Image src={img(src).src} alt={altOf(d, src)} fill sizes={sizes} quality={quality} className={`object-cover ${className}`} />;
}

function SectionHead({ eyebrow, title, text, center = false, id, light = false }: { eyebrow: string; title: string; text?: string; center?: boolean; id?: string; light?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${light ? "!text-linen" : ""}`}>{eyebrow}</p>
      <h2 id={id} className="display mt-6 text-[1.55rem] md:text-[2.15rem] rtl:text-[2.3rem] md:rtl:text-[3.2rem]">
        {title}
      </h2>
      {text && <p className={`lead mt-6 ${center ? "mx-auto max-w-2xl" : ""} ${light ? "!text-cream/80" : ""}`}>{text}</p>}
    </Reveal>
  );
}

const PILLARS = ["/media/stations-buffets/station-pates-tomates.jpg", "/media/lounges-deco/tables-hautes-roses.jpg", "/media/couples/einav-davidi-olivier.jpg"];
const PILLAR_HREF = ["#catering", "#production", "#weddings"];
const PRODUCTION = [
  "/media/equipe-montage/montage-tipis.jpg",
  "/media/lounges-deco/lounge-coussins-verts.jpg",
  "/media/lounges-deco/tables-bois-guirlandes.jpg",
  "/media/equipe-montage/dressage-assiettes.jpg",
  "/media/equipe-montage/fleuriste-hortensias.jpg",
  "/media/chupa-ceremonies/houppa-voilages-tapis.jpg",
];
const BLEED = ["/media/lounges-deco/tipi-lounge-dore.jpg", "/media/couples/einav-davidi-tables.jpg", "/media/lounges-deco/tables-coucher-soleil.jpg"];
const UP_CLOSE = [
  "/media/galerie/spritz-bar.jpg",
  "/media/cuisine/meringue-coulis.jpg",
  "/media/galerie/champagne-grenades.jpg",
  "/media/stations-buffets/installation-legumes.jpg",
  "/media/cuisine/choux-presentoir.jpg",
  "/media/lounges-deco/tournesols-vase-blanc.jpg",
  "/media/stations-buffets/grill-flammes.jpg",
  "/media/cuisine/bouchees-piment.jpg",
  "/media/galerie/verres-alignes.jpg",
  "/media/lounges-deco/table-polaroids-grenades.jpg",
  "/media/cuisine/crostinis-planche.jpg",
  "/media/galerie/invites-desserts.jpg",
];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang: l } = await params;
  const lang = l as Locale;
  const d = getDict(lang);
  const photo = (src: string) => ({ ...img(src), alt: altOf(d, src) });
  const reviews = (reviewsData.reviews as { published?: boolean; text: string; author?: string }[]).filter((r) => r.published);

  const weddingCards: WeddingCard[] = weddings.map((w) => ({
    id: w.id,
    names: d.weddings.names[w.id],
    note: d.weddings.notes[w.id],
    date: w.date ? weddingDate(w.date, lang) : null,
    cover: photo(w.cover),
    photos: w.photos.map(photo),
    credits: w.credits.map(([role, handle]) => ({ role: d.weddings.roles[role], handle })),
  }));
  const lightboxLabels = { close: d.weddings.close, prev: d.weddings.prev, next: d.weddings.next, counter: d.weddings.counter };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(homeJsonLd(lang))} />

      {/* ——— Hero ——— */}
      <section className="relative flex h-[100svh] min-h-[600px] items-end overflow-hidden bg-ink text-cream" aria-labelledby="hero-title">
        <HeroMedia
          tall={img("/media/hero/poster-tall.jpg")}
          panel={img("/media/hero/poster-panel.jpg")}
          photo={img("/media/cuisine/assiette-boeuf-salade.jpg")}
          alt={altOf(d, "poster-tall")}
          photoAlt={altOf(d, "assiette-boeuf-salade")}
          videoTall="/media/hero-tall.mp4"
          videoPanel="/media/hero-panel.mp4"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(46,37,34,0.42)_0%,rgba(46,37,34,0.06)_30%,rgba(46,37,34,0.2)_58%,rgba(46,37,34,0.72)_100%)]" />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-[max(5.5rem,12svh)] text-center md:px-10 md:pb-28">
          <p className="eyebrow rise mx-auto !text-cream/90 max-sm:!tracking-[0.22em]" style={{ animationDelay: "0.2s" }} dir="ltr">
            {d.hero.eyebrow}
          </p>
          <h1 id="hero-title" className="display-hero mx-auto mt-6 max-w-5xl text-[2.05rem] md:text-[3.4rem] lg:text-[4.1rem] rtl:text-[2.75rem] md:rtl:text-[4.6rem] lg:rtl:text-[5.4rem]">
            {d.hero.title}
          </h1>
          <div className="rise mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6" style={{ animationDelay: "0.5s" }}>
            <Link href="#contact" className="btn-line on-dark min-w-60">
              {d.hero.cta}
            </Link>
            <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="nav-link inline-flex min-h-12 items-center gap-2.5 px-4 text-cream/90 transition-colors hover:text-cream">
              <WhatsAppIcon className="h-4 w-4" />
              <span className="link-line">{d.hero.whatsapp}</span>
            </a>
          </div>
        </div>
        <a href="#about" className="absolute bottom-0 left-1/2 hidden h-16 w-10 -translate-x-1/2 justify-center md:flex" aria-label={d.hero.scroll}>
          <span className="scroll-line block h-full w-px bg-cream/70" />
        </a>
      </section>

      {/* ——— Manifeste ——— */}
      <section id="about" className="scroll-mt-20 px-5 py-28 md:py-44" aria-labelledby="manifesto-title">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{d.manifesto.eyebrow}</p>
          <h2 id="manifesto-title" className="display mt-7 text-[1.45rem] md:text-[2rem] rtl:text-[2.2rem] md:rtl:text-[3rem]">
            {d.manifesto.title}
          </h2>
          <p className="lead mx-auto mt-8 max-w-2xl">{d.manifesto.text}</p>
          <Leaves className="mx-auto mt-12 h-9 w-auto text-cinnamon" strokeWidth={4} />
          <a href="#what" className="link-line nav-link mt-10 inline-block">
            {d.manifesto.link}
          </a>
        </Reveal>
      </section>

      {/* ——— 001 / 002 / 003 ——— */}
      <section id="what" className="scroll-mt-20 bg-linen px-5 py-24 md:px-10 md:py-36" aria-labelledby="pillars-title">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-end justify-between gap-6 border-b border-line pb-6">
            <h2 id="pillars-title" className="display text-[1.05rem] md:text-[1.25rem] rtl:text-[1.6rem] md:rtl:text-[2rem]">
              {d.pillars.title}
            </h2>
            <p className="eyebrow hidden sm:block">{d.pillars.eyebrow}</p>
          </div>
          <ul className="mt-12 grid gap-14 md:mt-16 md:grid-cols-3 md:gap-10">
            {d.pillars.items.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 0.12}>
                <Link href={PILLAR_HREF[i]} className="group block">
                  <div className="zoom relative aspect-[3/4] overflow-hidden bg-linen-deep">
                    <Photo d={d} src={PILLARS[i]} sizes="(min-width: 768px) 31vw, 92vw" />
                  </div>
                  <p className="num mt-6 text-[0.8125rem] text-cinnamon-ink">{String(i + 1).padStart(3, "0")}</p>
                  <h3 className="display mt-3 text-[1.2rem] md:text-[1.35rem] rtl:text-[1.9rem]">{p.name}</h3>
                  <p className="eyebrow mt-2 !text-muted">{p.label}</p>
                  <p className="mt-4 max-w-sm leading-[1.8] text-muted">{p.text}</p>
                  <span className="link-line nav-link mt-6 inline-block">{p.link}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— Le traiteur ——— */}
      <section id="catering" className="scroll-mt-20 px-5 py-24 md:px-10 md:py-40" aria-labelledby="catering-title">
        <div className="mx-auto grid max-w-[1400px] items-center gap-16 md:grid-cols-[1fr_1.1fr] md:gap-24">
          <div>
            <SectionHead id="catering-title" eyebrow={d.catering.eyebrow} title={d.catering.title} text={d.catering.text} />
            <Reveal delay={0.15}>
              <p className="accent mt-10 max-w-md border-s border-cinnamon/50 ps-6 text-[1.5rem] leading-snug text-plum rtl:text-[1.45rem]">{d.catering.quote}</p>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="relative">
            <div className="zoom relative ms-auto aspect-[4/5] w-[82%] overflow-hidden bg-linen-deep">
              <Photo d={d} src="/media/cuisine/boeuf-pommes-de-terre.jpg" sizes="(min-width: 768px) 42vw, 80vw" />
            </div>
            <div className="zoom absolute start-0 -bottom-12 aspect-[3/4] w-[42%] overflow-hidden border-[6px] border-cream bg-linen-deep md:-bottom-16">
              <Photo d={d} src="/media/stations-buffets/chef-brochettes-braise.jpg" sizes="(min-width: 768px) 20vw, 42vw" />
            </div>
          </Reveal>
        </div>

        {/* Exemples de menus */}
        <div className="mx-auto mt-36 max-w-[1400px] md:mt-48">
          <SectionHead eyebrow={d.catering.menusEyebrow} title={d.catering.menusTitle} text={d.catering.menusNote} center />
          <ul className="mx-auto mt-16 grid max-w-xl gap-8 md:mt-20 lg:max-w-none lg:grid-cols-3">
            {menus.map((m, i) => {
              const t = d.catering.menus[m.id];
              return (
                <Reveal as="li" key={m.id} delay={i * 0.12} className="flex flex-col border border-line bg-cream">
                  <div className="zoom relative aspect-[4/3] overflow-hidden bg-linen-deep">
                    <Photo d={d} src={m.image} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 576px, 92vw" />
                  </div>
                  <div className="flex flex-1 flex-col p-7 md:p-9">
                    <p className="num text-[0.75rem] text-cinnamon-ink">{String(i + 1).padStart(3, "0")}</p>
                    <h3 className="display mt-3 text-[1.1rem] rtl:text-[1.75rem]">{t.name}</h3>
                    <p className="mt-3 leading-[1.75] text-muted">{t.text}</p>
                    <div className="mt-6 h-px w-12 bg-cinnamon/60" />
                    <ul className="mt-6 mb-10 space-y-3 text-[0.9375rem]">
                      {t.dishes.map((dish) => (
                        <li key={dish} className="flex items-start gap-3">
                          <Leaf className="mt-1.5 h-3 w-auto shrink-0 text-olive" />
                          <span>{dish}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line pt-6">
                      <span className="text-[0.875rem] text-muted">{m.priceFrom ? fill(d.catering.priceFrom, { price: shekels(m.priceFrom, lang) }) : d.catering.onRequest}</span>
                      <Link href="#contact" className="link-line nav-link shrink-0">
                        {d.catering.menuCta}
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ——— Pleine largeur : le mariage dans la ferme des parents ——— */}
      <section className="relative flex min-h-[86svh] items-center justify-center overflow-hidden bg-ink text-cream md:min-h-[82vh]" aria-labelledby="bleed-title">
        <div className="absolute inset-0 md:grid md:grid-cols-3 md:gap-px">
          {BLEED.map((src, i) => (
            <div key={src} className={`relative h-full ${i === 1 ? "" : "hidden md:block"}`}>
              <Photo d={d} src={src} sizes="(min-width: 768px) 34vw, 100vw" />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-ink/45" />
        <Reveal className="relative px-6 text-center">
          <p className="eyebrow !text-gold">{d.bleed.eyebrow}</p>
          <h2 id="bleed-title" className="display-hero mt-6 text-[2.3rem] md:text-[3.6rem] rtl:text-[3.2rem] md:rtl:text-[5rem]">
            {d.bleed.title}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[1.0625rem] leading-relaxed text-cream/90">{d.bleed.text}</p>
        </Reveal>
      </section>

      {/* ——— La production ——— */}
      <section id="production" className="scroll-mt-20 px-5 py-24 md:px-10 md:py-40" aria-labelledby="production-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead id="production-title" eyebrow={d.production.eyebrow} title={d.production.title} text={d.production.text} />
          <ul className="mt-16 grid gap-x-10 gap-y-16 sm:grid-cols-2 md:mt-24 lg:grid-cols-3">
            {d.production.items.map((it, i) => (
              <Reveal as="li" key={it.name} delay={(i % 3) * 0.1}>
                <div className="zoom relative aspect-[4/5] overflow-hidden bg-linen-deep">
                  <Photo d={d} src={PRODUCTION[i]} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw" />
                </div>
                <div className="mt-6 flex items-baseline gap-4">
                  <span className="num text-[0.75rem] text-cinnamon-ink">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display text-[1.05rem] rtl:text-[1.6rem]">{it.name}</h3>
                </div>
                <p className="mt-3 max-w-sm leading-[1.8] text-muted">{it.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— Comment ça marche ——— */}
      <section id="process" className="scroll-mt-20 bg-olive px-5 py-24 text-cream md:px-10 md:py-36" aria-labelledby="process-title">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-10 md:grid-cols-2 md:items-end">
            <SectionHead id="process-title" eyebrow={d.process.eyebrow} title={d.process.title} light />
            <Reveal delay={0.1}>
              <p className="accent max-w-lg text-[1.45rem] leading-snug text-cream/90 md:ms-auto rtl:text-[1.4rem]">{d.process.quote}</p>
            </Reveal>
          </div>
          <ol className="mt-16 grid gap-px overflow-hidden border border-cream/15 bg-cream/15 sm:grid-cols-2 md:mt-24 lg:grid-cols-3">
            {d.process.steps.map((s, i) => (
              <li key={s.name} className="bg-olive p-8 md:p-10">
                <Reveal delay={(i % 3) * 0.1}>
                  <span className="num text-[0.8125rem] text-linen">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display mt-5 text-[1.05rem] rtl:text-[1.6rem]">{s.name}</h3>
                  <p className="mt-3 leading-[1.8] text-cream/90">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— Nos mariages ——— */}
      <section id="weddings" className="scroll-mt-20 px-5 py-24 md:px-10 md:py-40" aria-labelledby="weddings-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead id="weddings-title" eyebrow={d.weddings.eyebrow} title={d.weddings.title} text={d.weddings.text} />
          <div className="mt-16 md:mt-24">
            <Weddings items={weddingCards} labels={{ ...lightboxLabels, open: d.weddings.open, photos: d.weddings.photos, with: d.weddings.with }} />
          </div>
        </div>
      </section>

      {/* ——— De près ——— */}
      <section className="bg-linen px-5 py-24 md:px-10 md:py-36" aria-labelledby="upclose-title">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-end">
            <SectionHead id="upclose-title" eyebrow={d.upClose.eyebrow} title={d.upClose.title} />
            <Reveal delay={0.1}>
              <p className="lead max-w-md md:ms-auto">{d.upClose.text}</p>
            </Reveal>
          </div>
          <div className="mt-14 md:mt-20">
            <UpClose items={UP_CLOSE.map(photo)} labels={lightboxLabels} openLabel={d.upClose.open} />
          </div>
        </div>
      </section>

      {/* ——— Partenaires (à valider avec Mor & Cinnamon) ——— */}
      <section className="px-5 py-24 md:px-10 md:py-32" aria-labelledby="partners-title">
        <div className="mx-auto max-w-[1100px]">
          <SectionHead id="partners-title" eyebrow={d.partners.eyebrow} title={d.partners.title} text={d.partners.text} center />
          <ul className="mt-14 grid grid-cols-2 gap-x-6 border-t border-line sm:grid-cols-3 lg:grid-cols-4">
            {partners.map((p) => (
              <li key={p.handle} className="border-b border-line py-5">
                <a href={instagramOf(p.handle)} target="_blank" rel="noopener noreferrer" className="group block">
                  <span className="eyebrow !text-muted">{d.weddings.roles[p.role]}</span>
                  <span className="mt-1.5 block text-[0.9375rem] text-ink transition-colors group-hover:text-cinnamon-ink" dir="ltr" translate="no">
                    @{p.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— Avis ——— */}
      <section className="bg-linen px-5 py-24 md:px-10 md:py-32" aria-labelledby="reviews-title">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHead id="reviews-title" eyebrow={d.reviews.eyebrow} title={d.reviews.title} center />
          {/* À REMPLIR avec de vrais avis de couples : data/reviews.json (published: true). Aucun avis n'est inventé. */}
          {reviews.length > 0 ? (
            <ul className="mt-14 space-y-14">
              {reviews.map((r) => (
                <li key={r.text}>
                  <blockquote className="accent text-[1.5rem] leading-snug text-plum">{r.text}</blockquote>
                  {r.author && <p className="eyebrow mt-5">{r.author}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <Reveal delay={0.1}>
              <p className="accent mx-auto mt-10 max-w-xl text-[1.45rem] leading-snug text-plum rtl:text-[1.4rem]">{d.reviews.empty}</p>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn-line mt-10">
                <InstagramIcon className="h-4 w-4" />
                {d.reviews.cta}
              </a>
            </Reveal>
          )}
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section className="px-5 py-24 md:px-10 md:py-36" aria-labelledby="faq-title">
        <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <SectionHead id="faq-title" eyebrow={d.faq.eyebrow} title={d.faq.title} />
          <div className="border-t border-line">
            {d.faq.items.map((f) => (
              <details key={f.q} className="group border-b border-line">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.0625rem] rtl:text-[1.125rem]">
                  <span>{f.q}</span>
                  <PlusIcon className="h-4 w-4 shrink-0 group-open:hidden" />
                  <MinusIcon className="hidden h-4 w-4 shrink-0 group-open:block" />
                </summary>
                <p className="pb-7 leading-[1.85] text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Demande de devis ——— */}
      <section id="contact" className="scroll-mt-20 bg-linen px-5 py-24 md:px-10 md:py-36" aria-labelledby="contact-title">
        <div className="mx-auto grid max-w-[1300px] gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHead id="contact-title" eyebrow={d.quote.eyebrow} title={d.quote.title} text={d.quote.text} />
            <Reveal delay={0.1}>
              <ul className="mt-10 space-y-4 text-[0.9375rem]">
                <li>
                  <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-3 hover:text-cinnamon-ink">
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href={`tel:${site.phoneIntl.replace(/[\s-]/g, "")}`} className="inline-flex min-h-10 items-center gap-3 hover:text-cinnamon-ink">
                    <PhoneIcon className="h-4 w-4" />
                    <span dir="ltr">{site.phone}</span>
                  </a>
                </li>
                <li>
                  <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-3 hover:text-cinnamon-ink">
                    <InstagramIcon className="h-4 w-4" />
                    <span dir="ltr">{site.instagramHandle}</span>
                  </a>
                </li>
              </ul>
              <div className="relative mt-12 hidden aspect-[4/5] w-2/3 overflow-hidden bg-linen-deep lg:block">
                <Photo d={d} src="/media/couples/hila-rotem-mains.jpg" sizes="22vw" />
              </div>
            </Reveal>
          </div>
          <div className="border border-line bg-cream p-6 sm:p-10 md:p-14">
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}
