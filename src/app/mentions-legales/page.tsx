import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Smart Lease : éditeur, immatriculation, TVA, hébergement.",
  alternates: { canonical: "/mentions-legales" },
};

function Todo({ children }: { children: React.ReactNode }) {
  return <span className="todo">TODO {children}</span>;
}

export default function LegalPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Mentions légales", path: "/mentions-legales" }]} title="Mentions légales" />
      <div className="container-site py-14 md:py-20">
        <div className="prose-site max-w-[70ch]">
          <h2>Éditeur du site</h2>
          <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-[220px_1fr]">
            <dt className="text-muted">Raison sociale</dt>
            <dd>{site.legalName}</dd>
            <dt className="text-muted">Siège social</dt>
            <dd>
              {site.address.street}, {site.address.postalCode} {site.address.city}
            </dd>
            <dt className="text-muted">Matricule luxembourgeois (RCS)</dt>
            <dd>{site.rcs}</dd>
            <dt className="text-muted">TVA intracommunautaire</dt>
            <dd>{site.vat}</dd>
            <dt className="text-muted">Capital social</dt>
            <dd>
              <Todo>capital social</Todo>
            </dd>
            <dt className="text-muted">Téléphone</dt>
            <dd>{site.phone.display}</dd>
            <dt className="text-muted">E-mail</dt>
            <dd>{site.email}</dd>
            <dt className="text-muted">Directeur de la publication</dt>
            <dd>{site.publicationDirector ?? <Todo>nom du directeur de la publication</Todo>}</dd>
          </dl>

          <h2>Hébergement</h2>
          {site.host ? (
            <p>
              {site.host.name}, {site.host.address}
            </p>
          ) : (
            <p>
              <Todo>hébergeur</Todo> (pressenti : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis, à
              confirmer au moment de la mise en ligne).
            </p>
          )}

          <h2>Propriété intellectuelle</h2>
          <p>
            Les textes, photographies et éléments graphiques de ce site sont la propriété de {site.legalName} ou utilisés avec
            autorisation. Toute reproduction sans accord écrit préalable est interdite. Les marques et logos des constructeurs
            cités appartiennent à leurs propriétaires respectifs.
          </p>

          <h2>Informations sur les véhicules</h2>
          <p>
            Les caractéristiques, équipements et prix des véhicules sont donnés à titre indicatif et peuvent comporter des
            erreurs. Seuls le bon de commande et la facture font foi. Les prix sont indiqués toutes taxes comprises (TTC) ou
            hors taxes (HT) selon la mention qui les accompagne.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Le traitement des données transmises via les formulaires est décrit dans notre{" "}
            <a href="/confidentialite">politique de confidentialité</a>.
          </p>
        </div>
      </div>
    </>
  );
}
