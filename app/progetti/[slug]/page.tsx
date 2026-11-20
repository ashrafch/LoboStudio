import { pageMetadata } from "@/content/metadata";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb, Intro, ProjectGrid } from "@/components/editorial";
import { Gallery } from "@/components/gallery";
import {
  categories,
  localPreview,
  mediaUrl,
  visibleProjects,
} from "@/content/projects";

type Params = Promise<{ slug: string }>;
export function generateStaticParams() {
  return visibleProjects(localPreview).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const project = visibleProjects(localPreview).find(
    (item) => item.slug === slug,
  );
  return project
    ? pageMetadata("/progetti/" + slug, project.title, project.description)
    : {};
}
export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const projects = visibleProjects(localPreview);
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const category = categories.find((item) => item.slug === project.category)!;
  const related = projects
    .filter((item) => item.category === category.slug && item.slug !== slug)
    .slice(0, 3);
  const details = [
    ["Ruolo", project.role],
    ["Località", project.location],
    ["Anno", project.year],
  ].filter(([, value]) => value !== undefined);
  return (
    <div className="frame inner-page">
      <Breadcrumb
        items={[
          ["Progetti", "/progetti"],
          [category.label, "/progetti/categoria/" + category.slug],
          [project.title],
        ]}
      />
      <Intro title={project.title} text={project.description} />
      {details.length > 0 && (
        <dl className="details">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <Gallery
        frames={project.gallery.map((media) => ({
          src: mediaUrl(media.file),
          alt: media.alt,
        }))}
      />
      {project.gallery.some((media) => media.credit) && (
        <p className="results">
          Crediti immagini ·{" "}
          {[
            ...new Set(project.gallery.flatMap((media) => media.credit ?? [])),
          ].join(", ")}
        </p>
      )}
      {related.length > 0 && (
        <section className="section">
          <h2>Progetti correlati</h2>
          <ProjectGrid projects={related} />
        </section>
      )}
      <div className="prose-block">
        <Link href="/progetti" className="underlined">
          Torna all’archivio
        </Link>
      </div>
    </div>
  );
}
