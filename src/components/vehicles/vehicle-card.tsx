import Link from "next/link";
import type { Vehicle } from "@/lib/vehicle-schema";
import { formatKm, formatRegistration, fuelLabel, transmissionLabel, vehicleTitle } from "@/lib/format";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";
import { VehiclePhoto } from "./vehicle-photo";
import { PriceAmount } from "./price-tag";
import { StatusBadge } from "./status-badge";

export function VehicleCard({
  vehicle,
  priority,
  sizes = "(min-width: 1024px) 600px, (min-width: 768px) 50vw, 100vw",
  headingLevel = "h3",
}: {
  vehicle: Vehicle;
  priority?: boolean;
  sizes?: string;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const title = vehicleTitle(vehicle);
  const specs = [
    formatRegistration(vehicle),
    vehicle.mileageKm !== null ? formatKm(vehicle.mileageKm) : null,
    fuelLabel[vehicle.fuel],
    vehicle.gearboxLabel ?? transmissionLabel[vehicle.transmission],
  ].filter(Boolean);

  return (
    <article className="group relative grid gap-4 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-accent">
      <div className="relative overflow-hidden">
        <VehiclePhoto
          image={vehicle.images[0]}
          alt={`${title} ${vehicle.version}`}
          sizes={sizes}
          priority={priority}
          className="aspect-[3/2]"
          imgClassName="transition-transform duration-700 ease-out-soft group-hover:scale-[1.025]"
        />
        <StatusBadge vehicle={vehicle} className="absolute left-3 top-3" />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Heading className="text-[1.5rem] leading-tight md:text-display-md">
            <Link
              href={`/vehicules/${vehicle.slug}`}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {title}
            </Link>
          </Heading>
          <p className="mt-1 text-[0.9375rem] text-muted">{vehicle.version}</p>
        </div>
        <p className="shrink-0 text-right text-[1.5rem] leading-tight md:text-display-md">
          <PriceAmount vehicle={vehicle} />
        </p>
      </div>
      <ul className={cn("flex flex-wrap items-center text-sm text-muted tabular-nums")}>
        {specs.map((s, i) => (
          <li key={i} className="flex items-center">
            {i > 0 ? <span aria-hidden className="mx-2.5 text-line">·</span> : null}
            {s}
          </li>
        ))}
      </ul>
      {vehicle.price.vatRecoverable ? (
        <p className="-mt-1 text-sm font-medium text-accent">{t.price.vatRecoverable}</p>
      ) : null}
    </article>
  );
}
