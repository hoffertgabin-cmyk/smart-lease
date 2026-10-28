"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import type { VehicleImage } from "@/lib/vehicle-schema";

export default function VehicleLightbox({ images, index, onClose }: { images: VehicleImage[]; index: number; onClose: () => void }) {
  return (
    <Lightbox
      open
      close={onClose}
      index={index}
      slides={images.map((img) => ({ src: img.src, alt: img.alt, width: img.width, height: img.height }))}
      plugins={[Zoom, Fullscreen, Counter]}
      zoom={{ maxZoomPixelRatio: 3 }}
      controller={{ closeOnBackdropClick: true }}
      labels={{ Previous: "Photo précédente", Next: "Photo suivante", Close: "Fermer", "Zoom in": "Zoomer", "Zoom out": "Dézoomer", "Enter Fullscreen": "Plein écran", "Exit Fullscreen": "Quitter le plein écran" }}
    />
  );
}
