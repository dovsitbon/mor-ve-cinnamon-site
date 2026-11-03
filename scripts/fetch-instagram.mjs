// Télécharge les médias Instagram listés dans assets/raw/mor-cinnamon_list.json { list: [{id,i,video,url,vurl}], caps }
// (liste extraite dans le navigateur via /p/<id>/embed/captioned/, Instagram refusant les requêtes serveur)
// vers assets/raw/mor-cinnamon_NNN_<shortcode>_<i>[_video-cover].jpg (+ _video.mp4) et les légendes.
//   node scripts/fetch-instagram.mjs
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const RAW = path.resolve(import.meta.dirname, "../assets/raw");
const { list, caps } = JSON.parse(await readFile(path.join(RAW, "mor-cinnamon_list.json"), "utf8"));

async function save(url, name) {
  const res = await fetch(url);
  if (!res.ok) return console.warn(`${name}: HTTP ${res.status}`);
  await writeFile(path.join(RAW, name), Buffer.from(await res.arrayBuffer()));
}

const order = [...new Set(list.map((it) => it.id))];
let n = 0;
for (const it of list) {
  const post = String(order.indexOf(it.id) + 1).padStart(3, "0");
  const base = `mor-cinnamon_${post}_${it.id}_${String(it.i + 1).padStart(2, "0")}`;
  await save(it.url, `${base}${it.video ? "_video-cover" : ""}.jpg`);
  if (it.vurl) await save(it.vurl, `${base}_video.mp4`);
  n += 1;
}
await writeFile(path.join(RAW, "mor-cinnamon_captions.json"), JSON.stringify(caps, null, 2));
console.log(`Total : ${n}`);
