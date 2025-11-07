"use client";
import {
  ElectoralDistrictBase,
  PoliticalPartyBase,
} from "@/interfaces/politics";
import React, { createContext, ReactNode } from "react";

type AdminLegislatorContextProps = {
  districts: ElectoralDistrictBase[];
  parties: PoliticalPartyBase[];
};

const AdminLegislatorContext = createContext<AdminLegislatorContextProps>(
  {} as AdminLegislatorContextProps,
);

interface AdminLegislatorProviderProps {
  children: ReactNode;
  districts: ElectoralDistrictBase[];
  parties: PoliticalPartyBase[];
}

const AdminLegislatorProvider: React.FC<AdminLegislatorProviderProps> = ({
  children,
  districts,
  parties,
}) => {
  return (
    <AdminLegislatorContext.Provider
      value={{
        districts,
        parties,
      }}
    >
      {children}
    </AdminLegislatorContext.Provider>
  );
};

export { AdminLegislatorContext, AdminLegislatorProvider };
