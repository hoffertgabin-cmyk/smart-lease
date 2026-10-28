import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Catalog } from "@/components/vehicles/catalog";
import { getStock } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Véhicules en stock : occasions récentes et neufs",
  description:
    "Stock Smart Lease à Luxembourg : Porsche, Audi, Mercedes, BMW, Cupra, Mini… Prix TTC, TVA récupérable signalée, financement crédit, LOA, LLD. Livraison en quelques jours.",
  alternates: { canonical: "/vehicules" },
};

export default async function VehiclesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const stock = getStock("vp");
  return (
    <>
      <PageHero
        crumbs={[{ name: "Véhicules", path: "/vehicules" }]}
        eyebrow={`${stock.length} véhicules disponibles`}
        title={
          <>
            Véhicules <em>en stock</em>
          </>
        }
        intro="Du citadin au sportif premium, chaque véhicule est disponible rapidement. Vous ne trouvez pas le vôtre ? Nous le cherchons pour vous."
      />
      <div className="container-site py-12 md:py-16">
        <Catalog vehicles={stock} searchParams={params} emptyCta={{ label: "Lancer ma recherche", href: "/recherche-personnalisee" }} />
      </div>
    </>
  );
}
