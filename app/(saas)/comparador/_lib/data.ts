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
import { getLegisladoresCards } from "@/queries/public/legislators";
import { getLegislatorsComparison } from "@/queries/public/compare";

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
      const response = await getLegisladoresCards({
        ids: ids,
        limit: ids.length,
        // active_only: false,
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
    return null;
  }

  try {
    // CASO 1: LEGISLADORES (Lógica Local Supabase)
    if (!isCandidateMode(params.mode)) {
      // Llamamos directamente a la función helper de base de datos
      // Sin fetch, sin API Route intermedia
      const result = await getLegislatorsComparison(params.ids);
      return result;
    }

    // CASO 2: CANDIDATOS (Lógica Legacy / API Externa)
    // Si aún usas el backend para candidatos, mantenemos esto:
    const endpoint = "/api/v1/public/candidates/compare";
    const candidatePayload: CandidateComparisonPayload = { ids: params.ids };

    const candidacyType = extractCandidacyType(params.mode);
    if (candidacyType) {
      candidatePayload.candidacy_type = candidacyType;
    }

    const result = await publicApi.post<ComparisonResponse>(
      endpoint,
      candidatePayload,
    );

    if (
      !result ||
      (typeof result === "object" && Object.keys(result).length === 0)
    ) {
      return null;
    }

    return result;
  } catch (error) {
    console.error(`💥 Error fetching comparison:`, error);
    return null;
  }
}
