import Link from "next/link";
import site from "@/data/site.json";
import { FacebookIcon, InstagramIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { LogoFull } from "@/components/Logo";
import type { Dict, Locale } from "@/lib/i18n";
import { waLink } from "@/lib/quote";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const year = new Date().getFullYear();
  const home = `/${lang}`;
  const nav = [
    { href: `${home}#catering`, label: d.nav.catering },
    { href: `${home}#production`, label: d.nav.production },
    { href: `${home}#weddings`, label: d.nav.weddings },
    { href: `${home}#process`, label: d.nav.process },
    { href: `${home}#contact`, label: d.nav.contact },
  ];
  return (
    <footer className="bg-plum text-cream">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 pt-20 pb-12 md:grid-cols-[1.3fr_1fr_1fr] md:px-10 md:pt-28">
        <div>
          <LogoFull className="h-auto w-44 text-cream" title={site.name} />
          <p className="mt-7 max-w-xs text-[0.9375rem] leading-relaxed text-cream/80">{d.footer.tagline}</p>
        </div>
        <div>
          <p className="eyebrow !text-gold">{d.footer.contact}</p>
          <ul className="mt-5 space-y-3 text-[0.9375rem]">
            <li>
              <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-3 hover:text-gold">
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`tel:${site.phoneIntl.replace(/[\s-]/g, "")}`} className="inline-flex min-h-8 items-center gap-3 hover:text-gold">
                <PhoneIcon className="h-4 w-4" />
                <span dir="ltr">{site.phone}</span>
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-3 hover:text-gold">
                <InstagramIcon className="h-4 w-4" />
                <span dir="ltr">{site.instagramHandle}</span>
              </a>
            </li>
            {site.facebook && (
              <li>
                <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-3 hover:text-gold">
                  <FacebookIcon className="h-4 w-4" />
                  <span>{site.facebookName}</span>
                </a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <p className="eyebrow !text-gold">{d.footer.explore}</p>
          <ul className="mt-5 space-y-3 text-[0.9375rem] text-cream/85">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-8 items-center hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={`${home}/privacy`} className="inline-flex min-h-8 items-center hover:text-gold">
                {d.footer.legal}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 border-t border-cream/15 px-5 py-6 text-[0.8125rem] text-cream/70 md:flex-row md:justify-between md:px-10">
        <p>
          © {year} <span translate="no">{site.nameLatin}</span> · {d.footer.rights}
        </p>
        <p>{d.footer.photos}</p>
      </div>
    </footer>
  );
}
