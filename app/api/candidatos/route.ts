import { NextRequest, NextResponse } from "next/server";
import { publicApi } from "@/lib/public-api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params = {
      type: searchParams.get("type") || undefined,
      search: searchParams.get("search") || undefined,
      districts:
        searchParams.getAll("districts").length > 0
          ? searchParams.getAll("districts")
          : undefined,
      skip: parseInt(searchParams.get("skip") || "0"),
      limit: parseInt(searchParams.get("limit") || "10"),
    };

    const candidatos = await publicApi.getCandidaturas(params);

    return NextResponse.json(candidatos);
  } catch (error) {
    console.error("Error en API route:", error);
    return NextResponse.json(
      { error: "Error al obtener candidatos" },
      { status: 500 },
    );
  }
}
