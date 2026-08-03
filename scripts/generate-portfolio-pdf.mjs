/**
 * Generates the editorial portfolio PDF from content/site.json, pulling
 * photography from Cloudinary. Writes public/portfolio.pdf; if Cloudinary
 * credentials are present it also uploads the PDF (raw) and prints the URL.
 *   npm run pdf
 */
import PDFDocument from "pdfkit";
import { v2 as cloudinary } from "cloudinary";
import { createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const site = JSON.parse(await readFile(path.resolve("content/site.json"), "utf8"));

const IVORY = "#FAF8F5";
const CHARCOAL = "#111111";
const GOLD = "#A8895B";
const SMOKE = "#6F6A62";

const A4 = { w: 595.28, h: 841.89 };
const FONTS = path.resolve("assets/fonts");

async function fetchImage(url, width = 1200) {
  const sized = url.replace("f_auto,q_auto", `w_${width},q_80`);
  const res = await fetch(sized);
  if (!res.ok) throw new Error(`fetch failed ${res.status}: ${sized}`);
  return Buffer.from(await res.arrayBuffer());
}

const doc = new PDFDocument({
  size: "A4",
  margin: 0,
  autoFirstPage: false,
  info: { Title: `${site.name} — Portfolio`, Author: site.name },
});
const out = path.resolve("public/portfolio.pdf");
const stream = doc.pipe(createWriteStream(out));

doc.registerFont("serif", path.join(FONTS, "CormorantGaramond-Light.ttf"));
doc.registerFont("serif-reg", path.join(FONTS, "CormorantGaramond-Regular.ttf"));
doc.registerFont("serif-italic", path.join(FONTS, "CormorantGaramond-Italic.ttf"));

function bg(color) {
  doc.rect(0, 0, A4.w, A4.h).fill(color);
}

function coverImage(buf, x, y, w, h, valign = "center") {
  doc.save();
  doc.rect(x, y, w, h).clip();
  const opts = { cover: [w, h], align: "center" };
  if (valign !== "top") opts.valign = valign; // omitting valign anchors the crop to the top
  doc.image(buf, x, y, opts);
  doc.restore();
}

function eyebrow(text, x, y, opts = {}) {
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(opts.color ?? SMOKE)
    .text(text.toUpperCase(), x, y, { characterSpacing: 3, ...opts });
}

function goldRule(cx, y, width = 28) {
  doc.save().rect(cx - width / 2, y, width, 0.7).fill(GOLD).restore();
}

// ————— Cover —————
console.log("building cover…");
const heroBuf = await fetchImage(site.hero.image, 1400);
doc.addPage();
bg(CHARCOAL);
const M = 44;
coverImage(heroBuf, M, M, A4.w - M * 2, A4.h * 0.68);
doc
  .font("serif")
  .fontSize(54)
  .fillColor(IVORY)
  .text(site.name, 0, A4.h * 0.68 + M + 44, { align: "center", characterSpacing: 14 });
eyebrow(site.roles.join("      "), 0, A4.h * 0.68 + M + 118, {
  align: "center",
  color: "#8d8577",
  width: A4.w,
});

// ————— Opening quote —————
doc.addPage();
bg(IVORY);
goldRule(A4.w / 2, A4.h * 0.42);
doc
  .font("serif-italic")
  .fontSize(24)
  .fillColor(CHARCOAL)
  .text(site.opening.join("\n"), 90, A4.h * 0.42 + 30, {
    align: "center",
    width: A4.w - 180,
    lineGap: 8,
  });

// ————— About —————
console.log("building about…");
const aboutBuf = await fetchImage(site.about.image, 1000);
doc.addPage();
bg(IVORY);
coverImage(aboutBuf, 0, 0, A4.w * 0.52, A4.h);
const ax = A4.w * 0.52 + 40;
const aw = A4.w - ax - 44;
eyebrow(site.about.heading, ax, A4.h * 0.3);
goldRule(ax + 14, A4.h * 0.3 + 22);
doc
  .font("serif-reg")
  .fontSize(13.5)
  .fillColor(CHARCOAL)
  .text(site.about.paragraph, ax, A4.h * 0.3 + 44, { width: aw, lineGap: 6 });
let specY = doc.y + 36;
for (const spec of site.about.specs ?? []) {
  eyebrow(spec.label, ax, specY);
  doc.font("serif-reg").fontSize(17).fillColor(CHARCOAL).text(spec.value, ax, specY + 13);
  specY += 58;
}

// ————— Projects —————
let idx = 0;
for (const project of site.projects) {
  idx++;
  console.log(`building project ${project.name}…`);
  const buf = await fetchImage(project.image, 1200);
  doc.addPage();
  bg(IVORY);
  coverImage(buf, 0, 0, A4.w, A4.h * 0.76, project.focus === "top" ? "top" : "center");
  const py = A4.h * 0.76 + 34;
  eyebrow(`${String(idx).padStart(2, "0")} — ${project.campaign}`, 44, py);
  doc.font("serif").fontSize(30).fillColor(CHARCOAL).text(project.name, 44, py + 16);
  doc
    .font("serif-italic")
    .fontSize(12)
    .fillColor(SMOKE)
    .text(project.description, 44, py + 58, { width: A4.w * 0.6 });
  eyebrow(project.year, 0, py, { align: "right", width: A4.w - 44 });
}

// ————— UGC —————
console.log("building UGC…");
doc.addPage();
bg(CHARCOAL);
eyebrow("UGC", 44, 52, { color: "#8d8577" });
doc.font("serif").fontSize(28).fillColor(IVORY).text(site.ugc.subheading, 44, 70, {
  width: A4.w - 130,
});
const cols = 3;
const gap = 14;
const gw = (A4.w - 88 - gap * (cols - 1)) / cols;
const gh = gw * 1.12;
let gx = 44;
let gy = 150;
for (const [i, item] of site.ugc.items.entries()) {
  const buf = await fetchImage(item.poster, 500);
  coverImage(buf, gx, gy, gw, gh);
  eyebrow(item.title, gx, gy + gh + 7, { color: "#8d8577", width: gw });
  gx += gw + gap;
  if ((i + 1) % cols === 0) {
    gx = 44;
    gy += gh + 36;
  }
}

// ————— Film stills —————
console.log("building stills…");
doc.addPage();
bg(IVORY);
eyebrow(site.film.heading, 44, 52);
doc.font("serif").fontSize(28).fillColor(CHARCOAL).text("Stills", 44, 70);
const sw = (A4.w - 88 - 28) / 3;
const sh = sw * 1.25;
let sx = 44;
const offsets = [0, 34, 68];
for (const [i, still] of site.film.stills.entries()) {
  const buf = await fetchImage(still.image, 700);
  coverImage(buf, sx, 170 + offsets[i], sw, sh);
  sx += sw + 14;
}
doc
  .font("serif-italic")
  .fontSize(15)
  .fillColor(SMOKE)
  .text(`"${site.quotes[0]}"`, 90, 170 + sh + 130, { align: "center", width: A4.w - 180 });

// ————— Contact —————
doc.addPage();
bg(CHARCOAL);
goldRule(A4.w / 2, A4.h * 0.38);
doc
  .font("serif-italic")
  .fontSize(26)
  .fillColor(IVORY)
  .text(site.contact.line, 70, A4.h * 0.38 + 30, { align: "center", width: A4.w - 140 });
doc
  .font("Helvetica")
  .fontSize(8)
  .fillColor("#b5aea3")
  .text(site.contact.email, 0, A4.h * 0.38 + 110, {
    align: "center",
    width: A4.w,
    characterSpacing: 2,
    link: `mailto:${site.contact.email}`,
  });
doc.text(site.contact.instagram.replace("https://www.", ""), 0, A4.h * 0.38 + 132, {
  align: "center",
  width: A4.w,
  characterSpacing: 2,
  link: site.contact.instagram,
});
doc
  .fontSize(7)
  .fillColor("#6b665e")
  .text(`© ${new Date().getFullYear()} ${site.name}   ·   Made with love by Z35TYYYY`, 0, A4.h - 70, {
    align: "center",
    width: A4.w,
    characterSpacing: 2,
    link: "https://www.kanishkkkk.xyz",
  });

doc.end();
await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
});
console.log(`✓ wrote ${out}`);

// Optional: host the PDF on Cloudinary alongside the rest of the media.
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  const result = await cloudinary.uploader.upload(out, {
    folder: "palak-portfolio",
    public_id: "portfolio",
    resource_type: "raw",
    format: "pdf",
    overwrite: true,
  });
  console.log(`✓ uploaded → ${result.secure_url}`);
}
