import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { VehiclePhoto } from "@/components/vehicles/vehicle-photo";
import type { VehicleImage } from "@/lib/vehicle-schema";

const rows = [
  { term: "TVA", text: "Récupérable sur les véhicules éligibles, prix affichés hors taxes." },
  { term: "Utilitaires", text: "Renault Master, Trafic, Express, Fiat Ducato et Talento, neufs ou zéro kilomètre." },
  { term: "Aménagement", text: "Pack bois pour utilitaires de toutes marques, sur devis." },
  { term: "Flottes", text: "Plusieurs véhicules, un seul interlocuteur du devis à la livraison." },
];

export function ProBlock({ image }: { image?: VehicleImage }) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
      <VehiclePhoto image={image} alt="Utilitaire Renault Trafic" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[5/4]" />
      <div>
        <p className="eyebrow">Professionnels et indépendants</p>
        <h2 className="mt-3.5 text-display-lg">
          Utilitaires et flottes, <em>prix HT</em>
        </h2>
        <dl className="mt-7">
          {rows.map((r) => (
            <div key={r.term} className="grid gap-1 border-t border-line py-3.5 sm:grid-cols-[160px_1fr] sm:gap-4">
              <dt className="font-display text-xl">{r.term}</dt>
              <dd className="text-muted">{r.text}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/utilitaires" className={buttonVariants()}>
            Voir les utilitaires
          </Link>
          <Link href="/contact?sujet=devis-pro" className={buttonVariants({ variant: "outline" })}>
            Demander un devis pro
          </Link>
        </div>
      </div>
    </div>
  );
}
