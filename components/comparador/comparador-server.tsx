import { publicApi } from "@/lib/public-api";
import ComparadorSplit from "./comparador-split";
import { LegislatorVersusCard } from "@/interfaces/versus";

export default async function ComparadorServer() {
  const [personas] = await Promise.all([
    publicApi.getVersusLegislators({
      limit: 20,
    }) as Promise<LegislatorVersusCard[]>,
  ]);
  const shuffled = [...personas].sort(() => Math.random() - 0.5);

  return <ComparadorSplit legisladores={shuffled} />;
}
