"use client";
import { ParliamentaryGroupBasic } from "@/interfaces/parliamentary-membership";
import {
  ElectoralDistrictBase,
  PoliticalPartyBase,
} from "@/interfaces/politics";
import React, { createContext, ReactNode } from "react";

type AdminLegislatorContextProps = {
  districts: ElectoralDistrictBase[];
  parties: PoliticalPartyBase[];
  parliamentaryGroups: ParliamentaryGroupBasic[];
};

const AdminLegislatorContext = createContext<AdminLegislatorContextProps>(
  {} as AdminLegislatorContextProps,
);

interface AdminLegislatorProviderProps {
  children: ReactNode;
  districts: ElectoralDistrictBase[];
  parties: PoliticalPartyBase[];
  parliamentaryGroups: ParliamentaryGroupBasic[];
}

const AdminLegislatorProvider: React.FC<AdminLegislatorProviderProps> = ({
  children,
  districts,
  parties,
  parliamentaryGroups,
}) => {
  return (
    <AdminLegislatorContext.Provider
      value={{
        districts,
        parties,
        parliamentaryGroups,
      }}
    >
      {children}
    </AdminLegislatorContext.Provider>
  );
};

export { AdminLegislatorContext, AdminLegislatorProvider };
