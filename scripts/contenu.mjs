// Régénère CONTENU.md : infos à demander au client, puis tous les textes du site dans les 4 langues,
// les menus, les mariages et les partenaires, pour validation.
//   npm run contenu
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const json = async (p) => JSON.parse(await readFile(path.join(ROOT, p), "utf8"));
const LANGS = ["he", "en", "fr", "es"];
const L = Object.fromEntries(await Promise.all(LANGS.map(async (l) => [l, await json(`locales/${l}.json`)])));
const site = await json("data/site.json");
const menus = await json("data/menus.json");
const weddings = await json("data/weddings.json");
const partners = await json("data/partners.json");

const out = [];
out.push(`# MOR & CINNAMON (מור וקינמון) — contenu du site à valider

Site : ${site.url} (hébreu /he par défaut, /en, /fr, /es). Les textes se modifient dans \`locales/he.json\`, \`en.json\`, \`fr.json\`, \`es.json\` ; ce fichier est régénéré par \`npm run contenu\`.

## Infos à demander à Mor & Cinnamon

1. **Les fondateurs** : prénom(s), photo et leur histoire (comment est né « מור וקינמון »). Le site n'en parle pas tant que ce n'est pas fourni.
2. **Exemples de menus réels** (stations, plats servis, desserts) : les trois menus du site reprennent les plats visibles sur Instagram → à corriger ou compléter dans \`locales/*.json\` (\`catering.menus\`).
3. **Prix ou fourchettes** « à partir de » par invité → \`data/menus.json\` (\`priceFrom\`). Tant qu'ils sont vides, le site affiche « מחיר בהצעה אישית ».
4. **Zone d'intervention** (régions, distance maximale) : non indiquée sur le site, la FAQ reste générale.
5. **Casher** : oui, sur demande, avec quelle supervision (כשרות) ? La FAQ répond aujourd'hui « dites-le-nous dans le formulaire ».
6. **Vrais avis de couples** (texte, prénoms, accord pour publication) → \`data/reviews.json\` avec \`published: true\`. Aucun avis n'est inventé : la section renvoie pour l'instant vers les stories à la une.
7. **Vidéos en bonne qualité** (fichiers originaux, si possible un plan horizontal pour le hero) : le hero utilise le reel de Hila & Rotem en 1080 × 1920.
8. **Accord des partenaires** cités (section « שותפים ») et **accord des couples** pour publier leurs photos et prénoms.
9. **Couples des stories à la une** (Yael & Eshel, Shahar & Alon, Noam & Hanan, Adi & Assaf, Lihi & Yonatan, Alin & Assaf, Neta & Ron, Or & Itay, Dafni & Alon) : leurs photos et dates. Instagram ne montre pas les stories sans connexion, seuls 5 couples ont pu être illustrés.
10. **Les 150 visuels du profil** : seul le logo était dans Téléchargements ; les 12 publications publiques (+ 1 collaboration) ont été récupérées. Les autres publications sont à fournir pour enrichir les galeries.
11. **Lien de la page Facebook** « ${site.facebookName} » (introuvable publiquement) → \`data/site.json\` (\`facebook\`). Le footer l'affichera automatiquement.
12. **E-mail** qui recevra les demandes (variable \`QUOTE_NOTIFY_EMAIL\`), et un domaine vérifié dans Resend pour l'expéditeur (\`RESEND_FROM\`) ; nom de domaine du site si souhaité.
13. **Dates déjà prises** à signaler dans le formulaire → \`data/dates.json\`.
14. **Mentions** : raison sociale, numéro d'entreprise (ע.מ / ח.פ), adresse ou ville, e-mail.
15. À confirmer : électricité, eau et sanitaires sur place (réponse de la FAQ), nombre d'invités minimum ou maximum, délai de réservation conseillé.
`);

out.push(`## Menus (data/menus.json)\n`);
for (const m of menus.menus) {
  const t = L.he.catering.menus[m.id];
  out.push(`- **${t.name}** (${L.fr.catering.menus[m.id].name}) — ${m.priceFrom ? `à partir de ${m.priceFrom} ₪ / invité` : "prix à fournir (affiché « sur devis »)"} — ${L.fr.catering.menus[m.id].dishes.join(", ")}`);
}

out.push(`\n## Mariages présentés (data/weddings.json)\n`);
for (const w of weddings.weddings) {
  const credits = w.credits.map(([role, handle]) => `${L.fr.weddings.roles[role]} @${handle}`).join(", ");
  out.push(`- **${L.he.weddings.names[w.id]}** (${L.fr.weddings.names[w.id]})${w.date ? ` — ${w.date}` : ""} — ${w.photos.length} photos${credits ? ` — avec ${credits}` : ""}`);
}

out.push(`\n## Partenaires affichés (data/partners.json, à valider)\n`);
for (const p of partners.partners.filter((p) => p.show)) out.push(`- @${p.handle} — ${L.fr.weddings.roles[p.role]}`);

// Tous les textes, clé par clé, dans les 4 langues
const flat = (o, p = "") =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v) ? flat(v, `${p}${k}.`) : Array.isArray(v) ? v.flatMap((x, i) => (typeof x === "object" ? flat(x, `${p}${k}.${i}.`) : [[`${p}${k}.${i}`, x]])) : [[`${p}${k}`, v]],
  );
const maps = Object.fromEntries(LANGS.map((l) => [l, Object.fromEntries(flat(L[l]))]));
let section = "";
out.push(`\n## Textes du site (HE / EN / FR / ES)\n`);
for (const [key] of flat(L.he)) {
  const top = key.split(".")[0];
  if (top !== section) {
    section = top;
    out.push(`\n### ${top}\n`);
  }
  const cell = (l) => String(maps[l][key] ?? "").replace(/\n/g, " ");
  out.push(`- \`${key}\`\n  - HE : ${cell("he")}\n  - EN : ${cell("en")}\n  - FR : ${cell("fr")}\n  - ES : ${cell("es")}`);
}

await writeFile(path.join(ROOT, "CONTENU.md"), out.join("\n") + "\n");
console.log("CONTENU.md à jour");
