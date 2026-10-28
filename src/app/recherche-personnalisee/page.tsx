import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { SearchForm } from "@/components/forms/search-form";
import { ImportSteps } from "@/components/home/import-steps";

export const metadata: Metadata = {
  title: "Recherche personnalisée : votre véhicule importé d'Europe",
  description:
    "Décrivez le véhicule que vous cherchez : Smart Lease le trouve chez ses partenaires européens, gère l'import et l'immatriculation, et vous le livre en quelques jours.",
  alternates: { canonical: "/recherche-personnalisee" },
};

export default function SearchPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Recherche personnalisée", path: "/recherche-personnalisee" }]}
        eyebrow="Cahier des charges"
        title={
          <>
            Décrivez-le, <em>nous le trouvons</em>
          </>
        }
        intro="Plus vos réponses sont précises, plus nos propositions correspondront à vos attentes. Comptez cinq minutes ; vous n'êtes engagé à rien."
      />
      <div className="container-site grid gap-14 py-14 md:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div className="rounded-lg border border-line bg-paper p-6 md:p-10">
          <SearchForm />
        </div>
        <aside aria-label="Comment ça marche" className="grid content-start gap-8">
          <p className="eyebrow">Après votre demande</p>
          <ImportSteps vertical />
        </aside>
      </div>
    </>
  );
}
