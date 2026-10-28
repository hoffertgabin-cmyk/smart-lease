import type { Vehicle } from "./vehicle-schema";
import { bodyTypeValues, fuelValues } from "./vehicle-enums";

export const sortOptions = [
  { value: "recommande", label: "Recommandés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "km-asc", label: "Kilométrage croissant" },
  { value: "annee-desc", label: "Plus récents" },
] as const;
export type SortValue = (typeof sortOptions)[number]["value"];

export type Filters = {
  q?: string;
  marque?: string;
  prixMin?: number;
  prixMax?: number;
  anneeMin?: number;
  kmMax?: number;
  energie?: Vehicle["fuel"];
  boite?: Vehicle["transmission"];
  carrosserie?: Vehicle["bodyType"];
  tva?: "recuperable";
  tri: SortValue;
};

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
const num = (v: string | undefined) => {
  if (!v) return undefined;
  const n = Number(v.replace(/\s/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};
const pick = <T extends string>(v: string | undefined, values: readonly T[]) =>
  v && (values as readonly string[]).includes(v) ? (v as T) : undefined;

export function parseFilters(params: Params): Filters {
  return {
    q: one(params.q)?.slice(0, 80),
    marque: one(params.marque),
    prixMin: num(one(params.prixMin)),
    prixMax: num(one(params.prixMax)),
    anneeMin: num(one(params.anneeMin)),
    kmMax: num(one(params.kmMax)),
    energie: pick(one(params.energie), fuelValues),
    boite: pick(one(params.boite), ["automatique", "manuelle"] as const),
    carrosserie: pick(one(params.carrosserie), bodyTypeValues),
    tva: one(params.tva) === "recuperable" ? "recuperable" : undefined,
    tri: pick(one(params.tri), sortOptions.map((o) => o.value)) ?? "recommande",
  };
}

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function applyFilters(vehicles: Vehicle[], f: Filters): Vehicle[] {
  const terms = f.q ? normalize(f.q).split(/\s+/).filter(Boolean) : [];
  const result = vehicles.filter((v) => {
    const price = v.price.amount;
    if (f.marque && v.brand !== f.marque) return false;
    if (f.prixMin !== undefined && (price === null || price < f.prixMin)) return false;
    if (f.prixMax !== undefined && (price === null || price > f.prixMax)) return false;
    if (f.anneeMin !== undefined && (v.year === null || v.year < f.anneeMin)) return false;
    if (f.kmMax !== undefined && (v.mileageKm === null || v.mileageKm > f.kmMax)) return false;
    if (f.energie && v.fuel !== f.energie) return false;
    if (f.boite && v.transmission !== f.boite) return false;
    if (f.carrosserie && v.bodyType !== f.carrosserie) return false;
    if (f.tva && !v.price.vatRecoverable) return false;
    if (terms.length) {
      const hay = normalize(
        [v.brand, v.model, v.version, v.exteriorColor ?? "", v.engine ?? "", ...v.options.flatMap((o) => o.items)].join(" "),
      );
      if (!terms.every((t) => hay.includes(t))) return false;
    }
    return true;
  });

  const price = (v: Vehicle) => v.price.amount ?? Number.POSITIVE_INFINITY;
  switch (f.tri) {
    case "prix-asc":
      return result.sort((a, b) => price(a) - price(b));
    case "prix-desc":
      return result.sort((a, b) => (b.price.amount ?? -1) - (a.price.amount ?? -1));
    case "km-asc":
      return result.sort((a, b) => (a.mileageKm ?? Infinity) - (b.mileageKm ?? Infinity));
    case "annee-desc":
      return result.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    default:
      return result.sort((a, b) => Number(b.featured) - Number(a.featured) || (b.year ?? 0) - (a.year ?? 0));
  }
}

export function facets(vehicles: Vehicle[]) {
  const uniq = <T,>(arr: T[]) => [...new Set(arr)];
  return {
    brands: uniq(vehicles.map((v) => v.brand)).sort((a, b) => a.localeCompare(b, "fr")),
    fuels: uniq(vehicles.map((v) => v.fuel)),
    bodyTypes: uniq(vehicles.map((v) => v.bodyType)),
    transmissions: uniq(vehicles.map((v) => v.transmission)),
    years: uniq(vehicles.map((v) => v.year).filter((y): y is number => y !== null)).sort((a, b) => b - a),
    hasVatRecoverable: vehicles.some((v) => v.price.vatRecoverable),
  };
}
export type Facets = ReturnType<typeof facets>;

export function activeFilterCount(f: Filters) {
  return (["marque", "prixMin", "prixMax", "anneeMin", "kmMax", "energie", "boite", "carrosserie", "tva", "q"] as const).filter(
    (k) => f[k] !== undefined,
  ).length;
}
