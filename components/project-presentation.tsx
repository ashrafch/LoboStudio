import type { ProjectLayout } from "@/content/projects/presentation";
import { CalendarDays, DraftingCompass, MapPin } from "lucide-react";
import { Gallery, type GalleryFrame } from "./gallery";

const projectFields = [
  { key: "location", label: "Località", Icon: MapPin },
  { key: "period", label: "Periodo", Icon: CalendarDays },
  { key: "role", label: "Ruolo dello studio", Icon: DraftingCompass },
] as const;

export function ProjectPresentation({
  title,
  summary,
  description,
  facts,
  frames,
  layout,
  preview = false,
}: {
  title: string;
  summary?: string;
  description: string;
  facts: { location?: string; period?: string | number; role?: string };
  frames: GalleryFrame[];
  layout: ProjectLayout;
  preview?: boolean;
}) {
  const editorial = layout === "racconto" && frames.length > 0;
  const Heading = preview ? "h3" : "h1";
  const StoryHeading = preview ? "h4" : "h2";
  const hasDescription = Boolean(description.trim());
  const details = projectFields.filter(
    ({ key }) => String(facts[key] ?? "").trim() !== "",
  );
  const credits = [...new Set(frames.flatMap((frame) => frame.credit || []))];
  const story = (
    <div className="project-story">
      {hasDescription && (
        <div className="project-story-copy">
          <StoryHeading>Il progetto</StoryHeading>
          <p>{description}</p>
        </div>
      )}
      {details.length > 0 && (
        <div className="project-data">
          <StoryHeading>Dati del progetto</StoryHeading>
          <dl className="project-facts">
            {details.map(({ key, label, Icon }) => (
              <div key={key} className={`project-fact-${key}`}>
                <dt>
                  <Icon aria-hidden="true" size={16} />
                  {label}
                </dt>
                <dd>{facts[key]}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
  return (
    <div
      className={
        "project-presentation " +
        (editorial ? "project-narrative" : "project-compact")
      }
    >
      <header className="project-title">
        <Heading>{title}</Heading>
        {summary && <p>{summary}</p>}
      </header>
      {!editorial && story}
      {frames.length > 0 && (
        <Gallery frames={frames} afterCover={editorial ? story : undefined} />
      )}
      {credits.length > 0 && (
        <p className="project-credits">
          Crediti immagini · {credits.join(", ")}
        </p>
      )}
    </div>
  );
}
