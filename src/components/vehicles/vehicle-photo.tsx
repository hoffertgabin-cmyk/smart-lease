import Image from "next/image";
import type { VehicleImage } from "@/lib/vehicle-schema";
import { cn } from "@/lib/utils";

/** A vehicle photo, or a neutral studio backdrop while the photo is missing. */
export function VehiclePhoto({
  image,
  alt,
  sizes,
  priority,
  className,
  imgClassName,
}: {
  image?: VehicleImage;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-studio", className)}>
      {image ? (
        <Image
          src={image.src}
          alt={image.alt || alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={image.blurDataURL ? "blur" : "empty"}
          blurDataURL={image.blurDataURL}
          className={cn("object-cover", imgClassName)}
        />
      ) : (
        <div role="img" aria-label={`${alt} (photo à venir)`} className="studio-placeholder absolute inset-0">
          <span className="absolute bottom-3 left-3 bg-paper/85 px-2 py-0.5 tabular-nums font-semibold text-[0.6875rem] text-muted">
            Photo à venir
          </span>
        </div>
      )}
    </div>
  );
}
