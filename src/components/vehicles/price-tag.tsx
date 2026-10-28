import type { Vehicle } from "@/lib/vehicle-schema";
import { formatPrice } from "@/lib/format";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

export function PriceAmount({ vehicle, className }: { vehicle: Vehicle; className?: string }) {
  const { amount, taxMode, variants } = vehicle.price;
  if (amount === null) {
    return <span className={cn("font-display", className)}>{t.price.onRequest}</span>;
  }
  return (
    <span className={cn("font-display tabular-nums lining-nums", className)}>
      {variants.length > 1 ? <span className="mr-1 font-sans text-[0.55em] text-muted">{t.price.from}</span> : null}
      {formatPrice(amount)}
      <span className="ml-1.5 font-mono text-[0.45em] tracking-[0.06em] text-muted">{taxMode}</span>
    </span>
  );
}

/** Mentions shown under a price: VAT, CO2 tax, financing. */
export function PriceMentions({ vehicle, withFinancing = false }: { vehicle: Vehicle; withFinancing?: boolean }) {
  const { vatRecoverable, co2TaxIncluded, financingAvailable, taxMode } = vehicle.price;
  const items = [
    vatRecoverable ? { label: t.price.vatRecoverable, accent: true } : null,
    { label: taxMode === "HT" ? "Prix hors taxes" : "Prix toutes taxes comprises", accent: false },
    co2TaxIncluded ? { label: t.price.co2Included, accent: false } : null,
    withFinancing && financingAvailable ? { label: t.price.financing, accent: false } : null,
  ].filter(Boolean) as { label: string; accent: boolean }[];
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {items.map((i) => (
        <li key={i.label} className={i.accent ? "font-medium text-accent" : "text-muted"}>
          {i.label}
        </li>
      ))}
    </ul>
  );
}
