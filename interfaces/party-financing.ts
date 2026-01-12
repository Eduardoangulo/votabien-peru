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
  financing_report_id: string;
  category: FinancingCategory;
  flow_type: FlowType;
  amount: number;
  currency: string;
  notes: string | null;
}

export interface FinancingReport {
  id: string;
  party_id: string;
  report_name: string; // "IFA 2024"
  filing_status: FinancingStatus;
  source_name: string;
  source_url: string | null;
  report_date: string;
  period_start: string;
  period_end: string;
  created_at: string;
  transactions: PartyFinancingBasic[];
}
