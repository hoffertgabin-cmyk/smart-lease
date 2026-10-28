// Interface strings. Add en.ts / de.ts with the same keys when the site goes multilingual.
export const fr = {
  nav: {
    vehicles: "Véhicules",
    utility: "Utilitaires",
    services: "Services",
    search: "Recherche personnalisée",
    sold: "Vendus",
    contact: "Contact",
    rental: "Location",
    tradeIn: "Reprise",
    financing: "Financement",
    reviews: "Avis",
    about: "À propos",
    appointment: "Rendez-vous",
    menu: "Menu",
    close: "Fermer",
    skip: "Aller au contenu",
  },
  cta: {
    seeStock: "Voir le stock",
    startSearch: "Lancer ma recherche",
    bookAppointment: "Prendre rendez-vous",
    requestInfo: "Demande d'information",
    proQuote: "Demander un devis pro",
    call: "Appeler",
    whatsapp: "WhatsApp",
    share: "Partager",
  },
  price: {
    ttc: "TTC",
    ht: "HT",
    vatRecoverable: "TVA récupérable",
    co2Included: "Taxe CO2 incluse",
    financing: "Financement possible (crédit, LOA, LLD)",
    onRequest: "Prix sur demande",
    from: "À partir de",
  },
  footer: {
    legal: "Mentions légales",
    privacy: "Confidentialité",
    cookies: "Gérer les cookies",
  },
} as const;

export type Dictionary = typeof fr;
export const t = fr;
