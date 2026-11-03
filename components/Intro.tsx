"use client";

import { useEffect, useState, type CSSProperties } from "react";
import logo from "@/data/logo.json";

const KEY = "morcin-intro";
const at = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

/**
 * Ouverture (2 s, une fois par session) sur fond lin au grain léger :
 * les trois feuilles du logo se dessinent au trait une par une, « מור וקינמון » apparaît en fondu,
 * puis « קייטרינג והפקה » ; une lumière dorée de fin de journée balaie l'écran, puis fondu sur le hero.
 * Tout est en CSS (globals.css) : l'animation démarre dès le premier rendu, sans attendre le JavaScript.
 */
export function Intro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      document.documentElement.classList.add("intro-seen");
    }, 1900);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;
  const [x1, y, x2] = logo.rule;

  return (
    <div className="intro-curtain flex items-center justify-center overflow-hidden text-plum">
      <div aria-hidden="true" className="intro-grain absolute inset-0" />
      <svg viewBox={logo.viewBox} className="relative w-[min(70vw,330px)]" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth={logo.stroke} strokeLinecap="round" strokeLinejoin="round">
          {logo.leaves.map((l, i) => (
            <path key={l.outline} className="intro-draw" style={at(i * 0.18)} pathLength={1} d={l.outline + l.veins} />
          ))}
        </g>
        <path className="intro-fade" style={at(0.7)} d={logo.name} fill="currentColor" />
        <path className="intro-draw" style={at(0.8)} pathLength={1} d={`M${x1} ${y}H${x2}`} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path className="intro-fade" style={at(0.9)} d={logo.sub} fill="currentColor" />
      </svg>
      <div aria-hidden="true" className="intro-light" />
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          document.documentElement.classList.add("intro-seen");
          setGone(true);
        }}
        className="nav-link absolute end-4 bottom-4 min-h-11 px-4 text-plum/80 transition-colors hover:text-plum"
      >
        {skipLabel}
      </button>
    </div>
  );
}
