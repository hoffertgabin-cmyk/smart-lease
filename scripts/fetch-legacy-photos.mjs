#!/usr/bin/env node
/**
 * Downloads the photos and logo from the old IONOS site (smartlease.fr) into public/,
 * then fills the `images` arrays of src/content/vehicles.json.
 *
 *   node scripts/fetch-legacy-photos.mjs              # every vehicle that has no photo yet
 *   node scripts/fetch-legacy-photos.mjs --only <slug> --force
 *   node scripts/fetch-legacy-photos.mjs --dry-run    # list what would be downloaded
 *
 * Output per vehicle: public/vehicules/<slug>/NN.webp (max 2400 px, next/image derives AVIF/WebP sizes),
 * a tiny blur placeholder stored in the JSON, and og.jpg (1200x630) used by the social share image.
 * Requires network access to www.smartlease.fr and its CDN (le-cdn.website-editor.net, *.multiscreensite.com,
 * irp.cdn-website.com).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const dataFile = path.join(root, "src/content/vehicles.json");
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const BASE = option("base") ?? "https://www.smartlease.fr";
const ONLY = option("only");
const FORCE = flag("force");
const DRY = flag("dry-run");
const MAX_PER_VEHICLE = Number(option("max") ?? 40);

const CDN = /(website-editor\.net|multiscreensite\.com|cdn-website\.com)/;
const IMG_URL = /https?:\/\/[^"'()\s<>]+?\.(?:jpe?g|png|webp)/gi;

/** "…/opt/IMG_7459-1920w.jpg" and "…/IMG_7459-640w.jpg" are the same photo. */
const photoKey = (url) =>
  decodeURIComponent(url.split("/").pop() ?? "")
    .replace(/-\d+w(?=\.\w+$)/i, "")
    .toLowerCase();
const widthOf = (url) => Number(/-(\d+)w\.\w+$/i.exec(url)?.[1] ?? 0);
const isLogo = (url) => /logo|noir-2bgris/i.test(url);

async function fetchText(url) {
  const res = await fetch(url, { headers: { "user-agent": "SmartLeaseMigration/1.0" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: { "user-agent": "SmartLeaseMigration/1.0" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

/** All CDN photos of a page, largest variant of each, in order of appearance. */
function extractPhotos(html) {
  const best = new Map();
  for (const raw of html.replaceAll("&amp;", "&").match(IMG_URL) ?? []) {
    const url = raw.replace(/^http:/, "https:");
    if (!CDN.test(url) || isLogo(url)) continue;
    const key = photoKey(url);
    const current = best.get(key);
    if (!current || widthOf(url) > widthOf(current)) best.set(key, url);
  }
  return [...best.entries()].map(([key, url]) => ({ key, url }));
}

/** Puts the cover used on the old listing first. */
function coverFirst(photos, cover) {
  if (!cover) return photos;
  const key = photoKey(cover);
  const i = photos.findIndex((p) => p.key === key);
  return i > 0 ? [photos[i], ...photos.slice(0, i), ...photos.slice(i + 1)] : photos;
}

async function saveImages(slug, photos, altBase) {
  const dir = path.join(root, "public/vehicules", slug);
  await mkdir(dir, { recursive: true });
  const images = [];
  for (const [i, photo] of photos.entries()) {
    const n = String(i + 1).padStart(2, "0");
    try {
      const input = await fetchBuffer(photo.url);
      const pipeline = sharp(input).rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true });
      const { data, info } = await pipeline.webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
      await writeFile(path.join(dir, `${n}.webp`), data);
      const blur = await sharp(data).resize(16).webp({ quality: 40 }).toBuffer();
      if (i === 0) {
        const og = await sharp(data).resize(640, 630, { fit: "cover" }).jpeg({ quality: 80 }).toBuffer();
        await writeFile(path.join(dir, "og.jpg"), og);
      }
      images.push({
        src: `/vehicules/${slug}/${n}.webp`,
        alt: `${altBase}, photo ${i + 1}`,
        width: info.width,
        height: info.height,
        blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
      });
      process.stdout.write(".");
    } catch (err) {
      console.warn(`\n  ! ${photo.url}: ${err.message}`);
    }
  }
  process.stdout.write("\n");
  return images;
}

async function photosFor(entry, cover) {
  if (!entry.legacyUrl) return [];
  const html = await fetchText(new URL(encodeURI(entry.legacyUrl), BASE).toString());
  return coverFirst(extractPhotos(html), cover).slice(0, MAX_PER_VEHICLE);
}

async function main() {
  const content = JSON.parse(await readFile(dataFile, "utf8"));
  const todo = (list) => list.filter((e) => (!ONLY || e.slug === ONLY) && (FORCE || e.images.length === 0));

  // Logo, from the home page.
  if (!ONLY) {
    try {
      const home = (await fetchText(BASE)).replaceAll("&amp;", "&");
      const logo = (home.match(IMG_URL) ?? []).find((u) => /noir-2bgris/i.test(u));
      if (logo && !DRY) {
        await mkdir(path.join(root, "public/brand"), { recursive: true });
        const buf = await fetchBuffer(logo);
        await sharp(buf).png().toFile(path.join(root, "public/brand/logo.png"));
        console.log("Logo -> public/brand/logo.png");
      } else console.log(logo ? `Logo: ${logo}` : "Logo introuvable sur la page d'accueil");
    } catch (err) {
      console.warn(`Logo: ${err.message}`);
    }
  }

  for (const v of todo(content.vehicles)) {
    try {
      const photos = await photosFor(v, v.legacyCover);
      console.log(`${v.slug}: ${photos.length} photo(s)`);
      if (DRY || !photos.length) continue;
      v.images = await saveImages(v.slug, photos, `${v.brand} ${v.model} ${v.version}`.trim());
    } catch (err) {
      console.warn(`${v.slug}: ${err.message}`);
    }
  }

  for (const r of todo(content.rental)) {
    try {
      const photos = await photosFor(r, r.legacyCover);
      console.log(`${r.slug}: ${photos.length} photo(s)`);
      if (!DRY && photos.length) r.images = await saveImages(r.slug, photos, r.title);
    } catch (err) {
      console.warn(`${r.slug}: ${err.message}`);
    }
  }

  // Sold references only need their cover, found on the old /vendu page.
  const sold = todo(content.soldReferences);
  if (sold.length) {
    try {
      const gallery = extractPhotos(await fetchText(new URL("/vendu", BASE).toString()));
      const byKey = new Map(gallery.map((p) => [p.key, p]));
      for (const s of sold) {
        const photo = s.legacyCover ? byKey.get(photoKey(s.legacyCover)) : undefined;
        console.log(`${s.slug}: ${photo ? "couverture trouvée" : "pas de couverture"}`);
        if (!DRY && photo) s.images = await saveImages(s.slug, [photo], s.title);
      }
    } catch (err) {
      console.warn(`/vendu: ${err.message}`);
    }
  }

  if (!DRY) {
    await writeFile(dataFile, JSON.stringify(content, null, 2) + "\n");
    console.log("src/content/vehicles.json mis à jour. Vérifiez l'ordre des photos puis lancez npm run build.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
