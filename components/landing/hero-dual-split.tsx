"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Users, Columns } from "lucide-react";
import { PiYoutubeLogoFill } from "react-icons/pi";

// ============= INTERFACES =============

interface ElectoralProcess {
  election_date?: string;
}

interface HeroDualSplitProps {
  proceso_electoral: ElectoralProcess;
}

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
}: HeroDualSplitProps) {
  const { diasRestantes, fechaFormateada } = useCountdown(
    proceso_electoral.election_date,
  );

  return (
    <section className="relative w-full flex flex-col bg-background md:h-[calc(100vh-4rem)] md:max-h-[900px] overflow-hidden rounded-md border border-border/40">
      {/* ============= FONDOS ============= */}
      <AnimatePresence mode="wait">
        <motion.div
          key="legislativo-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-green-500 via-transparent to-black/20 mix-blend-multiply" />

          {/* Imagen izquierda */}
          <div className="absolute top-0 left-0 w-full h-1/2 md:w-1/2 md:h-full overflow-hidden">
            <Image
              src="/images/hero-left.jpg"
              alt="Congreso actual"
              fill
              className="object-cover object-center grayscale-[1] brightness-[0.55] contrast-[1.1] scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Imagen derecha */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 md:top-0 md:left-1/2 md:w-1/2 md:h-full overflow-hidden">
            <Image
              src="/images/hero-right.jpg"
              alt="Nuevo Congreso 2026"
              fill
              className="object-cover object-center saturate-[1.15] brightness-[0.65] contrast-[1.05] scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/60 via-transparent to-black/60" />
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-white/5 blur-3xl rounded-full pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* ============= HEADER COMPACTO ============= */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-6 md:py-8 flex-shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-center bg-gradient-to-r from-primary via-white to-warning bg-clip-text text-transparent drop-shadow-2xl">
            ELECCIONES GENERALES 2026
          </h1>

          <p className="text-sm md:text-base text-white max-w-2xl mx-auto font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Vota informado: Conoce candidatos a{" "}
            <span className="text-warning font-extrabold bg-black/40 px-1.5 py-0.5 rounded">
              Presidente
            </span>
            ,{" "}
            <span className="text-info font-extrabold bg-black/40 px-1.5 py-0.5 rounded">
              Diputados
            </span>{" "}
            y{" "}
            <span className="text-success font-extrabold bg-black/40 px-1.5 py-0.5 rounded">
              Senadores
            </span>
          </p>

          <p className="text-xs md:text-sm text-white font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] bg-black/30 px-3 py-1 rounded-full inline-block">
            {fechaFormateada} —{" "}
            <span className="text-warning font-extrabold">
              {diasRestantes} días
            </span>
          </p>
        </motion.div>
      </motion.div>

      {/* ============= SUBTÍTULO ============= */}
      <div className="relative z-10 text-center pb-2 md:pb-3 px-4">
        <h2 className="text-lg md:text-xl font-bold text-white/90">
          Perú vuelve al Sistema Bicameral
        </h2>
      </div>

      {/* ============= CONTENIDO COMPARATIVO ============= */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key="legislativo-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row w-full h-full"
          >
            {/* ============= PANEL IZQUIERDO - Congreso Actual ============= */}
            <div className="relative w-full md:w-1/2 flex overflow-hidden group border-r border-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-end w-full text-white p-4 md:p-8 py-6 md:py-10 pb-8 md:pb-12">
                <div className="md:max-w-md ml-auto text-center md:text-right flex flex-col items-center md:items-end">
                  <div className="w-12 h-12 md:w-14 md:h-14 mb-4 rounded-xl flex items-center justify-center bg-white/10 border border-white/20 backdrop-blur-sm">
                    <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5">
                    Congreso 2021-2026
                  </h3>
                  <span className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-0.5 text-[10px] md:text-xs font-bold text-white/80 mb-3">
                    SISTEMA UNICAMERAL
                  </span>

                  <div className="w-full max-w-sm mb-4">
                    <div className="flex items-center justify-between p-2.5 md:p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
                      <span className="text-xs md:text-sm text-white/90">
                        🏛️ Cámara Única
                      </span>
                      <span className="text-xl md:text-2xl font-bold text-white">
                        130
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/legisladores"
                    className="relative inline-flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-white text-black text-sm md:text-base font-semibold hover:bg-white/90 transition-shadow shadow-lg"
                  >
                    Ver Congresistas
                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ============= PANEL DERECHO - Nuevo Congreso 2026 ============= */}
            <div className="relative w-full md:w-1/2 flex overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-success/10 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-end w-full text-white p-4 md:p-8 py-6 md:py-10 pb-8 md:pb-12">
                <div className="md:max-w-md mr-auto text-center md:text-left flex flex-col items-center md:items-start">
                  <div className="w-12 h-12 md:w-14 md:h-14 mb-4 rounded-xl flex items-center justify-center bg-warning/20 border border-warning/30 backdrop-blur-sm">
                    <Columns className="w-6 h-6 md:w-7 md:h-7 text-warning" />
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5">
                    Tu Voto en 2026
                  </h3>
                  <span className="inline-flex items-center bg-warning/20 backdrop-blur-sm border border-warning/30 rounded-full px-2.5 py-0.5 text-[10px] md:text-xs font-bold text-warning mb-3">
                    SISTEMA BICAMERAL
                  </span>

                  <div className="w-full max-w-sm space-y-1.5 mb-4">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                      <span className="text-xs md:text-sm text-white/90">
                        👤 Presidente
                      </span>
                      <span className="text-base md:text-lg font-bold text-white">
                        1
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                      <span className="text-xs md:text-sm text-info">
                        🏛️ Senadores
                      </span>
                      <span className="text-base md:text-lg font-bold text-white">
                        60
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                      <span className="text-xs md:text-sm text-success">
                        🏛️ Diputados
                      </span>
                      <span className="text-base md:text-lg font-bold text-white">
                        130
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 md:p-3 rounded-lg bg-warning/20 border border-warning/40 backdrop-blur-sm">
                      <span className="text-xs md:text-sm text-white font-semibold">
                        Total
                      </span>
                      <span className="text-xl md:text-2xl font-bold text-warning">
                        190
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/aprende"
                    className="relative inline-flex items-center justify-center gap-2 w-full px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-warning to-warning/90 text-black text-sm md:text-base font-semibold hover:shadow-xl transition-all shadow-lg"
                  >
                    <PiYoutubeLogoFill className="w-4 h-4 md:w-5 md:h-5" />
                    Entiende el Cambio
                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
