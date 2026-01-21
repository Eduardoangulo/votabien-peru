import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import TeamList from "@/app/(platform)/(nosotros)/equipo/_components/team-list";
import { getTeam, type TeamMember } from "@/queries/public/team";

export default async function TeamPage() {
  let team: TeamMember[] = [];
  try {
    team = await getTeam();
  } catch (error) {
    console.error("Error al obtener el equipo:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 pointer-events-none" />
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl relative">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-12 bg-red-500 rounded-full" />
              <span className="text-sm font-medium text-red-600 uppercase tracking-wide">
                Nuestro Equipo
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Quiénes lo hacemos posible
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Un equipo de profesionales apasionados por la transparencia
              democrática y comprometidos con ofrecerte información verificable
              sobre el panorama político peruano.
            </p>
          </div>
        </div>
      </header>

      {/* Introducción */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Nuestro compromiso
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nuestro equipo está formado por investigadores, desarrolladores
                y diseñadores que comparten una visión común: democratizar el
                acceso a información política confiable en el Perú. Cada miembro
                aporta su experiencia y dedicación para garantizar que los datos
                presentados sean verificables, actualizados y accesibles.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 p-6 bg-muted/30 border border-red-500/20 rounded-lg">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-1 bg-red-500 rounded-full" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Independencia
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sin afiliaciones políticas ni intereses económicos
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-1 bg-red-500 rounded-full" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Verificación
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Cada dato respaldado por fuentes confiables
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-1 bg-red-500 rounded-full" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Transparencia
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Referencias públicas y accesibles para todos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-12 md:py-16 border-y border-border bg-muted/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Nuestro Equipo
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-red-500 to-red-400 rounded-full" />
          </div>
          <TeamList members={team} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border border-red-500/20 rounded-lg p-8">
            <div className="flex justify-center mb-4">
              <Heart className="w-8 h-8 text-red-600 fill-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Conocenos más
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Descubre por qué nos comprometemos con la transparencia
              democrática y cómo trabajamos para que tengas información
              verificable en las elecciones 2026.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/mision"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Nuestra Misión
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
