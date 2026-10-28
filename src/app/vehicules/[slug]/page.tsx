import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { KeySpecs } from "@/components/vehicles/key-specs";
import { OptionsList } from "@/components/vehicles/options-list";
import { ContactActions } from "@/components/vehicles/contact-actions";
import { PriceAmount, PriceMentions } from "@/components/vehicles/price-tag";
import { StatusBadge } from "@/components/vehicles/status-badge";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getSimilar, getVehicle, getVehicles } from "@/lib/vehicles";
import { conditionLabel, formatKm, formatPrice, formatRegistration, fuelLabel, vehicleTitle } from "@/lib/format";
import { site } from "@/lib/site";
import type { Vehicle } from "@/lib/vehicle-schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return getVehicles().map((v) => ({ slug: v.slug }));
}

type Props = { params: Promise<{ slug: string }> };

function describe(v: Vehicle) {
  const parts = [
    `${vehicleTitle(v)} ${v.version}`,
    formatRegistration(v),
    v.mileageKm !== null ? formatKm(v.mileageKm) : null,
    fuelLabel[v.fuel],
    v.powerHp ? `${v.powerHp} ch` : null,
    v.price.amount !== null ? `${formatPrice(v.price.amount)} ${v.price.taxMode}` : null,
    v.price.vatRecoverable ? "TVA récupérable" : null,
  ].filter(Boolean);
  return `${parts.join(" · ")}. Disponible chez Smart Lease à Luxembourg, financement possible, livraison en Europe.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const v = getVehicle(slug);
  if (!v) return {};
  const title = `${vehicleTitle(v)} ${v.version}${v.year ? ` ${v.year}` : ""}`;
  return {
    title,
    description: describe(v),
    alternates: { canonical: `/vehicules/${v.slug}` },
    openGraph: {
      title: `${title} · Smart Lease`,
      description: describe(v),
      url: `/vehicules/${v.slug}`,
    },
    robots: v.status === "vendu" ? { index: false } : undefined,
  };
}

function carJsonLd(v: Vehicle) {
  const url = `${site.url}/vehicules/${v.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${vehicleTitle(v)} ${v.version}`,
    url,
    brand: { "@type": "Brand", name: v.brand },
    model: v.model,
    vehicleConfiguration: v.version,
    vehicleModelDate: v.year ?? undefined,
    dateVehicleFirstRegistered: v.firstRegistration ?? undefined,
    mileageFromOdometer: v.mileageKm !== null ? { "@type": "QuantitativeValue", value: v.mileageKm, unitCode: "KMT" } : undefined,
    fuelType: fuelLabel[v.fuel],
    vehicleTransmission: v.transmission === "automatique" ? "Automatique" : "Manuelle",
    vehicleEngine: v.powerHp ? { "@type": "EngineSpecification", enginePower: { "@type": "QuantitativeValue", value: v.powerHp, unitCode: "BHP" } } : undefined,
    color: v.exteriorColor ?? undefined,
    itemCondition: v.condition === "occasion" ? "https://schema.org/UsedCondition" : "https://schema.org/NewCondition",
    image: v.images.map((i) => `${site.url}${i.src}`),
    offers:
      v.price.amount !== null
        ? {
            "@type": "Offer",
            url,
            price: v.price.amount,
            priceCurrency: "EUR",
            priceSpecification: { "@type": "PriceSpecification", price: v.price.amount, priceCurrency: "EUR", valueAddedTaxIncluded: v.price.taxMode === "TTC" },
            availability: v.status === "vendu" ? "https://schema.org/SoldOut" : v.status === "arrivage" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
            seller: { "@id": `${site.url}/#dealer` },
          }
        : undefined,
  };
}

export default async function VehiclePage({ params }: Props) {
  const { slug } = await params;
  const v = getVehicle(slug);
  if (!v) notFound();
  if (v.status === "vendu") permanentRedirect("/vendus");

  const title = vehicleTitle(v);
  const label = `${title} ${v.version}${v.year ? ` (${v.year})` : ""}`;
  const url = `${site.url}/vehicules/${v.slug}`;
  const similar = getSimilar(v);
  const listPath = v.category === "utilitaire" ? "/utilitaires" : "/vehicules";

  return (
    <>
      <PageHero
        className="pb-8 md:pb-10"
        crumbs={[
          { name: v.category === "utilitaire" ? "Utilitaires" : "Véhicules", path: listPath },
          { name: `${title} ${v.version}`, path: `/vehicules/${v.slug}` },
        ]}
        eyebrow={`${v.brand} · ${conditionLabel[v.condition]}`}
        title={
          <>
            {v.model} <em>{v.version}</em>
          </>
        }
      />
      <div className="container-site grid gap-10 py-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
        <div className="grid min-w-0 content-start gap-12">
          <VehicleGallery images={v.images} title={label} />
          <section aria-labelledby="specs-title" className="grid gap-6">
            <h2 id="specs-title" className="text-display-md">
              Caractéristiques
            </h2>
            <KeySpecs vehicle={v} />
            {v.maintenance ? (
              <p className="max-w-[65ch] text-muted">
                <span className="font-medium text-ink">Historique : </span>
                {v.maintenance}
              </p>
            ) : null}
          </section>
          {v.options.length ? (
            <section aria-labelledby="options-title" className="grid gap-6">
              <h2 id="options-title" className="text-display-md">
                Options et équipements <span className="tabular-nums font-normal text-base text-muted">({v.options.reduce((n, g) => n + g.items.length, 0)})</span>
              </h2>
              <OptionsList options={v.options} />
            </section>
          ) : null}
        </div>

        <aside aria-label="Prix et contact" className="lg:order-none">
          <div className="grid gap-6 rounded-lg border border-line bg-paper p-6 md:p-8 lg:sticky lg:top-24">
            <StatusBadge vehicle={v} className="w-fit border border-line" />
            <div className="grid gap-3 border-y border-ink py-6">
              <p className="text-[2.75rem] leading-none">
                <PriceAmount vehicle={v} />
              </p>
              {v.price.variants.length > 1 ? (
                <ul className="grid gap-1 text-sm">
                  {v.price.variants.map((variant) => (
                    <li key={variant.label} className="flex justify-between gap-4 tabular-nums">
                      <span className="text-muted">{variant.label}</span>
                      <span>
                        {formatPrice(variant.amount)} {v.price.taxMode}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <PriceMentions vehicle={v} withFinancing />
            </div>
            <ContactActions vehicleLabel={label} url={url} />
            <p className="text-sm text-muted">
              Visite et essai {site.hoursShort.toLowerCase()}, au {site.address.street}, {site.address.city}.{" "}
              <Link href="/financement" className="underline underline-offset-2">
                Financement
              </Link>{" "}
              et{" "}
              <Link href="/reprise" className="underline underline-offset-2">
                reprise
              </Link>{" "}
              possibles.
            </p>
          </div>
        </aside>
      </div>

      {similar.length ? (
        <section aria-labelledby="similar-title" className="border-t border-line py-16 md:py-24">
          <div className="container-site">
            <h2 id="similar-title" className="mb-10 text-display-lg">
              Véhicules <em>similaires</em>
            </h2>
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
              {similar.map((s) => (
                <VehicleCard key={s.slug} vehicle={s} sizes="(min-width: 768px) 33vw, 100vw" />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <JsonLd data={carJsonLd(v)} />
    </>
  );
}
