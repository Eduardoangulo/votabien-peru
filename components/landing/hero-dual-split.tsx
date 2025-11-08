"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Users,
  Columns,
  Building2,
  Scale,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Executive } from "@/interfaces/politics";

// ============= INTERFACES =============

interface ElectoralProcess {
  election_date?: string;
}

interface HeroDualSplitProps {
  proceso_electoral: ElectoralProcess;
  ejecutivos?: Executive[];
}

type TabType = "ejecutivo" | "legislativo" | "judicial";

// ============= UTILIDADES =============
const calcularDiasRestantes = (fecha: string) => {
  const hoy = new Date();
  const fechaObjetivo = new Date(fecha);
  const diferencia = fechaObjetivo.getTime() - hoy.getTime();
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};

const formatFechaPeru = (fecha: string) => {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ============= HOOKS =============
const useCountdown = (fechaElecciones?: string) => {
  const [diasRestantes, setDiasRestantes] = useState(() =>
    fechaElecciones ? calcularDiasRestantes(fechaElecciones) : 0,
  );

  useEffect(() => {
    if (!fechaElecciones) return;

    const intervalo = setInterval(
      () => {
        setDiasRestantes(calcularDiasRestantes(fechaElecciones));
      },
      1000 * 60 * 60 * 24,
    );

    return () => clearInterval(intervalo);
  }, [fechaElecciones]);

  const fechaFormateada = useMemo(
    () =>
      fechaElecciones
        ? formatFechaPeru(fechaElecciones)
        : "Fecha no disponible",
    [fechaElecciones],
  );

  return { diasRestantes, fechaFormateada };
};

// ============= COMPONENTE PRINCIPAL =============
export default function HeroDualSplit({
  proceso_electoral,
  ejecutivos = [],
}: HeroDualSplitProps) {
  const [activeTab, setActiveTab] = useState<TabType>("ejecutivo");
  const { diasRestantes, fechaFormateada } = useCountdown(
    proceso_electoral.election_date,
  );
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filtrar datos del ejecutivo
  const presidente = ejecutivos.find((m) => m.role === "Presidente");
  const vicepresidente = ejecutivos.find((m) => m.role === "Vicepresidente");
  const primerMinistro = ejecutivos.find((m) => m.role === "Primer_ministro");
  const ministros = ejecutivos.filter((m) => m.role === "Ministro");

  // Funciones de navegación del carousel
  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 200;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Configuración de tabs
  const tabs = [
    {
      id: "ejecutivo" as TabType,
      label: "Ejecutivo",
      icon: Building2,
      disabled: false,
    },
    {
      id: "legislativo" as TabType,
      label: "Legislativo",
      icon: Users,
      disabled: false,
    },
    {
      id: "judicial" as TabType,
      label: "Judicial",
      icon: Scale,
      disabled: true,
    },
  ];

  return (
    <section className="relative w-full md:h-[calc(100vh-4rem)] overflow-hidden rounded-md border border-border/40 flex flex-col bg-background">
      {/* ============= FONDOS SEGÚN TAB ============= */}
      <AnimatePresence mode="wait">
        {activeTab === "legislativo" && (
          <motion.div
            key="legislativo-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-green-500 via-transparent to-black/20 mix-blend-multiply" />

            {/* Imagen izquierda */}
            <div className="absolute top-0 left-0 w-full h-1/2 md:w-1/2 md:h-full">
              <Image
                src="/images/hero-left.jpg"
                alt="Congreso actual"
                fill
                className="object-cover object-center grayscale-[1] brightness-[0.55] contrast-[1.1]"
                priority
              />
            </div>

            {/* Imagen derecha */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 md:top-0 md:left-1/2 md:w-1/2 md:h-full">
              <Image
                src="/images/hero-right.jpg"
                alt="Nuevo Congreso 2026"
                fill
                className="object-cover object-center saturate-[1.15] brightness-[0.65] contrast-[1.05]"
                priority
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/60 via-transparent to-black/60" />
            <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-white/5 blur-3xl rounded-full pointer-events-none" />
          </motion.div>
        )}

        {activeTab === "ejecutivo" && (
          <motion.div
            key="ejecutivo-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0"
          >
            {/* Degradado moderno institucional */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-black" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-blue-500/20" />
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 blur-3xl rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full" />
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============= TABS FLOTANTES (FIXED) ============= */}
      <div className="relative z-10 pt-6 px-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`
                    relative px-6 py-2.5 rounded-xl font-semibold text-sm
                    transition-all duration-300 flex items-center gap-2
                    ${
                      isActive
                        ? "bg-white/20 text-white shadow-lg"
                        : tab.disabled
                          ? "text-white/30 cursor-not-allowed"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white/10 rounded-xl border border-white/20"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============= HEADER CENTRAL (SOLO LEGISLATIVO) ============= */}
      {activeTab === "legislativo" && (
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-8 md:py-12 flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            key="legislativo-header"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-center bg-gradient-to-r from-primary via-white to-warning bg-clip-text text-transparent drop-shadow-2xl">
              2026: El Año del Cambio Democrático
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/80 max-w-2xl mx-auto font-medium drop-shadow">
              Del Congreso Unicameral al nuevo Sistema Bicameral.
            </p>
            <p className="mt-2 text-sm text-white font-semibold">
              Elecciones el <span>{fechaFormateada}</span> —{" "}
              <span className="text-warning font-bold">{diasRestantes}</span>{" "}
              días restantes.
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* ============= CONTENIDO SEGÚN TAB ============= */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ============= TAB LEGISLATIVO ============= */}
          {activeTab === "legislativo" && (
            <motion.div
              key="legislativo-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col md:flex-row w-full h-full"
            >
              {/* PANEL IZQUIERDO - Congreso */}
              <div className="relative w-full md:w-1/2 flex overflow-hidden group border-r border-white/10">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

                <div className="relative z-10 flex flex-col justify-end w-full h-full text-white p-6 md:p-10 min-h-[45vh]">
                  <div className="md:max-w-md ml-auto text-center md:text-right flex flex-col items-center md:items-end">
                    <div className="w-16 h-16 mb-6 rounded-2xl flex items-center justify-center bg-white/10 border border-white/20 backdrop-blur-sm">
                      <Users className="w-8 h-8 text-white" />
                    </div>

                    <span className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-xs font-bold text-white/80 mb-4">
                      ACTUAL
                    </span>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Congreso 2021-2026
                    </h3>
                    <p className="text-base text-white/80 mb-4">
                      Sistema Unicameral
                    </p>

                    <div className="w-full max-w-sm space-y-2 mb-6">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
                        <span className="text-sm text-white/90">
                          Cámara Única
                        </span>
                        <span className="text-2xl font-bold text-white">
                          130
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/legisladores"
                      className="relative inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-shadow shadow-lg"
                    >
                      Ver Congresistas Actuales
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* PANEL DERECHO - Bicameral */}
              <div className="relative w-full md:w-1/2 flex overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-primary/30 to-transparent" />

                <div className="relative z-10 flex flex-col justify-end w-full h-full text-white p-6 md:p-10 min-h-[45vh]">
                  <div className="md:max-w-md mr-auto text-center md:text-left flex flex-col items-center md:items-start">
                    <div className="w-16 h-16 mb-6 rounded-2xl flex items-center justify-center bg-warning/20 border border-warning/30 backdrop-blur-sm">
                      <Columns className="w-8 h-8 text-warning" />
                    </div>

                    <span className="inline-flex items-center bg-warning/20 backdrop-blur-sm border border-warning/30 rounded-full px-3 py-1 text-xs font-bold text-warning mb-4">
                      DESDE 2026
                    </span>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Nuevo Congreso 2026
                    </h3>
                    <p className="text-base text-warning mb-4">
                      Sistema Bicameral
                    </p>

                    <div className="w-full max-w-sm space-y-2 mb-6">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
                        <div className="text-sm font-semibold">
                          <span className="text-info">60 Senadores</span>
                          <span className="text-white/80"> + </span>
                          <span className="text-warning">130 Diputados</span>
                        </div>
                        <span className="text-2xl font-bold text-white">
                          190
                        </span>
                      </div>
                    </div>

                    <button className="relative inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-warning text-black font-semibold hover:bg-warning/90 transition-shadow shadow-lg">
                      Entiende el Cambio
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============= TAB EJECUTIVO ============= */}
          {activeTab === "ejecutivo" && (
            <motion.div
              key="ejecutivo-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col md:flex-row w-full h-full overflow-hidden"
            >
              {/* Título centrado entre ambos paneles */}
              <div className="absolute top-6 md:top-12 left-1/2 -translate-x-1/2 z-30 text-center px-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary via-white to-info bg-clip-text text-transparent drop-shadow-2xl leading-tight">
                  Poder Ejecutivo del Perú
                </h1>
              </div>

              {/* ========== PANEL IZQUIERDO - PRESIDENTE ========== */}
              <div className="relative w-full md:w-1/2 h-full overflow-hidden border-white/10 min-h-[50vh] flex flex-col">
                {/* Contenedor de imagen con altura limitada */}
                {presidente?.person.image_url && (
                  <div className="absolute inset-x-0 bottom-0 h-[70%] md:h-[75%]">
                    <Image
                      src={presidente.person.image_url}
                      alt={presidente.person.fullname}
                      fill
                      className="object-cover object-top"
                      priority
                    />
                    {/* Borde superior con degradado que hace sync con el background */}
                    <div className="absolute inset-x-0 top-0 h-12 md:h-24 bg-gradient-to-b from-blue-950 via-slate-900/80 to-transparent" />
                    {/* Bordes laterales con degradado */}
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-blue-950 via-slate-900/40 to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-blue-950/60 to-transparent" />
                  </div>
                )}

                <div className="relative z-10 mt-auto p-6 md:p-8 lg:p-10 flex-shrink-0">
                  {presidente ? (
                    <div className="text-center md:text-right flex flex-col items-center md:items-end space-y-2 md:space-y-3 max-w-md ml-auto">
                      {/* Badge del rol */}
                      <span className="inline-flex items-center bg-primary/40 backdrop-blur-xl border border-primary/50 rounded-full px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-xs font-semibold text-white shadow-[0_2px_10px_rgba(0,0,0,0.4)] uppercase tracking-wider">
                        {presidente.role}
                      </span>

                      {/* Nombre del presidente */}
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight [text-shadow:_0_3px_10px_rgba(0,0,0,0.9)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]">
                        {presidente.person.fullname}
                      </h3>

                      {/* Fecha */}
                      <p className="text-xs md:text-sm text-white/90 backdrop-blur-md font-medium tracking-wide [text-shadow:_0_2px_6px_rgba(0,0,0,0.8)]">
                        Desde {formatFechaPeru(presidente.start_date)}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center text-white/60">
                      No hay datos del presidente
                    </div>
                  )}
                </div>
              </div>

              {/* ========== PANEL DERECHO - GABINETE (CORREGIDO) ========== */}
              <div className="relative w-full md:w-1/2 h-full overflow-hidden">
                <div className="relative z-10 h-full flex flex-col px-4 md:px-6 lg:px-8 justify-end pb-0">
                  <h3 className="text-lg font-bold text-white py-2">
                    Gabinete Ministerial
                  </h3>

                  {/* Primer Ministro destacado */}
                  <div className="flex-shrink-0">
                    {primerMinistro && (
                      <div className="group cursor-pointer">
                        <div className="md:hidden flex gap-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                          <div className="relative w-24 h-32 rounded-xl overflow-hidden ring-2 ring-white/20 flex-shrink-0 bg-gradient-to-b from-gray-800 to-black">
                            {primerMinistro.person.image_url && (
                              <Image
                                src={primerMinistro.person.image_url}
                                alt={primerMinistro.person.fullname}
                                fill
                                className="object-cover object-top scale-180"
                              />
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <span className="inline-block w-fit bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-2.5 py-0.5 text-xs font-bold text-white/80 mb-2">
                              PRIMER MINISTRO
                            </span>
                            <p className="font-bold text-sm text-white mb-1 leading-tight">
                              {primerMinistro.person.fullname}
                            </p>
                            {primerMinistro.ministry && (
                              <p className="text-xs lg:text-xs text-white/50 mt-1">
                                {primerMinistro.ministry}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="hidden md:flex items-center gap-4 lg:gap-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm hover:from-white/15 hover:to-white/10 hover:border-white/30 hover:scale-[1.02] transition-all duration-500 shadow-xl">
                          <div className="relative w-28 lg:w-32 xl:w-36 h-40 lg:h-38 rounded-xl overflow-hidden ring-2 ring-white/30 shadow-2xl flex-shrink-0 bg-gradient-to-b from-gray-700 to-gray-900">
                            {primerMinistro.person.image_url && (
                              <Image
                                src={primerMinistro.person.image_url}
                                alt={primerMinistro.person.fullname}
                                fill
                                className="object-cover object-[center_top_70%] scale-140 transition-transform duration-700"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                          <div className="flex-1 space-y-2 lg:space-y-2.5 pr-2">
                            <span className="inline-block bg-primary/25 backdrop-blur-sm border border-primary/40 rounded-full px-3 py-1 text-xs lg:text-xs font-bold text-white shadow-lg uppercase tracking-wider">
                              Primer Ministro
                            </span>
                            <h4 className="text-base lg:text-lg xl:text-xl font-bold text-white leading-tight">
                              {primerMinistro.person.fullname}
                            </h4>

                            {primerMinistro.ministry && (
                              <p className="text-xs lg:text-xs text-white/50 mt-1">
                                {primerMinistro.ministry}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Carrusel de ministros - CORREGIDO */}
                  {ministros.length > 0 && (
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-between py-2 flex-shrink-0">
                        <p className="text-sm md:text-base text-white/70 font-medium">
                          Ministros
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => scrollCarousel("left")}
                            className="p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
                            aria-label="Anterior"
                          >
                            <ChevronLeft className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => scrollCarousel("right")}
                            className="p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
                            aria-label="Siguiente"
                          >
                            <ChevronRight className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <div
                          ref={carouselRef}
                          className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            WebkitOverflowScrolling: "touch",
                          }}
                        >
                          {ministros.map((ministro) => (
                            <div
                              key={ministro.id}
                              className="snap-center flex-shrink-0 w-[175px]"
                            >
                              <div className="block group h-[280px]">
                                <div
                                  className="rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 backdrop-blur-sm 
                      hover:from-white/12 hover:to-white/6 hover:border-white/20 transition-all duration-300 
                      h-full flex flex-col shadow-lg hover:shadow-xl overflow-hidden"
                                >
                                  {/* Imagen */}
                                  <div
                                    className="relative w-full h-36 md:h-40 rounded-xl overflow-hidden ring-2 ring-white/20 
                        bg-gradient-to-b from-gray-700 to-gray-900 flex-shrink-0"
                                  >
                                    {ministro.person.image_url && (
                                      <Image
                                        src={ministro.person.image_url}
                                        alt={ministro.person.fullname}
                                        fill
                                        className="object-cover object-[center_top_70%] group-hover:scale-110 transition-transform duration-500"
                                      />
                                    )}
                                    <div
                                      className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300"
                                    />
                                  </div>

                                  {/* Texto */}
                                  <div className="flex flex-col flex-1 min-w-0 px-2 py-2 text-center overflow-hidden">
                                    <p
                                      className="text-sm md:text-md font-semibold text-white group-hover:text-primary 
                       transition-colors duration-300 whitespace-normal break-words leading-tight"
                                    >
                                      {ministro.person.fullname}
                                    </p>
                                    <p className="text-xs md:text-sm text-white/70 whitespace-normal break-words leading-snug">
                                      {ministro.ministry}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
