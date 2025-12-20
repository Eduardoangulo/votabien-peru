"use server";

import { LegislatorCard } from "@/interfaces/legislator";
import { ChamberType } from "@/interfaces/politics";
import { createClient } from "@/lib/supabase/server";
interface GetLegislatorsParams {
  active_only?: boolean;
  chamber?: string;
  groups?: string[];
  districts?: string[];
  search?: string;
  ids?: string[];
  page?: number;
  pageSize?: number;
}

export async function getLegisladoresCards({
  active_only = true,
  chamber,
  groups,
  districts,
  search,
  ids,
  page = 1,
  pageSize = 30,
}: GetLegislatorsParams): Promise<LegislatorCard[]> {
  const supabase = await createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Nota: 'current_parliamentary_group'
  // ahora se pide como si fuera una columna
  // ya que es una funcion SQL en db
  let query = supabase
    .from("legislator")
    .select(
      `
      id,
      chamber,
      condition,
      active,
      start_date,
      end_date,
      person:person_id!inner ( id, fullname, image_url, profession ),
      electoral_district:electoral_district_id ( id, name, code ),
      elected_by_party:elected_by_party_id ( id, name, acronym ),
      current_parliamentary_group
    `,
    )
    .range(from, to);

  if (active_only) query = query.eq("active", true);
  if (chamber) query = query.eq("chamber", chamber);
  if (ids && ids.length > 0) query = query.in("id", ids);

  if (search) {
    query = query.ilike("person.fullname", `%${search}%`);
  }

  if (districts && districts.length > 0) {
    query = query.in("electoral_district.name", districts);
  }

  if (groups && groups.length > 0) {
    query = query
      .not("parliamentarymembership.id", "is", null)
      .is("parliamentarymembership.end_date", null)
      .or(
        `name.in.(${groups.map((g) => `"${g}"`).join(",")}),acronym.in.(${groups.map((g) => `"${g}"`).join(",")})`,
        {
          foreignTable: "parliamentarymembership.parliamentarygroup",
        },
      );
  }

  query = query.order("lastname", { foreignTable: "person", ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching legislators:", error);
    throw new Error("Error al obtener legisladores");
  }
  const rawLegislators = data as unknown as LegislatorCard[];
  if (!rawLegislators || rawLegislators.length === 0) return [];

  const legislatorIds = rawLegislators.map((l) => l.id);
  const { data: metricsData } = await supabase
    .from("legislatormetrics")
    .select("legislator_id")
    .in("legislator_id", legislatorIds);

  const metricsSet = new Set(metricsData?.map((m) => m.legislator_id));

  const results: LegislatorCard[] = rawLegislators.map((leg) => {
    return {
      id: leg.id,
      chamber: leg.chamber as ChamberType,
      condition: leg.condition,
      active: leg.active,
      start_date: leg.start_date,
      end_date: leg.end_date,
      person: {
        id: leg.person.id,
        fullname: leg.person.fullname,
        image_url: leg.person.image_url,
        profession: leg.person.profession,
      },
      elected_by_party: {
        id: leg.elected_by_party.id,
        name: leg.elected_by_party.name,
        acronym: leg.elected_by_party.acronym,
        logo_url: leg.elected_by_party.logo_url ?? null,
        color_hex: leg.elected_by_party.color_hex,
        active: leg.elected_by_party.active,
        foundation_date: leg.elected_by_party.foundation_date ?? null,
      },
      electoral_district: {
        id: leg.electoral_district.id,
        name: leg.electoral_district.name,
        code: leg.electoral_district.code,
        is_national: leg.electoral_district.is_national,
        num_senators: leg.electoral_district.num_senators,
        num_deputies: leg.electoral_district.num_deputies,
        active: leg.electoral_district.active,
      },
      current_parliamentary_group: leg.current_parliamentary_group,

      has_metrics: metricsSet.has(leg.id),
    };
  });

  return results;
}
