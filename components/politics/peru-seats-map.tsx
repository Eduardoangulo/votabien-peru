"use client";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users, Info } from "lucide-react";
import { SeatsByDistrict } from "@/interfaces/politics";

// Tipos para GeoJSON
interface GeoJSONGeometry {
  type: string;
  coordinates: number[][] | number[][][] | number[][][][];
}

interface GeoJSONFeature {
  type: "Feature";
  properties: {
    NOMBDEP: string;
    [key: string]: unknown;
  };
  geometry: GeoJSONGeometry;
}

interface GeoJSONData {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

type Bounds = [[number, number], [number, number]];
type Coordinate = [number, number];
type CoordinateArray = number[] | number[][] | number[][][] | number[][][][];

interface PeruSeatsMapSimpleProps {
  partyName: string;
  partyColor: string;
  seatsByDistrict: SeatsByDistrict[];
  totalSeats: number;
}

export function PeruSeatsMapSimple({
  partyName,
  partyColor,
  seatsByDistrict,
  totalSeats,
}: PeruSeatsMapSimpleProps) {
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const response = await fetch("/peru-dep.geojson");
        const data = (await response.json()) as GeoJSONData;
        setGeoData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
        setLoading(false);
      }
    };

    loadGeoJSON();
  }, []);

  const normalize = (str: string): string =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const getDistrictData = (
    districtName: string,
  ): SeatsByDistrict | undefined => {
    return seatsByDistrict.find(
      (d) => normalize(d.district_name) === normalize(districtName),
    );
  };

  const getDistrictColor = (districtName: string): string => {
    const data = getDistrictData(districtName);
    if (!data || data.seats === 0) return "#E5E7EB";

    const maxSeats = Math.max(...seatsByDistrict.map((d) => d.seats));
    const intensity = data.seats / maxSeats;

    const hex = partyColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    return `rgba(${r}, ${g}, ${b}, ${0.3 + intensity * 0.7})`;
  };

  const calculateBounds = (): Bounds => {
    if (!geoData)
      return [
        [0, 0],
        [1, 1],
      ];

    let minLon = Infinity,
      minLat = Infinity;
    let maxLon = -Infinity,
      maxLat = -Infinity;

    geoData.features.forEach((feature) => {
      const coords = feature.geometry.coordinates;
      const flattenCoords = (c: CoordinateArray): void => {
        if (typeof c[0] === "number") {
          minLon = Math.min(minLon, c[0] as number);
          maxLon = Math.max(maxLon, c[0] as number);
          minLat = Math.min(minLat, c[1] as number);
          maxLat = Math.max(maxLat, c[1] as number);
        } else {
          (c as CoordinateArray[]).forEach(flattenCoords);
        }
      };
      flattenCoords(coords);
    });

    return [
      [minLon, minLat],
      [maxLon, maxLat],
    ];
  };

  const projectCoordinates = (
    coordinates: CoordinateArray,
    bounds: Bounds,
  ): CoordinateArray => {
    const [[minLon, minLat], [maxLon, maxLat]] = bounds;
    const width = 800;
    const height = 1000;

    const scale = Math.min(
      width / (maxLon - minLon),
      height / (maxLat - minLat),
    );

    const project = ([lon, lat]: Coordinate): Coordinate => {
      const x = (lon - minLon) * scale;
      const y = (maxLat - lat) * scale;
      return [x, y];
    };

    const processCoords = (coords: CoordinateArray): CoordinateArray => {
      if (typeof coords[0] === "number") {
        return project(coords as Coordinate);
      }
      return (coords as CoordinateArray[]).map(
        processCoords,
      ) as CoordinateArray;
    };

    return processCoords(coordinates);
  };

  const normalizePolygon = (coords: CoordinateArray): number[][][] => {
    if (
      Array.isArray(coords[0]) &&
      Array.isArray(coords[0][0]) &&
      typeof coords[0][0][0] === "number"
    ) {
      // Polygon
      return coords as number[][][];
    }
    // MultiPolygon: combinar todos los polígonos en uno solo array
    return (coords as number[][][][]).flat();
  };

  const coordinatesToPath = (coordinates: CoordinateArray): string => {
    const normalized = normalizePolygon(coordinates);
    if (!normalized || !normalized.length) return "";

    const rings = normalized.map((ring) => {
      const points = ring
        .map(
          ([x, y], i) =>
            `${i === 0 ? "M" : "L"} ${x.toFixed(2)},${y.toFixed(2)}`,
        )
        .join(" ");
      return points + " Z";
    });

    return rings.join(" ");
  };

  const getCentroid = (coordinates: CoordinateArray): Coordinate | null => {
    let totalX = 0,
      totalY = 0,
      totalPoints = 0;

    const addPoints = (coords: CoordinateArray): void => {
      if (typeof coords[0] === "number") {
        totalX += coords[0] as number;
        totalY += coords[1] as number;
        totalPoints++;
      } else {
        (coords as CoordinateArray[]).forEach(addPoints);
      }
    };

    addPoints(coordinates);
    return totalPoints > 0
      ? [totalX / totalPoints, totalY / totalPoints]
      : null;
  };

  const districtsWithSeats = seatsByDistrict.filter((d) => d.seats > 0).length;
  const hoveredData = hoveredDistrict ? getDistrictData(hoveredDistrict) : null;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!geoData || seatsByDistrict.length === 0) {
    return null;
  }

  const bounds = calculateBounds();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Representación Electoral por Departamento
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Escaños obtenidos en las elecciones congresales
          </p>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Resultados Electorales
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Este mapa muestra los escaños que {partyName} obtuvo en cada
              departamento electoral según los resultados oficiales de las
              elecciones congresales.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Total de Escaños</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalSeats}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-medium">Departamentos</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {districtsWithSeats}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Porcentaje Nacional</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {((totalSeats / 130) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">del Congreso</p>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/0 rounded-xl p-6 border border-border">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SVG Map */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm">
              <svg
                viewBox="0 0 800 1000"
                className="w-full h-auto"
                style={{ maxHeight: "700px" }}
              >
                <defs>
                  <filter id="shadow">
                    <feDropShadow
                      dx="0"
                      dy="2"
                      stdDeviation="3"
                      floodOpacity="0.3"
                    />
                  </filter>
                </defs>

                {geoData.features.map((feature, idx) => {
                  const districtName = feature.properties.NOMBDEP;
                  const data = getDistrictData(districtName);
                  const seats = data?.seats || 0;

                  const projectedCoords = projectCoordinates(
                    feature.geometry.coordinates,
                    bounds,
                  );
                  const pathData = coordinatesToPath(projectedCoords);
                  const centroid = getCentroid(projectedCoords);

                  return (
                    <g key={idx}>
                      <path
                        d={pathData}
                        fill={getDistrictColor(districtName)}
                        stroke="#1F2937"
                        strokeWidth="1.5"
                        className="cursor-pointer transition-all duration-200"
                        style={{
                          filter:
                            hoveredDistrict === districtName
                              ? "url(#shadow) brightness(1.15)"
                              : "none",
                          strokeWidth:
                            hoveredDistrict === districtName ? "2.5" : "1.5",
                        }}
                        onMouseEnter={() => setHoveredDistrict(districtName)}
                        onMouseLeave={() => setHoveredDistrict(null)}
                      />
                      {seats > 0 && centroid && (
                        <text
                          x={centroid[0]}
                          y={centroid[1]}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-4xl font-bold pointer-events-none select-none"
                          fill="#1F2937"
                          stroke="white"
                          strokeWidth="3"
                          paintOrder="stroke"
                        >
                          {seats}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Hover tooltip */}
            {hoveredData && (
              <div className="mt-4 bg-card border-2 border-primary rounded-lg p-4 shadow-lg">
                <h4 className="font-bold text-lg text-foreground mb-2">
                  {hoveredData.district_name}
                </h4>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Escaños obtenidos:
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: partyColor }}
                  >
                    {hoveredData.seats}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm text-foreground mb-3">
                Leyenda
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: partyColor, opacity: 1 }}
                  />
                  <span className="text-xs text-muted-foreground">
                    Mayor concentración
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: partyColor, opacity: 0.5 }}
                  />
                  <span className="text-xs text-muted-foreground">
                    Concentración media
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-200" />
                  <span className="text-xs text-muted-foreground">
                    Sin representación
                  </span>
                </div>
              </div>
            </div>

            {/* Top Districts */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm text-foreground mb-3">
                Principales Departamentos
              </h4>
              <div className="space-y-2">
                {[...seatsByDistrict]
                  .sort((a, b) => b.seats - a.seats)
                  .slice(0, 5)
                  .map((district) => (
                    <div
                      key={district.district_code}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-foreground truncate">
                        {district.district_name}
                      </span>
                      <Badge variant="secondary" className="ml-2">
                        {district.seats}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
