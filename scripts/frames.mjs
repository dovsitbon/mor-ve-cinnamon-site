// Range les meilleurs visuels dans assets/<catégorie>/<nom>.jpg :
// photos Instagram copiées telles quelles, images nettes tirées des reels (1080 × 1920 sauf mention).
// `crop: [haut, bas]` (fractions de la hauteur) retire un texte incrusté ; `x: [gauche, droite]` recadre en largeur.
//   npm run frames
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

const ROOT = path.resolve(import.meta.dirname, "..");
const RAW = path.join(ROOT, "assets/raw");
const files = readdirSync(RAW);

// photo : "009_04" (publication_média) ; image de reel : ["003_01", seconde, options]
const PICKS = {
  couples: {
    "roni-itay-mariee-fleurs": ["011_01", 5.5],
    "roni-itay-sourire": ["011_01", 7.2],
    "roni-itay-danse": ["002_01", 54.5],
    "roni-itay-lounge": ["011_01", 32.5],
    "roni-mariee": "009_05",
    "hila-rotem-houppa": ["003_01", 0.4],
    "hila-rotem-mains": ["003_01", 11.5],
    "hila-rotem-marche": ["003_01", 24],
    "einav-davidi-tables": "005_04",
    "einav-davidi-houppa": ["004_01", 33.4],
    "einav-davidi-olivier": ["004_01", 36.4],
    "noam-nadav": ["006_01", 10],
    "adi-nimi": ["007_01", 47.6],
  },
  cuisine: {
    "pavlova-fruits-rouges": "001_02",
    "meringue-coulis": "001_03",
    "gateau-chocolat-creme": "001_05",
    "choux-presentoir": "001_10",
    "desserts-assiettes": "001_01",
    "bouchees-piment": "008_01",
    "barquettes-salade": "008_02",
    "entrees-plateau-argent": "008_03",
    "chef-dressage": "008_04",
    "crostinis-planche": "008_06",
    "pates-legumes-grilles": "009_02",
    "assiette-boeuf-salade": "012_01",
    "poulet-grille-boulgour": "012_03",
    "salade-peches": "012_04",
    "boeuf-tranche": "012_07",
    "boeuf-pommes-de-terre": "012_08",
    "bruschettas-tomates": ["006_01", 27.4],
    "barquettes-laitue-grenade": ["006_01", 33.3],
    "assiette-focaccia-viande": ["002_01", 44.2],
    "assiettes-poulet-haricots": ["002_01", 40],
    "cocotte-brioche": ["006_01", 48.4],
  },
  "stations-buffets": {
    "station-pates-tomates": "009_01",
    "installation-legumes": ["006_01", 13.4],
    "buffet-grenades-olivier": ["006_01", 22.3],
    "station-grenades": ["006_01", 41.3],
    "buffet-legumes-rotis": ["002_01", 36.2],
    "grill-vigne": ["002_01", 23],
    "grill-flammes": ["002_01", 50],
    "station-chef-poeles": ["007_01", 28],
    "patates-douces-grill": ["006_01", 34.4],
    "chef-station-courges": "012_06",
    "chef-poele-pates": ["002_01", 46.2],
    "chef-brochettes-braise": ["002_01", 48],
    "marmite-cuivre-tomates": "005_06",
  },
  "lounges-deco": {
    "table-fleurs-tropicales": "009_03",
    "table-vase-vert": "009_04",
    "tables-hautes-roses": "009_07",
    "lounge-coussins-lin": "005_09",
    "tipi-lounge-dore": "005_11",
    "tipi-olivier": "005_08",
    "tables-bois-fleurs": "005_10",
    "tables-bois-guirlandes": "005_02",
    "tables-coucher-soleil": "005_01",
    "tables-rondes-fleurs": "005_05",
    "lounge-rose-orange": ["002_01", 8.4],
    "table-polaroids-grenades": ["007_01", 36],
    "tournesols-vase-blanc": ["003_01", 3.4],
    "lounge-coussins-verts": ["003_01", 18.4],
    "lounge-terracotta": ["011_01", 26.3],
    "vases-tulipes": ["011_01", 47.4],
    "tables-palmiers": ["006_01", 7.3],
    "lounge-parasols": ["006_01", 20.3],
  },
  "chupa-ceremonies": {
    "houppa-voilages-tapis": ["003_01", 22.3],
    "voilage-olivier": ["003_01", 4.4],
  },
  "equipe-montage": {
    "montage-tipis": "005_07",
    "fleuriste-hortensias": ["003_01", 8.4],
    "vase-blanc-mains": ["003_01", 9.4],
    "mise-en-place-bougies": ["003_01", 16.4],
    "service-desserts": "001_06",
    "equipe-buffet": ["006_01", 24.3],
    "dressage-assiettes": ["006_01", 37.4],
    "service-salades-tomates": ["002_01", 52.2],
    "dressage-haricots": ["002_01", 38],
    "service-assiette": ["002_01", 39],
  },
  galerie: {
    "spritz-bar": "012_02",
    "invites-desserts": "001_04",
    "champagne-grenades": ["003_01", 6.4],
    "vue-aerienne": ["011_01", 1.4],
    "vue-aerienne-tables": ["011_01", 16.4],
    "verres-alignes": ["006_01", 16.3],
    "invites-lounge": ["002_01", 49],
  },
};

let n = 0;
for (const [cat, items] of Object.entries(PICKS)) {
  const out = path.join(ROOT, "assets", cat);
  mkdirSync(out, { recursive: true });
  for (const [name, pick] of Object.entries(items)) {
    const [ref, t, opt = {}] = Array.isArray(pick) ? pick : [pick];
    const [post, idx] = ref.split("_");
    const prefix = new RegExp(`^mor-cinnamon_${post}_.+_${idx}(_video-cover\.jpg|_video\.mp4|\.jpg)$`);
    const dest = path.join(out, `${name}.jpg`);
    if (t === undefined) {
      const file = files.find((f) => prefix.test(f) && f.endsWith(".jpg"));
      if (!file) { console.warn(`photo ${ref} introuvable`); continue; }
      copyFileSync(path.join(RAW, file), dest);
    } else {
      const file = files.find((f) => prefix.test(f) && f.endsWith("_video.mp4"));
      if (!file) { console.warn(`reel ${ref} introuvable`); continue; }
      const [top, bottom] = opt.crop ?? [0, 1];
      const [left, right] = opt.x ?? [0, 1];
      const vf = `crop=iw*${right - left}:ih*${bottom - top}:iw*${left}:ih*${top}`;
      execFileSync(ffmpeg, ["-loglevel", "error", "-y", "-ss", String(t), "-i", path.join(RAW, file), "-frames:v", "1", "-vf", vf, "-q:v", "1", dest]);
    }
    n += 1;
  }
}
console.log(`${n} visuels rangés`);
