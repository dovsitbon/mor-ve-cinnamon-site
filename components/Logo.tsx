import logo from "@/data/logo.json";

/**
 * Logo Mor & Cinnamon redessiné en tracés (scripts/logo.py) d'après leur logo :
 * trois feuilles au trait, « מור וקינמון », un filet fin et « קייטרינג והפקה ».
 * La couleur suit `currentColor` : version foncée ou claire selon le fond.
 */
export function LogoFull({ className = "", title }: { className?: string; title?: string }) {
  const [x1, y, x2] = logo.rule;
  return (
    <svg viewBox={logo.viewBox} className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <LeafPaths />
      <g fill="currentColor">
        <path d={logo.name} />
        <path d={logo.sub} />
      </g>
      <path d={`M${x1} ${y}H${x2}`} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

function LeafPaths({ strokeWidth = logo.stroke }: { strokeWidth?: number }) {
  return (
    <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {logo.leaves.map((l) => (
        <path key={l.outline} d={l.outline + l.veins} />
      ))}
    </g>
  );
}

/** Les trois feuilles seules (header, favicon, ornements). */
export function Leaves({ className = "", strokeWidth }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox={logo.leavesBox} className={className} aria-hidden="true">
      <LeafPaths strokeWidth={strokeWidth} />
    </svg>
  );
}

/** Une feuille au trait (la troisième, nervure seule) pour les petits détails. */
export function Leaf({ className = "" }: { className?: string }) {
  const l = logo.leaves[2];
  return (
    <svg viewBox="583 200 140 194" className={className} aria-hidden="true">
      <path d={l.outline + l.veins} fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Marque du header : les trois feuilles au-dessus du nom en hébreu. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="112 188 816 410" className={className} aria-hidden="true">
      <LeafPaths strokeWidth={5} />
      <path d={logo.name} fill="currentColor" />
    </svg>
  );
}
