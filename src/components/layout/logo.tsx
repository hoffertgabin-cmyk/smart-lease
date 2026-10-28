import Link from "next/link";
import { cn } from "@/lib/utils";

// TODO: remplacer par le logo officiel (public/brand/logo.png, téléchargé par npm run photos) ou mieux, sa version SVG.
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("font-display text-[1.5rem] font-extrabold leading-none tracking-[-0.03em] whitespace-nowrap", className)}
      aria-label="Smart Lease, accueil"
    >
      Smart<span className="text-highlight">Lease</span>
    </Link>
  );
}
