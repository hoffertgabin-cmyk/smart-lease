import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { site, telHref } from "@/lib/site";

export const metadata: Metadata = { title: "Page introuvable", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="container-site grid min-h-[60vh] content-center gap-6 py-20">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="font-display text-display-lg max-w-[18ch]">
        Cette page <em>n&apos;existe plus</em>.
      </h1>
      <p className="max-w-[52ch] text-lg text-muted">
        Le véhicule a peut-être été vendu, ou l&apos;adresse a changé avec le nouveau site. Parcourez le stock actuel
        ou appelez-nous au{" "}
        <a href={telHref} className="underline underline-offset-4">
          {site.phone.display}
        </a>
        .
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/vehicules">Voir les véhicules en stock</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/vendus">Véhicules vendus</Link>
        </Button>
      </div>
    </div>
  );
}
