import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ReviewsSection } from "@/components/home/reviews-section";

export const metadata: Metadata = {
  title: "Avis clients",
  description: "Les avis des clients de Smart Lease, négociant automobile et mandataire import Europe à Luxembourg.",
  alternates: { canonical: "/avis" },
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Avis", path: "/avis" }]}
        eyebrow="Avis clients"
        title={
          <>
            Ce que disent <em>nos clients</em>
          </>
        }
        intro="Nous publions uniquement des avis réels, vérifiables sur Google ou transmis par nos clients avec leur accord."
      />
      <div className="container-site py-14 md:py-20">
        <ReviewsSection />
      </div>
    </>
  );
}
