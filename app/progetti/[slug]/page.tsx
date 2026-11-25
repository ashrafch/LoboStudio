import { pageMetadata } from "@/content/metadata";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb, ProjectGrid } from "@/components/editorial";
import { ProjectPresentation } from "@/components/project-presentation";
import { categories, localPreview, mediaUrl } from "@/content/projects";
import { publicProjects } from "@/content/cms/public";

type Params = Promise<{ slug: string }>;
export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const project = (await publicProjects(localPreview)).find(
    (item) => item.slug === slug,
  );
  return project
    ? pageMetadata(
        "/progetti/" + slug,
        project.title,
        project.summary || project.description,
      )
    : {};
}
export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const projects = await publicProjects(localPreview);
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const category = categories.find((item) => item.slug === project.category)!;
  const related = projects
    .filter(
      (item) =>
        item.category === category.slug &&
        item.slug !== slug &&
        item.gallery.length > 0,
    )
    .slice(0, 3);
  return (
    <div className="frame inner-page">
      <Breadcrumb
        items={[
          ["Progetti", "/progetti"],
          [category.label, "/progetti/categoria/" + category.slug],
          [project.title],
        ]}
      />
      <ProjectPresentation
        title={project.title}
        summary={project.summary}
        description={project.description}
        layout={project.presentation}
        frames={project.gallery.map(({ file, ...photo }) => ({
          ...photo,
          src: mediaUrl(file),
        }))}
        facts={{
          location: project.location,
          period: project.period ?? project.year,
          role: project.role,
        }}
      />
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
