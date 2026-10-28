import Link from "next/link";
import { Suspense } from "react";
import type { Vehicle } from "@/lib/vehicle-schema";
import { activeFilterCount, applyFilters, facets as getFacets, parseFilters } from "@/lib/catalog";
import { buttonVariants } from "@/components/ui/button";
import { VehicleCard } from "./vehicle-card";
import { CatalogSidebar, CatalogToolbar } from "./catalog-filters";

type Params = Record<string, string | string[] | undefined>;

export function Catalog({
  vehicles,
  searchParams,
  emptyCta,
}: {
  vehicles: Vehicle[];
  searchParams: Params;
  emptyCta: { label: string; href: string };
}) {
  const filters = parseFilters(searchParams);
  const results = applyFilters([...vehicles], filters);
  const facets = getFacets(vehicles);
  const activeCount = activeFilterCount(filters);

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
      <Suspense>
        <CatalogSidebar facets={facets} filters={filters} />
      </Suspense>
      <div className="grid content-start gap-10">
        <Suspense>
          <CatalogToolbar facets={facets} filters={filters} total={results.length} activeCount={activeCount} />
        </Suspense>
        {results.length ? (
          <section aria-labelledby="catalog-results" className="grid gap-x-8 gap-y-14 md:grid-cols-2">
            <h2 id="catalog-results" className="sr-only">
              Véhicules correspondants
            </h2>
            {results.map((v, i) => (
              <VehicleCard key={v.slug} vehicle={v} priority={i < 2} sizes="(min-width: 1024px) 460px, (min-width: 768px) 50vw, 100vw" />
            ))}
          </section>
        ) : (
          <div className="grid justify-items-start gap-4 rounded-lg border border-line bg-paper p-8 md:p-12">
            <h2 className="text-display-md">Aucun véhicule ne correspond à ces critères</h2>
            <p className="max-w-[56ch] text-muted">
              Élargissez votre recherche, ou confiez-nous votre cahier des charges : nous trouvons le véhicule pour vous
              chez nos partenaires européens.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="?" className={buttonVariants({ variant: "outline" })} scroll={false}>
                Effacer les filtres
              </Link>
              <Link href={emptyCta.href} className={buttonVariants()}>
                {emptyCta.label}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
