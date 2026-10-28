import { z } from "zod";

const phone = z
  .string()
  .trim()
  .min(6, "Indiquez un numéro de téléphone valide.")
  .max(30)
  .regex(/^[+()0-9 .-]+$/, "Indiquez un numéro de téléphone valide.");
const email = z.string().trim().max(200).pipe(z.email("Indiquez une adresse e-mail valide."));
const name = z.string().trim().min(2, "Indiquez votre nom.").max(120);
/** Honeypot: real users never fill it. */
const honeypot = z.string().max(0).optional().or(z.literal(""));
const consent = z.literal(true, { error: "Votre accord est nécessaire pour vous répondre." });

export const contactSchema = z.object({
  name,
  email,
  phone: phone.optional().or(z.literal("")),
  subject: z.enum(["information", "rendez-vous", "devis-pro", "location", "autre"]),
  vehicle: z.string().max(200).optional(),
  message: z.string().trim().min(10, "Votre message est un peu court (10 caractères minimum).").max(4000),
  consent,
  website: honeypot,
});
export type ContactInput = z.input<typeof contactSchema>;

export const searchSchema = z.object({
  // Étape 1 : le projet
  vehicleType: z.enum(["citadine", "compacte", "berline", "break", "suv", "coupe", "cabriolet", "monospace", "utilitaire", "indifferent"], { error: "Choisissez un type de véhicule." }),
  brands: z.string().trim().max(300).optional(),
  models: z.string().trim().max(300).optional(),
  condition: z.enum(["neuf", "occasion", "indifferent"], { error: "Choisissez une option." }),
  // Étape 2 : budget et critères
  budgetMax: z.coerce.number({ error: "Indiquez un budget." }).int().min(1000, "Indiquez un budget réaliste.").max(2_000_000),
  financing: z.enum(["comptant", "credit", "loa", "lld", "a-discuter"]),
  yearMin: z.union([z.literal(""), z.coerce.number().int().min(1950).max(2100)]).optional(),
  kmMax: z.union([z.literal(""), z.coerce.number().int().min(0).max(1_000_000)]).optional(),
  fuel: z.array(z.enum(["essence", "diesel", "hybride", "hybride-rechargeable", "electrique", "indifferent"])).min(1, "Choisissez au moins une énergie."),
  transmission: z.enum(["automatique", "manuelle", "indifferent"]),
  // Étape 3 : équipements et délai
  mustHave: z.string().trim().max(1000).optional(),
  colors: z.string().trim().max(200).optional(),
  deadline: z.enum(["urgent", "1-mois", "3-mois", "pas-presse"]),
  // Étape 4 : reprise
  tradeIn: z.enum(["oui", "non"]),
  tradeInDetails: z.string().trim().max(500).optional(),
  // Étape 5 : vous
  customerType: z.enum(["particulier", "professionnel"]),
  company: z.string().trim().max(200).optional(),
  name,
  email,
  phone,
  contactPreference: z.enum(["telephone", "email", "whatsapp"]),
  comment: z.string().trim().max(2000).optional(),
  consent,
  website: honeypot,
});
export type SearchInput = z.input<typeof searchSchema>;
export type SearchOutput = z.output<typeof searchSchema>;

export const tradeInSchema = z.object({
  brand: z.string().trim().min(2, "Indiquez la marque.").max(60),
  model: z.string().trim().min(1, "Indiquez le modèle.").max(120),
  year: z.coerce.number({ error: "Indiquez l'année." }).int().min(1950).max(2100),
  mileageKm: z.coerce.number({ error: "Indiquez le kilométrage." }).int().min(0).max(2_000_000),
  fuel: z.enum(["essence", "diesel", "hybride", "hybride-rechargeable", "electrique", "gpl"]),
  transmission: z.enum(["automatique", "manuelle"]),
  condition: z.string().trim().max(1500).optional(),
  wish: z.enum(["reprise", "depot-vente", "les-deux"]),
  name,
  email,
  phone,
  consent,
  website: honeypot,
});
export type TradeInInput = z.input<typeof tradeInSchema>;
export type TradeInOutput = z.output<typeof tradeInSchema>;

export const UPLOAD_LIMITS = {
  maxFiles: 8,
  maxFileBytes: 4 * 1024 * 1024,
  maxTotalBytes: 4 * 1024 * 1024, // Vercel request body limit is 4.5 MB
  accept: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"],
};
