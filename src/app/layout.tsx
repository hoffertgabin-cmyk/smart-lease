import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { JsonLd, autoDealerJsonLd } from "@/components/seo/json-ld";
import { site } from "@/lib/site";
import { t } from "@/i18n/fr";
import { consentBootScript } from "@/lib/consent";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Smart Lease · Négociant automobile à Luxembourg, import Europe",
    template: "%s · Smart Lease Luxembourg",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b1f3a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${manrope.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Hides the server-rendered cookie banner before first paint when a choice is already stored. */}
        <script dangerouslySetInnerHTML={{ __html: consentBootScript }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-3 focus:text-bg"
        >
          {t.nav.skip}
        </a>
        <SiteHeader />
        <main id="contenu">{children}</main>
        <SiteFooter />
        <WhatsAppFab />
        <CookieBanner />
        <JsonLd data={autoDealerJsonLd()} />
      </body>
    </html>
  );
}
