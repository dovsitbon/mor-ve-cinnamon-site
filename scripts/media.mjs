// Prépare les visuels classés dans assets/<catégorie>/ pour le web :
// public/media/<catégorie>/<nom>.jpg (côté long 1600 px max ; les images tirées des reels font 1080 × 1920).
// next/image sert ensuite des variantes AVIF/WebP à la bonne taille.
// Recrée aussi la boucle vidéo du hero (Hila & Rotem marchant vers la houppa, reel 003),
// l'image Open Graph et l'icône Apple.
//   npm run media
import { execFileSync } from "node:child_process";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const CATS = ["hero", "couples", "cuisine", "stations-buffets", "lounges-deco", "chupa-ceremonies", "equipe-montage", "galerie"];

let n = 0;
const sizes = {};
const RAW = path.join(ROOT, "assets/raw");
const reel = (await readdir(RAW)).find((f) => f.startsWith("mor-cinnamon_003_") && f.endsWith("_video.mp4"));

// Boucle du hero : 3,8 s sans son. Verticale (mobile) et 4:5 (panneau du diptyque sur ordinateur).
const HERO = { from: 23.05, duration: 3.8 };
const TALL = "scale=720:1280";
const PANEL = "crop=1080:1350:0:330,scale=864:1080";
await mkdir(path.join(ROOT, "assets/hero"), { recursive: true });
await mkdir(path.join(ROOT, "public/media/hero"), { recursive: true });
const encode = (vf, file) =>
  execFileSync(ffmpeg, [
    "-loglevel", "error", "-y", "-ss", String(HERO.from), "-t", String(HERO.duration), "-i", path.join(RAW, reel),
    "-an", "-vf", `${vf},fps=30`, "-c:v", "libx264", "-profile:v", "high", "-crf", "26", "-preset", "slow",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(ROOT, "public/media", file),
  ]);
const poster = (vf, file) =>
  execFileSync(ffmpeg, ["-loglevel", "error", "-y", "-ss", String(HERO.from), "-i", path.join(RAW, reel), "-frames:v", "1", "-vf", vf, "-q:v", "1", path.join(ROOT, "assets/hero", file)]);
if (reel) {
  encode(TALL, "hero-tall.mp4");
  encode(PANEL, "hero-panel.mp4");
  poster(TALL, "poster-tall.jpg");
  poster(PANEL, "poster-panel.jpg");
}

for (const cat of CATS) {
  const src = path.join(ROOT, "assets", cat);
  const out = path.join(ROOT, "public/media", cat);
  await mkdir(out, { recursive: true });
  const files = (await readdir(src).catch(() => [])).filter((f) => /\.jpe?g$/i.test(f));
  for (const f of files) {
    const info = await sharp(path.join(src, f))
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: cat === "hero" ? 82 : 84, mozjpeg: true })
      .toFile(path.join(out, f));
    sizes[`/media/${cat}/${f}`] = [info.width, info.height];
    n += 1;
  }
}

// Dimensions réelles, utilisées par next/image (évite tout décalage de mise en page)
await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 1) + "\n");

// Image Open Graph 1200 × 630 : le couple et l'assiette du diptyque, médaillon du logo au centre
const half = (file, position) => sharp(path.join(ROOT, file)).resize(600, 630, { fit: "cover", position }).toBuffer();
const medallion = await sharp(await readFile(path.join(ROOT, "public/logo.svg")), { density: 144 }).resize(250, 250).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#EFE6DA" } })
  .composite([
    { input: await half("assets/hero/poster-panel.jpg", "centre"), left: 0, top: 0 },
    { input: await half("assets/cuisine/assiette-boeuf-salade.jpg", "centre"), left: 600, top: 0 },
    { input: medallion, left: 475, top: 190 },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

// Icône Apple (180 px, sans transparence)
await sharp(await readFile(path.join(ROOT, "app/icon.svg")), { density: 300 })
  .resize(180, 180)
  .flatten({ background: "#FAF6F0" })
  .png()
  .toFile(path.join(ROOT, "app/apple-icon.png"));

console.log(`${n} images prêtes`);
