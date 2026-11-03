"use client";

import { getImageProps } from "next/image";
import { useEffect, useState } from "react";
import type { Img } from "@/lib/media";

const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/**
 * Hero plein écran. Leurs vidéos sont verticales : sur mobile, la boucle du couple remplit l'écran ;
 * sur ordinateur, diptyque (la même boucle en 4:5 à côté d'une photo nette qui zoome très lentement),
 * pour ne jamais agrandir une vidéo verticale jusqu'au flou.
 * L'image fixe (LCP) s'affiche d'abord ; la vidéo se charge après le rendu, jamais si l'utilisateur
 * préfère réduire les animations ou économise ses données.
 */
export function HeroMedia({ tall, panel, photo, alt, photoAlt, videoTall, videoPanel }: { tall: Img; panel: Img; photo: Img; alt: string; photoAlt: string; videoTall: string; videoPanel: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || /2g|3g/.test(conn?.effectiveType ?? "")) return;
    let t: ReturnType<typeof setTimeout>;
    const start = () => (t = setTimeout(() => setSrc(window.matchMedia("(min-width: 768px)").matches ? videoPanel : videoTall), 900));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", start);
    };
  }, [videoPanel, videoTall]);

  // Pas de <link preload> (il ignorerait le media et chargerait les deux formats) : le <picture>
  // est dans le HTML, chargé en priorité haute, et le navigateur ne télécharge que la bonne source.
  const common = { alt, quality: 80, loading: "eager" as const, fetchPriority: "high" as const };
  const { props: panelProps } = getImageProps({ ...common, ...panel, sizes: "50vw" });
  const {
    props: { srcSet: tallSet, ...tallProps },
  } = getImageProps({ ...common, ...tall, sizes: "100vw" });
  const { props: photoProps } = getImageProps({ ...common, ...photo, alt: photoAlt, sizes: "50vw" });

  return (
    <div className="absolute inset-0 md:grid md:grid-cols-2 md:gap-px md:bg-cream/30">
      <div className="relative h-full overflow-hidden">
        <picture>
          <source media="(min-width: 768px)" srcSet={panelProps.srcSet} sizes="50vw" />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt transmis par getImageProps */}
          <img {...tallProps} srcSet={tallSet} className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        {src && (
          <video
            src={src}
            muted
            loop
            autoPlay
            playsInline
            aria-hidden="true"
            onPlaying={() => setPlaying(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ${playing ? "opacity-100" : "opacity-0"}`}
          />
        )}
      </div>
      {/* Photo du diptyque : source réservée aux écrans larges, rien n'est téléchargé sur mobile */}
      <div className="relative hidden h-full overflow-hidden md:block">
        <picture>
          <source media="(min-width: 768px)" srcSet={photoProps.srcSet} sizes="50vw" />
          <img src={BLANK} alt={photoAlt} width={photo.width} height={photo.height} loading="eager" decoding="async" className="drift absolute inset-0 h-full w-full object-cover" />
        </picture>
      </div>
    </div>
  );
}
