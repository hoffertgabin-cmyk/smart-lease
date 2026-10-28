// One-off: converts the scraped legacy data (content/legacy/vehicles.json) into src/content/vehicles.json.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const src = JSON.parse(fs.readFileSync(path.join(root, "content/legacy/vehicles.json"), "utf8"));

const GROUPS = [
  ["Sécurité et aides à la conduite", /(assist|radar|caméra|camera|angle|régulateur|regulateur|front|lane|park|freinage|abs|esp|pre sense|protection|alerte|avertisseur|détection|lecture des panneaux|anti|airbag|isofix|pression)/i],
  ["Multimédia et connectivité", /(carplay|android|gps|navigation|audio|bose|burmester|harman|sennheiser|sonos|b&o|bang|hifi|radio|bluetooth|connect|phone|cockpit|écran|ecran|instrumentation|head-up|tête haute|tete haute|chargeur|induction|teleservice|télé|r-link|mmi|comand|commande vocale|interface|touchpad|pavé)/i],
  ["Confort", /(climat|siège|siege|sièges|volant|chauff|ventil|keyless|accès|acces|clé|cle|hayon|toit|store|soft close|massant|confort|ambiance|éclairage d'ambiance|lumière ambiante|ionis|multi-sense|stationnaire|lève-vitres|leve-vitres|rétroviseur intérieur|intérieur|interieur|cuir|sellerie|alcantara|harnais|moquette)/i],
  ["Extérieur et châssis", /(jante|roue|phare|led|xénon|xenon|matrix|échappement|echappement|pack|amg|m sport|s line|rs |châssis|chassis|suspension|pasm|frein|attelage|attache|barres|rails|vitr|teint|privacy|carbone|black|chrome|peinture|différentiel|differentiel|pneus|direction|shadow)/i],
];

function groupOptions(items = []) {
  const buckets = new Map(GROUPS.map(([name]) => [name, []]));
  buckets.set("Autres équipements", []);
  for (const item of items) {
    const hit = GROUPS.find(([, re]) => re.test(item));
    buckets.get(hit ? hit[0] : "Autres équipements").push(item);
  }
  return [...buckets].filter(([, list]) => list.length).map(([group, list]) => ({ group, items: list }));
}

const SOLD_ON_LEGACY = new Set(["mini-cooper-3-portes-favoured-2024", "renault-clio-5-blue-dci-100-advanced-gris-schiste-2025"]);
const conditionMap = { "0km": "zero-km", neuf: "neuf", occasion: "occasion" };

function toVehicle(v) {
  const status = SOLD_ON_LEGACY.has(v.slug) ? "vendu" : "en-stock";
  const todo = [...(v._todo ?? [])];
  return {
    slug: v.slug,
    category: v.category,
    status,
    condition: conditionMap[v.condition] ?? "occasion",
    brand: v.brand,
    model: v.model,
    version: v.version,
    year: v.year ?? (v.firstRegistration ? Number(v.firstRegistration.slice(0, 4)) : null),
    firstRegistration: v.firstRegistration ?? null,
    mileageKm: v.mileageKm ?? null,
    fuel: v.fuel,
    transmission: v.transmission,
    gearboxLabel: v.gearboxLabel ?? null,
    powerHp: v.powerHp ?? null,
    fiscalHp: v.fiscalHp ?? null,
    engine: v.engine ?? null,
    bodyType: v.bodyType,
    exteriorColor: v.color ?? null,
    interiorColor: null,
    price: {
      amount: v.price.amount ?? null,
      taxMode: v.price.taxMode ?? "TTC",
      vatRecoverable: v.price.vatRecoverable === true,
      co2TaxIncluded: v.price.co2TaxIncluded === true,
      financingAvailable: v.price.financingAvailable !== false,
      variants: v.price.variants ?? [],
    },
    warranty: v.warranty ?? null,
    maintenance: v.maintenance ?? null,
    highlights: [],
    options: groupOptions(v.options),
    images: [],
    featured: v.featured === true,
    legacyUrl: v.legacyUrl ?? null,
    legacyCover: v.coverSource ?? null,
    todo,
  };
}

const vehicles = [
  ...src.vehicles.map(toVehicle),
  // The Citroën Jumpy block was an obsolete footer repeat: dropped on purpose.
  ...src.utilitaires.filter((u) => u.legacyUrl).map(toVehicle),
];

const soldReferences = [
  ...src.vendus.map((v) => ({
    slug: v.slug,
    title: `${v.brand} ${v.model} ${v.version ?? ""}`.trim(),
    brand: v.brand,
    legacyUrl: v.legacyUrl,
    legacyCover: v.coverSource,
    images: [],
  })),
  ...src.vendusGalerie
    .filter((v) => v.legacyUrl)
    .map((v) => ({
      slug: v.legacyUrl.replace(/^\//, "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9-]/gi, "-").toLowerCase(),
      title: v.title,
      brand: v.title.split(" ")[0].replace("Mercedes-AMG", "Mercedes-Benz"),
      legacyUrl: v.legacyUrl,
      legacyCover: v.cover,
      images: [],
    })),
];

const rental = src.location.map((r) => ({
  slug: r.slug,
  title: `${r.brand} ${r.model} ${r.version}`,
  color: r.color,
  legacyUrl: r.legacyUrl,
  legacyCover: r.coverSource,
  images: [],
}));

fs.writeFileSync(path.join(root, "src/content/vehicles.json"), JSON.stringify({ vehicles, soldReferences, rental }, null, 2) + "\n");
console.log(`vehicles: ${vehicles.length}, sold references: ${soldReferences.length}, rental: ${rental.length}`);
