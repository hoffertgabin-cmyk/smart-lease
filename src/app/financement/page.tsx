import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Financement : crédit, LOA, LLD",
  description:
    "Financez votre véhicule neuf ou d'occasion avec Smart Lease : crédit classique, location avec option d'achat (LOA) ou location longue durée (LLD) via nos partenaires agréés.",
  alternates: { canonical: "/financement" },
};

const formulas = [
  {
    id: "credit",
    name: "Crédit classique",
    lead: "Vous êtes propriétaire du véhicule dès l'achat.",
    points: [
      "Remboursement par mensualités fixes sur une durée choisie",
      "Apport possible pour réduire les mensualités",
      "Aucune limite de kilométrage, revente libre",
    ],
    for: "Pour ceux qui veulent garder leur voiture longtemps.",
  },
  {
    id: "loa",
    name: "LOA",
    full: "Location avec option d'achat",
    lead: "Vous louez le véhicule et décidez à la fin si vous l'achetez.",
    points: [
      "Loyers mensuels sur une durée et un kilométrage définis",
      "Option d'achat à l'échéance pour le montant prévu au contrat",
      "Ou restitution du véhicule et passage à un autre modèle",
    ],
    for: "Pour changer régulièrement tout en gardant la possibilité d'acheter.",
  },
  {
    id: "lld",
    name: "LLD",
    full: "Location longue durée",
    lead: "Vous payez l'usage, sans vous soucier de la revente.",
    points: [
      "Loyer mensuel sur une durée et un kilométrage définis",
      "Services possibles selon le contrat (entretien, assistance)",
      "Restitution du véhicule en fin de contrat",
    ],
    for: "Pour les professionnels et ceux qui veulent un budget prévisible.",
  },
];

export default function FinancingPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Financement", path: "/financement" }]}
        eyebrow="Financement"
        title={
          <>
            Crédit, LOA ou LLD, <em>à votre mesure</em>
          </>
        }
        intro="Nous montons votre dossier avec nos partenaires financiers agréés, pour un véhicule neuf ou d'occasion, que vous soyez particulier ou professionnel."
      />
      <div className="container-site py-14 md:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {formulas.map((f) => (
            <section key={f.id} id={f.id} aria-labelledby={`${f.id}-title`} className="grid content-start gap-5 border-t border-ink pt-6">
              <div>
                <h2 id={`${f.id}-title`} className="text-display-lg">
                  {f.name}
                </h2>
                {f.full ? <p className="eyebrow mt-2">{f.full}</p> : null}
              </div>
              <p className="text-lg">{f.lead}</p>
              <ul className="grid gap-2.5 text-muted">
                {f.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span aria-hidden className="mt-[0.75em] h-px w-3 shrink-0 bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="text-sm font-medium text-accent">{f.for}</p>
            </section>
          ))}
        </div>
        <div className="mt-16 grid gap-6 rounded-lg border border-line bg-paper p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-10">
          <div className="grid gap-3">
            <h2 className="text-display-md">Une simulation adaptée à votre projet</h2>
            <p className="max-w-[60ch] text-muted">
              Les mensualités dépendent du véhicule, de la durée, de l&apos;apport et de votre situation. Plutôt qu&apos;un
              simulateur approximatif, nous vous transmettons une offre chiffrée de nos partenaires. Un crédit vous
              engage et doit être remboursé : vérifiez vos capacités de remboursement avant de vous engager.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact?sujet=information" className={buttonVariants()}>
              Demander une offre
            </Link>
            <Link href="/vehicules" className={buttonVariants({ variant: "outline" })}>
              Voir le stock
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
