// components/context/comparator.tsx
"use client";

import { createContext, ReactNode, useState, useEffect } from "react";
import { SearchableEntity } from "@/interfaces/ui-types";
import {
  ElectoralDistrictBase,
  PoliticalPartyBase,
} from "@/interfaces/politics";

interface ComparatorContextType {
  entities: SearchableEntity[];
  mode: string;
  setEntities: (entities: SearchableEntity[]) => void; // Para actualizar resultados de búsqueda async
  districts: ElectoralDistrictBase[];
  parties: PoliticalPartyBase[];
}

export const ComparatorContext = createContext<ComparatorContextType>({
  entities: [],
  mode: "legislator",
  setEntities: () => {},
  districts: [],
  parties: [],
});

interface ProviderProps {
  children: ReactNode;
  initialEntities: SearchableEntity[];
  mode: string;
  selectedIds: string[];
  districts: ElectoralDistrictBase[];
  parties: PoliticalPartyBase[];
}

export function ComparatorProvider({
  children,
  initialEntities,
  mode,
  districts,
  parties,
}: ProviderProps) {
  const [entities, setEntities] = useState<SearchableEntity[]>(initialEntities);

  // Si cambian los iniciales (navegación server-side), actualizamos
  useEffect(() => {
    setEntities(initialEntities);
  }, [initialEntities]);

  return (
    <ComparatorContext.Provider
      value={{ entities, setEntities, mode, districts, parties }}
    >
      {children}
    </ComparatorContext.Provider>
  );
}
