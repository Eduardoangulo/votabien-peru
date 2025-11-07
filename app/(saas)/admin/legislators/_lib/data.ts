"use server";

import { unstable_noStore as noStore } from "next/cache";
import { serverApi } from "@/lib/server-api";
import type { GetLegislatorSchema } from "./validation";
import type {
  PaginatedLegislatorsResponse,
  ChamberCounts,
  DistrictCounts,
  ConditionCounts,
} from "./types";

/**
 * Obtiene legisladores con filtros, paginación y ordenamiento
 */
export async function getLegislators(
  input: GetLegislatorSchema,
): Promise<PaginatedLegislatorsResponse> {
  noStore();

  try {
    // Construir el body para el POST request
    const requestBody = {
      page: input.page,
      page_size: input.perPage,
      sort: input.sort,
      fullname: input.fullname || undefined,
      chamber: input.chamber,
      condition: input.condition,
      electoral_districts: input.electoral_district,
      // filters: input.filters,
      // joinOperator: input.joinOperator,
    };

    const response = await serverApi.post<PaginatedLegislatorsResponse>(
      "/api/v1/politics/admin/legislators",
      requestBody,
    );

    return response;
  } catch (error) {
    console.error("Error fetching legislators:", error);
    throw new Error("Failed to fetch legislators");
  }
}

/**
 * Obtiene conteos de legisladores por tipo de cámara
 */
export async function getChamberTypeCounts(): Promise<ChamberCounts> {
  noStore();

  try {
    const response = await serverApi.get<ChamberCounts>(
      "/api/v1/politics/admin/legislators/chamber-counts",
    );

    return response;
  } catch (error) {
    console.error("Error fetching chamber counts:", error);
    return {};
  }
}

/**
 * Obtiene conteos de legisladores por condición
 */
export async function getLegislatorConditionCounts(): Promise<ConditionCounts> {
  noStore();

  try {
    const response = await serverApi.get<ConditionCounts>(
      "/api/v1/politics/admin/legislators/condition-counts",
    );

    return response;
  } catch (error) {
    console.error("Error fetching condition counts:", error);
    return {};
  }
}

/**
 * Obtiene conteos de legisladores por distrito electoral
 */
export async function getDistrictsCounts(): Promise<DistrictCounts> {
  noStore();

  try {
    const response = await serverApi.get<DistrictCounts>(
      "/api/v1/politics/admin/legislators/district-counts",
    );

    return response;
  } catch (error) {
    console.error("Error fetching district counts:", error);
    return {};
  }
}
