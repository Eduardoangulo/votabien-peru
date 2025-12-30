"use server";

import { createClient } from "@/lib/supabase/server";
import {
  PoliticalPartyListPaginated,
  PoliticalPartyDetail,
  ElectedLegislatorBasic,
  PartyHistory,
  PartyLegalCase,
  PoliticalPartyBase,
  GovernmentPlanSummary,
} from "@/interfaces/politics";
import {
  FinancingCategory,
  FinancingReport,
  FinancingStatus,
  FlowType,
  PartyFinancingBasic,
} from "@/interfaces/party-financing";
import { Database } from "@/interfaces/supabase";

export async function getPartidosListSimple({
  active,
}: {
  active: boolean;
}): Promise<PoliticalPartyBase[]> {
  const supabase = await createClient();
  const TABLE_NAME = "politicalparty";
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(
        `
        id, name, acronym, logo_url, color_hex, active, foundation_date
        `,
      )
      .eq("active", active)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error al obtener partidos:", error);
      throw new Error(`Error al obtener partidos: ${error.message}`);
    }

    return data as unknown as PoliticalPartyBase[];
  } catch (error) {
    console.error("Error en getPartidosListSimple:", error);
    throw error;
  }
}

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

type FinancingReportRow = Tables<"financingreports">;
type FinancingTransactionRow = Tables<"partyfinancing">;
type SeatsViewRow = Views<"party_seats_by_district">;

interface FinancingReportQueryResponse extends FinancingReportRow {
  transactions: FinancingTransactionRow[];
}

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

    // ✅ NUEVO QUERY: Obtener reportes con sus transacciones
    supabase
      .from("financingreports")
      .select(
        `
        *,
        transactions:partyfinancing(*)
      `,
      )
      .eq("party_id", partidoId)
      .order("report_date", { ascending: false }),
  ]);

  if (partidoRes.error || !partidoRes.data) {
    console.error("Error fetching party:", partidoRes.error);
    throw new Error("Partido no encontrado");
  }

  const partido = partidoRes.data;
  return {
    ...partido,
    party_timeline: (partido.party_timeline as unknown as PartyHistory[]) || [],
    legal_cases: (partido.legal_cases as unknown as PartyLegalCase[]) || [],
    government_plan_summary:
      (partido.government_plan_summary as unknown as GovernmentPlanSummary[]) ||
      [],
    seats_by_district: seatsRes.data || [],
    elected_legislators: electosRes.data?.map(mapLegislator) || [],

    // ✅ NUEVO: Mapear reportes con sus transacciones
    financing_reports: financingRes.data?.map(mapFinancingReport) || [],
  };
}

// ✅ NUEVO MAPPER: Convierte el reporte con sus transacciones
const mapFinancingReport = (
  report: FinancingReportQueryResponse,
): FinancingReport => ({
  id: report.id,
  report_name: report.report_name,
  filing_status: report.filing_status as FinancingStatus,
  source_name: report.source_name,
  source_url: report.source_url,
  report_date: report.report_date,
  period_start: report.period_start,
  period_end: report.period_end,
  transactions: (report.transactions || []).map(mapTransaction),
});

// ✅ NUEVO MAPPER: Convierte las transacciones
const mapTransaction = (t: FinancingTransactionRow): PartyFinancingBasic => ({
  id: t.id,
  category: (t.category?.toLowerCase() || null) as FinancingCategory | null,
  flow_type: (t.flow_type?.toLowerCase() || null) as FlowType | null,
  amount: t.amount,
  currency: t.currency,
  notes: t.notes,
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
