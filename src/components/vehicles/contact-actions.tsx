"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Phone, Share2, Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { site, telHref, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

const loadDialog = () => import("./vehicle-info-dialog");
const VehicleInfoDialog = dynamic(loadDialog, { ssr: false });

export function ContactActions({ vehicleLabel, url }: { vehicleLabel: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  async function share() {
    const data = { title: vehicleLabel, text: `${vehicleLabel} chez Smart Lease`, url };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* user cancelled */
    }
  }

  return (
    <div className="grid gap-2">
      <Button
        ref={trigger}
        size="lg"
        className="w-full"
        aria-haspopup="dialog"
        onPointerEnter={loadDialog}
        onFocus={loadDialog}
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
      >
        Demande d&apos;information
      </Button>
      {mounted ? <VehicleInfoDialog open={open} onOpenChange={setOpen} vehicleLabel={vehicleLabel} trigger={trigger} /> : null}
      <div className="grid grid-cols-2 gap-2">
        <a
          href={whatsappHref(`Bonjour, je suis intéressé(e) par : ${vehicleLabel} (${url})`)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline" })}
        >
          WhatsApp
        </a>
        <a href={telHref} className={buttonVariants({ variant: "outline" })} aria-label={`Appeler le ${site.phone.display}`}>
          <Phone aria-hidden /> Appeler
        </a>
      </div>
      <button type="button" onClick={share} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "justify-self-start px-0 hover:bg-transparent")}>
        {copied ? <Check aria-hidden /> : <Share2 aria-hidden />}
        {copied ? "Lien copié" : "Partager ce véhicule"}
      </button>
      <p className="font-mono text-sm text-muted">{site.phone.display}</p>
    </div>
  );
}
