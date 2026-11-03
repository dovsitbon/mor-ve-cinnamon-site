"use client";

import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/locales";

const LABELS: Record<Locale, string> = { he: "עב", en: "EN", fr: "FR", es: "ES" };
const NAMES: Record<Locale, string> = { he: "עברית", en: "English", fr: "Français", es: "Español" };

export function LangSwitch({ lang, label, className = "" }: { lang: Locale; label: string; className?: string }) {
  const pathname = usePathname() || `/${lang}`;
  const rest = pathname.replace(/^\/(he|en|fr|es)(?=\/|$)/, "");

  return (
    <nav aria-label={label} className={`flex items-center gap-2 text-[0.75rem] tracking-[0.16em] ${className}`} dir="ltr">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="opacity-40">
              ·
            </span>
          )}
          <a
            href={`/${l}${rest}`}
            hrefLang={l}
            lang={l}
            aria-label={NAMES[l]}
            aria-current={l === lang ? "true" : undefined}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000;samesite=lax`;
            }}
            className={`inline-flex min-h-10 min-w-6 items-center justify-center transition-opacity ${l === "he" ? "font-[family-name:var(--font-assistant)] text-[0.875rem] font-semibold tracking-normal" : ""} ${l === lang ? "opacity-100" : "opacity-55 hover:opacity-100"}`}
          >
            {LABELS[l]}
          </a>
        </span>
      ))}
    </nav>
  );
}
