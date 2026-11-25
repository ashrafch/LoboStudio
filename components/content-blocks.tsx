import { ProjectImage } from "./project-image";
import { cmsImage } from "@/content/cms/public";
import type { PageDraft } from "@/content/cms/schema";

export function ContentBlocks({ content }: { content?: PageDraft }) {
  if (!content?.blocks.length) return null;
  return (
    <div className={"cms-blocks cms-" + content.layout}>
      {content.blocks.map((block, index) => (
        <section className="cms-block" key={index}>
          {block.image && (
            <div className="cms-block-picture">
              <ProjectImage src={cmsImage(block.image)} alt={block.alt} />
            </div>
          )}
          {(block.title || block.text) && (
            <div className="cms-block-copy">
              {block.title && <h2>{block.title}</h2>}
              {block.text && <p>{block.text}</p>}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
