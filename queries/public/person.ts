"use server";

import { PersonDetail, PersonWithActivePeriod } from "@/interfaces/person";
import { createClient } from "@/lib/supabase/server";

export async function getPersonaById(
  personaId: string,
): Promise<PersonDetail | null> {
  const supabase = await createClient();

  const TABLE_NAME = "person";
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(
      `
      *,
      
      backgrounds:background(*), 
      
      legislative_periods:legislator(
        *,
        elected_by_party:politicalparty(*),
        electoral_district:electoraldistrict(*),
        bill_authorships:bill(*) 
      ),
      
      candidacies:candidate(
        *,
        electoral_process:electoralprocess(*),
        political_party:politicalparty(*),
        electoral_district:electoraldistrict(*)
      )
    `,
    )
    .eq("id", personaId)
    .single();

  if (error) {
    console.error("Error fetching persona detail:", error);
    return null;
  }

  if (!data) return null;

  return data as unknown as PersonDetail;
}

interface GetPersonasParams {
  search: string;
  limit?: number;
  skip?: number;
}

export async function getPersonas({
  search,
  limit = 10,
  skip = 0,
}: GetPersonasParams): Promise<PersonWithActivePeriod[]> {
  const supabase = await createClient();

  // Limpiamos la búsqueda para evitar espacios vacíos
  const searchTerm = search.trim();

  if (!searchTerm) return [];

  const { data, error } = await supabase
    .from("person")
    .select("*")
    .ilike("fullname", `%${searchTerm}%`)
    .order("fullname", { ascending: true })
    .range(skip, skip + limit - 1);

  if (error) {
    console.error("Error searching personas:", error);
    return [];
  }

  // Retornamos los datos.
  // Nota: Hacemos el cast porque PersonWithActivePeriod suele tener campos extras
  // que aquí no estamos calculando, pero para el "Selector" la info básica basta.
  return (data || []) as unknown as PersonWithActivePeriod[];
}
