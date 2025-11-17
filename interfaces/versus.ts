import { ParliamentaryGroupBasic } from "./parliamentary-membership";
import { ElectoralDistrictBase, PoliticalPartyBase } from "./politics";

export interface AttendanceStats {
  porcentaje: number | null;
  total_sesiones: number;
  asistencias: number;
  faltas: number;
  faltas_justificadas: number;
  tardanzas: number;
  licencias: number;
}

export interface BillsStats {
  total: number;
  como_coautor: number;
  aprobados: number;
  en_comision: number;
  en_debate: number;
  rechazados: number;
  archivados: number;
}

export interface AlertasStats {
  total: number;
  controversias: number;
  antecedentes: number;
}

export interface LegislatorVersusCard {
  id: string;
  person_id: string;

  // Datos básicos
  fullname: string;
  name: string;
  lastname: string;
  image_url: string | null;
  profession: string | null;

  // Datos legislativos
  chamber: string;
  condition: string;
  start_date: string;
  days_in_office: number;

  // Relaciones
  current_parliamentary_group: ParliamentaryGroupBasic | null;
  electoral_district: ElectoralDistrictBase | null;
  elected_by_party: PoliticalPartyBase | null;

  // Stats
  asistencia: AttendanceStats;
  proyectos: BillsStats;
  alertas: AlertasStats;
}

export interface BiographyItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  date: string | null;
  source_url: string | null;
}

export interface PreviousCase {
  id: string;
  case_type: string;
  description: string;
  year: number | null;
  status: string | null;
  source_url: string | null;
}

// Response para comparación detallada
export interface LegislatorVersusDetail {
  id: string;
  person_id: string;

  // Datos completos
  fullname: string;
  name: string;
  lastname: string;
  image_url: string | null;
  profession: string | null;
  birthdate: string | null;
  dni: string | null;

  // Biografía y antecedentes
  detailed_biography: BiographyItem[];
  previous_cases: PreviousCase[];

  // Datos legislativos
  chamber: string;
  condition: string;
  start_date: string;
  end_date: string | null;
  days_in_office: number;
  institutional_email: string | null;

  // Relaciones
  current_parliamentary_group: ParliamentaryGroupBasic | null;
  electoral_district: ElectoralDistrictBase;
  elected_by_party: PoliticalPartyBase;

  // Stats
  asistencia: AttendanceStats;
  proyectos: BillsStats;
  alertas: AlertasStats;
}
