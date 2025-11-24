// components/context/comparator.tsx
"use client";

import { createContext, ReactNode, useState, useEffect } from "react";
import { SearchableEntity } from "@/interfaces/ui-types";

interface ComparatorContextType {
  entities: SearchableEntity[];
  mode: string;
  setEntities: (entities: SearchableEntity[]) => void; // Para actualizar resultados de búsqueda async
}

export const ComparatorContext = createContext<ComparatorContextType>({
  entities: [],
  mode: "legislator",
  setEntities: () => {},
});

interface ProviderProps {
  children: ReactNode;
  initialEntities: SearchableEntity[];
  mode: string;
  selectedIds: string[];
}

export function ComparatorProvider({
  children,
  initialEntities,
  mode,
}: ProviderProps) {
  const [entities, setEntities] = useState<SearchableEntity[]>(initialEntities);

  // Si cambian los iniciales (navegación server-side), actualizamos
  useEffect(() => {
    setEntities(initialEntities);
  }, [initialEntities]);

  return (
    <ComparatorContext.Provider value={{ entities, setEntities, mode }}>
      {children}
    </ComparatorContext.Provider>
  );
}
