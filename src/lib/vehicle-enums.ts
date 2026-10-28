// Plain value lists, safe to import from client components (no zod).
export const fuelValues = ["essence", "diesel", "hybride", "hybride-rechargeable", "electrique", "gpl"] as const;
export const bodyTypeValues = [
  "citadine", "compacte", "berline", "break", "suv", "coupe", "cabriolet", "monospace", "fourgon", "fourgonnette", "benne",
] as const;
export const statusValues = ["en-stock", "arrivage", "reserve", "vendu"] as const;
