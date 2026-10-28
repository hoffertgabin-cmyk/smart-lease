"use client";

import Link from "next/link";
import { useConsent } from "@/hooks/use-consent";
import { t } from "@/i18n/fr";

/**
 * GDPR banner. The site sets no tracking cookie by itself; consent only unlocks
 * third-party content (Google Maps, Instagram, Google reviews widget).
 * "Refuser" has the same weight and position as "Accepter".
 */
export function CookieBanner() {
  const { consent, save } = useConsent();
  // Rendered on the server so it paints with the page; hidden by CSS (html[data-consent]) when already answered.
  if (consent) return null;

  return (
    <section
      role="region"
      aria-label="Cookies et contenus tiers"
      className="cookie-banner fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper shadow-[0_-8px_32px_rgba(19,22,20,0.08)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="container-site flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between md:gap-8">
        <p className="max-w-[70ch] text-sm text-muted">
          Nous n&apos;utilisons pas de cookies publicitaires. Avec votre accord, nous affichons des contenus de
          Google Maps, Instagram et des avis Google, qui peuvent déposer leurs propres cookies.{" "}
          <Link href="/confidentialite#cookies" className="underline underline-offset-2 text-ink">
            En savoir plus
          </Link>
        </p>
        <div className="grid shrink-0 grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => save(false)}
            className="h-11 border border-ink px-5 text-sm font-medium transition-colors hover:bg-ink hover:text-bg"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => save(true)}
            className="h-11 border border-ink px-5 text-sm font-medium transition-colors hover:bg-ink hover:text-bg"
          >
            Accepter
          </button>
        </div>
      </div>
    </section>
  );
}

export function CookieSettingsButton() {
  const { reset } = useConsent();
  return (
    <button type="button" onClick={reset} className="hover:text-ink">
      {t.footer.cookies}
    </button>
  );
}
