import "server-only";
import raw from "@/content/vehicles.json";
import { contentSchema, type Vehicle } from "./vehicle-schema";

// Data access layer. Swap this file's internals for a CMS (Sanity) without touching the pages.
const content = contentSchema.parse(raw);

export function getVehicles(): Vehicle[] {
  return content.vehicles;
}

export function getStock(category: Vehicle["category"]): Vehicle[] {
  return content.vehicles.filter((v) => v.category === category && v.status !== "vendu");
}

export function getVehicle(slug: string): Vehicle | undefined {
  return content.vehicles.find((v) => v.slug === slug);
}

export function getFeatured(limit = 6): Vehicle[] {
  return getStock("vp")
    .filter((v) => v.featured)
    .slice(0, limit);
}

export function getSimilar(vehicle: Vehicle, limit = 3): Vehicle[] {
  const price = vehicle.price.amount ?? 0;
  return getStock(vehicle.category)
    .filter((v) => v.slug !== vehicle.slug)
    .map((v) => ({
      v,
      score:
        (v.bodyType === vehicle.bodyType ? 0 : 1) +
        Math.abs((v.price.amount ?? price) - price) / Math.max(price, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map(({ v }) => v);
}

export function getSold() {
  return {
    vehicles: content.vehicles.filter((v) => v.status === "vendu"),
    references: content.soldReferences,
  };
}

export function getRental() {
  return content.rental;
}
