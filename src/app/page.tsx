import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/layout/page-hero";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { VehiclePhoto } from "@/components/vehicles/vehicle-photo";
import { ImportSteps } from "@/components/home/import-steps";
import { ProBlock } from "@/components/home/pro-block";
import { ReviewsSection } from "@/components/home/reviews-section";
import { InstagramFeed } from "@/components/home/instagram-feed";
import { AppointmentCta } from "@/components/home/appointment-cta";
import { services } from "@/content/services";
import { getFeatured, getStock, getVehicle } from "@/lib/vehicles";
import { vehicleTitle } from "@/lib/format";

export default function HomePage() {
  const featured = getFeatured(4);
  const stockCount = getStock("vp").length;
  const heroVehicle = getVehicle("audi-rsq8-2022") ?? featured[0];
  const proVehicle = getVehicle("renault-trafic-l1h1-150-confort");

  return (
    <>
      <section aria-labelledby="hero-title" className="on-dark pb-16 pt-10 md:pb-20 md:pt-14">
        <div className="container-site grid items-center gap-10 md:grid-cols-2 md:gap-12">
          <div className="order-2 md:order-1">
            <p className="eyebrow">Négociant automobile indépendant · Luxembourg</p>
            <h1 id="hero-title" className="mt-5 text-display-xl">
              Votre voiture, trouvée, importée et livrée <em>en quelques jours.</em>
            </h1>
            <p className="mt-6 max-w-[40ch] text-lg text-muted">
              Nous cherchons, importons et immatriculons pour vous, partout en Europe. Sans démarches de votre côté.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/vehicules" className={buttonVariants({ size: "lg" })}>
                Voir le stock
              </Link>
              <Link href="/recherche-personnalisee" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Lancer ma recherche
              </Link>
            </div>
          </div>
          {heroVehicle ? (
            <Link href={`/vehicules/${heroVehicle.slug}`} className="group relative order-1 block md:order-2">
              <VehiclePhoto
                image={heroVehicle.images[0]}
                alt={`${vehicleTitle(heroVehicle)} ${heroVehicle.version}`}
                sizes="(min-width: 768px) 58vw, 100vw"
                priority
                className="aspect-[4/3]"
              />
              <span className="absolute bottom-3 right-3 bg-paper/90 px-3 py-1.5 text-sm">
                {vehicleTitle(heroVehicle)} <span className="text-muted">· en stock</span>
              </span>
            </Link>
          ) : null}
        </div>
        <div className="container-site">
          <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-2 border-t border-line pt-5 text-[0.9375rem] text-muted">
            <li>
              <strong className="font-medium text-ink">Import clé en main</strong> jusqu&apos;à l&apos;immatriculation définitive
            </li>
            <li>
              <strong className="font-medium text-ink">Crédit, LOA, LLD</strong> via partenaires agréés
            </li>
            <li>
              <strong className="font-medium text-ink">Reprise</strong> ou dépôt-vente gratuit
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="stock-title" className="pb-20 md:pb-28">
        <div className="container-site">
          <SectionHeading
            id="stock-title"
            title={
              <>
                En stock, <em>prêts à partir</em>
              </>
            }
            intro="Prix TTC ou HT affichés clairement, TVA récupérable signalée, financement possible sur tout le stock."
            action={
              <Link href="/vehicules" className="inline-flex shrink-0 items-center gap-2 font-medium underline decoration-accent underline-offset-4">
                Voir les {stockCount} véhicules <ArrowRight aria-hidden className="size-4" />
              </Link>
            }
          />
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
            {featured.map((v) => (
              <Reveal key={v.slug}>
                <VehicleCard vehicle={v} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="services-title" className="border-y border-line bg-paper py-20 md:py-28">
        <div className="container-site">
          <SectionHeading
            id="services-title"
            eyebrow="Services"
            title={
              <>
                Tout ce qu&apos;il faut, <em>sous un même toit</em>
              </>
            }
            intro="De la recherche du véhicule à son financement, en passant par la reprise de l'ancien : un seul interlocuteur."
          />
          <ul className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.id} className="border-b border-line sm:odd:border-r lg:border-r lg:[&:nth-child(3n)]:border-r-0">
                <Link href={`/services#${s.id}`} className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-bg md:p-8">
                  <h3 className="text-2xl">{s.title}</h3>
                  <p className="text-[0.9375rem] text-muted">{s.short}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-accent">
                    En savoir plus <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
            <li className="border-b border-line">
              <Link href="/contact" className="flex h-full flex-col justify-center gap-3 bg-accent p-6 text-white transition-colors hover:bg-ink md:p-8">
                <h3 className="text-2xl">Une question ?</h3>
                <p className="text-[0.9375rem] text-white/80">Appelez-nous ou écrivez-nous, 7 jours sur 7.</p>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="import-title" className="py-20 md:py-28">
        <div className="container-site">
          <SectionHeading
            id="import-title"
            eyebrow="Import Europe"
            title={
              <>
                L&apos;import, <em>sans y penser</em>
              </>
            }
            intro="Du cahier des charges à la carte grise définitive, nous nous occupons de tout et vous tenons informé à chaque étape."
          />
          <ImportSteps />
          <div className="mt-10">
            <Link href="/recherche-personnalisee" className={buttonVariants()}>
              Lancer ma recherche personnalisée
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Professionnels" className="bg-accent-soft py-20 md:py-28">
        <div className="container-site">
          <ProBlock image={proVehicle?.images[0]} />
        </div>
      </section>

      <section aria-labelledby="avis-title" className="border-t border-line bg-paper py-20 md:py-28">
        <div className="container-site">
          <SectionHeading
            id="avis-title"
            eyebrow="Avis clients"
            title={
              <>
                Ils nous ont <em>confié leur recherche</em>
              </>
            }
          />
          <ReviewsSection />
        </div>
      </section>

      <section aria-label="Instagram" className="py-20 md:py-28">
        <div className="container-site">
          <InstagramFeed />
        </div>
      </section>

      <div className="border-t border-line">
        <AppointmentCta />
      </div>
    </>
  );
}
