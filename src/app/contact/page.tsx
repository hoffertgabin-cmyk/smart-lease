import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { MapEmbed } from "@/components/forms/map-embed";
import { buttonVariants } from "@/components/ui/button";
import { site, telHref, mailHref, whatsappHref } from "@/lib/site";
import type { ContactInput } from "@/lib/forms/schemas";

export const metadata: Metadata = {
  title: "Contact et rendez-vous",
  description:
    "Smart Lease, 71-72 Muehlenweg, L-2155 Luxembourg. Uniquement sur rendez-vous, 7 jours sur 7. Téléphone et WhatsApp +352 691 452 770, contact@smartlease.lu.",
  alternates: { canonical: "/contact" },
};

const subjects: ContactInput["subject"][] = ["information", "rendez-vous", "devis-pro", "location", "autre"];

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ sujet?: string }> }) {
  const { sujet } = await searchParams;
  const subject = subjects.find((s) => s === sujet) ?? "information";
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact" }]}
        eyebrow={site.hoursShort}
        title={
          <>
            Parlons de <em>votre prochain véhicule</em>
          </>
        }
        intro="Nous recevons uniquement sur rendez-vous, du lundi au dimanche. Appelez-nous, écrivez sur WhatsApp ou laissez un message : nous fixons ensemble un créneau."
      />
      <div className="container-site grid gap-14 py-14 md:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div id="rendez-vous" className="grid content-start gap-8">
          <div className="grid gap-2">
            <p className="eyebrow">Téléphone et WhatsApp</p>
            <a href={telHref} className="tabular-nums font-semibold text-2xl">
              {site.phone.display}
            </a>
            <div className="mt-2 flex flex-wrap gap-2">
              <a href={telHref} className={buttonVariants()}>
                Prendre rendez-vous par téléphone
              </a>
              <a href={whatsappHref("Bonjour, je souhaite prendre rendez-vous.")} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline" })}>
                WhatsApp
              </a>
            </div>
          </div>
          <div className="grid gap-1">
            <p className="eyebrow">E-mail</p>
            <a href={mailHref} className="text-lg underline-offset-4 hover:underline">
              {site.email}
            </a>
          </div>
          <div className="grid gap-1">
            <p className="eyebrow">Adresse</p>
            <address className="text-lg not-italic">
              {site.legalName}
              <br />
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </address>
          </div>
          <div className="grid gap-1">
            <p className="eyebrow">Horaires</p>
            <p className="text-lg">{site.hours}</p>
          </div>
          <div className="overflow-hidden border border-line">
            <MapEmbed />
          </div>
        </div>
        <section id="formulaire" aria-labelledby="form-title" className="rounded-lg border border-line bg-paper p-6 md:p-10">
          <h2 id="form-title" className="mb-8 text-display-md">
            Envoyer un message
          </h2>
          <ContactForm defaultSubject={subject} />
        </section>
      </div>
    </>
  );
}
