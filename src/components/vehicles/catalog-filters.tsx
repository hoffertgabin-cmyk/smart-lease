"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Facets, Filters } from "@/lib/catalog";
import { sortOptions } from "@/lib/catalog";
import { bodyTypeLabel, fuelLabel, transmissionLabel } from "@/lib/format";
import { Input, Label, Select } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const priceSteps = [15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000, 150000];
const kmSteps = [10000, 25000, 50000, 75000, 100000, 150000];

function useFilterUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const set = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === "") next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    start(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };
  const clear = () => start(() => router.replace(pathname, { scroll: false }));
  return { set, clear, pending };
}

function FilterFields({ facets, filters, idPrefix }: { facets: Facets; filters: Filters; idPrefix: string }) {
  const { set } = useFilterUrl();
  const id = (k: string) => `${idPrefix}-${k}`;
  const onSelect = (key: string) => (e: React.ChangeEvent<HTMLSelectElement>) => set({ [key]: e.target.value || undefined });

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor={id("marque")}>Marque</Label>
        <Select id={id("marque")} value={filters.marque ?? ""} onChange={onSelect("marque")}>
          <option value="">Toutes les marques</option>
          {facets.brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>
      </div>
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-medium">Prix</legend>
        <div className="grid grid-cols-2 gap-2">
          <Select aria-label="Prix minimum" id={id("prixMin")} value={filters.prixMin ?? ""} onChange={onSelect("prixMin")}>
            <option value="">Min.</option>
            {priceSteps.map((p) => (
              <option key={p} value={p}>
                {p.toLocaleString("fr-FR")} €
              </option>
            ))}
          </Select>
          <Select aria-label="Prix maximum" id={id("prixMax")} value={filters.prixMax ?? ""} onChange={onSelect("prixMax")}>
            <option value="">Max.</option>
            {priceSteps.map((p) => (
              <option key={p} value={p}>
                {p.toLocaleString("fr-FR")} €
              </option>
            ))}
          </Select>
        </div>
      </fieldset>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <Label htmlFor={id("anneeMin")}>Année min.</Label>
          <Select id={id("anneeMin")} value={filters.anneeMin ?? ""} onChange={onSelect("anneeMin")}>
            <option value="">Toutes</option>
            {facets.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor={id("kmMax")}>Km max.</Label>
          <Select id={id("kmMax")} value={filters.kmMax ?? ""} onChange={onSelect("kmMax")}>
            <option value="">Tous</option>
            {kmSteps.map((k) => (
              <option key={k} value={k}>
                {k.toLocaleString("fr-FR")} km
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor={id("energie")}>Énergie</Label>
        <Select id={id("energie")} value={filters.energie ?? ""} onChange={onSelect("energie")}>
          <option value="">Toutes</option>
          {facets.fuels.map((f) => (
            <option key={f} value={f}>
              {fuelLabel[f]}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor={id("boite")}>Boîte</Label>
        <Select id={id("boite")} value={filters.boite ?? ""} onChange={onSelect("boite")}>
          <option value="">Toutes</option>
          {facets.transmissions.map((t) => (
            <option key={t} value={t}>
              {transmissionLabel[t]}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor={id("carrosserie")}>Carrosserie</Label>
        <Select id={id("carrosserie")} value={filters.carrosserie ?? ""} onChange={onSelect("carrosserie")}>
          <option value="">Toutes</option>
          {facets.bodyTypes.map((b) => (
            <option key={b} value={b}>
              {bodyTypeLabel[b]}
            </option>
          ))}
        </Select>
      </div>
      {facets.hasVatRecoverable ? (
        <label className="flex cursor-pointer items-center gap-3 text-[0.9375rem]">
          <input
            type="checkbox"
            id={id("tva")}
            className="size-5 accent-[var(--color-accent)]"
            checked={filters.tva === "recuperable"}
            onChange={(e) => set({ tva: e.target.checked ? "recuperable" : undefined })}
          />
          TVA récupérable uniquement
        </label>
      ) : null}
    </div>
  );
}

export function CatalogToolbar({
  facets,
  filters,
  total,
  activeCount,
}: {
  facets: Facets;
  filters: Filters;
  total: number;
  activeCount: number;
}) {
  const { set, clear, pending } = useFilterUrl();
  const [q, setQ] = useState(filters.q ?? "");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => setQ(filters.q ?? ""), [filters.q]);

  const onSearch = (value: string) => {
    setQ(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => set({ q: value || undefined }), 300);
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            type="search"
            id="catalog-search"
            aria-label="Rechercher un véhicule"
            placeholder="Rechercher : marque, modèle, option…"
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-11"
          />
        </div>
        <div className="flex gap-2">
          <Select
            id="catalog-sort"
            aria-label="Trier par"
            value={filters.tri}
            onChange={(e) => set({ tri: e.target.value === "recommande" ? undefined : e.target.value })}
            className="flex-1 sm:w-60 sm:flex-none"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          <Dialog.Root>
            <Dialog.Trigger className="inline-flex h-12 shrink-0 items-center gap-2 border border-ink px-4 text-[0.9375rem] font-medium lg:hidden">
              <SlidersHorizontal aria-hidden className="size-4" />
              Filtres{activeCount ? ` (${activeCount})` : ""}
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
              <Dialog.Content
                aria-describedby={undefined}
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-bg pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
              >
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <Dialog.Title className="font-display text-2xl">Filtres</Dialog.Title>
                  <Dialog.Close className="inline-flex size-11 items-center justify-center rounded-full border border-line" aria-label="Fermer les filtres">
                    <X aria-hidden className="size-5" />
                  </Dialog.Close>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-6">
                  <FilterFields facets={facets} filters={filters} idPrefix="m" />
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-line p-5">
                  <button type="button" onClick={clear} className="h-12 border border-ink font-medium">
                    Effacer
                  </button>
                  <Dialog.Close className="h-12 bg-accent font-medium text-white">Voir {total} résultat{total > 1 ? "s" : ""}</Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
      <p aria-live="polite" className={cn("text-sm text-muted transition-opacity", pending && "opacity-50")}>
        {total} véhicule{total > 1 ? "s" : ""}
        {activeCount ? (
          <>
            {" "}
            ·{" "}
            <button type="button" onClick={clear} className="underline underline-offset-2 hover:text-ink">
              effacer les filtres
            </button>
          </>
        ) : null}
      </p>
    </div>
  );
}

export function CatalogSidebar({ facets, filters }: { facets: Facets; filters: Filters }) {
  return (
    <aside aria-label="Filtres" className="hidden lg:block">
      <div className="sticky top-24">
        <p className="eyebrow mb-5">Filtrer</p>
        <FilterFields facets={facets} filters={filters} idPrefix="d" />
      </div>
    </aside>
  );
}
