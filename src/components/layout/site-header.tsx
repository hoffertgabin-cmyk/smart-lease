"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import { mainNav } from "@/lib/navigation";
import { site, telHref } from "@/lib/site";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function ServicesMenu({ label, items }: { label: string; items: readonly { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = items.some((i) => isActive(pathname, i.href));
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="services-menu"
        onClick={() => setOpen((o) => !o)}
        className={cn("inline-flex items-center gap-1 py-2 transition-colors hover:text-ink", active ? "text-ink" : "text-muted")}
      >
        {label}
        <ChevronDown aria-hidden className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <ul
          id="services-menu"
          className="absolute left-0 top-full z-30 mt-2 min-w-60 border border-line bg-paper py-2 shadow-[0_12px_32px_rgba(19,22,20,0.08)]"
        >
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block px-4 py-2.5 text-[0.9375rem] text-ink hover:bg-bg"
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-line bg-bg/92 backdrop-blur-md supports-[backdrop-filter]:bg-bg/85">
      <div className="container-site grid min-h-[72px] grid-cols-[auto_1fr] items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <nav aria-label="Navigation principale" className="hidden items-center gap-6 text-[0.9375rem] lg:flex">
          {mainNav.map((item) =>
            item.children ? (
              <ServicesMenu key={item.href} label={item.label} items={item.children} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "py-2 transition-colors hover:text-ink",
                  isActive(pathname, item.href) ? "text-ink" : "text-muted",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <Logo className="lg:justify-self-center" />
        <div className="flex items-center justify-self-end gap-2 sm:gap-4">
          <a href={telHref} className="hidden items-center gap-2 tabular-nums font-semibold text-sm sm:inline-flex">
            <Phone aria-hidden className="size-4 text-accent" />
            {site.phone.display}
          </a>
          <a
            href={telHref}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line sm:hidden"
            aria-label={`Appeler le ${site.phone.display}`}
          >
            <Phone aria-hidden className="size-4" />
          </a>
          <Link
            href="/contact#rendez-vous"
            className="hidden h-10 items-center rounded-[2px] bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-ink lg:inline-flex"
          >
            {t.nav.appointment}
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
