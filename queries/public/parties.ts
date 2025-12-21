"use server";

import { createClient } from "@/lib/supabase/server";
import {
  PoliticalPartyListPaginated,
  PoliticalPartyDetail,
  ElectedLegislatorBasic,
  PartyHistory,
  PartyLegalCase,
} from "@/interfaces/politics";
import {
  FinancingCategory,
  FinancingStatus,
  FlowType,
  PartyFinancingBasic,
} from "@/interfaces/party-financing";
import { Database } from "@/interfaces/supabase";

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

type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
type Views<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"];

interface LegislatorQueryResponse {
  id: string;
  person_id: string;
  condition: string;
  person: {
    fullname: string;
    image_url: string | null;
  };
  electoraldistrict: {
    name: string;
  } | null;
}

type FinancingRow = Tables<"partyfinancing">;
type SeatsViewRow = Views<"party_seats_by_district">;

export async function getPartidoById(
  partidoId: string,
): Promise<PoliticalPartyDetail> {
  const supabase = await createClient();

  const [partidoRes, seatsRes, electosRes, financingRes] = await Promise.all([
    supabase.from("politicalparty").select("*").eq("id", partidoId).single(),

    supabase
      .from("party_seats_by_district")
      .select("district_name, district_code, seats")
      .eq("elected_by_party_id", partidoId)
      .then((res) => ({ ...res, data: res.data as SeatsViewRow[] })),

    supabase
      .from("legislator")
      .select(
        `
        id, person_id, condition,
        person!inner(fullname, image_url),
        electoraldistrict(name)
      `,
      )
      .eq("elected_by_party_id", partidoId)
      .eq("active", true)
      .eq("condition", "EN_EJERCICIO")
      .order("person(fullname)", { ascending: true }),

    supabase
      .from("partyfinancing")
      .select("*")
      .eq("party_id", partidoId)
      .order("date", { ascending: false }),
  ]);

  if (partidoRes.error || !partidoRes.data) {
    console.error("Error fetching party:", partidoRes.error);
    throw new Error("Partido no encontrado");
  }

  const partido = partidoRes.data;
  return {
    ...partido,

    // Casteos
    party_timeline: (partido.party_timeline as unknown as PartyHistory[]) || [],
    legal_cases: (partido.legal_cases as unknown as PartyLegalCase[]) || [],

    // Mapeo directo
    seats_by_district: seatsRes.data || [],

    elected_legislators: electosRes.data?.map(mapLegislator) || [],
    financing_records: financingRes.data?.map(mapFinancingRecord) || [],
  };
}

// ---------------------------------------------------------
// MAPPERS TIPADOS (Adiós 'any')
// ---------------------------------------------------------

const mapFinancingRecord = (f: FinancingRow): PartyFinancingBasic => ({
  id: f.id,
  date: f.date,
  period: f.period,
  status: (f.status?.toLowerCase().replace(/_/g, "_") ||
    "unknown") as FinancingStatus,
  category: (f.category?.toLowerCase() || null) as FinancingCategory | null,
  flow_type: (f.flow_type?.toLowerCase() || null) as FlowType | null,
  amount: f.amount,
  currency: f.currency,
  source_name: f.source_name,
  source_url: f.source_url,
  notes: f.notes,
});

const mapLegislator = (
  leg: LegislatorQueryResponse,
): ElectedLegislatorBasic => ({
  id: leg.id,
  person_id: leg.person_id,
  full_name: leg.person?.fullname || "Desconocido",
  photo_url: leg.person?.image_url || null,
  district_name: leg.electoraldistrict?.name || null,
  condition: leg.condition,
});
