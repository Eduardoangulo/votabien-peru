import { publicApi } from "@/lib/public-api";
import ComparadorSplit from "./comparador-split";
import { LegislatorVersusCard } from "@/interfaces/versus";

export default async function ComparadorServer() {
  const [legisladores] = await Promise.all([
    publicApi.getVersusLegislators({
      limit: 40,
    }) as Promise<LegislatorVersusCard[]>,
  ]);
  const shuffled = [...legisladores].sort(() => Math.random() - 0.5);

  return <ComparadorSplit legisladores={shuffled} />;
}
