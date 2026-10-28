"use client";

import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Expand } from "lucide-react";
import type { VehicleImage } from "@/lib/vehicle-schema";
import { VehiclePhoto } from "./vehicle-photo";

const Lightbox = dynamic(() => import("./vehicle-lightbox"), { ssr: false });

/** Main photo + thumbnails on desktop, swipeable strip on mobile, fullscreen lightbox with zoom. */
export function VehicleGallery({ images, title }: { images: VehicleImage[]; title: string }) {
  const [index, setIndex] = useState(-1);

  if (images.length === 0) {
    return <VehiclePhoto alt={title} sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-[3/2]" priority />;
  }

  const thumbs = images.slice(1, 5);
  const more = images.length - 5;

  return (
    <div>
      {/* Mobile: horizontal scroll-snap strip */}
      <ul className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 md:hidden" aria-label={`Photos de ${title}`}>
        {images.map((img, i) => (
          <li key={img.src} className="w-[88%] shrink-0 snap-center">
            <button type="button" onClick={() => setIndex(i)} className="relative block aspect-[3/2] w-full overflow-hidden bg-studio" aria-label={`Agrandir la photo ${i + 1} sur ${images.length}`}>
              <Image src={img.src} alt={img.alt} fill sizes="88vw" priority={i === 0} placeholder={img.blurDataURL ? "blur" : "empty"} blurDataURL={img.blurDataURL} className="object-cover" />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-1 font-mono text-xs text-muted md:hidden">
        {images.length} photos · faites glisser
      </p>

      {/* Desktop: main + 4 thumbnails */}
      <div className="hidden gap-1.5 md:grid">
        <button type="button" onClick={() => setIndex(0)} className="group relative block aspect-[3/2] overflow-hidden bg-studio" aria-label="Agrandir la photo principale">
          <Image src={images[0].src} alt={images[0].alt} fill priority sizes="(min-width: 1240px) 720px, 60vw" placeholder={images[0].blurDataURL ? "blur" : "empty"} blurDataURL={images[0].blurDataURL} className="object-cover" />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 bg-paper/90 px-3 py-1.5 text-sm">
            <Expand aria-hidden className="size-4" /> {images.length} photos
          </span>
        </button>
        {thumbs.length ? (
          <div className="grid grid-cols-4 gap-1.5">
            {thumbs.map((img, i) => (
              <button key={img.src} type="button" onClick={() => setIndex(i + 1)} className="relative block aspect-square overflow-hidden bg-studio" aria-label={`Agrandir la photo ${i + 2}`}>
                <Image src={img.src} alt={img.alt} fill sizes="180px" className="object-cover transition-transform duration-500 hover:scale-105" />
                {i === thumbs.length - 1 && more > 0 ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/55 font-medium text-white">+{more}</span>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {index >= 0 ? <Lightbox images={images} index={index} onClose={() => setIndex(-1)} /> : null}
    </div>
  );
}
