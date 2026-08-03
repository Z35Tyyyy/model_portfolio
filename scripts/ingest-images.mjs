/**
 * One-off ingest: maps curated source photos to the site's semantic image
 * slots, resizing and optimizing on the way in. Usage:
 *   node scripts/ingest-images.mjs <raw-dir>
 */
import sharp from "sharp";
import path from "node:path";

const raw = process.argv[2];
if (!raw) throw new Error("pass the raw assets dir");
const OUT = path.resolve("public/images");

const MAP = [
  ["portfolio/IMG_4322.jpg", "hero.jpg", 2200],
  ["shoot/IMG_5487.jpg", "story-01.jpg", 1800],
  ["portfolio/IMG_4240.jpg", "story-02.jpg", 1800],
  ["portfolio/IMG_4307.jpg", "about.jpg", 1600],
  ["shoot/IMG_5490.jpg", "project-bridal.jpg", 2000],
  ["portfolio/IMG-20260726-WA0211.jpg", "project-western.jpg", 2000],
  ["shoot/IMG-20250929-WA0017.jpg", "project-editorial.jpg", 2000],
  ["portfolio/IMG_0666.jpg", "project-commercial.jpg", 2000],
  ["portfolio/IMG_4450.jpg", "project-lifestyle.jpg", 2200],
  ["portfolio/IMG_4444.jpg", "film-poster.jpg", 2200],
  ["shoot/AZV02264.jpg", "film-still-01.jpg", 1600],
  ["shoot/IMG-20251028-WA0013.jpg", "film-still-02.jpg", 1280],
  ["shoot/IMG-20260312-WA0060.jpg", "film-still-03.jpg", 1600],
  ["shoot/IMG_5604-1.jpg", "seq-01.jpg", 1800],
  ["shoot/IMG-20250805-WA0010.jpg", "seq-02.jpg", 1500],
  ["shoot/IMG-20250928-WA0005.jpg", "seq-03.jpg", 1800],
  ["portfolio/IMG_4340.jpg", "seq-04.jpg", 1800],
];

for (const [src, dest, longEdge] of MAP) {
  const input = sharp(path.join(raw, src), { failOn: "none" }).rotate();
  await input
    .resize(longEdge, longEdge, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(OUT, dest));
  console.log(`✓ ${dest}  ←  ${src}`);
}
