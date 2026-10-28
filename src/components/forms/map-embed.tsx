"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConsent } from "@/hooks/use-consent";
import { mapsHref, site } from "@/lib/site";

/** Google Maps is a third-party embed: loaded only after consent or an explicit click. */
export function MapEmbed() {
  const { consent } = useConsent();
  // A click shows the map for this visit only; it does not change the saved cookie choice.
  const [shown, setShown] = useState(false);
  const query = encodeURIComponent(`${site.address.street}, ${site.address.postalCode} ${site.address.city}`);
  if (consent?.thirdParty || shown) {
    return (
      <iframe
        title={`Carte : ${site.address.street}, ${site.address.postalCode} ${site.address.city}`}
        src={`https://maps.google.com/maps?q=${query}&z=15&output=embed`}
        className="aspect-[4/3] w-full border-0 bg-studio md:aspect-auto md:h-full md:min-h-[420px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }
  return (
    <div className="grid border border-line bg-studio aspect-[4/3] w-full place-content-center justify-items-center gap-4 p-6 text-center md:aspect-auto md:h-full md:min-h-[420px]">
      <MapPin aria-hidden className="size-8 text-accent" strokeWidth={1.5} />
      <p className="max-w-[36ch] text-sm text-muted">
        {site.address.street}, {site.address.postalCode} {site.address.city}. La carte Google Maps s&apos;affiche avec votre
        accord.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" onClick={() => setShown(true)}>
          Afficher la carte
        </Button>
        <Button asChild variant="outline">
          <a href={mapsHref} target="_blank" rel="noopener noreferrer">
            Ouvrir dans Maps
          </a>
        </Button>
      </div>
    </div>
  );
}
