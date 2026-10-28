// Service copy, rewritten from the legacy /nos-services page. Used on the home page and /services.
export type Service = {
  id: string;
  title: string;
  short: string;
  body: string[];
  points?: string[];
  cta: { label: string; href: string };
};

export const services: Service[] = [
  {
    id: "recherche",
    title: "Recherche personnalisée",
    short: "Vous décrivez la voiture, nous la trouvons pour vous en Europe.",
    body: [
      "Remplissez votre cahier des charges en ligne : modèle, budget, options indispensables, délai. Nous interrogeons notre réseau de partenaires européens et revenons vers vous avec des propositions vérifiées et chiffrées.",
      "Vous gardez la main à chaque étape : rien n'est engagé sans votre accord.",
    ],
    cta: { label: "Remplir mon cahier des charges", href: "/recherche-personnalisee" },
  },
  {
    id: "stock",
    title: "Véhicules en stock",
    short: "Une sélection disponible tout de suite, livrée en quelques jours.",
    body: [
      "Grâce à nos partenaires dans toute l'Europe, nous avons souvent le bon véhicule disponible, avec un délai de livraison très court là où d'autres annoncent des semaines d'attente.",
    ],
    cta: { label: "Voir le stock", href: "/vehicules" },
  },
  {
    id: "import",
    title: "Import Europe clé en main",
    short: "Nous gérons tout, jusqu'à l'immatriculation définitive.",
    body: [
      "Achat, transport, contrôle, taxes, plaques provisoires et immatriculation définitive : nous prenons en charge l'ensemble des démarches. Vous récupérez un véhicule prêt à rouler, au Luxembourg ou livré ailleurs en Europe.",
    ],
    points: ["Cahier des charges", "Sourcing Europe", "Démarches et immatriculation", "Livraison"],
    cta: { label: "Lancer ma recherche", href: "/recherche-personnalisee" },
  },
  {
    id: "reprise",
    title: "Reprise au meilleur prix",
    short: "Votre véhicule actuel repris pour financer le suivant.",
    body: [
      "Nous rachetons votre véhicule à un prix compétitif pour faciliter votre nouvel achat. Si nous ne trouvons pas d'accord sur le prix, nous vous proposons le dépôt-vente gratuit.",
    ],
    cta: { label: "Faire estimer mon véhicule", href: "/reprise" },
  },
  {
    id: "depot-vente",
    title: "Dépôt-vente gratuit",
    short: "Nous vendons votre véhicule pour vous, sans frais de dépôt.",
    body: [
      "Confiez-nous votre véhicule : il est présenté dans nos locaux et sur notre site, et nous gérons les contacts avec les acheteurs.",
    ],
    cta: { label: "Proposer mon véhicule", href: "/reprise" },
  },
  {
    id: "financement",
    title: "Financement",
    short: "Crédit classique, LOA ou LLD avec nos partenaires agréés.",
    body: [
      "Neuf ou occasion, nous vous orientons vers la formule adaptée à votre situation, particulier ou professionnel, et montons le dossier avec nos partenaires financiers agréés.",
    ],
    cta: { label: "Comprendre les formules", href: "/financement" },
  },
  {
    id: "location",
    title: "Location",
    short: "Un véhicule pour une durée déterminée à l'avance.",
    body: ["Besoin d'un véhicule pour quelques jours ou quelques mois ? Nous vous louons un véhicule pour la durée convenue."],
    cta: { label: "Voir l'offre de location", href: "/location" },
  },
];

export const importSteps = [
  {
    title: "Cahier des charges",
    text: "Modèle, budget, options indispensables, délai : en ligne ou lors d'un rendez-vous.",
  },
  {
    title: "Sourcing Europe",
    text: "Recherche chez nos partenaires européens, propositions vérifiées et chiffrées.",
  },
  {
    title: "Démarches et immatriculation",
    text: "Transport, taxes et immatriculation définitive, financement si besoin.",
  },
  {
    title: "Livraison",
    text: "Remise des clés à Luxembourg ou livraison partout en Europe.",
  },
];
