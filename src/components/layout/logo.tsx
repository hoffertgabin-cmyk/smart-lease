import Link from "next/link";
import { cn } from "@/lib/utils";

// TODO: remplacer par le logo officiel (public/brand/logo.png, téléchargé par npm run photos) ou mieux, sa version SVG.
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("font-display text-2xl leading-none tracking-[0.02em] whitespace-nowrap", className)}
      aria-label="Smart Lease, accueil"
    >
      Smart <i className="font-normal">Lease</i>
    </Link>
  );
}
