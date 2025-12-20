import { notFound } from "next/navigation";
import DetailParty from "./_components/detail-party";
import { getPartidoById } from "@/queries/public/parties";

interface PageProps {
  params: { partidosId: string };
}

export default async function PartidoDetailPage({ params }: PageProps) {
  const { partidosId } = await params;

  try {
    const party = await getPartidoById(partidosId);
    if (!party) notFound();
    return <DetailParty party={party} />;
  } catch (error) {
    console.error("Error al obtener datos del partido:", error);
    notFound();
  }
}
