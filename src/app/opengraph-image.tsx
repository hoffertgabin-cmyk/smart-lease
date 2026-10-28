import { ogCard, ogSize } from "@/lib/og/card";

export const alt = "Smart Lease, négociant automobile à Luxembourg";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: "Négociant automobile · Luxembourg",
    title: "Votre prochain véhicule, trouvé, importé et livré.",
  });
}
