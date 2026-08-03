/**
 * Uploads everything in public/images and public/videos to Cloudinary and
 * rewrites content/site.json to point at the delivered URLs (f_auto,q_auto).
 *
 * Setup (once):
 *   1. Create a free Cloudinary account and open Dashboard → API Keys.
 *   2. Copy .env.example to .env and fill in the three values.
 *   3. npm run cloudinary
 *
 * Idempotent: re-running overwrites the same public IDs, and already-rewritten
 * URLs in site.json are left untouched. After a successful run the local files
 * in public/images and public/videos can be deleted from the repo — the blur
 * map keeps working because it is keyed by filename.
 */
import { v2 as cloudinary } from "cloudinary";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error(
    "Missing Cloudinary credentials.\n" +
      "Copy .env.example to .env and fill in CLOUDINARY_CLOUD_NAME, " +
      "CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (Cloudinary Dashboard → API Keys)."
  );
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const FOLDER = "palak-portfolio";
const urlMap = {};

async function uploadDir(dir, resourceType, localPrefix) {
  let files = [];
  try {
    files = await readdir(dir);
  } catch {
    return;
  }
  for (const file of files) {
    const stem = path.parse(file).name;
    const result = await cloudinary.uploader.upload(path.join(dir, file), {
      folder: FOLDER,
      public_id: stem,
      resource_type: resourceType,
      overwrite: true,
      use_filename: false,
    });
    const delivered = cloudinary.url(result.public_id, {
      resource_type: resourceType,
      secure: true,
      version: result.version,
      transformation:
        resourceType === "video"
          ? [{ quality: "auto" }]
          : [{ fetch_format: "auto", quality: "auto" }],
      format: resourceType === "video" ? "mp4" : result.format,
    });
    urlMap[`${localPrefix}/${file}`] = delivered;
    console.log(`✓ ${file} → ${delivered}`);
  }
}

await uploadDir(path.resolve("public/images"), "image", "/images");
await uploadDir(path.resolve("public/videos"), "video", "/videos");

// Rewrite local paths in site.json to the delivered URLs.
const sitePath = path.resolve("content/site.json");
const site = JSON.parse(await readFile(sitePath, "utf8"));
let rewrites = 0;
function walk(node) {
  if (Array.isArray(node)) return node.map(walk);
  if (node && typeof node === "object")
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, walk(v)]));
  if (typeof node === "string" && urlMap[node]) {
    rewrites++;
    return urlMap[node];
  }
  return node;
}
await writeFile(sitePath, JSON.stringify(walk(site), null, 2) + "\n");
console.log(`\n✓ ${Object.keys(urlMap).length} assets uploaded, ${rewrites} paths rewritten in content/site.json`);
console.log("Next: verify the site locally, then the files in public/images and public/videos can be removed.");
