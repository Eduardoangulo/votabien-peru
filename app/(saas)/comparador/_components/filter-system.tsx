"use client";

import { useQueryStates } from "nuqs";
import { useState, useMemo } from "react";
import { LucideIcon } from "lucide-react";
import {
  Users,
  Trophy,
  Building2,
  Scale,
  UserCheck,
  Filter,
  X,
  ChevronRight,
  MapPin,
  Flag,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// ============================================
// TIPOS
// ============================================

type CategoryId = "legislator" | "candidate";

type EntityCategory = {
  id: CategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
};

type Subtype = {
  mode: string;
  label: string;
  icon: LucideIcon;
  chamber?: string;
  needsRefinement: boolean;
};

export interface FilterState {
  mode: string | null;
  chamber: string | null;
  district: string | null;
  party: string | null;
  process_id: string | null;
  active_only: boolean | null;
}

// ============================================
// CONFIGURACIÓN
// ============================================

const ENTITY_CATEGORIES: EntityCategory[] = [
  {
    id: "legislator",
    label: "Legisladores",
    description: "Congresistas actuales e históricos",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    id: "candidate",
    label: "Candidatos",
    description: "Elecciones 2026",
    icon: Trophy,
    color: "bg-purple-500",
  },
];

const LEGISLATOR_SUBTYPES: Subtype[] = [
  {
    mode: "legislator",
    label: "Congreso",
    icon: Users,
    chamber: "Congreso",
    needsRefinement: true,
  },
  {
    mode: "senator-legislator",
    label: "Senado",
    icon: Building2,
    chamber: "Senado",
    needsRefinement: true,
  },
  {
    mode: "deputy-legislator",
    label: "Diputados",
    icon: Scale,
    chamber: "Diputados",
    needsRefinement: true,
  },
];

const CANDIDATE_SUBTYPES: Subtype[] = [
  {
    mode: "president-candidate",
    label: "Presidente",
    icon: Trophy,
    needsRefinement: false,
  },
  {
    mode: "vicepresident-candidate",
    label: "Vicepresidente",
    icon: UserCheck,
    needsRefinement: false,
  },
  {
    mode: "senator-candidate",
    label: "Senador",
    icon: Building2,
    needsRefinement: true,
  },
  {
    mode: "deputy-candidate",
    label: "Diputado",
    icon: Scale,
    needsRefinement: true,
  },
];

// ============================================
// PARSERS PARA NUQS
// ============================================

const filterParsers = {
  mode: {
    parse: (v: string | null): string => v || "legislator",
    serialize: (v: string): string => v,
  },
  chamber: {
    parse: (v: string | null): string => v || "",
    serialize: (v: string): string => v,
  },
  district: {
    parse: (v: string | null): string => v || "",
    serialize: (v: string): string => v,
  },
  party: {
    parse: (v: string | null): string => v || "",
    serialize: (v: string): string => v,
  },
  process_id: {
    parse: (v: string | null): string => v || "elecciones-2026",
    serialize: (v: string): string => v,
  },
  active_only: {
    parse: (v: string | null): boolean => v === "true",
    serialize: (v: boolean): string => String(v),
  },
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function FilterSystem() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [filters, setFilters] = useQueryStates(filterParsers, {
    history: "replace",
    shallow: false,
  });

  const category: CategoryId | null = useMemo(() => {
    if (!filters.mode) return null;
    return filters.mode.includes("candidate") ? "candidate" : "legislator";
  }, [filters.mode]);

  const currentSubtype = useMemo(() => {
    if (!filters.mode) return null;

    const allSubtypes =
      category === "legislator" ? LEGISLATOR_SUBTYPES : CANDIDATE_SUBTYPES;

    return (
      allSubtypes.find(
        (s) =>
          s.mode === filters.mode &&
          (s.chamber === undefined || s.chamber === filters.chamber),
      ) || null
    );
  }, [filters.mode, filters.chamber, category]);

  const activeFiltersCount = useMemo(() => {
    return [
      filters.chamber && filters.chamber !== "",
      filters.district && filters.district !== "",
      filters.party && filters.party !== "",
      filters.active_only !== null && !filters.active_only,
    ].filter(Boolean).length;
  }, [filters]);

  const isFilterComplete = Boolean(category && filters.mode);

  // ============================================
  // HANDLERS
  // ============================================

  const handleCategoryChange = (newCategory: CategoryId) => {
    setFilters({
      mode: newCategory === "legislator" ? "legislator" : "candidate",
      chamber: null,
      district: null,
      party: null,
      process_id: newCategory === "candidate" ? "elecciones-2026" : null,
      active_only: true,
    });
  };

  const handleSubtypeChange = (subtype: Subtype) => {
    const updates: Partial<FilterState> = {
      mode: subtype.mode,
      chamber: subtype.chamber || null,
    };

    if (!subtype.needsRefinement) {
      updates.district = null;
      updates.party = null;
    }

    setFilters(updates);
  };

  const resetFilters = () => {
    setFilters({
      mode: "legislator",
      chamber: null,
      district: null,
      party: null,
      process_id: null,
      active_only: true,
    });
  };

  // ============================================
  // RENDER
  // ============================================

  const panelProps = {
    category,
    currentSubtype,
    filters,
    setFilters,
    onCategoryChange: handleCategoryChange,
    onSubtypeChange: handleSubtypeChange,
    onReset: resetFilters,
    activeFiltersCount,
    isComplete: isFilterComplete,
  };

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <DesktopFilterPanel {...panelProps} />
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden">
        <MobileFilterDrawer
          {...panelProps}
          open={mobileOpen}
          onOpenChange={setMobileOpen}
        />
      </div>
    </>
  );
}

// ============================================
// DESKTOP PANEL
// ============================================

interface PanelProps {
  category: CategoryId | null;
  currentSubtype: Subtype | null;
  filters: FilterState;
  setFilters: (updates: Partial<FilterState>) => void;
  onCategoryChange: (category: CategoryId) => void;
  onSubtypeChange: (subtype: Subtype) => void;
  onReset: () => void;
  activeFiltersCount: number;
  isComplete: boolean;
}

function DesktopFilterPanel({
  category,
  currentSubtype,
  filters,
  setFilters,
  onCategoryChange,
  onSubtypeChange,
  onReset,
  activeFiltersCount,
  isComplete,
}: PanelProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Filtros</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-7 px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
        <CardDescription>Configura tu comparación</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <FilterContent
          category={category}
          currentSubtype={currentSubtype}
          filters={filters}
          setFilters={setFilters}
          onCategoryChange={onCategoryChange}
          onSubtypeChange={onSubtypeChange}
          activeFiltersCount={activeFiltersCount}
          isComplete={isComplete}
        />
      </CardContent>
    </Card>
  );
}

// ============================================
// CONTENIDO COMPARTIDO DE FILTROS
// ============================================

interface FilterContentProps {
  category: CategoryId | null;
  currentSubtype: Subtype | null;
  filters: FilterState;
  setFilters: (updates: Partial<FilterState>) => void;
  onCategoryChange: (category: CategoryId) => void;
  onSubtypeChange: (subtype: Subtype) => void;
  activeFiltersCount: number;
  isComplete: boolean;
}

function FilterContent({
  category,
  currentSubtype,
  filters,
  setFilters,
  onCategoryChange,
  onSubtypeChange,
  isComplete,
}: FilterContentProps) {
  const showRefinement = currentSubtype?.needsRefinement ?? false;
  const isCandidate = category === "candidate";

  return (
    <div className="space-y-4">
      {/* Paso 1: Categoría */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase">
          Paso 1: Tipo
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {ENTITY_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all text-left",
                  "hover:border-primary/50 hover:bg-primary/5",
                  category === cat.id
                    ? "border-primary bg-primary/10"
                    : "border-border",
                )}
              >
                <div className="flex items-start gap-2">
                  <div
                    className={cn("p-1.5 rounded-md", cat.color, "text-white")}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{cat.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {category && (
        <>
          <Separator />

          {/* Paso 2: Subtipo */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              Paso 2: Cargo
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {(category === "legislator"
                ? LEGISLATOR_SUBTYPES
                : CANDIDATE_SUBTYPES
              ).map((subtype) => {
                const Icon = subtype.icon;
                const isSelected =
                  filters.mode === subtype.mode &&
                  (!subtype.chamber || filters.chamber === subtype.chamber);

                return (
                  <button
                    key={`${subtype.mode}-${subtype.label}`}
                    onClick={() => onSubtypeChange(subtype)}
                    className={cn(
                      "p-2.5 rounded-lg border transition-all text-left flex items-center gap-2",
                      "hover:border-primary/50 hover:bg-primary/5",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border",
                    )}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{subtype.label}</span>
                    {isSelected && (
                      <ChevronRight className="h-3 w-3 ml-auto text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Paso 3: Refinamiento (Condicional) */}
          {showRefinement && filters.mode && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">
                  Paso 3: Ajustar Filtros
                </Label>

                {/* Distrito Electoral */}
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Distrito Electoral
                  </Label>
                  <Select
                    value={filters.district || "all"}
                    onValueChange={(val: string) =>
                      setFilters({ district: val === "all" ? null : val })
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Lima">Lima</SelectItem>
                      <SelectItem value="Junín">Junín</SelectItem>
                      <SelectItem value="Cusco">Cusco</SelectItem>
                      <SelectItem value="Arequipa">Arequipa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Partido Político (solo candidatos) */}
                {isCandidate && (
                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1">
                      <Flag className="h-3 w-3" />
                      Partido Político
                    </Label>
                    <Select
                      value={filters.party || "all"}
                      onValueChange={(val: string) =>
                        setFilters({ party: val === "all" ? null : val })
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="fuerza-popular">
                          Fuerza Popular
                        </SelectItem>
                        <SelectItem value="peru-libre">Perú Libre</SelectItem>
                        <SelectItem value="renovacion-popular">
                          Renovación Popular
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {isComplete && (
        <div className="pt-2">
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
            <p className="text-xs text-green-700 dark:text-green-400 font-medium">
              ✓ Filtros configurados
            </p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-1">
              {showRefinement
                ? "Puedes refinar tu búsqueda con distrito y partido"
                : "Ahora busca y selecciona hasta 4 entidades"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// MOBILE PANEL
// ============================================

interface MobilePanelProps extends PanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function MobileFilterDrawer({
  category,
  currentSubtype,
  filters,
  setFilters,
  onCategoryChange,
  onSubtypeChange,
  onReset,
  activeFiltersCount,
  isComplete,
  open,
  onOpenChange,
}: MobilePanelProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-between h-11">
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5">
                {activeFiltersCount}
              </Badge>
            )}
          </span>
          {isComplete && (
            <Badge variant="default" className="h-5">
              ✓
            </Badge>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left border-b">
          <div className="flex items-start justify-between">
            <div>
              <DrawerTitle>Configurar Comparación</DrawerTitle>
              <DrawerDescription>
                Selecciona tipo y aplica filtros
              </DrawerDescription>
            </div>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-8 px-2"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 py-6">
          <FilterContent
            category={category}
            currentSubtype={currentSubtype}
            filters={filters}
            setFilters={setFilters}
            onCategoryChange={onCategoryChange}
            onSubtypeChange={onSubtypeChange}
            activeFiltersCount={activeFiltersCount}
            isComplete={isComplete}
          />
        </div>

        <DrawerFooter className="border-t pt-4">
          <Button
            className="w-full h-11"
            onClick={() => onOpenChange(false)}
            disabled={!isComplete}
          >
            Aplicar Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-white text-primary">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancelar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
