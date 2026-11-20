import { Breadcrumb, Intro } from "./editorial";
export function EditorialPage({
  title,
  text,
  children,
}: {
  title: string;
  text?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="frame inner-page">
      <Breadcrumb items={[[title]]} />
      <Intro title={title} text={text} />
      {children}
    </div>
  );
}
