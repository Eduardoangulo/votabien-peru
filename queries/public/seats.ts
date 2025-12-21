"use server";

import { SeatParliamentary } from "@/interfaces/politics";
import { Database } from "@/interfaces/supabase";
import { createClient } from "@/lib/supabase/server";

type ChamberType = Database["public"]["Tables"]["legislator"]["Row"]["chamber"];

export async function getSeatParliamentary(
  chamber: ChamberType,
): Promise<SeatParliamentary[]> {
  if (chamber !== "CONGRESO") {
    throw new Error("Solo se permite consultar escaños del congreso");
  }

  const supabase = await createClient();
  const TABLE_NAME = "seatparliamentary";

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(
      `
      id,
      chamber,
      number_seat,
      row,
      
      legislator:legislator (
        id,
        person_id,
        chamber,
        condition,
        active,
        
        elected_by_party:politicalparty (
          id, name, acronym
        ),
        
        current_parliamentary_group
      )
    `,
    )
    .eq("chamber", chamber)
    .order("row", { ascending: true })
    .order("number_seat", { ascending: true });

  if (error) {
    console.error("Error al obtener escaños:", error);
    return [];
  }

  return data as unknown as SeatParliamentary[];
}
