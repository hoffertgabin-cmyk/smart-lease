import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { VehiclePhoto } from "@/components/vehicles/vehicle-photo";
import { buttonVariants } from "@/components/ui/button";
import { getRental } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Location de véhicules",
  description:
    "Location de véhicules sur une durée déterminée à Luxembourg : minibus 8 places et utilitaires. Aménagement bois pour utilitaires toutes marques. Smart Lease.",
  alternates: { canonical: "/location" },
};

export default function RentalPage() {
  const rental = getRental();
  return (
    <>
      <PageHero
        crumbs={[{ name: "Location", path: "/location" }]}
        eyebrow="Location"
        title={
          <>
            Un véhicule, <em>pour la durée qu&apos;il vous faut</em>
          </>
        }
        intro="Quelques jours, quelques semaines ou quelques mois : nous convenons ensemble de la durée et des conditions avant le départ."
      />
      <div className="container-site grid gap-16 py-14 md:py-20">
        <ul className="grid gap-10 md:grid-cols-2">
          {rental.map((r) => (
            <li key={r.slug} className="grid content-start gap-4">
              <VehiclePhoto image={r.images[0]} alt={r.title} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[3/2]" />
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-display-md">{r.title}</h2>
                  {r.color ? <p className="text-muted">Couleur : {r.color}</p> : null}
                </div>
                <p className="font-display text-2xl">Tarif sur demande</p>
              </div>
              <p className="todo w-fit">TODO tarifs jour / semaine / mois, caution, kilométrage inclus</p>
              <Link href="/contact?sujet=location" className={buttonVariants({ className: "w-fit" })}>
                Demander une réservation
              </Link>
            </li>
          ))}
          <li className="grid content-start gap-4 self-start border border-line bg-paper p-6 md:p-8">
            <p className="eyebrow">Professionnels</p>
            <h2 className="text-display-md">Pack bois pour utilitaires</h2>
            <p className="text-muted">
              Aménagement bois pour utilitaires de toutes tailles et de toutes marques.
            </p>
            <p className="font-display text-2xl">Prix sur demande</p>
            <Link href="/contact?sujet=devis-pro" className={buttonVariants({ variant: "outline", className: "w-fit" })}>
              Demander un devis
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
