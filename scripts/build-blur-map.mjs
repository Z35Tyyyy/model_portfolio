/**
 * Rebuilds lib/blur-map.json from whatever actually lives in public/images.
 * Run after adding or swapping any image:  npm run blur
 */
import sharp from "sharp";
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DIR = path.resolve("public/images");
const OUT = path.resolve("lib/blur-map.json");

const files = (await readdir(DIR)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const map = {};
for (const f of files.sort()) {
  const tiny = await sharp(path.join(DIR, f)).resize(12).jpeg({ quality: 40 }).toBuffer();
  // Keyed by bare filename so lookups survive a move to CDN-hosted URLs.
  map[f] = `data:image/jpeg;base64,${tiny.toString("base64")}`;
}
await writeFile(OUT, JSON.stringify(map, null, 2));
console.log(`✓ blur map for ${files.length} images → ${OUT}`);
