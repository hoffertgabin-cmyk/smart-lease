import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { site, telHref, whatsappHref, mapsHref } from "@/lib/site";

export function AppointmentCta({ id = "rendez-vous" }: { id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="py-20 md:py-28">
      <div className="container-site grid items-end gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-12">
        <div>
          <p className="eyebrow">{site.hoursShort}</p>
          <h2 id={`${id}-title`} className="mt-4 text-display-xl">
            Venez voir la voiture <em>avant de signer.</em>
          </h2>
        </div>
        <div className="grid gap-2.5 border border-line bg-paper p-7">
          <p className="eyebrow">Showroom</p>
          <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {site.address.street}, {site.address.postalCode} {site.address.city}
          </a>
          <a href={telHref} className="font-mono text-xl">
            {site.phone.display}
          </a>
          <a href={`mailto:${site.email}`} className="text-muted hover:text-ink">
            {site.email}
          </a>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/contact#formulaire" className={buttonVariants()}>
              Prendre rendez-vous
            </Link>
            <a
              href={whatsappHref("Bonjour, je souhaite prendre rendez-vous.")}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
