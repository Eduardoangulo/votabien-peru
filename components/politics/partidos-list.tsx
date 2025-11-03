"use client";

import { useState } from "react";
import { Building2, ChevronRight } from "lucide-react";
import PartidoDialog from "./partido-dialog";
import { PoliticalPartyDetail } from "@/interfaces/politics";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface PartidosListProps {
  partidos: PoliticalPartyDetail[];
}

const getLuminance = (color: string): number => {
  let r = 0,
    g = 0,
    b = 0;

  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else if (color.startsWith("oklch") || color.startsWith("rgb")) {
    return 0.3;
  }

  // Luminosidad relativa
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance;
};

// Determinar si necesitamos texto oscuro o claro
const getTextColor = (backgroundColor: string): string => {
  const luminance = getLuminance(backgroundColor);
  // Si la luminosidad es alta (> 0.6), usar texto oscuro
  return luminance > 0.6 ? "text-gray-900" : "text-white";
};

// Overlay si el color es muy claro
const needsOverlay = (backgroundColor: string): boolean => {
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.7;
};

const PartidosList = ({ partidos }: PartidosListProps) => {
  const [selectedPartido, setSelectedPartido] =
    useState<PoliticalPartyDetail | null>(null);
  if (!partidos || partidos.length === 0) {
    return (
      <div className="text-center py-16 md:py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-md bg-muted mb-4 md:mb-6">
          <Building2 className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
          No hay partidos para mostrar
        </h3>
        <p className="text-sm md:text-base text-muted-foreground">
          No se encontraron partidos políticos activos
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 py-4 gap-4 md:gap-6">
        {partidos.map((partido) => {
          const partidoColor = partido.color_hex || "oklch(0.45 0.15 260)";
          const textColor = getTextColor(partidoColor);
          const hasOverlay = needsOverlay(partidoColor);

          return (
            <button
              key={partido.id}
              onClick={() => setSelectedPartido(partido)}
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
                        className={`text-sm md:text-base font-bold transition-colors line-clamp-4 leading-snug ${textColor} group-hover:opacity-90`}
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
                        partido.active ? "bg-success" : "bg-muted-foreground"
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
            </button>
          );
        })}
      </div>

      {selectedPartido && (
        <PartidoDialog
          partido={selectedPartido}
          isOpen={!!selectedPartido}
          onClose={() => setSelectedPartido(null)}
        />
      )}
    </>
  );
};

export default PartidosList;
