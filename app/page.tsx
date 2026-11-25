import {
  pageDefaults,
  homeSubtitle,
  homeCta,
} from "@/content/cms/page-defaults";
import Link from "next/link";
import { pageMetadata } from "@/content/metadata";
import { site } from "@/content/site";
import { categories, localPreview, mediaUrl } from "@/content/projects";
import { pageContent, publicProjects } from "@/content/cms/public";
import { ContentBlocks } from "@/components/content-blocks";
import { Featured } from "@/components/featured";
import { FilmIntro } from "@/components/film-intro";
import { ContactCallout } from "@/components/editorial";
import { ServiceCarousel } from "@/components/service-carousel";
import { previewVideos } from "@/content/preview-videos";
import { orderFeatured } from "@/content/projects/presentation";
import { defaultShowcaseOrder } from "@/content/projects/showcase";
import { HeroReveal } from "@/components/motion/reveal";
import {
  ArchitecturalShowcase,
  type ShowcaseProject,
} from "@/components/architectural-showcase";

export const metadata = pageMetadata(
  "/",
  "LoboStudio — Studio di ingegneria",
  site.description,
);

export default async function Home() {
  const [projects, home, servicePage] = await Promise.all([
    publicProjects(localPreview),
    pageContent("home"),
    pageContent("servizi"),
  ]);
  const showExisting = home?.mode !== "sostituisci";
  const slides = orderFeatured(
    projects.filter((project) => project.featured),
    home?.featuredOrder,
  )
    .slice(0, 6)
    .map((project) => ({
      src: mediaUrl(project.gallery[0].file),
      alt: project.gallery[0].alt,
      title: project.title,
      category: categories.find(({ slug }) => slug === project.category)?.label,
      location: project.location,
      href: "/progetti/" + project.slug,
    }));
  const featuredSlides = localPreview
    ? [
        ...slides,
        ...Object.entries(previewVideos).map(([name, video]) => ({
          title: video.title,
          src: "/anteprima-media/" + name,
          video: true as const,
        })),
      ]
    : slides;
  const showcase = (
    home?.showcaseOrder ?? defaultShowcaseOrder
  ).flatMap<ShowcaseProject>((slug) => {
    const project = projects.find((item) => item.slug === slug);
    const image = project?.gallery[0];
    if (!project || !image) return [];
    return [
      {
        slug,
        title: project.title,
        category: categories.find((item) => item.slug === project.category)!
          .label,
        summary: project.summary ?? project.description,
        photos: [
          { src: mediaUrl(image.file), alt: image.alt },
          ...project.gallery
            .slice(1, 5)
            .map(({ file, alt }) => ({ src: mediaUrl(file), alt })),
        ],
      },
    ];
  });
  return (
    <>
      {localPreview && showExisting && (
        <FilmIntro
          src="/anteprima-media/bologna-work-in-progress"
          title={previewVideos["bologna-work-in-progress"].title}
        />
      )}
      <div className="frame home" id="inizio-home">
        <div className={featuredSlides.length ? "cover has-photo" : "cover"}>
          <HeroReveal className="cover-copy">
            <p className="eyebrow" data-hero-line>
              {localPreview ? "Bologna" : "Studio di ingegneria"}
            </p>
            <h1 data-hero-line>{home?.title || pageDefaults.home.title}</h1>
            <p className="cover-subtitle" data-hero-line>
              {home?.subtitle || homeSubtitle}
            </p>
            <p data-hero-line>{home?.intro || pageDefaults.home.intro}</p>
            <Link className="underlined" href="/progetti" data-hero-line>
              {home?.cta || homeCta} →
            </Link>
          </HeroReveal>
          <Featured slides={featuredSlides} />
        </div>
        {showExisting && (
          <>
            <nav aria-label="Archivio per categoria" className="archive-strip">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={"/progetti/categoria/" + category.slug}
                >
                  {category.label}
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </nav>
            {showcase.length > 0 && (
              <ArchitecturalShowcase projects={showcase} />
            )}
            <ServiceCarousel photos={servicePage?.servicePhotos} />
            <section className="section split">
              <div>
                <p className="eyebrow">Lo studio</p>
                <h2>
                  {localPreview ? "Lorenzo Bolelli" : "Il progetto integrato"}
                </h2>
              </div>
              <div className="reading">
                <p>
                  {localPreview
                    ? "Dal 1995 lo studio di Bologna affianca alla progettazione architettonica e strutturale la ricerca sul risparmio energetico, nelle nuove costruzioni e nel recupero degli edifici storici."
                    : "Architettura e struttura si sviluppano insieme, dalle prime verifiche di fattibilità alla realizzazione."}
                </p>
                <Link className="underlined" href="/studio">
                  Profilo e metodo →
                </Link>
              </div>
            </section>
          </>
        )}
        <ContentBlocks content={home} />
      </div>
      <ContactCallout />
    </>
  );
}
