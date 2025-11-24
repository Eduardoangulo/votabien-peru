// comparador/_lib/data.ts
"use server";

import { publicApi } from "@/lib/public-api";
import { EntityType, SearchableEntity } from "@/interfaces/ui-types";
import {
  ComparatorParamsSchema,
  isCandidateMode,
  extractCandidacyType,
} from "./validation";
import {
  adaptLegislatorFromSearch, // 🔥 Para búsqueda/IDs individuales
  adaptCandidateFromSearch, // 🔥 Para búsqueda/IDs individuales
} from "./helpers";
import {
  ComparisonResponse,
  LegislatorComparisonPayload,
  CandidateComparisonPayload,
} from "@/interfaces/comparator";

// ============================================
// SERVER ACTIONS: Obtener entidades por IDs
// ============================================

export async function getEntitiesByIds(
  ids: string[],
  mode: EntityType,
): Promise<SearchableEntity[]> {
  if (!ids || ids.length === 0) {
    return [];
  }

  try {
    // CASO 1: LEGISLADORES
    if (mode === "legislator") {
      const response = await publicApi.getLegisladoresCards({
        ids: ids.join(","),
        limit: ids.length,
        active_only: false,
      });

      if (!Array.isArray(response)) {
        console.error("❌ Invalid legislator response");
        return [];
      }

      // 🔥 Usar adapter de búsqueda (estructura simple)
      return response.map(adaptLegislatorFromSearch);
    }

    // CASO 2: CANDIDATOS
    if (isCandidateMode(mode)) {
      const candidacyType = extractCandidacyType(mode);

      const response = await publicApi.getCandidaturas({
        ids: ids.join(","),
        candidacy_type: candidacyType || undefined,
        limit: ids.length,
      });

      if (!Array.isArray(response)) {
        console.error("❌ Invalid candidate response");
        return [];
      }

      // 🔥 Usar adapter de búsqueda (estructura simple)
      return response.map((cand) => adaptCandidateFromSearch(cand, mode));
    }

    console.warn(`⚠️ Unsupported mode: ${mode}`);
    return [];
  } catch (error) {
    console.error(`💥 Error in getEntitiesByIds (${mode}):`, error);
    return [];
  }
}

// ============================================
// SERVER ACTION: Comparación
// ============================================

export async function getComparisonData(
  params: ComparatorParamsSchema,
): Promise<ComparisonResponse> {
  if (params.ids.length < 2) {
    console.log("⚠️ Need at least 2 IDs for comparison");
    return null;
  }

  const endpoint = isCandidateMode(params.mode)
    ? "/api/v1/public/candidates/compare"
    : "/api/v1/public/legislators/compare";

  try {
    let payload: LegislatorComparisonPayload | CandidateComparisonPayload;

    if (isCandidateMode(params.mode)) {
      const candidatePayload: CandidateComparisonPayload = {
        ids: params.ids,
      };

      const candidacyType = extractCandidacyType(params.mode);
      if (candidacyType) {
        candidatePayload.candidacy_type = candidacyType;
      }
      if (params.process_id) {
        candidatePayload.process_id = params.process_id;
      }

      payload = candidatePayload;
    } else {
      payload = {
        ids: params.ids,
      };
    }

    console.log("📤 Calling comparison endpoint:", endpoint);
    console.log("📤 Payload:", payload);

    const result = await publicApi.post<ComparisonResponse>(endpoint, payload);

    console.log(
      "📥 Comparison result:",
      result ? "✅ Data received" : "❌ Null/empty",
    );

    // ✅ Normalizar respuesta vacía a null
    if (
      !result ||
      (typeof result === "object" && Object.keys(result).length === 0)
    ) {
      console.warn("⚠️ Empty comparison response");
      return null;
    }

    return result;
  } catch (error) {
    console.error(`💥 Error fetching comparison:`, error);
    return null;
  }
}
