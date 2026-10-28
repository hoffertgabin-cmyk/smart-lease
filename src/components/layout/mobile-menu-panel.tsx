"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { mainNav } from "@/lib/navigation";
import { site, telHref, whatsappHref } from "@/lib/site";
import { t } from "@/i18n/fr";

/** Full-screen menu, loaded on demand so Radix stays out of the initial bundle. */
export default function MobileMenuPanel({
  open,
  onOpenChange,
  trigger,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.RefObject<HTMLButtonElement | null>;
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const links = mainNav.flatMap((item) => item.children ?? [item]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Content
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            trigger.current?.focus();
          }}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
          aria-describedby={undefined}
        >
          <div className="container-site flex min-h-[72px] items-center justify-between border-b border-line">
            <Dialog.Title className="font-display text-2xl font-extrabold tracking-[-0.03em]">
              Smart<span className="text-highlight">Lease</span>
            </Dialog.Title>
            <Dialog.Close
              className="inline-flex size-11 items-center justify-center rounded-full border border-line"
              aria-label={t.nav.close}
            >
              <X aria-hidden className="size-5" />
            </Dialog.Close>
          </div>
          <nav aria-label="Navigation mobile" className="container-site flex-1 py-6">
            <ul className="flex flex-col">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  className="border-b border-line"
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.04 * i, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <Link
                    href={link.href}
                    className="block py-4 font-display text-[1.625rem] leading-tight"
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
          <div className="container-site grid gap-3 border-t border-line py-6">
            <p className="eyebrow">{site.hoursShort}</p>
            <a href={telHref} className="tabular-nums font-semibold text-lg">
              {site.phone.display}
            </a>
            <div className="grid grid-cols-2 gap-2">
              <a href={telHref} className="inline-flex h-12 items-center justify-center bg-accent font-medium text-white">
                {t.cta.call}
              </a>
              <a
                href={whatsappHref()}
                className="inline-flex h-12 items-center justify-center border border-ink font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.cta.whatsapp}
              </a>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
