import { CalendarDays, Gauge, Fuel, Cog, Zap, Car, Palette, ShieldCheck } from "lucide-react";
import type { Vehicle } from "@/lib/vehicle-schema";
import { bodyTypeLabel, formatKm, formatRegistration, fuelLabel, transmissionLabel } from "@/lib/format";

export function KeySpecs({ vehicle }: { vehicle: Vehicle }) {
  const items = [
    { icon: CalendarDays, label: vehicle.firstRegistration ? "1re immatriculation" : "Année", value: formatRegistration(vehicle) },
    { icon: Gauge, label: "Kilométrage", value: vehicle.mileageKm !== null ? formatKm(vehicle.mileageKm) : "À confirmer" },
    { icon: Fuel, label: "Énergie", value: fuelLabel[vehicle.fuel] },
    { icon: Cog, label: "Boîte", value: vehicle.gearboxLabel ?? transmissionLabel[vehicle.transmission] },
    {
      icon: Zap,
      label: "Puissance",
      value: [vehicle.powerHp ? `${vehicle.powerHp} ch` : null, vehicle.fiscalHp ? `${vehicle.fiscalHp} CV` : null].filter(Boolean).join(" · ") || "À confirmer",
    },
    { icon: Car, label: "Carrosserie", value: bodyTypeLabel[vehicle.bodyType] },
    ...(vehicle.exteriorColor ? [{ icon: Palette, label: "Couleur", value: vehicle.exteriorColor }] : []),
    ...(vehicle.warranty ? [{ icon: ShieldCheck, label: "Garantie", value: vehicle.warranty }] : []),
  ];
  return (
    <dl className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-4">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="grid content-start gap-1.5 border-b border-r border-line p-4">
          <dt className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted">
            <Icon aria-hidden className="size-4 text-accent" strokeWidth={1.5} />
            {label}
          </dt>
          <dd className="font-medium tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
