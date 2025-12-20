"use server";

import { ElectoralProcess } from "@/interfaces/politics";
import { createClient } from "@/lib/supabase/server";

/**
 * Obtiene la lista de procesos electorales (ej: Elecciones 2026).
 * * @param active - (Opcional)
 * - true: Solo activos
 * - false: Solo inactivos
 * - undefined/null: Todos
 */
export async function getElectoralProcess(
  active?: boolean | null,
): Promise<ElectoralProcess[]> {
  const supabase = await createClient();

  const TABLE_NAME = "electoralprocess";

  let query = supabase.from(TABLE_NAME).select(`
      id,
      name,
      year,
      election_date,
      active
    `);

  if (active !== undefined && active !== null) {
    query = query.eq("active", active);
  }

  query = query.order("year", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error("Error al obtener procesos electorales:", error);
    return [];
  }

  return data as unknown as ElectoralProcess[];
}
