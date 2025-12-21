export enum FinancingStatus {
  DENTRO_DEL_PLAZO = "DENTRO_DEL_PLAZO",
  FUERA_DEL_PLAZO = "FUERA_DEL_PLAZO",
  NO_PRESENTARON = "NO_PRESENTARON",
}

export enum FinancingCategory {
  INGRESO = "INGRESO",
  GASTO = "GASTO",
  DEUDA = "DEUDA",
}

export enum FlowType {
  I_FPD = "I_FPD",
  I_F_PRIVADO = "I_F_PRIVADO",
  I_OPERACIONALES = "I_OPERACIONALES",
  G_FONDO_FPD = "G_FONDO_FPD",
  G_FONDO_F_PRIVADO = "G_FONDO_F_PRIVADO",
  G_OPERACIONALES = "G_OPERACIONALES",
  D_TOTAL = "D_TOTAL",
}

export interface PartyFinancingBasic {
  id: string;
  date: string;
  period: string;
  status: FinancingStatus;
  category: FinancingCategory | null;
  flow_type: FlowType | null;
  amount: number | null;
  currency: string | null;
  source_name: string | null;
  source_url: string | null;
  notes: string | null;
}
