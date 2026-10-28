import Link from "next/link";
import { footerNav } from "@/lib/navigation";
import { site, telHref, mailHref, mapsHref } from "@/lib/site";
import { t } from "@/i18n/fr";
import { CookieSettingsButton } from "./cookie-banner";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink bg-bg pb-28 pt-16 md:pb-16">
      <div className="container-site grid gap-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="grid content-start gap-4">
            <p className="font-display text-3xl leading-none">
              Smart <i className="font-normal">Lease</i>
            </p>
            <address className="not-italic text-muted">
              {site.legalName}
              <br />
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </a>
            </address>
            <p className="grid gap-1">
              <a href={telHref} className="font-mono">
                {site.phone.display}
              </a>
              <a href={mailHref} className="hover:underline">
                {site.email}
              </a>
            </p>
            <p className="text-sm text-muted">{site.hours}</p>
          </div>
          {footerNav.map((col) => (
            <nav key={col.title} aria-label={col.title} className="grid content-start gap-3">
              <p className="eyebrow">{col.title}</p>
              <ul className="grid gap-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:underline underline-offset-4">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="flex flex-col gap-4 border-t border-line pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <span>RCS {site.rcs}</span>
            <span>TVA {site.vat}</span>
            <span>© {new Date().getFullYear()} {site.legalName}</span>
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              Instagram
            </a>
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              Facebook
            </a>
            <Link href="/mentions-legales" className="hover:text-ink">
              {t.footer.legal}
            </Link>
            <Link href="/confidentialite" className="hover:text-ink">
              {t.footer.privacy}
            </Link>
            <CookieSettingsButton />
          </p>
        </div>
      </div>
    </footer>
  );
}
