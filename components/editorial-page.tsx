import { pageDefaults } from "@/content/cms/page-defaults";
import { Breadcrumb, Intro } from "./editorial";
import { ContentBlocks } from "./content-blocks";
import { pageContent } from "@/content/cms/public";
import type { PageKey } from "@/content/cms/schema";

export async function EditorialPage({
  page,
  title,
  text,
  children,
  introAside,
}: {
  page?: PageKey;
  title?: string;
  text?: string;
  children: React.ReactNode;
  introAside?: React.ReactNode;
}) {
  const content = page ? await pageContent(page) : undefined;
  const heading =
    content?.title || (page ? pageDefaults[page].title : (title ?? ""));
  const showExisting = content?.mode !== "sostituisci";
  return (
    <div className="frame inner-page">
      <Breadcrumb items={[[heading]]} />
      <Intro
        title={heading}
        text={content?.intro || (page ? pageDefaults[page].intro : text)}
        aside={showExisting ? introAside : undefined}
      />
      {showExisting && children}
      <ContentBlocks content={content} />
    </div>
  );
}
