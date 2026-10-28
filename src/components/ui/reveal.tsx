import { cn } from "@/lib/utils";

/**
 * Subtle rise-in as the element scrolls into view. Pure CSS (scroll-driven animation), so it costs no JavaScript;
 * browsers without support, and visitors who prefer reduced motion, simply see the content in place.
 */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("reveal", className)}>{children}</div>;
}
