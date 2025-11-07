import { NextRequest, NextResponse } from "next/server";
import { publicApi } from "@/lib/public-api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extraer parámetros
    const params = {
      active_only: true,
      chamber: searchParams.get("chamber") || undefined,
      search: searchParams.get("search") || undefined,
      groups:
        searchParams.getAll("groups").length > 0
          ? searchParams.getAll("groups")
          : undefined,
      districts:
        searchParams.getAll("districts").length > 0
          ? searchParams.getAll("districts")
          : undefined,
      skip: parseInt(searchParams.get("skip") || "0"),
      limit: parseInt(searchParams.get("limit") || "10"),
    };

    const legisladores = await publicApi.getLegisladoresCards(params);

    return NextResponse.json(legisladores);
  } catch (error) {
    console.error("Error en API route:", error);
    return NextResponse.json(
      { error: "Error al obtener legisladores" },
      { status: 500 },
    );
  }
}
