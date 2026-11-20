import { pageMetadata } from "@/content/metadata";
import { Archive, readQuery, type SearchParams } from "@/components/archive";
export const metadata = pageMetadata(
  "/progetti",
  "Progetti",
  "Archivio di progetti per categoria e parola chiave.",
);
export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return <Archive query={await readQuery(searchParams)} />;
}
