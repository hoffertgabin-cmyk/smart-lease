import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getStock } from "@/lib/vehicles";

const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/vehicules", priority: 0.9, changeFrequency: "daily" },
  { path: "/utilitaires", priority: 0.8, changeFrequency: "daily" },
  { path: "/vendus", priority: 0.5, changeFrequency: "weekly" },
  { path: "/services", priority: 0.7, changeFrequency: "monthly" },
  { path: "/recherche-personnalisee", priority: 0.7, changeFrequency: "monthly" },
  { path: "/reprise", priority: 0.6, changeFrequency: "monthly" },
  { path: "/financement", priority: 0.6, changeFrequency: "monthly" },
  { path: "/location", priority: 0.5, changeFrequency: "monthly" },
  { path: "/avis", priority: 0.4, changeFrequency: "monthly" },
  { path: "/a-propos", priority: 0.4, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/mentions-legales", priority: 0.1, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.1, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const vehicles = [...getStock("vp"), ...getStock("utilitaire")];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p.path}`, priority: p.priority, changeFrequency: p.changeFrequency })),
    ...vehicles.map((v) => ({
      url: `${site.url}/vehicules/${v.slug}`,
      priority: 0.8,
      changeFrequency: "weekly" as const,
      images: v.images.slice(0, 1).map((i) => `${site.url}${i.src}`),
    })),
  ];
}
