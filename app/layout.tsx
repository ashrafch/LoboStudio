import type { Metadata } from "next";
import Link from "next/link";
import { categories, localPreview } from "@/content/projects";
import { indexing, site, siteUrl } from "@/content/site";
import { Navigation } from "@/components/navigation";
import { ProjectImage } from "@/components/project-image";
import "@fontsource-variable/manrope";
import "@fontsource-variable/dm-sans";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl ?? new URL("http://localhost:3000"),
  title: {
    default: "LoboStudio — Studio di ingegneria",
    template: "%s | LoboStudio",
  },
  description: site.description,
  robots: { index: indexing, follow: indexing },
  openGraph: {
    title: "LoboStudio — Studio di ingegneria",
    description: site.description,
    siteName: site.name,
    locale: "it_IT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>
        <a className="skip" href="#contenuto">
          Vai al contenuto
        </a>
        <Navigation
          categories={categories}
          mark={
            localPreview ? (
              <span className="mark" aria-hidden="true">
                <ProjectImage src="/anteprima-media/lobo" alt="" sizes="30px" />
              </span>
            ) : undefined
          }
        />
        {localPreview && (
          <div className="preview-note">
            <div className="frame">
              Anteprima locale · Contenuti in revisione
            </div>
          </div>
        )}
        <main id="contenuto">{children}</main>
        <footer className="footer">
          <div className="frame footer-inner">
            <Link className="brand" href="/">
              LOBO<span className="brand-sub">STUDIO</span>
            </Link>
            <span>Architettura e ingegneria</span>
            <nav aria-label="Informazioni legali">
              <Link href="/privacy">Privacy</Link>
              <Link href="/note-legali">Note legali</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
