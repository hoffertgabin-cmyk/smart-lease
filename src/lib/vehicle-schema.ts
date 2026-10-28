import { z } from "zod";
import { bodyTypeValues, fuelValues, statusValues } from "./vehicle-enums";

export { bodyTypeValues, fuelValues, statusValues };

const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number(),
  height: z.number(),
  blurDataURL: z.string().optional(),
});

export const vehicleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(["vp", "utilitaire"]),
  status: z.enum(statusValues),
  availableFrom: z.string().nullish(),
  condition: z.enum(["neuf", "zero-km", "occasion"]),
  brand: z.string(),
  model: z.string(),
  version: z.string(),
  year: z.number().nullable(),
  firstRegistration: z.string().nullable(),
  mileageKm: z.number().nullable(),
  fuel: z.enum(fuelValues),
  transmission: z.enum(["automatique", "manuelle"]),
  gearboxLabel: z.string().nullable(),
  powerHp: z.number().nullable(),
  fiscalHp: z.number().nullable(),
  engine: z.string().nullable(),
  bodyType: z.enum(bodyTypeValues),
  exteriorColor: z.string().nullable(),
  interiorColor: z.string().nullable(),
  price: z.object({
    amount: z.number().nullable(),
    taxMode: z.enum(["TTC", "HT"]),
    vatRecoverable: z.boolean(),
    co2TaxIncluded: z.boolean(),
    financingAvailable: z.boolean(),
    variants: z.array(z.object({ label: z.string(), amount: z.number() })),
  }),
  warranty: z.string().nullable(),
  maintenance: z.string().nullable(),
  highlights: z.array(z.string()),
  options: z.array(z.object({ group: z.string(), items: z.array(z.string()) })),
  images: z.array(imageSchema),
  featured: z.boolean(),
  soldAt: z.string().nullish(),
  legacyUrl: z.string().nullable(),
  legacyCover: z.string().nullable(),
  todo: z.array(z.string()),
});

export const soldReferenceSchema = z.object({
  slug: z.string(),
  title: z.string(),
  brand: z.string(),
  legacyUrl: z.string().nullable(),
  legacyCover: z.string().nullable(),
  images: z.array(imageSchema),
});

export const rentalSchema = z.object({
  slug: z.string(),
  title: z.string(),
  color: z.string().nullable(),
  legacyUrl: z.string().nullable(),
  legacyCover: z.string().nullable(),
  images: z.array(imageSchema),
});

export const contentSchema = z.object({
  vehicles: z.array(vehicleSchema),
  soldReferences: z.array(soldReferenceSchema),
  rental: z.array(rentalSchema),
});

export type Vehicle = z.infer<typeof vehicleSchema>;
export type VehicleImage = z.infer<typeof imageSchema>;
export type SoldReference = z.infer<typeof soldReferenceSchema>;
export type RentalVehicle = z.infer<typeof rentalSchema>;
export type Fuel = (typeof fuelValues)[number];
export type BodyType = (typeof bodyTypeValues)[number];
export type VehicleStatus = (typeof statusValues)[number];
