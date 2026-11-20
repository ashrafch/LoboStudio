import { pageMetadata } from "@/content/metadata";
import { notFound } from "next/navigation";
import { categories } from "@/content/projects";
import { Archive, readQuery, type SearchParams } from "@/components/archive";

type Params = Promise<{ slug: string }>;
export function generateStaticParams() {
  return categories.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const match = categories.find((item) => item.slug === slug);
  return match
    ? pageMetadata("/progetti/categoria/" + slug, match.label, match.intro)
    : {};
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  return <Archive category={category} query={await readQuery(searchParams)} />;
}
