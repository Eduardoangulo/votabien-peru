export enum FinancingStatus {
  DENTRO_DEL_PLAZO = "DENTRO_DEL_PLAZO",
  FUERA_DEL_PLAZO = "FUERA_DEL_PLAZO",
  NO_PRESENTARON = "NO_PRESENTARON",
}

export enum FinancingCategory {
  INGRESO = "ingreso",
  GASTO = "gasto",
  DEUDA = "deuda",
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
  category: FinancingCategory | null;
  flow_type: FlowType | null;
  amount: number | null;
  currency: string | null;
  notes: string | null;
}

export interface FinancingReport {
  id: string;
  // party_id: string;
  report_name: string; // "IFA 2024"
  filing_status: FinancingStatus;
  source_name: string;
  source_url: string | null;
  report_date: string;
  period_start: string;
  period_end: string;
  transactions: PartyFinancingBasic[];
}
