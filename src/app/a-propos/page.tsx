import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { AppointmentCta } from "@/components/home/appointment-cta";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
  description: "Smart Lease S.A.R.L, négociant automobile indépendant et mandataire import Europe installé au 71-72 Muehlenweg à Luxembourg.",
  alternates: { canonical: "/a-propos" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "À propos", path: "/a-propos" }]}
        eyebrow="À propos"
        title={
          <>
            Une maison indépendante, <em>à Luxembourg</em>
          </>
        }
        intro={`${site.legalName}, négociant automobile multimarques et mandataire pour l'import de véhicules en Europe.`}
      />
      <div className="container-site grid gap-10 py-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:py-20">
        <p className="eyebrow">Notre histoire</p>
        <div className="prose-site grid max-w-[65ch] gap-4 text-lg">
          <p className="todo w-fit">TODO texte « À propos »</p>
          <p className="text-muted">
            À rédiger avec Smart Lease : date de création, parcours du ou des fondateurs, philosophie (sélection, rapidité,
            transparence), zone d&apos;intervention (Luxembourg, frontaliers, Grand Est, Europe), photo de l&apos;équipe et des
            locaux.
          </p>
        </div>
      </div>
      <AppointmentCta />
    </>
  );
}
