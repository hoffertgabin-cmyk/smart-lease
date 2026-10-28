import { readFile } from "node:fs/promises";
import path from "node:path";
import { ogCard, ogSize } from "@/lib/og/card";
import { getStock, getVehicle } from "@/lib/vehicles";
import { formatKm, formatPrice, vehicleTitle } from "@/lib/format";

export const alt = "Véhicule disponible chez Smart Lease";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return [...getStock("vp"), ...getStock("utilitaire")].map((v) => ({ slug: v.slug }));
}

/** Uses public/vehicules/<slug>/og.jpg when the photo script has produced it. */
async function photoFor(slug: string) {
  try {
    const buf = await readFile(path.join(process.cwd(), "public/vehicules", slug, "og.jpg"));
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return undefined;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = getVehicle(slug);
  if (!v) return ogCard({ eyebrow: "Smart Lease", title: "Véhicule" });
  const price = v.price.amount !== null ? `${formatPrice(v.price.amount)} ${v.price.taxMode}` : "Prix sur demande";
  return ogCard({
    eyebrow: [v.year, v.mileageKm !== null ? formatKm(v.mileageKm) : null].filter(Boolean).join(" · "),
    title: `${vehicleTitle(v)} ${v.version}`.trim(),
    details: price,
    photo: await photoFor(slug),
  });
}
