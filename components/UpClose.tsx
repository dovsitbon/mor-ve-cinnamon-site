"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox, type LightboxItem, type LightboxLabels } from "@/components/Lightbox";

// Rythme asymétrique : largeur, format et décalage vertical, en boucle
const PATTERN = [
  "col-span-7 md:col-span-4 aspect-[4/5]",
  "col-span-5 md:col-span-3 mt-16 md:mt-32 aspect-[3/4]",
  "col-span-12 md:col-span-5 aspect-[5/4] md:aspect-[4/5]",
  "col-span-6 md:col-span-3 md:-mt-24 aspect-[2/3]",
  "col-span-6 md:col-span-5 aspect-[3/4] md:aspect-[5/4]",
  "col-span-12 md:col-span-4 md:mt-20 aspect-[4/5]",
];

/** Galerie « de près » : détails de table, de cuisine et de lumière, ouverts en grand au clic. */
export function UpClose({ items, labels, openLabel }: { items: LightboxItem[]; labels: LightboxLabels; openLabel: string }) {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <>
      <ul className="grid grid-cols-12 gap-3 md:gap-8">
        {items.map((it, i) => (
          <li key={it.src} className={`${PATTERN[i % PATTERN.length]} relative`}>
            <button type="button" onClick={() => setIndex(i)} className="zoom block h-full w-full cursor-zoom-in overflow-hidden bg-linen-deep" aria-label={`${openLabel}, ${it.alt}`}>
              <Image src={it.src} alt={it.alt} fill sizes="(min-width: 768px) 38vw, 55vw" quality={70} className="object-cover" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox items={items} index={index} onIndex={setIndex} labels={labels} />
    </>
  );
}
