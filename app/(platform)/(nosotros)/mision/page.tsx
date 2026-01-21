import Link from "next/link";
import { Target, Eye, Zap, Users, Heart, ArrowRight } from "lucide-react";

export default function MissionPage() {
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
                Propósito y compromiso
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Nuestra Misión en
              <span className="block text-red-600">Las Elecciones 2026</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Un equipo de jóvenes comprometidos con transformar la información
              política en una herramienta de empoderamiento ciudadano para
              elegir mejor en las elecciones generales del Perú.
            </p>
          </div>
        </div>
      </header>

      {/* Quiénes Somos */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Somos un Equipo de Jóvenes
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Profundamente preocupados y comprometidos con el futuro de
                nuestro país. Creemos que la información verificable es la base
                de una democracia fuerte y que cada ciudadano merece acceder a
                datos confiables para tomar decisiones informadas en las urnas.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                No queremos un Perú donde la desinformación y la propaganda
                determinen el rumbo de nuestras elecciones. Queremos ciudadanos
                empoderados que conozcan a quiénes votarán, qué hicieron, qué
                proponen y en qué se diferencian entre sí.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted/30 border border-red-500/20 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Heart className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Pasión por el cambio
                    </h3>
                    <p className="text-muted-foreground">
                      Creemos que nuestro trabajo puede marcar la diferencia en
                      cómo millones de peruanos toman decisiones en 2026.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 border border-red-500/20 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Zap className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Energía y determinación
                    </h3>
                    <p className="text-muted-foreground">
                      Trabajamos incansablemente para asegurar que ningún dato
                      importante se pierda o se distorsione.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-12 md:py-16 border-y border-border bg-muted/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Misión */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Target className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Misión</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Centralizar y democratizar el acceso a información verificable
                sobre congresistas, partidos políticos y candidatos en el Perú,
                permitiendo que cada ciudadano tome decisiones informadas en las
                elecciones generales de 2026.
              </p>
              <div className="pt-4 border-t border-red-500/20">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Nos comprometemos a:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">→</span>
                    <span>Verificar cada dato con fuentes primarias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">→</span>
                    <span>Mantener total neutralidad política</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">→</span>
                    <span>Actualizar información continuamente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">→</span>
                    <span>Hacer la información accesible a todos</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Visión */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Eye className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Visión</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ser la plataforma de referencia de información política para los
                peruanos, donde la transparencia, la verificabilidad y la
                calidad de datos creen una ciudadanía mejor informada y
                participativa.
              </p>
              <div className="pt-4 border-t border-red-500/20">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Imaginamos un Perú donde:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>La información política es accesible para todos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>
                      Los ciudadanos eligen basados en hechos, no en mentiras
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>La transparencia es la norma en política</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Jóvenes y ciudadanos participan activamente</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enfoque en 2026 */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Nuestro enfoque en las Elecciones 2026
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4 pb-6 border-b border-border">
              <div className="flex-shrink-0">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Información sobre Candidatos y Congresistas
                </h3>
                <p className="text-muted-foreground">
                  Perfiles detallados de quiénes quieren tu voto, su
                  trayectoria, logros, errores y propuestas. Queremos que
                  conozcas a quién votarás antes de ingresar a la urna.
                </p>
              </div>
            </div>

            <div className="flex gap-4 pb-6 border-b border-border">
              <div className="flex-shrink-0">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Target className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Análisis de Desempeño Legislativo
                </h3>
                <p className="text-muted-foreground">
                  Para quienes buscan reelección: ¿qué proyectos presentaron?
                  ¿cuál fue su asistencia? ¿cambiaron de partido? Los números
                  hablan por sí solos.
                </p>
              </div>
            </div>

            <div className="flex gap-4 pb-6 border-b border-border">
              <div className="flex-shrink-0">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Eye className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Transparencia sin Sesgo
                </h3>
                <p className="text-muted-foreground">
                  No decimos por quién votar. Damos los datos verificables para
                  que TÚ decidas. Sin propaganda, sin manipulación.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Información Actualizada Constantemente
                </h3>
                <p className="text-muted-foreground">
                  Cada semana actualizamos datos legislativos, antecedentes,
                  alianzas y cambios que afecten las elecciones de 2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué es importante */}
      <section className="py-12 md:py-16 border-y border-border bg-muted/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Importancia de 2026 para el Perú
          </h2>

          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              El 2026 es crucial para el Perú. Las elecciones generales
              determinarán el rumbo de nuestro país en los próximos años. Pero
              esta decisión solo puede ser correcta si se basa en información
              verificable.
            </p>

            <p>
              Vivimos en una era donde la desinformación viaja más rápido que la
              verdad. Donde mentiras bien empaquetadas pueden influir en
              millones de votos. Donde candidatos con antecedentes cuestionables
              intentan ocultarlos.
            </p>

            <p>
              Por eso existimos. Para asegurar que en 2026, cada voto cuente con
              la información más confiable disponible. Para que jóvenes como tú
              puedan participar activamente en política armados de hechos. Para
              que el Perú tenga mejores líderes porque los ciudadanos eligieron
              con conocimiento de causa.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border border-red-500/20 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Sé parte del cambio
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Te invitamos a explorar la información, compartirla con tu
              comunidad y participar activamente en las elecciones 2026 con
              datos verificables.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Explora los Datos
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/equipo"
                className="inline-flex items-center gap-2 px-6 py-3 border border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
              >
                Conoce el Equipo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
