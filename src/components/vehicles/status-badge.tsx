import type { Vehicle } from "@/lib/vehicle-schema";
import { statusLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

export function StatusBadge({ vehicle, className }: { vehicle: Pick<Vehicle, "status" | "availableFrom">; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block bg-paper px-2.5 py-1 tabular-nums font-semibold text-[0.6875rem] uppercase tracking-[0.08em]",
        vehicle.status === "vendu" && "bg-ink text-bg",
        vehicle.status === "reserve" && "bg-accent text-white",
        className,
      )}
    >
      {statusLabel(vehicle)}
    </span>
  );
}
