"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox, type LightboxItem, type LightboxLabels } from "@/components/Lightbox";
import { Reveal } from "@/components/Reveal";
import { instagramOf } from "@/lib/catalog";

export type WeddingCard = {
  id: string;
  names: string;
  note: string;
  date: string | null;
  cover: LightboxItem;
  photos: LightboxItem[];
  credits: { role: string; handle: string }[];
};
type Labels = LightboxLabels & { open: string; photos: string; with: string };

// Rythme asymétrique : une grande carte, puis des paires décalées
const LAYOUT = [
  { span: "col-span-12 md:col-span-7", box: "aspect-[4/5]" },
  { span: "col-span-12 md:col-span-5 md:mt-40", box: "aspect-[3/4]" },
  { span: "col-span-6 md:col-span-4", box: "aspect-[3/4]" },
  { span: "col-span-6 md:col-span-4 md:mt-24", box: "aspect-[3/4]" },
  { span: "col-span-12 md:col-span-4 md:-mt-12", box: "aspect-[4/5] md:aspect-[3/4]" },
];

/** Une carte par couple (photo, prénoms, date si connue) ; un clic ouvre sa petite galerie. */
export function Weddings({ items, labels }: { items: WeddingCard[]; labels: Labels }) {
  const [open, setOpen] = useState<{ w: number; i: number } | null>(null);
  const current = open ? items[open.w] : null;

  return (
    <>
      <ul className="grid grid-cols-12 gap-x-4 gap-y-14 md:gap-x-10 md:gap-y-20">
        {items.map((w, k) => (
          <Reveal as="li" key={w.id} delay={(k % 2) * 0.12} className={LAYOUT[k % LAYOUT.length].span}>
            <button
              type="button"
              onClick={() => setOpen({ w: k, i: 0 })}
              className={`zoom group relative block w-full cursor-zoom-in overflow-hidden bg-linen-deep ${LAYOUT[k % LAYOUT.length].box}`}
              aria-label={labels.open.replace("{names}", w.names)}
            >
              <Image src={w.cover.src} alt={w.cover.alt} fill sizes={k === 0 ? "(min-width: 768px) 55vw, 100vw" : "(min-width: 768px) 34vw, 50vw"} quality={70} className="object-cover" />
              <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/45 to-transparent" aria-hidden="true" />
              <span className="nav-link absolute start-4 bottom-4 text-cream md:start-6 md:bottom-6">{labels.photos.replace("{count}", String(w.photos.length))}</span>
            </button>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h3 className="display text-[1.05rem] md:text-[1.2rem] rtl:text-[1.6rem] md:rtl:text-[1.85rem]">{w.names}</h3>
              <span className="num shrink-0 text-[0.75rem] text-cinnamon-ink">{String(k + 1).padStart(3, "0")}</span>
            </div>
            <p className="accent mt-1 text-[1.15rem] text-muted rtl:text-[1.05rem]">
              {w.note}
              {w.date && <span className="not-italic"> · {w.date}</span>}
            </p>
            {w.credits.length > 0 && (
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">
                <span className="text-ink/70">{labels.with} </span>
                {w.credits.map((c, i) => (
                  <span key={c.handle}>
                    {i > 0 && " · "}
                    {c.role}{" "}
                    <a href={instagramOf(c.handle)} target="_blank" rel="noopener noreferrer" className="link-line text-ink" dir="ltr">
                      @{c.handle}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </Reveal>
        ))}
      </ul>
      <Lightbox items={current?.photos ?? []} index={open ? open.i : null} onIndex={(i) => setOpen(i === null || !open ? null : { w: open.w, i })} labels={labels} title={current?.names} />
    </>
  );
}
