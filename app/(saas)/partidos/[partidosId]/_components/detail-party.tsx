"use client";

import {
  Building2,
  History,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Users,
  ChevronRight,
  Home,
} from "lucide-react";
import {
  SlSocialFacebook,
  SlSocialTwitter,
  SlSocialYoutube,
} from "react-icons/sl";
import { PiTiktokLogo } from "react-icons/pi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyHistory, PoliticalPartyDetail } from "@/interfaces/politics";
import Image from "next/image";
import Link from "next/link";
import { getTextColor, needsOverlay } from "@/lib/utils/color-utils";
import { cn } from "@/lib/utils";
import { PeruSeatsMapSimple } from "@/components/politics/peru-seats-map";

export default function DetailParty({
  party,
}: {
  party: PoliticalPartyDetail;
}) {
  const partidoColor = party.color_hex;
  const hasOverlay = needsOverlay(partidoColor);
  const textColor = getTextColor(partidoColor);

  const formatNumber = (num: number | null | undefined) => {
    if (!num) return "No disponible";
    return new Intl.NumberFormat("es-PE").format(num);
  };

  const añosFundacion = party.foundation_date
    ? new Date().getFullYear() - new Date(party.foundation_date).getFullYear()
    : null;

  const socialLinks = (
    <div className="flex flex-wrap gap-3">
      {party.facebook_url && (
        <a
          href={party.facebook_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <SlSocialFacebook className="w-4 h-4" />
          <span className="text-sm font-medium">Facebook</span>
        </a>
      )}

      {party.twitter_url && (
        <a
          href={party.twitter_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <SlSocialTwitter className="w-4 h-4" />
          <span className="text-sm font-medium">Twitter</span>
        </a>
      )}

      {party.tiktok_url && (
        <a
          href={party.tiktok_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-[#010101] via-[#121212] to-[#343434] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <PiTiktokLogo className="w-4 h-4" />
          <span className="text-sm font-medium">TikTok</span>
        </a>
      )}

      {party.youtube_url && (
        <a
          href={party.youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF0000] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <SlSocialYoutube className="w-4 h-4" />
          <span className="text-sm font-medium">YouTube</span>
        </a>
      )}
    </div>
  );

  const hasSocialLinks =
    party.facebook_url ||
    party.twitter_url ||
    party.tiktok_url ||
    party.youtube_url;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/partidos"
              className="hover:text-foreground transition-colors"
            >
              Partidos Políticos
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
              {party.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Header Hero */}
      <div
        className="relative border-b border-border"
        style={{
          background: `linear-gradient(135deg, ${partidoColor} 0%, ${partidoColor}dd 100%)`,
        }}
      >
        {hasOverlay && (
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/10" />
        )}

        <div className="container mx-auto p-4 relative z-10">
          <div className="flex flex-row items-start sm:items-center gap-6">
            {/* Logo */}
            {party.logo_url ? (
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-2xl flex items-center justify-center shadow-2xl ring-2 ring-white/30 overflow-hidden flex-shrink-0">
                <Image
                  src={party.logo_url}
                  alt={party.name}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 640px) 80px, 112px"
                  priority
                />
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white/90 rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0">
                <Building2 className="w-10 h-10 sm:w-14 sm:h-14 text-muted-foreground" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1
                className={cn(
                  "text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight",
                  textColor,
                )}
              >
                {party.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                {party.acronym && (
                  <Badge className="bg-background/30 border-0 font-bold text-base">
                    {party.acronym}
                  </Badge>
                )}

                {party.active ? (
                  <Badge
                    className={cn("bg-success/70 border-success/30", textColor)}
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Activo
                  </Badge>
                ) : (
                  <Badge variant="secondary">Inactivo</Badge>
                )}

                {party.ideology && (
                  <Badge className={cn("bg-background/30 border-0", textColor)}>
                    {party.ideology}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* ----- STATS MOVIDOS AQUI ----- */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 sm:mt-12">
            {añosFundacion && (
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0",
                    textColor,
                  )}
                >
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-2xl font-bold", textColor)}>
                    {añosFundacion}
                  </p>
                  <p className={cn("text-xs opacity-80", textColor)}>
                    años de fundación
                  </p>
                </div>
              </div>
            )}

            {party.total_afiliates && (
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0",
                    textColor,
                  )}
                >
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-2xl font-bold", textColor)}>
                    {formatNumber(party.total_afiliates)}
                  </p>
                  <p className={cn("text-xs opacity-80", textColor)}>
                    afiliados
                  </p>
                </div>
              </div>
            )}

            {party.total_seats !== null && party.total_seats !== undefined && (
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0",
                    textColor,
                  )}
                >
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-2xl font-bold", textColor)}>
                    {party.total_seats}
                  </p>
                  <p className={cn("text-xs opacity-80", textColor)}>
                    escaños congresales
                  </p>
                </div>
              </div>
            )}

            {party.founder && (
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0",
                    textColor,
                  )}
                >
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn("text-sm font-semibold truncate", textColor)}
                  >
                    {party.founder}
                  </p>
                  <p className={cn("text-xs opacity-80", textColor)}>
                    fundador
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* STATS ORIGINALES ELIMINADOS DE AQUI */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 lg:order-1 flex flex-col space-y-8 order-1">
            <div className="lg:sticky lg:top-8 space-y-6">
              {party.description && (
                <Card className="order-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Descripción</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-foreground/90 text-justify leading-relaxed">
                      {party.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* ----- REDES SOCIALES MODIFICADAS ----- */}
              {hasSocialLinks && (
                <>
                  {/* Desktop view: With Card */}
                  <Card className="hidden lg:block">
                    <CardHeader>
                      <CardTitle className="text-lg">Redes Sociales</CardTitle>
                    </CardHeader>
                    <CardContent>{socialLinks}</CardContent>
                  </Card>

                  {/* Mobile view: No Card, just links */}
                  <div className="block lg:hidden">{socialLinks}</div>
                </>
              )}
              {/* ----- FIN DE REDES SOCIALES ----- */}

              {/* Información de Contacto */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {party.main_office && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Sede Nacional
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {party.main_office}
                        </p>
                      </div>
                    </div>
                  )}

                  {party.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Teléfono
                        </p>
                        <a
                          href={`tel:${party.phone}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {party.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {party.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Email
                        </p>
                        <a
                          href={`mailto:${party.email}`}
                          className="text-sm text-primary hover:underline truncate block"
                        >
                          {party.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {party.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Sitio Web
                        </p>
                        <a
                          href={`https://${party.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Visitar sitio
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-2 order-2 lg:order-2 space-y-8">
            {/* Mapa de Escaños */}
            {party.seats_by_district && party.seats_by_district.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <PeruSeatsMapSimple
                    partyName={party.name}
                    partyColor={party.color_hex}
                    seatsByDistrict={party.seats_by_district}
                    totalSeats={party.total_seats}
                  />
                </CardContent>
              </Card>
            )}

            {/* Legisladores Electos */}
            {party.elected_legislators &&
              party.elected_legislators.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Users className="w-6 h-6 text-primary" />
                      Congresistas Electos
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {party.elected_legislators.length} congresistas elegidos
                      por este partido
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {party.elected_legislators.map((legislator) => (
                        <Link
                          key={legislator.id}
                          href={`/congresistas/${legislator.id}`}
                          className="group"
                        >
                          <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 bg-card">
                            {/* Foto */}
                            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-2 ring-border group-hover:ring-primary/50 transition-all">
                              {legislator.photo_url ? (
                                <Image
                                  src={legislator.photo_url}
                                  alt={legislator.full_name}
                                  fill
                                  className="object-cover"
                                  sizes="56px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Users className="w-6 h-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                {legislator.full_name}
                              </h4>
                              {legislator.district_name && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3" />
                                  {legislator.district_name}
                                </p>
                              )}
                              {legislator.position && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {legislator.position}
                                </p>
                              )}
                            </div>

                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Timeline histórico */}
            {party.party_timeline && party.party_timeline.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <History className="w-6 h-6 text-primary" />
                    Historia del Partido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-primary/5 to-primary/0 rounded-xl p-6">
                    <TimelineComponent items={party.party_timeline} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const TimelineComponent = ({ items }: { items: PartyHistory[] }) => {
  const sortedItems = [...items].sort((a, b) => b.year - a.year);

  return (
    <div className="relative space-y-6 sm:space-y-8">
      {sortedItems.map((item, idx) => (
        <div key={idx} className="relative flex gap-4 sm:gap-6 group">
          {/* Columna de tiempo */}
          <div className="flex-shrink-0 w-16 sm:w-20 text-right pt-1">
            <span className="text-lg sm:text-xl font-bold text-primary tabular-nums">
              {item.year}
            </span>
          </div>

          {/* Línea y punto */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative z-10 w-3 h-3 rounded-full bg-primary ring-4 ring-background group-hover:ring-primary/20 group-hover:scale-125 transition-all duration-300 mt-2" />

            {idx < sortedItems.length - 1 && (
              <div className="w-px flex-1 bg-gradient-to-b from-primary/80 via-primary/40 to-primary/20 min-h-[3rem]" />
            )}
          </div>

          {/* Contenido del evento */}
          <div className="flex-1 pb-2 pt-0.5 min-w-0">
            <div className="bg-muted/40 hover:bg-muted/70 border border-border/50 hover:border-primary/30 rounded-xl p-3 sm:p-4 transition-all duration-300 group-hover:shadow-md">
              <p className="text-sm sm:text-base text-foreground leading-relaxed">
                {item.event}
              </p>
              {item.source && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    Fuente: {item.source}
                    {item.source_type && ` (${item.source_type})`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="relative flex gap-4 sm:gap-6">
        <div className="flex-shrink-0 w-16 sm:w-20" />
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-2 h-2 rounded-full bg-primary/30" />
        </div>
      </div>
    </div>
  );
};
