import type { BodyType, Fuel, Vehicle } from "./vehicle-schema";

const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

export const formatNumber = (n: number) => nf.format(n);
export const formatPrice = (n: number) => `${nf.format(n)} €`;
export const formatKm = (n: number | null) => (n === null ? "—" : `${nf.format(n)} km`);

export const fuelLabel: Record<Fuel, string> = {
  essence: "Essence",
  diesel: "Diesel",
  hybride: "Hybride",
  "hybride-rechargeable": "Hybride rechargeable",
  electrique: "Électrique",
  gpl: "GPL",
};

export const bodyTypeLabel: Record<BodyType, string> = {
  citadine: "Citadine",
  compacte: "Compacte",
  berline: "Berline",
  break: "Break",
  suv: "SUV",
  coupe: "Coupé",
  cabriolet: "Cabriolet / roadster",
  monospace: "Monospace",
  fourgon: "Fourgon",
  fourgonnette: "Fourgonnette",
  benne: "Benne",
};

export const transmissionLabel = { automatique: "Automatique", manuelle: "Manuelle" } as const;

export const conditionLabel = { neuf: "Neuf", "zero-km": "Zéro kilomètre", occasion: "Occasion" } as const;

/** "05/2025" when the month is known, otherwise the year. */
export function formatRegistration(v: Pick<Vehicle, "firstRegistration" | "year">) {
  if (v.firstRegistration) {
    const [y, m] = v.firstRegistration.split("-");
    return `${m}/${y}`;
  }
  return v.year ? String(v.year) : "—";
}

export function vehicleTitle(v: Pick<Vehicle, "brand" | "model">) {
  return `${v.brand} ${v.model}`;
}

export function vehicleFullTitle(v: Pick<Vehicle, "brand" | "model" | "version" | "year">) {
  return `${v.brand} ${v.model} ${v.version}${v.year ? ` (${v.year})` : ""}`;
}

export function statusLabel(v: Pick<Vehicle, "status" | "availableFrom">) {
  switch (v.status) {
    case "en-stock":
      return "En stock";
    case "arrivage":
      return v.availableFrom
        ? `Disponible le ${new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" }).format(new Date(v.availableFrom))}`
        : "En arrivage";
    case "reserve":
      return "Réservé";
    case "vendu":
      return "Vendu";
  }
}

export function priceFrom(v: Vehicle) {
  if (v.price.amount !== null) return v.price.amount;
  return null;
}
