import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { VehiclePhoto } from "@/components/vehicles/vehicle-photo";
import { buttonVariants } from "@/components/ui/button";
import { getSold } from "@/lib/vehicles";
import { vehicleTitle } from "@/lib/format";

export const metadata: Metadata = {
  title: "Véhicules vendus : nos références",
  description:
    "Porsche 911, BMW M3 CS, Aston Martin DBS, Audi RS6, Mercedes Classe G… Une sélection des véhicules trouvés, importés et livrés par Smart Lease.",
  alternates: { canonical: "/vendus" },
};

export default function SoldPage() {
  const { vehicles, references } = getSold();
  const items = [
    ...vehicles.map((v) => ({ key: v.slug, title: vehicleTitle(v), subtitle: v.version, image: v.images[0] })),
    ...references.map((r) => ({ key: r.slug, title: r.title, subtitle: null as string | null, image: r.images[0] })),
  ];
  return (
    <>
      <PageHero
        crumbs={[{ name: "Vendus", path: "/vendus" }]}
        eyebrow={`${items.length} références`}
        title={
          <>
            Ils ont <em>trouvé preneur</em>
          </>
        }
        intro="Une partie des véhicules que nous avons trouvés, importés et livrés. Le modèle qui vous intéresse n'est plus disponible ? Nous pouvons en chercher un équivalent."
      />
      <div className="container-site py-12 md:py-16">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.key} className="grid content-start gap-3">
              <div className="relative">
                <VehiclePhoto image={item.image} alt={item.title} sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw" className="aspect-[4/3]" />
                <span className="absolute left-2 top-2 bg-ink px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-bg">
                  Vendu
                </span>
              </div>
              <div>
                <h2 className="text-lg leading-snug">{item.title}</h2>
                {item.subtitle ? <p className="text-sm text-muted">{item.subtitle}</p> : null}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-16 grid justify-items-start gap-4 border-t border-line pt-10">
          <h2 className="text-display-md">Vous cherchez un modèle similaire ?</h2>
          <Link href="/recherche-personnalisee" className={buttonVariants()}>
            Lancer ma recherche personnalisée
          </Link>
        </div>
      </div>
    </>
  );
}
