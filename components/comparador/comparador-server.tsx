import ComparadorSplit from "./comparador-split";
import { getVersusLegislators } from "@/queries/public/legislators";

export default async function ComparadorServer() {
  const legisladores = await getVersusLegislators({
    limit: 40,
    activeOnly: true,
  });
  const shuffled = [...legisladores].sort(() => Math.random() - 0.5);
  return <ComparadorSplit legisladores={shuffled} />;
}
