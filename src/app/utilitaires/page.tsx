import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { Catalog } from "@/components/vehicles/catalog";
import { buttonVariants } from "@/components/ui/button";
import { getStock } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Utilitaires neufs et zéro km, prix HT",
  description:
    "Renault Master, Trafic, Express, Fiat Ducato et Talento pour les professionnels : prix HT, TVA récupérable, aménagement bois, devis flotte. Smart Lease Luxembourg.",
  alternates: { canonical: "/utilitaires" },
};

export default async function UtilityPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const stock = getStock("utilitaire");
  return (
    <>
      <PageHero
        crumbs={[{ name: "Utilitaires", path: "/utilitaires" }]}
        eyebrow="Professionnels et indépendants"
        title={
          <>
            Utilitaires, <em>prix HT</em>
          </>
        }
        intro={
          <>
            <p>Fourgons, fourgonnettes et bennes neufs ou zéro kilomètre. TVA récupérable, aménagement bois sur demande, devis flotte.</p>
            <Link href="/contact?sujet=devis-pro" className={buttonVariants({ className: "mt-6" })}>
              Demander un devis pro
            </Link>
          </>
        }
      />
      <div className="container-site py-12 md:py-16">
        <Catalog vehicles={stock} searchParams={params} emptyCta={{ label: "Demander un devis pro", href: "/contact?sujet=devis-pro" }} />
      </div>
    </>
  );
}
