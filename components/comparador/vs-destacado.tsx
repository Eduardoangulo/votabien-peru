import { ReactNode, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shuffle,
  Users,
  FileCheck,
  TrendingUp,
  AlertCircle,
  Scale,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import {
  AlertasStats,
  AttendanceStats,
  BillsStats,
  LegislatorVersusCard,
} from "@/interfaces/versus";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import React from "react";

export interface ComparadorContentProps {
  legisladorA: LegislatorVersusCard;
  legisladorB: LegislatorVersusCard;
  isAnimating: boolean;
  onShuffleClick: () => void;
}

export function ComparadorContent({
  legisladorA,
  legisladorB,
  isAnimating,
  onShuffleClick,
}: ComparadorContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const statsA = {
    asistencia: legisladorA.asistencia,
    proyectos: legisladorA.proyectos,
    alertas: legisladorA.alertas,
  };

  const statsB = {
    asistencia: legisladorB.asistencia,
    proyectos: legisladorB.proyectos,
    alertas: legisladorB.alertas,
  };

  const colorA =
    legisladorA.current_parliamentary_group?.color_hex || "#6b7280";
  const colorB =
    legisladorB.current_parliamentary_group?.color_hex || "#6b7280";

  return (
    <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-b from-background via-muted/50 to-background">
      {/* Decorativos */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] dark:opacity-100 opacity-30" />
        <div className="absolute top-20 left-10 w-72 h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-72 h-72 md:w-96 md:h-96 bg-info/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 mb-12 md:mb-16">
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-3xl -z-10" />

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 leading-tight">
            Tú Decides con Datos
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Compara el trabajo real de tus congresistas: asistencia, proyectos
            presentados y transparencia
          </p>
        </div>
      </div>

      {/* Comparador */}
      <div className="w-full mb-6 md:mb-8 md:container md:mx-auto md:px-4">
        <div
          ref={containerRef}
          className="relative min-h-screen md:min-h-[80vh]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${legisladorA.id}-${legisladorB.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="sticky top-0 h-screen overflow-hidden"
            >
              {/* Split Screen Container */}
              <div className="relative h-full w-full md:rounded-2xl overflow-hidden shadow-2xl">
                <LegisladorSide
                  legislador={legisladorA}
                  stats={statsA}
                  side="left"
                  color={colorA}
                />

                <LegisladorSide
                  legislador={legisladorB}
                  stats={statsB}
                  side="right"
                  color={colorB}
                />

                <div className="md:hidden">
                  <ComparisonStats
                    statsA={statsA}
                    statsB={statsB}
                    colorA={colorA}
                    colorB={colorB}
                  />
                </div>

                <VSBadge colorA={colorA} colorB={colorB} />

                <Button
                  onClick={onShuffleClick}
                  disabled={isAnimating}
                  size="lg"
                  variant="outline"
                  className="group absolute top-[40%] sm:top-2/3 left-1/2 -translate-x-1/2 overflow-hidden bg-card/80 backdrop-blur-sm border-2 border-border hover:border-primary/50 hover:bg-accent text-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-50"
                >
                  <Shuffle
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isAnimating ? "animate-spin" : "group-hover:rotate-180"
                    }`}
                  />
                  <span className="font-semibold">Cambiar</span>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center flex-wrap">
          <Link href="/comparator">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Scale className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="font-bold">Comparar Personalizadamente</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <Link href="/legisladores">
            <Button
              size="lg"
              variant="outline"
              className="group bg-card/50 backdrop-blur-sm border-2 border-border hover:border-primary/50 hover:bg-accent text-foreground shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Users className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="font-semibold">Ver Todos</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Componente para cada lado del split
interface LegisladorSideProps {
  legislador: LegislatorVersusCard;
  stats: {
    asistencia: AttendanceStats;
    proyectos: BillsStats;
    alertas: AlertasStats;
  };
  side: "left" | "right";
  color: string;
}

// Overlay más dramático

interface LegisladorSideProps {
  legislador: LegislatorVersusCard;
  stats: {
    asistencia: AttendanceStats;
    proyectos: BillsStats;
    alertas: AlertasStats;
  };
  side: "left" | "right";
  color: string;
}

export function LegisladorSide({
  legislador,
  stats,
  side,
  color,
}: LegisladorSideProps) {
  const isLeft = side === "left";
  const isMobilePortrait = useMediaQuery(
    "(max-width: 768px) and (min-height: 600px)",
  );

  return (
    <div
      className={`absolute top-0 ${isLeft ? "left-0" : "right-0"} w-1/2 h-full overflow-hidden transition-all duration-700 ease-out`}
    >
      {/* === MOBILE: blur extendido === */}
      <div className="md:hidden absolute inset-0 transition-all duration-700">
        {legislador.image_url ? (
          <>
            <div
              className="absolute inset-0 transition-all duration-700"
              style={{
                backgroundImage: `url(${legislador.image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(50px) brightness(0.5)",
                transform: "scale(1.1)",
              }}
            />
            <div
              className="absolute inset-0 transition-all duration-700"
              style={{
                background: `linear-gradient(
                  to bottom,
                  ${color}08 0%,
                  ${color}20 30%,
                  ${color}50 60%,
                  ${color}80 85%,
                  ${color}95 100%
                )`,
              }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{
              background: `linear-gradient(135deg, ${color}40, ${color}10)`,
            }}
          >
            <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-white/10" />
          </div>
        )}

        {legislador.image_url && (
          <div className="absolute top-0 left-0 right-0 w-full h-[60%] transition-opacity duration-700">
            <Image
              src={legislador.image_url}
              alt={`${legislador.name} ${legislador.lastname}`}
              fill
              priority
              sizes="50vw"
              className="object-cover object-top transition-all duration-700"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 50%, transparent 95%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 50%, transparent 95%)",
              }}
            />
          </div>
        )}

        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `linear-gradient(
              to bottom,
              transparent 0%,
              transparent 40%,
              rgba(0,0,0,0.2) 55%,
              rgba(0,0,0,0.5) 70%,
              rgba(0,0,0,0.75) 85%,
              rgba(0,0,0,0.85) 92%,
              ${color}60 97%,
              ${color}90 100%
            )`,
          }}
        />
      </div>

      {/* === DESKTOP: imagen y overlays === */}
      <div className="hidden md:block absolute inset-0 overflow-hidden">
        {legislador.image_url ? (
          <Image
            src={legislador.image_url}
            alt={`${legislador.name} ${legislador.lastname}`}
            fill
            priority
            sizes="50vw"
            className="object-cover object-top transition-all duration-700"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center transition-all duration-700"
            style={{
              background: `linear-gradient(135deg, ${color}40, ${color}10)`,
            }}
          >
            <Users className="w-32 h-32 text-foreground/20" />
          </div>
        )}

        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `linear-gradient(
              to bottom,
              transparent 0%,
              transparent 30%,
              ${color}04 45%,
              ${color}12 60%,
              ${color}30 75%,
              ${color}60 88%,
              ${color}B3 100%
            )`,
          }}
        />
      </div>

      {/* Overlay negro */}
      <div
        className="hidden md:block absolute inset-0 transition-all duration-700"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            transparent 30%,
            rgba(0,0,0,0.12) 45%,
            rgba(0,0,0,0.30) 60%,
            rgba(0,0,0,0.50) 75%,
            rgba(0,0,0,0.65) 100%
          )`,
        }}
      />

      {/* Vignette radial */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 20%,
            rgba(0,0,0,0.3) 100%
          )`,
        }}
      />

      {/* Contenido */}
      <div className="relative md:absolute inset-0 h-full flex flex-col justify-end md:p-4 md:px-12 md:pb-4 z-20">
        <div className="flex-1" />

        {/* MOBILE VERSION */}
        <div
          className={`md:hidden px-3 transition-all duration-700 ${isLeft ? "text-left" : "text-right"}`}
          style={{
            position: "absolute",
            bottom: isMobilePortrait ? "18%" : "25%",
            left: isLeft ? "12px" : "auto",
            right: isLeft ? "auto" : "12px",
            maxWidth: isMobilePortrait
              ? "calc(90% - 12px)"
              : "calc(70% - 12px)",
            zIndex: 30,
          }}
        >
          <h3 className="text-2xl font-black text-white mb-0.5 leading-tight uppercase tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-all duration-700">
            {legislador.lastname}
          </h3>
          <p className="text-md font-bold text-white/95 mb-1.5 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] transition-all duration-700">
            {legislador.name}
          </p>

          <div className="flex flex-col gap-1 mb-1.5">
            <Badge
              className={`!whitespace-normal px-2 py-0.5 rounded-full backdrop-blur-xl border shadow-2xl text-white font-bold leading-tight text-center max-w-[140px] transition-all duration-700 ${
                legislador.current_parliamentary_group
                  ? "border-white/30"
                  : "border-gray-400/30 bg-gray-500/70 text-white/90"
              } ${isLeft ? "self-start" : "self-end"}`}
              style={
                legislador.current_parliamentary_group
                  ? { backgroundColor: `${color}F0` }
                  : undefined
              }
            >
              <span className="break-words hyphens-auto" lang="es">
                {legislador.current_parliamentary_group?.name || "No agrupados"}
              </span>
            </Badge>
          </div>

          <p className="text-sm text-white/80 font-medium drop-shadow-md transition-all duration-700">
            {legislador.electoral_district?.name || "Distrito no especificado"}
          </p>
        </div>

        {/* DESKTOP VERSION */}
        <div
          className={`hidden md:block transition-all mb-4 duration-700 ${isLeft ? "text-left" : "text-right"}`}
        >
          <div className="transition-all duration-700">
            <h3 className="text-4xl lg:text-5xl font-black text-white mb-1 leading-tight uppercase tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-all duration-700">
              {legislador.lastname}
            </h3>
            <p className="text-2xl lg:text-3xl font-bold text-white/95 mb-3 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] transition-all duration-700">
              {legislador.name}
            </p>
          </div>

          <div className="flex flex-col gap-2 mb-3 transition-all duration-700">
            <Badge
              className={`!whitespace-normal px-4 py-2 rounded-full backdrop-blur-xl border shadow-2xl text-white font-bold text-sm leading-tight text-center max-w-[220px] transition-all duration-700 ${
                legislador.current_parliamentary_group
                  ? "border-white/30"
                  : "border-gray-400/30 bg-gray-500/70 text-white/90"
              } ${isLeft ? "self-start" : "self-end"}`}
              style={
                legislador.current_parliamentary_group
                  ? { backgroundColor: `${color}F0` }
                  : undefined
              }
            >
              <span className="break-words hyphens-auto" lang="es">
                {legislador.current_parliamentary_group?.name || "No agrupados"}
              </span>
            </Badge>
          </div>

          <p className="text-base text-white/90 font-medium drop-shadow-md transition-all duration-700">
            {legislador.electoral_district?.name || "Distrito no especificado"}
          </p>
        </div>

        {/* Stats - solo Desktop */}
        <div className="hidden md:block space-y-2 md:space-y-3 backdrop-blur-xl bg-black/20 rounded-2xl p-3 md:p-4 border border-white/10 relative z-30 transition-all duration-700">
          <StatBar
            icon={<TrendingUp className="w-3 h-3 md:w-4 md:h-4" />}
            label="Asistencia"
            value={stats.asistencia.porcentaje}
            total={stats.asistencia.total_sesiones}
            color={color}
            side={side}
            showPercentage
          />

          <StatBar
            icon={<FileCheck className="w-3 h-3 md:w-4 md:h-4" />}
            label="Proyectos de Ley"
            value={stats.proyectos.total}
            maxValue={50}
            subtitle={`${stats.proyectos.aprobados} aprobados`}
            color={color}
            side={side}
          />

          <StatBar
            icon={<AlertCircle className="w-3 h-3 md:w-4 md:h-4" />}
            label="Alertas"
            value={stats.alertas.total}
            maxValue={10}
            color={stats.alertas.total > 0 ? "#ef4444" : color}
            side={side}
            alert={stats.alertas.total > 0}
          />
        </div>
      </div>
    </div>
  );
}

interface StatBarProps {
  icon: ReactNode;
  label: string;
  value: number | null;
  maxValue?: number;
  total?: number;
  subtitle?: string;
  color: string;
  side: "left" | "right";
  showPercentage?: boolean;
  alert?: boolean;
}

function StatBar({
  icon,
  label,
  value,
  maxValue = 100,
  total,
  subtitle,
  color,
  side,
  showPercentage = false,
  alert = false,
}: StatBarProps) {
  const isLeft = side === "left";
  const percentage = maxValue
    ? Math.min(((value ?? 0) / maxValue) * 100, 100)
    : 0;
  const displayValue = value !== null ? value : "—";

  return (
    <div className="flex flex-col gap-1 transition-all duration-700">
      <div
        className={`flex items-center justify-between gap-2 transition-all duration-700 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
      >
        <div
          className={`flex items-center gap-1.5 transition-all duration-700 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
        >
          <div className="text-white/90 transition-all duration-700">
            {icon}
          </div>
          <span className="text-xs md:text-sm font-medium text-white transition-all duration-700">
            {label}
          </span>
        </div>
        <div
          className={`flex flex-col transition-all duration-700 ${isLeft ? "items-end" : "items-start"}`}
        >
          <span
            className={`text-sm md:text-lg font-bold transition-all duration-700 ${alert ? "text-red-400" : "text-white"}`}
          >
            {displayValue}
            {showPercentage && value !== null ? "%" : ""}
          </span>
          {subtitle && (
            <span className="text-[10px] text-white/70 transition-all duration-700">
              {subtitle}
            </span>
          )}
          {total !== undefined && value !== null && (
            <span className="text-[10px] text-white/70 transition-all duration-700">
              {total} sesiones
            </span>
          )}
        </div>
      </div>

      {/* Barra de progreso */}
      {value !== null && (
        <div className="relative h-1.5 md:h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm transition-all duration-700">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
              boxShadow: `0 0 12px ${color}99`,
            }}
          />
        </div>
      )}
    </div>
  );
}

interface ComparisonStatsProps {
  statsA: {
    asistencia: AttendanceStats;
    proyectos: BillsStats;
    alertas: AlertasStats;
  };
  statsB: {
    asistencia: AttendanceStats;
    proyectos: BillsStats;
    alertas: AlertasStats;
  };
  colorA: string;
  colorB: string;
}

// Estadísticas Mobile
function ComparisonStats({
  statsA,
  statsB,
  colorA,
  colorB,
}: ComparisonStatsProps) {
  const items = [
    {
      icon: <TrendingUp className="w-3.5 h-3.5 text-white/90" />,
      label: "Asistencia",
      valueA:
        statsA.asistencia.porcentaje !== null
          ? `${statsA.asistencia.porcentaje}%`
          : "—",
      valueB:
        statsB.asistencia.porcentaje !== null
          ? `${statsB.asistencia.porcentaje}%`
          : "—",
    },
    {
      icon: <FileCheck className="w-3.5 h-3.5 text-white/90" />,
      label: "Proyectos",
      valueA: statsA.proyectos.total,
      valueB: statsB.proyectos.total,
    },
    {
      icon: <AlertCircle className="w-3.5 h-3.5 text-white/90" />,
      label: "Alertas",
      valueA: statsA.alertas.total,
      valueB: statsB.alertas.total,
      alertColor: true,
    },
  ];

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md backdrop-blur-xl bg-black/30 rounded-2xl p-4 border border-white/10 z-30 shadow-lg transition-all duration-700">
      <div className="grid grid-cols-3 gap-2 text-center">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <div
              className="flex flex-col items-center justify-center transition-all duration-700"
              style={{
                color:
                  item.alertColor && statsA.alertas.total > 0
                    ? "#ef4444"
                    : colorA,
              }}
            >
              <span className="text-sm font-bold">{item.valueA}</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-0.5">
              <div className="flex items-center gap-1">
                {item.icon}
                <span className="text-[11px] font-medium text-white">
                  {item.label}
                </span>
              </div>
            </div>

            <div
              className="flex flex-col items-center justify-center transition-all duration-700"
              style={{
                color:
                  item.alertColor && statsB.alertas.total > 0
                    ? "#ef4444"
                    : colorB,
              }}
            >
              <span className="text-sm font-bold">{item.valueB}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function VSBadge({ colorA, colorB }: { colorA: string; colorB: string }) {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="relative">
        <div className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 relative">
          <div
            className="relative w-full h-full rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 transition-all duration-700"
            style={{
              background: `linear-gradient(135deg, ${colorA} 0%, ${colorB} 100%)`,
              boxShadow: `0 0 40px ${colorA}40, 0 0 40px ${colorB}40`,
            }}
          >
            <span className="text-xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-lg">
              VS
            </span>
          </div>

          <div
            className="absolute -inset-6 rounded-full blur-2xl -z-10 opacity-50 transition-all duration-700"
            style={{
              background: `radial-gradient(circle, ${colorA}60, ${colorB}60)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
