import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { TradeInForm } from "@/components/forms/trade-in-form";

export const metadata: Metadata = {
  title: "Reprise et dépôt-vente : estimez votre véhicule",
  description:
    "Faites estimer votre véhicule : reprise au meilleur prix ou, à défaut d'accord, dépôt-vente gratuit chez Smart Lease à Luxembourg. Envoyez photos et carte grise en ligne.",
  alternates: { canonical: "/reprise" },
};

export default function TradeInPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Reprise", path: "/reprise" }]}
        eyebrow="Reprise et dépôt-vente"
        title={
          <>
            Votre véhicule actuel, <em>repris au juste prix</em>
          </>
        }
        intro="Envoyez-nous quelques photos et la carte grise : nous vous faisons une proposition de reprise. Si le prix ne vous convient pas, nous vous proposons le dépôt-vente gratuit dans nos locaux."
      />
      <div className="container-site grid gap-14 py-14 md:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div className="rounded-lg border border-line bg-paper p-6 md:p-10">
          <TradeInForm />
        </div>
        <aside aria-label="Comment ça marche" className="grid content-start gap-6">
          <p className="eyebrow">Comment ça marche</p>
          <ol className="grid gap-6">
            {[
              ["Vous décrivez le véhicule", "Photos, kilométrage, entretien et carte grise, en ligne."],
              ["Nous l'estimons", "Une proposition de reprise, à confirmer lors de l'inspection."],
              ["Vous choisissez", "Reprise immédiate, ou dépôt-vente gratuit si le prix ne vous convient pas."],
            ].map(([title, text], i) => (
              <li key={title} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-line pt-5">
                <span className="tabular-nums font-semibold text-sm text-accent">{i + 1}</span>
                <div>
                  <p className="font-display text-xl">{title}</p>
                  <p className="mt-1 text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </>
  );
}
