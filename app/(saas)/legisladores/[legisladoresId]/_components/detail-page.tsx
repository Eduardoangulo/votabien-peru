"use client";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  FileText,
  ExternalLink,
  Mail,
  Briefcase,
  Check,
  Copy,
  User,
  GraduationCap,
  AlertTriangle,
  History,
  Award,
  BookOpen,
  Microscope,
  Landmark,
} from "lucide-react";
import { SlSocialFacebook, SlSocialTwitter } from "react-icons/sl";
import { PiTiktokLogo } from "react-icons/pi";
import {
  Field,
  FieldGroup,
  FieldTitle,
  FieldDescription,
  FieldSeparator,
  FieldContent,
} from "@/components/ui/field";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button } from "@/components/ui/button";
import { PreviousCase, PersonDetail, Bill } from "@/interfaces/politics";
import { formatFechaJsonable } from "@/lib/utils/date";
import { NoDataMessage } from "@/components/no-data-message";

export default function DetailLegislador({
  persona,
}: {
  persona: PersonDetail;
}) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const periodoActivo = persona.legislative_periods?.find((p) => p.active);

  // Ordenar periodos por fecha DESC
  const periodosOrdenados = [...(persona.legislative_periods || [])].sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
  );

  // Años totales de servicio
  const calcularAniosServicio = () => {
    if (!persona.legislative_periods?.length) return 0;
    const primerPeriodo = periodosOrdenados[periodosOrdenados.length - 1];
    const ultimoPeriodo = periodosOrdenados[0];
    const inicio = new Date(primerPeriodo.start_date).getFullYear();
    const fin = periodoActivo
      ? new Date().getFullYear()
      : new Date(ultimoPeriodo.end_date).getFullYear();
    return fin - inicio;
  };

  const stats = [
    {
      label: "Periodos Legislativos",
      value: persona.legislative_periods?.length || 0,
      icon: History,
      color: "text-info",
    },
    {
      label: "Años de Servicio",
      value: calcularAniosServicio(),
      icon: Calendar,
      color: "text-primary",
    },
    {
      label: "Proyectos de Ley",
      value: periodoActivo?.bills?.length || 0,
      icon: FileText,
      color: "text-success",
    },
  ];

  const getEstadoBadgeVariant = (activo: boolean) => {
    return activo ? "success" : "secondary";
  };

  // tiene información educativa?
  const tieneEducacion =
    persona.technical_education ||
    persona.university_education ||
    persona.academic_degree ||
    persona.professional_title ||
    persona.postgraduate_education;

  // Color del badge de antecedentes?
  const getPreviousCasesBadgeColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "rehabilitado":
      case "archivado":
      case "resuelto":
        return "secondary";
      case "en proceso":
      case "activo":
        return "warning";
      case "condenado":
      case "pendiente":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-4">
        {/* ===== HERO SECTION ===== */}
        <section className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mt-4">
          <div className="bg-gradient-to-r from-primary to-primary/90 p-4 text-primary-foreground relative">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-40 h-40 flex-shrink-0 rounded-full overflow-hidden border-4 border-primary-foreground/20">
                <Image
                  src={persona.image_url || "/images/default-avatar.svg"}
                  alt={`Foto de ${persona.fullname}`}
                  fill
                  className="object-cover object-top"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                  {persona.fullname}
                </h1>

                {persona.profession && (
                  <p className="text-lg text-primary-foreground/90 mt-2">
                    {persona.profession}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-primary-foreground mt-4">
                  {periodoActivo?.original_party &&
                    periodoActivo.original_party.logo_url && (
                      <div className="inline-flex items-center gap-2 font-medium">
                        <Image
                          src={periodoActivo.original_party.logo_url}
                          alt={periodoActivo.original_party.name}
                          width={24}
                          height={24}
                          className="rounded-sm"
                        />
                        <span>{periodoActivo.original_party.name}</span>
                      </div>
                    )}
                  {periodoActivo?.parliamentary_group && (
                    <div className="inline-flex items-center gap-2">
                      <Landmark className="size-4" />
                      <span>{periodoActivo.parliamentary_group}</span>
                    </div>
                  )}
                  {periodoActivo?.electoral_district && (
                    <div className="inline-flex items-center gap-2">
                      <MapPin className="size-4" />
                      <span>{periodoActivo.electoral_district.name}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-center md:justify-start gap-3">
                  <Badge
                    variant={getEstadoBadgeVariant(
                      periodoActivo?.active ?? false,
                    )}
                    className="text-sm px-3 py-1"
                  >
                    {periodoActivo?.active ? "En Ejercicio" : "Inactivo"}
                  </Badge>
                  {periodoActivo && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="size-4" />
                      <span>
                        Periodo{" "}
                        {new Date(periodoActivo.start_date).getFullYear()} -{" "}
                        {new Date(periodoActivo.end_date).getFullYear()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CONTENIDO PRINCIPAL ===== */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- COLUMNA PRINCIPAL --- */}
          <div className="lg:col-span-2 space-y-4">
            {/* Formación Académica */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="size-5" />
                  Formación Académica
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tieneEducacion ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {persona.technical_education &&
                      persona.technical_education !== "No" && (
                        <div className="p-3 bg-info/10 border border-info/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-1.5">
                            <BookOpen className="w-4 h-4 text-info" />
                            <span className="text-xs font-semibold text-info-foreground uppercase tracking-wide">
                              Educación Técnica
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {persona.technical_education}
                          </p>
                        </div>
                      )}

                    {persona.university_education &&
                      persona.university_education !== "No" && (
                        <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-1.5">
                            <GraduationCap className="w-4 h-4 text-primary" />
                            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                              Educación Universitaria
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {persona.university_education === "Si"
                              ? "Concluida"
                              : persona.university_education}
                          </p>
                        </div>
                      )}

                    {persona.academic_degree &&
                      persona.academic_degree !== "No" && (
                        <div className="p-3 bg-success/10 border border-success/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Award className="w-4 h-4 text-success" />
                            <span className="text-xs font-semibold text-success uppercase tracking-wide">
                              Grado Académico
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {persona.academic_degree}
                          </p>
                        </div>
                      )}

                    {persona.professional_title &&
                      persona.professional_title !== "No" && (
                        <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Award className="w-4 h-4 text-warning" />
                            <span className="text-xs font-semibold text-warning uppercase tracking-wide">
                              Título Profesional
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {persona.professional_title}
                          </p>
                        </div>
                      )}

                    {persona.postgraduate_education &&
                      persona.postgraduate_education !== "No" && (
                        <div className="p-3 bg-accent border border-border rounded-lg md:col-span-2">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Microscope className="w-4 h-4 text-accent-foreground" />
                            <span className="text-xs font-semibold text-accent-foreground uppercase tracking-wide">
                              Estudios de Postgrado
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {persona.postgraduate_education}
                          </p>
                        </div>
                      )}
                  </div>
                ) : (
                  <NoDataMessage text="No cuenta con información de estudios superiores registrada." />
                )}
              </CardContent>
            </Card>

            {/* Biografía */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="size-5" />
                  Trayectoria y Biografía
                </CardTitle>
              </CardHeader>
              <CardContent>
                {persona.detailed_biography ? (
                  <div className="relative space-y-6">
                    {/* Timeline line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />

                    {persona.detailed_biography
                      .sort(
                        (a, b) =>
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime(),
                      )
                      .map((item, index) => (
                        <div key={index} className="relative pl-8 group">
                          <div className="absolute left-0 top-2 w-4 h-4 bg-background border-2 border-primary rounded-full shadow-sm transition-transform group-hover:scale-125 group-hover:shadow-md" />

                          <div className="flex flex-col gap-2 pb-6 border-b border-border last:border-0 last:pb-0">
                            <div className="flex flex-wrap items-start gap-2">
                              <h4 className="font-semibold text-base leading-tight flex-1 min-w-0">
                                {item.title}
                              </h4>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <Badge
                                  variant="outline"
                                  className="text-xs capitalize font-normal"
                                >
                                  {item.type}
                                </Badge>
                                {item.relevance && (
                                  <Badge
                                    variant={
                                      item.relevance === "Alta"
                                        ? "destructive"
                                        : item.relevance === "Media"
                                          ? "default"
                                          : "secondary"
                                    }
                                    className="text-xs font-medium text-white/90"
                                  >
                                    {item.relevance}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {item.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <time dateTime={item.date}>
                                  {formatFechaJsonable(item.date)}
                                </time>
                              </div>

                              {item.source && item.source_url && (
                                <>
                                  <span className="text-muted-foreground/40">
                                    •
                                  </span>
                                  <Link
                                    href={item.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 hover:underline text-primary transition-colors underline-offset-2"
                                    aria-label={`source: ${item.source}`}
                                  >
                                    <span>{item.source}</span>
                                    <ExternalLink className="w-3 h-3 opacity-70 inline-block" />
                                  </Link>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <NoDataMessage text="No hay información detallada de la biografía." />
                )}
              </CardContent>
            </Card>

            {/* PreviousCases */}
            <Card className="shadow-sm border-warning/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="size-5" />
                  Antecedentes Registrados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {persona.previous_cases && persona.previous_cases.length > 0 ? (
                  <div className="relative space-y-6">
                    {Object.entries(
                      persona.previous_cases.reduce<
                        Record<string, PreviousCase[]>
                      >((acc, ant) => {
                        const tipo = ant.type || "Otros";
                        if (!acc[tipo]) acc[tipo] = [];
                        acc[tipo].push(ant);
                        return acc;
                      }, {}),
                    ).map(([tipo, lista]) => (
                      <div key={tipo} className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {tipo}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {lista.length}{" "}
                            {lista.length === 1 ? "registro" : "registros"}
                          </span>
                        </div>

                        {lista.map((antecedente, i) => (
                          <div
                            key={i}
                            className="p-3 bg-warning/10 border border-warning/30 rounded-lg"
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="text-xs font-semibold text-warning uppercase">
                                {antecedente.title}
                              </span>
                              {antecedente.status && (
                                <Badge
                                  variant={getPreviousCasesBadgeColor(
                                    antecedente.status,
                                  )}
                                  className="text-xs"
                                >
                                  {antecedente.status}
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm text-foreground mb-1">
                              {antecedente.description}
                            </p>

                            {antecedente.date && (
                              <span className="block text-xs text-muted-foreground">
                                Fecha: {formatFechaJsonable(antecedente.date)}
                              </span>
                            )}

                            {(antecedente.source || antecedente.source_url) && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                {antecedente.source_url ? (
                                  <Link
                                    href={antecedente.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 hover:underline text-primary transition-colors underline-offset-2"
                                  >
                                    {antecedente.source}
                                    <ExternalLink className="w-3 h-3 inline-block opacity-70" />
                                  </Link>
                                ) : (
                                  <span>{antecedente.source}</span>
                                )}
                                {antecedente.source_type && (
                                  <span className="text-muted-foreground/70">
                                    {" "}
                                    ({antecedente.source_type})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <NoDataMessage text="No se registran antecedentes." />
                )}
              </CardContent>
            </Card>

            {/* Proyectos de Ley */}
            {periodoActivo?.bills && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="size-5" />
                    Proyectos de Ley del Periodo Actual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    {periodoActivo.bills.length > 0 ? (
                      periodoActivo.bills.map(
                        (proyecto: Bill, index: number) => (
                          <div key={proyecto.id}>
                            <Link
                              href={`/proyectos/${proyecto.id}`}
                              className="block p-4 -m-4 rounded-lg hover:bg-muted transition-colors duration-200"
                            >
                              <FieldTitle className="text-base hover:text-primary">
                                {proyecto.title}
                              </FieldTitle>
                              <FieldDescription className="mt-1">
                                {proyecto.summary}
                              </FieldDescription>
                              <FieldContent className="flex-row items-center gap-2 text-xs text-muted-foreground mt-3">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>
                                  Presentado el{" "}
                                  {new Date(
                                    proyecto.submission_date,
                                  ).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </FieldContent>
                            </Link>
                            {index < periodoActivo.bills.length - 1 && (
                              <FieldSeparator className="my-2" />
                            )}
                          </div>
                        ),
                      )
                    ) : (
                      <NoDataMessage text="No se registran proyectos de ley en el periodo actual." />
                    )}
                  </FieldGroup>
                </CardContent>
              </Card>
            )}
          </div>

          {/* --- BARRA LATERAL --- */}
          <div className="space-y-4">
            {/* Resumen de Actividad */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Resumen de Actividad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <stat.icon className={`size-4 ${stat.color}`} />
                      <span className="text-sm text-foreground/80">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-lg font-bold">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Información de Contacto */}
            {periodoActivo?.institutional_email && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldGroup className="gap-2">
                    <Field>
                      <FieldContent>
                        <div className="flex items-center justify-between gap-2 w-full">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Mail className="size-4 flex-shrink-0" />
                            <span className="break-all text-sm">
                              {periodoActivo.institutional_email}
                            </span>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              copyToClipboard(
                                periodoActivo.institutional_email,
                                "email",
                              )
                            }
                            title={
                              isCopied("email") ? "Copiado" : "Copiar email"
                            }
                          >
                            {isCopied("email") ? (
                              <Check className="w-4 h-4 text-success" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </FieldContent>
                    </Field>
                  </FieldGroup>
                </CardContent>
              </Card>
            )}

            {/* Redes Sociales */}
            {(persona.facebook_url ||
              persona.twitter_url ||
              persona.tiktok_url) && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Redes Sociales</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldGroup className="gap-3">
                    {persona.facebook_url && (
                      <a
                        href={persona.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-info hover:underline p-2 -m-2 rounded-md hover:bg-info/10 transition-colors"
                      >
                        <SlSocialFacebook className="size-4" />
                        <span>Facebook</span>
                        <ExternalLink className="size-3 ml-auto" />
                      </a>
                    )}
                    {persona.twitter_url && (
                      <a
                        href={persona.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-info hover:underline p-2 -m-2 rounded-md hover:bg-info/10 transition-colors"
                      >
                        <SlSocialTwitter className="size-4" />
                        <span>Twitter / X</span>
                        <ExternalLink className="size-3 ml-auto" />
                      </a>
                    )}
                    {persona.tiktok_url && (
                      <a
                        href={persona.tiktok_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-foreground hover:text-primary p-2 -m-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <PiTiktokLogo className="size-4" />
                        <span>Tiktok</span>
                        <ExternalLink className="size-3 ml-auto" />
                      </a>
                    )}
                  </FieldGroup>
                </CardContent>
              </Card>
            )}

            {/* Información Personal */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {persona.birth_date && (
                  <div className="flex justify-between">
                    <span className="text-foreground/70">
                      Fecha de Nacimiento:
                    </span>
                    <span className="font-medium">
                      {new Date(persona.birth_date).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-foreground/70">Registro:</span>
                  <span className="font-medium">
                    {new Date(persona.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Historial Legislativo */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="size-5" />
                  Historial Legislativo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {periodosOrdenados.length > 0 ? (
                  <div
                    className={`grid gap-4 ${
                      periodosOrdenados.length === 1
                        ? "grid-cols-1"
                        : "grid-cols-1 md:grid-cols-2"
                    }`}
                  >
                    {periodosOrdenados.map((periodo) => (
                      <div
                        key={periodo.id}
                        className={`p-3 border rounded-lg transition-all hover:shadow-md ${
                          periodo.active
                            ? "bg-success/10 border-success/30"
                            : "bg-muted border-border"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-sm">
                              {periodo.chamber}
                            </h4>
                            <Badge
                              variant={periodo.active ? "success" : "secondary"}
                            >
                              {periodo.active ? "Actual" : "Finalizado"}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between gap-3 text-xs text-foreground/70">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="size-3 flex-shrink-0" />
                              <span>
                                {new Date(periodo.start_date).getFullYear()} -{" "}
                                {new Date(periodo.end_date).getFullYear()}
                              </span>
                            </div>
                            {periodo.electoral_district && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="size-3 flex-shrink-0" />
                                <span className="truncate">
                                  {periodo.electoral_district.name}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                            <Briefcase className="size-3 flex-shrink-0" />
                            <span className="truncate">
                              {periodo.current_party?.name || "No agrupados"}
                            </span>
                          </div>

                          {periodo.institutional_email && (
                            <div className="flex items-center gap-1.5 text-xs text-foreground/70 pt-1">
                              <Mail className="size-3 flex-shrink-0" />
                              <span className="truncate">
                                {periodo.institutional_email}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <NoDataMessage text="No hay historial legislativo registrado." />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
