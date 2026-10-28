import { site } from "@/lib/site";
import { reviews } from "@/content/reviews";

/**
 * Only real reviews are shown. The legacy /avis page had none, so until reviews are
 * provided (content/reviews.ts) or a Google Business link is set, a visible TODO is rendered.
 */
export function ReviewsSection() {
  if (reviews.length > 0) {
    return (
      <ul className="grid gap-6 md:grid-cols-3">
        {reviews.map((r) => (
          <li key={r.author + r.date} className="grid content-start gap-4 border-t border-ink pt-6">
            <blockquote className="font-display text-xl leading-snug">« {r.text} »</blockquote>
            <p className="text-sm text-muted">
              {r.author} · {r.source}, {r.date}
            </p>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="grid gap-4 border border-dashed border-line bg-paper p-8">
      <p className="todo w-fit">TODO avis clients</p>
      <p className="max-w-[60ch] text-muted">
        Emplacement réservé aux avis clients réels. Deux options : renseigner le lien de la fiche Google Business pour
        afficher le widget officiel, ou ajouter dans <code>src/content/reviews.ts</code> des avis transmis avec
        l&apos;accord des clients.
      </p>
      {site.googleReviewsUrl ? (
        <a href={site.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="underline">
          Voir nos avis Google
        </a>
      ) : null}
    </div>
  );
}
