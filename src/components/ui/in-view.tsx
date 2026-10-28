"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sets data-inview="armed" after hydration, then "in" once the block scrolls into view, so CSS can play an
 * entrance animation. Without JavaScript, or with reduced motion, the attribute stays "idle" and nothing is hidden.
 */
export function InView({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "armed" | "in">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setState("armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          // Let the hidden "armed" state paint first, otherwise there is nothing to transition from.
          requestAnimationFrame(() => requestAnimationFrame(() => setState("in")));
        }
      },
      // Starts once the top of the block reaches the lower quarter of the screen, whatever its height.
      { rootMargin: "0px 0px -25% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-inview={state} className={className}>
      {children}
    </div>
  );
}
