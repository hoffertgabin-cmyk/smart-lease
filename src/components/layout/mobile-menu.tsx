"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { t } from "@/i18n/fr";

const load = () => import("./mobile-menu-panel");
const MobileMenuPanel = dynamic(load, { ssr: false });

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-full border border-line lg:hidden"
        aria-label={t.nav.menu}
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={load}
        onFocus={load}
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
      >
        <Menu aria-hidden className="size-5" />
      </button>
      {mounted ? <MobileMenuPanel open={open} onOpenChange={setOpen} trigger={trigger} /> : null}
    </>
  );
}
