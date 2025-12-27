import React, { useState } from "react";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  FileText,
  Menu,
  ExternalLink,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import SimpleAudioPlayer from "./simple-audio-player";

interface PlanGobiernoProps {
  audio_url: string | null;
  government_plan_url: string | null;
  planes: {
    title: string;
    summary: string;
    tags: string[];
    proposals: string[];
    goals: { indicator: string }[];
  }[];
}

// Mapa de colores basado en tags
const getColorFromTag = (tags: string[]) => {
  const colorMap: Record<string, string> = {
    seguridad: "bg-red-600",
    extorsion: "bg-red-600",
    mineria_ilegal: "bg-amber-600",
    salud: "bg-emerald-600",
    educacion: "bg-blue-600",
    agua_saneamiento: "bg-cyan-600",
    empleo: "bg-purple-600",
    vivienda: "bg-orange-600",
    ambiente: "bg-green-600",
  };

  const mainTag = tags[0];
  return colorMap[mainTag] || "bg-slate-600";
};

const getCategoryLabel = (tags: string[]) => {
  const categoryMap: Record<string, string> = {
    seguridad: "Seguridad",
    extorsion: "Extorsión",
    mineria_ilegal: "Minería",
    salud: "Salud",
    educacion: "Educación",
    agua_saneamiento: "Agua y Saneamiento",
    empleo: "Empleo",
    vivienda: "Vivienda",
    ambiente: "Ambiente",
  };

  const mainTag = tags[0];
  return categoryMap[mainTag] || mainTag;
};

export function PlanGobiernoFlashcards({
  audio_url,
  government_plan_url,
  planes,
}: PlanGobiernoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const currentPlan = planes[currentIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < planes.length - 1) {
      nextCard();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevCard();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const nextCard = () => {
    if (currentIndex < planes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const togglePlay = () => {
    const audio = document.getElementById("plan-audio") as HTMLAudioElement;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const jumpToCard = (index: number) => {
    setCurrentIndex(index);
    setIsFlipped(false);
    setShowMenu(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="w-6 h-6" />
          Plan de Gobierno
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Audio Player */}
        {audio_url && (
          <SimpleAudioPlayer audioId="plan-audio" audioUrl={audio_url} />
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-2xl font-light">{planes.length}</div>
            <div className="text-xs text-muted-foreground">Ejes temáticos</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-2xl font-light">
              {planes.reduce((acc, p) => acc + p.proposals.length, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Propuestas</div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-2">
          <Credenza>
            <CredenzaTrigger asChild>
              <Button className="w-full" variant="default">
                <FileText className="w-4 h-4 mr-2" />
                Explorar propuestas
              </Button>
            </CredenzaTrigger>
            <CredenzaContent className="overflow-hidden max-w-6xl px-0 py-4">
              <CredenzaHeader className="sm:p-4 border-b">
                <CredenzaTitle className="flex items-center justify-around p-0">
                  {/* Navegación superior */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowMenu(!showMenu)}
                      className="lg:hidden"
                    >
                      <Menu className="w-4 h-4" />
                    </Button>

                    <div className="hidden lg:flex items-center gap-3">
                      <span className="text-sm text-muted-foreground font-medium">
                        {currentIndex + 1} / {planes.length}
                      </span>
                      <div className="flex gap-1">
                        {planes.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => jumpToCard(idx)}
                            className={`h-1.5 rounded-full transition-all ${
                              idx === currentIndex
                                ? "w-8 bg-primary"
                                : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" size="icon" onClick={togglePlay}>
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                </CredenzaTitle>
              </CredenzaHeader>
              <CredenzaBody className="overflow-y-auto p-0">
                <div className="max-w-5xl mx-auto p-4">
                  {/* Menu móvil */}
                  {showMenu && (
                    <div className="bg-muted/50 rounded-lg lg:hidden max-h-64 overflow-y-auto">
                      {planes.map((plan, idx) => (
                        <button
                          key={idx}
                          onClick={() => jumpToCard(idx)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            idx === currentIndex
                              ? "bg-primary text-primary-foreground font-medium"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className="font-medium">
                            {getCategoryLabel(plan.tags)}
                          </div>
                          <div className="text-xs opacity-80 mt-0.5 line-clamp-1">
                            {plan.title}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Flashcard */}
                  {!showMenu && (
                    <div
                      className="relative w-full h-[55vh] cursor-pointer"
                      onClick={() => setIsFlipped(!isFlipped)}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <div
                        className="w-full h-full transition-transform duration-500"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: isFlipped
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                        }}
                      >
                        {/* Frente */}
                        <div
                          className="absolute w-full h-full"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <div className="h-full bg-card rounded-lg border border-border p-4 lg:p-8 flex flex-col justify-between">
                            <div>
                              <div
                                className={`inline-block px-3 py-1 rounded text-xs font-medium text-white mb-4 ${getColorFromTag(currentPlan.tags)}`}
                              >
                                {getCategoryLabel(currentPlan.tags)}
                              </div>
                              <h2 className="text-3xl lg:text-4xl font-light mb-4 leading-tight">
                                {currentPlan.title}
                              </h2>
                              <p className="text-justify text-lg text-muted-foreground leading-relaxed font-light">
                                {currentPlan.summary}
                              </p>
                            </div>
                            <div className="text-center pt-4">
                              <p className="text-muted-foreground text-sm font-medium">
                                Toca para ver detalles
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Reverso */}
                        <div
                          className="absolute w-full h-full"
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <div className="h-full bg-card rounded-lg border border-border p-4 lg:p-8 overflow-y-auto">
                            <div
                              className={`inline-block px-3 py-1 rounded text-xs font-medium text-white mb-4 ${getColorFromTag(currentPlan.tags)}`}
                            >
                              {getCategoryLabel(currentPlan.tags)}
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-light mb-8">
                              {currentPlan.title}
                            </h3>

                            <div className="mb-8">
                              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                                Propuestas principales
                              </h4>
                              <div className="space-y-3">
                                {currentPlan.proposals.map((prop, i) => (
                                  <div key={i} className="flex gap-3">
                                    <div
                                      className={`w-1 rounded-full flex-shrink-0 ${getColorFromTag(currentPlan.tags)}`}
                                    ></div>
                                    <p className="text-sm leading-relaxed text-justify">
                                      {prop}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                                Metas e indicadores
                              </h4>
                              <div className="space-y-3">
                                {currentPlan.goals.map((meta, i) => (
                                  <div
                                    key={i}
                                    className="bg-muted/50 p-4 rounded-lg border border-border"
                                  >
                                    <p className="text-sm leading-relaxed">
                                      {meta.indicator}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="mt-4 text-center">
                              <p className="text-muted-foreground text-xs">
                                Toca para volver
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CredenzaBody>
              <CredenzaFooter className="flex flex-row justify-center sm:justify-center w-full gap-5 sm:p-4">
                {/* Controles */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevCard}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="text-center">
                  <div className="text-sm font-medium mb-1">
                    {currentIndex + 1} de {planes.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getCategoryLabel(currentPlan.tags)}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextCard}
                  disabled={currentIndex === planes.length - 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </CredenzaFooter>
            </CredenzaContent>
          </Credenza>
          {government_plan_url && (
            <Button variant="outline" className="w-full" asChild>
              <Link
                href={government_plan_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF completo
                <ExternalLink className="w-3 h-3" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
