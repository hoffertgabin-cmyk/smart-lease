import type { Vehicle } from "@/lib/vehicle-schema";

export function OptionsList({ options }: { options: Vehicle["options"] }) {
  if (!options.length) return null;
  return (
    <div className="border-t border-line">
      {options.map((group, i) => (
        <details key={group.group} className="group border-b border-line" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
            <span>
              {group.group} <span className="tabular-nums font-normal text-sm text-muted">({group.items.length})</span>
            </span>
            <span aria-hidden className="text-2xl leading-none text-muted transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <ul className="grid gap-x-8 gap-y-2 pb-6 text-[0.9375rem] text-muted sm:grid-cols-2">
            {group.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
