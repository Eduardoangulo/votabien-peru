"use server";

import { PersonDetail } from "@/interfaces/person";
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
