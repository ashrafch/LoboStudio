import { LockKeyhole } from "lucide-react";
import { connection } from "next/server";
import { adminHref } from "@/content/cms/auth";
import type { Metadata } from "next";
import Link from "next/link";
import { categories, clientPreview, localPreview } from "@/content/projects";
import { indexing, site, siteUrl } from "@/content/site";
import { Navigation } from "@/components/navigation";
import { ProjectImage } from "@/components/project-image";
import { MotionSettings } from "@/components/motion/settings";
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

async function StudioAccess() {
  await connection();
  const href = adminHref();
  return href ? (
    <a className="studio-access" href={href}>
      <LockKeyhole size={14} aria-hidden="true" />
      Area riservata
    </a>
  ) : null;
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>
        <MotionSettings>
          <a className="skip" href="#contenuto">
            Vai al contenuto
          </a>
          <Navigation
            categories={categories}
            mark={
              localPreview ? (
                <span className="mark" aria-hidden="true">
                  <ProjectImage
                    src="/anteprima-media/lobo"
                    alt=""
                    sizes="30px"
                    priority
                    fallback={
                      <span className="mark-fallback">
                        LO
                        <br />
                        BO
                      </span>
                    }
                  />
                </span>
              ) : undefined
            }
          />
          {localPreview && (
            <div className="preview-note">
              <div className="frame">
                {clientPreview ? "Anteprima riservata" : "Anteprima locale"} ·
                Contenuti in revisione
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
              <nav aria-label="Informazioni e accesso studio">
                <Link href="/privacy">Privacy</Link>
                <Link href="/note-legali">Note legali</Link>
                <StudioAccess />
              </nav>
            </div>
            <p className="frame footer-credit">
              Realizzazione web · Ashraf Chouikh
            </p>
          </footer>
        </MotionSettings>
      </body>
    </html>
  );
}
