import { publicApi } from "@/lib/public-api";
import ComparadorSplit from "./comparador-split";
import { LegislatorVersusCard } from "@/interfaces/legislator-metrics";

export default async function ComparadorServer() {
  const [legisladores] = await Promise.all([
    publicApi.getVersusLegislators({
      limit: 40,
    }) as Promise<LegislatorVersusCard[]>,
  ]);
  const shuffled = [...legisladores].sort(() => Math.random() - 0.5);
  console.log("shuffle", shuffled);
  return <ComparadorSplit legisladores={shuffled} />;
}
