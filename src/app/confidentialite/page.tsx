import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité et cookies",
  description: "Comment Smart Lease traite vos données personnelles et utilise les cookies, conformément au RGPD.",
  alternates: { canonical: "/confidentialite" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Confidentialité", path: "/confidentialite" }]} title="Politique de confidentialité" />
      <div className="container-site py-14 md:py-20">
        <div className="prose-site max-w-[70ch]">
          <p className="todo w-fit">TODO faire relire ce texte par votre conseil juridique</p>

          <h2>Responsable du traitement</h2>
          <p>
            {site.legalName}, {site.address.street}, {site.address.postalCode} {site.address.city}, joignable à {site.email}.
          </p>

          <h2>Données collectées et finalités</h2>
          <ul>
            <li>
              <strong>Formulaires de contact, de demande d&apos;information et de recherche personnalisée</strong> : identité,
              coordonnées et critères de recherche, pour répondre à votre demande et vous proposer des véhicules.
            </li>
            <li>
              <strong>Formulaire de reprise</strong> : informations sur votre véhicule, photos et carte grise, pour établir une
              estimation.
            </li>
          </ul>
          <p>
            Base légale : mesures précontractuelles prises à votre demande et votre consentement. Les données ne sont jamais
            vendues ni utilisées à des fins publicitaires.
          </p>

          <h2>Destinataires</h2>
          <p>
            Les messages sont transmis par e-mail à Smart Lease via notre prestataire d&apos;envoi (Resend). Avec votre accord,
            vos informations peuvent être communiquées à nos partenaires financiers pour une demande de financement.
          </p>

          <h2>Durée de conservation</h2>
          <p>
            Les demandes sans suite sont conservées 3 ans au maximum après le dernier contact. Les données liées à une vente
            sont conservées pendant la durée légale de conservation des pièces comptables.
          </p>

          <h2>Vos droits</h2>
          <p>
            Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition et de
            portabilité. Écrivez à {site.email}. Vous pouvez aussi saisir la Commission nationale pour la protection des
            données (CNPD, Luxembourg).
          </p>

          <h2 id="cookies">Cookies et contenus tiers</h2>
          <p>
            Le site ne dépose aucun cookie publicitaire ni de mesure d&apos;audience. Votre choix sur le bandeau est mémorisé dans
            votre navigateur. Si vous l&apos;acceptez, nous affichons des contenus de tiers qui peuvent déposer leurs propres
            cookies : Google Maps (carte de la page Contact) et le widget d&apos;avis Google. Les publications Instagram sont
            chargées sans script tiers.
          </p>
          <p>Vous pouvez modifier votre choix à tout moment avec le lien « Gérer les cookies » en bas de page.</p>
        </div>
      </div>
    </>
  );
}
