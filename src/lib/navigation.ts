import { t } from "@/i18n/fr";

export type NavLink = { href: string; label: string };
export type NavItem = NavLink & { children?: NavLink[] };

export const mainNav: NavItem[] = [
  { href: "/vehicules", label: t.nav.vehicles },
  { href: "/utilitaires", label: t.nav.utility },
  {
    href: "/services",
    label: t.nav.services,
    children: [
      { href: "/services", label: "Tous nos services" },
      { href: "/recherche-personnalisee", label: t.nav.search },
      { href: "/reprise", label: t.nav.tradeIn },
      { href: "/financement", label: t.nav.financing },
      { href: "/location", label: t.nav.rental },
    ],
  },
  { href: "/vendus", label: t.nav.sold },
  { href: "/contact", label: t.nav.contact },
];

export const footerNav = [
  {
    title: "Véhicules",
    links: [
      { href: "/vehicules", label: "Stock particuliers" },
      { href: "/utilitaires", label: "Utilitaires" },
      { href: "/vendus", label: "Véhicules vendus" },
      { href: "/location", label: "Location" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/recherche-personnalisee", label: "Recherche personnalisée" },
      { href: "/services#import", label: "Import Europe" },
      { href: "/reprise", label: "Reprise et dépôt-vente" },
      { href: "/financement", label: "Financement" },
    ],
  },
  {
    title: "Smart Lease",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/avis", label: "Avis clients" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;
