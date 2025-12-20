"use server";

import { createClient } from "@/lib/supabase/server";
import {
  PoliticalPartyListPaginated,
  PoliticalPartyDetail,
} from "@/interfaces/politics";

interface GetPartidosParams {
  active?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getPartidosList(
  params: GetPartidosParams = {},
): Promise<PoliticalPartyListPaginated> {
  const supabase = await createClient();

  const { active, search, limit = 30, offset = 0 } = params;

  try {
    let query = supabase
      .from("politicalparty")
      .select("*", { count: "exact" })
      .order("name", { ascending: true });

    if (active !== undefined) {
      query = query.eq("active", active);
    }

    // Búsqueda por nombre o acrónimo (case-insensitive)
    if (search && search.trim() !== "") {
      const searchTerm = search.trim();
      query = query.or(
        `name.ilike.%${searchTerm}%,acronym.ilike.%${searchTerm}%`,
      );
    }

    // paginación
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Error al obtener partidos: ${error.message}`);
    }

    return {
      items: data || [],
      total: count || 0,
      limit,
      offset,
    };
  } catch (error) {
    console.error("Error en getPartidosList:", error);
    throw error;
  }
}

export async function getPartidoById(
  partidoId: string,
): Promise<PoliticalPartyDetail> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_partido_detail", {
    p_partido_id: partidoId,
  });
  if (error) {
    console.error("Error:", error);
    throw new Error("Error al obtener detalle del partido");
  }

  if (!data || !data.partido) {
    throw new Error("Partido no encontrado");
  }

  return {
    ...data.partido,
    total_seats: data.total_seats,
    seats_by_district: data.seats_by_district,
    elected_legislators: data.elected_legislators,
  };
}
