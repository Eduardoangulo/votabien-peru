"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Users, Columns, Building2, Scale } from "lucide-react";
import { ElectoralProcess, Executive } from "@/interfaces/politics";
import { calcularDiasRestantes, formatFechaPeru } from "@/lib/utils/date";
import YouTubeVideoDialog from "@/components/youtube-video-dialog";

// ============= INTERFACES =============

interface HeroDualSplitProps {
  proceso_electoral: ElectoralProcess;
  ejecutivos?: Executive[];
}

type TabType = "ejecutivo" | "legislativo" | "judicial";

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
  const [activeTab, setActiveTab] = useState<TabType>("legislativo");
  const { diasRestantes, fechaFormateada } = useCountdown(
    proceso_electoral.election_date,
  );

  // Filtrar datos del ejecutivo
  const presidente = ejecutivos.find((m) => m.role === "Presidente");
  const vicepresidente = ejecutivos.find((m) => m.role === "Vicepresidente");
  const primerMinistro = ejecutivos.find((m) => m.role === "Primer_ministro");
  const ministros = ejecutivos.filter((m) => m.role === "Ministro").slice(0, 4);

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
    <section className="relative w-full md:h-[calc(100vh-4rem)] overflow-hidden rounded-md border border-border/40 flex flex-col">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-primary/20 to-black/30 mix-blend-multiply" />

            {/* Imagen izquierda - con tinte azul institucional */}
            <div className="absolute top-0 left-0 w-full h-1/2 md:w-1/2 md:h-full">
              <Image
                src="/images/hero-left.jpg"
                alt="Poder Ejecutivo"
                fill
                className="object-cover object-center brightness-[0.6] contrast-[1.1] saturate-[0.8]"
                priority
              />
              <div className="absolute inset-0 bg-primary/30 mix-blend-multiply" />
            </div>

            {/* Imagen derecha */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 md:top-0 md:left-1/2 md:w-1/2 md:h-full">
              <Image
                src="/images/hero-right.jpg"
                alt="Gabinete Ministerial"
                fill
                className="object-cover object-center brightness-[0.65] contrast-[1.05] saturate-[0.9]"
                priority
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/70 via-transparent to-black/70" />
            <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============= TABS FLOTANTES ============= */}
      <div className="relative z-20 pt-6 px-4">
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

                  {/* Indicador activo */}
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

      {/* ============= HEADER CENTRAL ============= */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-8 md:py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === "legislativo" && (
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
          )}

          {activeTab === "ejecutivo" && (
            <motion.div
              key="ejecutivo-header"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-center bg-gradient-to-r from-primary via-white to-info bg-clip-text text-transparent drop-shadow-2xl">
                Poder Ejecutivo del Perú
              </h1>
              <p className="mt-4 text-base md:text-lg text-white/80 max-w-2xl mx-auto font-medium drop-shadow">
                Conoce a quienes lideran el gobierno de la nación.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ============= CONTENIDO SEGÚN TAB ============= */}
      <div className="relative z-10 flex flex-col md:flex-row">
        <AnimatePresence mode="wait">
          {/* ============= TAB LEGISLATIVO ============= */}
          {activeTab === "legislativo" && (
            <motion.div
              key="legislativo-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col md:flex-row w-full"
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

                    <YouTubeVideoDialog
                      videoId="66mCo_zW_sk"
                      buttonText="Entiende el Cambio"
                      buttonIcon={<ArrowRight className="w-4 h-4" />}
                      autoplay={true}
                    />
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
              className="flex flex-col md:flex-row w-full"
            >
              {/* PANEL IZQUIERDO - Presidente */}
              <div className="relative w-full md:w-1/2 flex overflow-hidden group border-r border-white/10">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-primary/40 to-transparent" />

                <div className="relative z-10 flex flex-col justify-end w-full h-full text-white p-6 md:p-8 min-h-[45vh]">
                  {presidente ? (
                    <div className="md:max-w-md ml-auto text-center md:text-right flex flex-col items-center md:items-end">
                      {/* Imagen del presidente */}
                      <div className="relative w-24 h-24 md:w-54 md:h-54 mb-3 rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-2xl">
                        {presidente.person.image_url && (
                          <Image
                            src={presidente.person.image_url}
                            alt={presidente.person.fullname}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>

                      <span className="inline-flex items-center bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-2.5 py-1 text-[14px] font-bold text-white/80 mb-2">
                        {presidente.role.toUpperCase()}
                      </span>

                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight">
                        {presidente.person.fullname}
                      </h3>
                      {/* <p className="text-sm text-white/80 mb-1">
                        {presidente.person.profession}
                      </p> */}
                      <p className="text-xs text-white/60 mb-3">
                        Desde {formatFechaPeru(presidente.start_date)}
                      </p>

                      <Link
                        href={`/ejecutivo/${presidente.id}`}
                        className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-shadow shadow-lg"
                      >
                        Ver Perfil Completo
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center text-white/60">
                      No hay datos del presidente
                    </div>
                  )}
                </div>
              </div>

              {/* PANEL DERECHO - Gabinete */}
              <div className="relative w-full md:w-1/2 flex overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                <div className="relative z-10 flex flex-col justify-end w-full h-full text-white p-6 md:p-8 min-h-[45vh]">
                  <div className="md:max-w-md mr-auto text-center md:text-left flex flex-col items-center md:items-start w-full">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                      Gabinete Ministerial
                    </h3>

                    {/* Vicepresidente y Premier */}
                    <div className="w-full space-y-2 mb-3">
                      {vicepresidente && (
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all cursor-pointer group">
                          <div className="relative w-14 h-16 rounded-lg overflow-hidden ring-2 ring-white/20 flex-shrink-0 bg-black/20">
                            {vicepresidente.person.image_url && (
                              <Image
                                src={vicepresidente.person.image_url}
                                alt={vicepresidente.person.fullname}
                                fill
                                className="object-cover object-top scale-125 group-hover:scale-130 transition-transform duration-300"
                              />
                            )}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="font-semibold text-xs text-white mb-0.5 line-clamp-2 leading-tight">
                              {vicepresidente.person.fullname}
                            </p>
                            <p className="text-[10px] text-white/70">
                              Vicepresidente
                            </p>
                          </div>
                        </div>
                      )}

                      {primerMinistro && (
                        <div className="flex items-center gap-3 p-1 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all cursor-pointer group">
                          <div className="relative w-28 h-32 md:w-14 md:h-16 rounded-lg overflow-hidden ring-2 ring-white/20 flex-shrink-0 bg-black/20">
                            {primerMinistro.person.image_url && (
                              <Image
                                src={primerMinistro.person.image_url}
                                alt={primerMinistro.person.fullname}
                                fill
                                className="object-cover object-top scale-125 group-hover:scale-130 transition-transform duration-300"
                              />
                            )}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="font-semibold text-xs text-white mb-0.5 line-clamp-2 leading-tight">
                              {primerMinistro.person.fullname}
                            </p>
                            <p className="text-[10px] text-white/70">
                              Pres. Consejo de Ministros
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Grid de Ministros */}
                    {ministros.length > 0 && (
                      <>
                        <p className="text-[14px] text-white/70 mb-2 w-full">
                          Principales Ministros
                        </p>
                        <div className="grid grid-cols-2 gap-2 w-full mb-3">
                          {ministros.map((ministro) => (
                            <div
                              key={ministro.id}
                              className="flex items-center gap-2 p-1 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all cursor-pointer group"
                            >
                              <div className="relative w-28 h-32 md:w-12 md:h-14 rounded-lg overflow-hidden ring-2 ring-white/20 flex-shrink-0 bg-black/20">
                                {ministro.person.image_url && (
                                  <Image
                                    src={ministro.person.image_url}
                                    alt={ministro.person.fullname}
                                    fill
                                    className="object-cover object-top scale-125 group-hover:scale-130 transition-transform duration-300"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[10px] text-white mb-0.5 line-clamp-2 leading-tight">
                                  {ministro.person.fullname
                                    .split(" ")
                                    .slice(0, 3)
                                    .join(" ")}
                                </p>
                                <p className="text-[9px] text-white/70 line-clamp-1">
                                  {ministro.ministry}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <Link
                      href="/ejecutivo"
                      className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-shadow shadow-lg w-full md:w-auto justify-center"
                    >
                      Ver Gabinete Completo
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
