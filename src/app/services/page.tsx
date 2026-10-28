import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { ImportSteps } from "@/components/home/import-steps";
import { AppointmentCta } from "@/components/home/appointment-cta";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Services : import Europe, recherche, reprise, financement",
  description:
    "Recherche personnalisée, véhicules en stock, import Europe clé en main jusqu'à l'immatriculation, reprise, dépôt-vente gratuit, financement crédit, LOA, LLD et location. Smart Lease Luxembourg.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }]}
        eyebrow="Nos services"
        title={
          <>
            Un interlocuteur, <em>de la recherche à la livraison</em>
          </>
        }
        intro="Particulier exigeant ou professionnel, nous trouvons, importons, finançons et livrons votre véhicule. Vous n'avez aucune démarche à faire."
      >
        <nav aria-label="Services" className="mt-10 flex flex-wrap gap-2">
          {services.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="rounded-full border border-line bg-paper px-4 py-2 text-sm hover:border-ink">
              {s.title}
            </a>
          ))}
        </nav>
      </PageHero>
      <div className="container-site">
        {services.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            aria-labelledby={`${s.id}-title`}
            className="grid gap-6 border-b border-line py-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12 md:py-20"
          >
            <div>
              <p className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h2 id={`${s.id}-title`} className="mt-3 text-display-lg">
                {s.title}
              </h2>
            </div>
            <div className="grid content-start gap-6">
              <div className="grid max-w-[62ch] gap-4 text-lg text-muted">
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {s.id === "import" ? (
                <div className="py-4">
                  <ImportSteps vertical />
                </div>
              ) : null}
              <div>
                <Link href={s.cta.href} className={buttonVariants()}>
                  {s.cta.label}
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>
      <AppointmentCta />
    </>
  );
}
