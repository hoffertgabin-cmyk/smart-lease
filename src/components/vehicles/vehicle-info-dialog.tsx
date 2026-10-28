"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";

/** Information request dialog, loaded on demand (form + validation stay out of the fiche's initial bundle). */
export default function VehicleInfoDialog({
  open,
  onOpenChange,
  vehicleLabel,
  trigger,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleLabel: string;
  trigger: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/45" />
        <Dialog.Content
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            trigger.current?.focus();
          }}
          className="fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto bg-bg p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] md:inset-auto md:left-1/2 md:top-1/2 md:w-[min(640px,calc(100vw-48px))] md:-translate-x-1/2 md:-translate-y-1/2 md:p-8"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="font-display text-3xl">Demande d&apos;information</Dialog.Title>
              <Dialog.Description className="mt-1 text-muted">{vehicleLabel}</Dialog.Description>
            </div>
            <Dialog.Close className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line" aria-label="Fermer">
              <X aria-hidden className="size-5" />
            </Dialog.Close>
          </div>
          <ContactForm vehicle={vehicleLabel} idPrefix="info" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
