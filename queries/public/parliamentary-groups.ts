"use server";

import { ParliamentaryGroupBasic } from "@/interfaces/parliamentary-membership";
import { createClient } from "@/lib/supabase/server";

export async function getParliamentaryGroups(
  active: boolean = true,
): Promise<ParliamentaryGroupBasic[]> {
  const supabase = await createClient();

  const TABLE_NAME = "parliamentarygroup";

  let query = supabase.from(TABLE_NAME).select(`
      id,
      name,
      acronym,
      logo_url, 
      color_hex  
    `);

  if (active) {
    query = query.eq("active", true);
  }

  // Ordenamos por nombre ascendente (igual que en Python)
  query = query.order("name", { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error("Error al obtener grupos parlamentarios:", error);
    // Retornamos array vacío en caso de error para no romper la UI
    return [];
  }

  // Casting seguro porque usamos alias para coincidir con la interfaz
  return data as unknown as ParliamentaryGroupBasic[];
}
