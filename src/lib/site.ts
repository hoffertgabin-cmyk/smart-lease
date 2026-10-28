// Single source of truth for company details. Never hard-code these elsewhere.
export const site = {
  name: "Smart Lease",
  legalName: "Smart Lease S.A.R.L",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.smartlease.fr",
  description:
    "Négociant automobile indépendant à Luxembourg : véhicules neufs et d'occasion récents, import clé en main depuis toute l'Europe, financement crédit, LOA et LLD, utilitaires pour les professionnels.",
  address: {
    street: "71-72 Muehlenweg",
    postalCode: "L-2155",
    city: "Luxembourg",
    country: "LU",
    countryName: "Luxembourg",
  },
  geo: { latitude: 49.5876, longitude: 6.1282 }, // TODO: vérifier les coordonnées exactes du 71-72 Muehlenweg
  phone: { display: "+352 691 452 770", e164: "+352691452770" },
  whatsapp: "https://wa.me/352691452770",
  email: "contact@smartlease.lu",
  hours: "Du lundi au dimanche, uniquement sur rendez-vous",
  hoursShort: "Uniquement sur rendez-vous, 7j/7",
  rcs: "2020 2429 689",
  vat: "LU32219616",
  social: {
    instagram: "https://instagram.com/smart_lease",
    facebook: "https://www.facebook.com/people/Smart-Lease/100063577572202/",
  },
  // TODO: compléter avant la mise en ligne
  publicationDirector: null as string | null,
  host: null as { name: string; address: string; phone?: string } | null,
  googleReviewsUrl: null as string | null,
} as const;

export const telHref = `tel:${site.phone.e164}`;
export const mailHref = `mailto:${site.email}`;
export const whatsappHref = (text?: string) =>
  text ? `${site.whatsapp}?text=${encodeURIComponent(text)}` : site.whatsapp;
export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "71-72 Muehlenweg, L-2155 Luxembourg",
)}`;
