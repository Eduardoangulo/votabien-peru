"use client";

import { Building2, ChevronRight } from "lucide-react";
import { PoliticalPartyListPaginated } from "@/interfaces/politics";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getTextColor, needsOverlay } from "@/lib/utils/color-utils";
import { FilterField, FilterPanel } from "../ui/filter-panel";
import { SimplePagination } from "../ui/pagination";

interface PartidosListPaginatedProps {
  partidos: PoliticalPartyListPaginated;
  currentFilters: {
    search: string;
    active: string;
    limit: number;
    offset: number;
  };
}

const PartidosListPaginated = ({
  partidos,
  currentFilters,
}: PartidosListPaginatedProps) => {
  const filterFields: FilterField[] = [
    {
      id: "search",
      label: "Buscar",
      type: "search",
      placeholder: "Buscar partido por nombre o acrónimo...",
      searchPlaceholder: "Nombre o acrónimo",
      defaultValue: "",
    },
    {
      id: "active",
      label: "Estado",
      type: "select",
      placeholder: "Estado del partido",
      options: [
        { value: "all", label: "Todos" },
        { value: "true", label: "Activos" },
        { value: "false", label: "Inactivos" },
      ],
    },
  ];

  const defaultFilters = {
    search: "",
    active: "all",
    limit: 30,
    offset: 0,
  };

  const totalPages = Math.ceil(partidos.total / partidos.limit);
  const currentPage = Math.floor(partidos.offset / partidos.limit) + 1;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Partidos Políticos
        </h1>
        <p className="text-muted-foreground">Conoce la información completa</p>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <FilterPanel
          fields={filterFields}
          currentFilters={currentFilters}
          onApplyFilters={() => {}} // Se maneja por URL
          baseUrl="/partidos"
          defaultFilters={defaultFilters}
        />
      </div>

      {/* Lista de partidos */}
      {!partidos.items || partidos.items.length === 0 ? (
        <div className="text-center py-16 md:py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-md bg-muted mb-4 md:mb-6">
            <Building2 className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
            No hay partidos para mostrar
          </h3>
          <p className="text-sm md:text-base text-muted-foreground">
            No se encontraron partidos con los filtros aplicados
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {partidos.items.map((partido) => {
              const partidoColor = partido.color_hex || "oklch(0.45 0.15 260)";
              const textColor = getTextColor(partidoColor);
              const hasOverlay = needsOverlay(partidoColor);

              return (
                <Link
                  key={partido.id}
                  href={`/partidos/${partido.id}`}
                  className="group text-left w-full"
                >
                  <Card className="shadow-sm hover:shadow-xl pt-0 transition-all duration-300 border-2 hover:border-primary/50 transform hover:-translate-y-1 h-full flex flex-col overflow-hidden">
                    <CardHeader
                      className="relative overflow-hidden p-4 flex-grow"
                      style={{
                        background: `linear-gradient(135deg, ${partidoColor} 0%, ${partidoColor}dd 100%)`,
                      }}
                    >
                      {hasOverlay && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 to-gray-900/20"></div>
                      )}

                      <CardTitle className="flex items-start gap-3 relative z-10">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 md:w-18 md:h-18 bg-white rounded-lg flex items-center justify-center shadow-md overflow-hidden ring-1 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
                            {partido.logo_url ? (
                              <Image
                                src={partido.logo_url}
                                alt={partido.name}
                                width={72}
                                height={72}
                                className="object-contain p-1"
                              />
                            ) : (
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        <div className="flex-grow min-w-0">
                          {partido.acronym && (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm mb-2 backdrop-blur-sm ${
                                textColor === "text-white"
                                  ? "bg-white/20 text-white"
                                  : "bg-gray-900/20 text-gray-900"
                              }`}
                            >
                              {partido.acronym}
                            </span>
                          )}
                          <div
                            className={`text-sm md:text-base font-bold transition-colors line-clamp-3 leading-snug ${textColor} group-hover:opacity-90`}
                            style={{
                              textShadow: hasOverlay
                                ? "none"
                                : textColor === "text-white"
                                  ? "0 1px 2px rgba(0,0,0,0.1)"
                                  : "none",
                            }}
                          >
                            {partido.name}
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>

                    <CardFooter className="p-4 flex items-center justify-between border-t border-border flex-shrink-0">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                          partido.active
                            ? "bg-success/10 text-success border border-success/20"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            partido.active
                              ? "bg-success"
                              : "bg-muted-foreground"
                          }`}
                        ></span>
                        {partido.active ? "Activo" : "Inactivo"}
                      </span>

                      <span className="inline-flex items-center text-primary group-hover:text-primary/80 font-medium text-xs transition-colors">
                        Ver más
                        <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Paginación */}
          <SimplePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={partidos.total}
            itemsPerPage={partidos.limit}
            baseUrl="/partidos"
            pageSizeOptions={[10, 20, 30, 40, 50]}
            currentFilters={currentFilters}
          />
        </>
      )}
    </div>
  );
};

export default PartidosListPaginated;
