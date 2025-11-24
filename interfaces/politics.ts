// ============= ENUMS =============

import { LegislatorDetail, LegislatorInSeat } from "./legislator";
import { ParliamentaryGroupBasic } from "./parliamentary-membership";
import { PersonBase, PersonBasicInfo } from "./person";

export enum ChamberType {
  CONGRESO = "Congreso",
  SENADO = "Senado",
  DIPUTADOS = "Diputados",
}

export enum CandidacyType {
  PRESIDENTE = "Presidente",
  VICEPRESIDENTE = "Vicepresidente",
  SENADOR = "Senador",
  DIPUTADO = "Diputado",
  CONGRESISTA = "Congresista",
}

export enum CandidacyStatus {
  INSCRITO = "Inscrito",
  HABIL = "Hábil",
  INHABILITADO = "Inhabilitado",
  TACADO = "Tacado",
}
export enum LegislatorCondition {
  EN_EJERCICIO = "En_ejercicio",
  FALLECIDO = "Fallecido",
  SUSPENDIDO = "Suspendido",
  LICENCIA = "Licencia",
  DESTITUIDO = "Destituido",
}

export enum ExecutiveRole {
  PRESIDENTE = "Presidente",
  VICEPRESIDENTE = "Vicepresidente",
  PRIMER_MINISTRO = "Primer_ministro",
  MINISTRO = "Ministro",
}

export enum GroupChangeReason {
  INICIAL = "inicial",
  CAMBIO_VOLUNTARIO = "cambio_voluntario",
  EXPULSION = "expulsion",
  RENUNCIA = "renuncia",
  DISOLUCION_BANCADA = "disolucion_bancada",
  CAMBIO_ESTRATEGICO = "cambio_estrategico",
  SANCION_DISCIPLINARIA = "sancion_disciplinaria",
  OTRO = "otro",
}

export interface PreviousCase {
  type: string;
  title: string;
  description: string;
  status: string | null;
  sanction: string | null;
  date: string;
  period: string | null;
  source: string;
  source_type: string;
  source_url: string | null;
}

export interface BiographyDetail {
  type: string;
  date: string;
  title: string;
  description: string;
  relevance: string | null;
  source: string;
  source_tipo: string;
  source_url: string | null;
}

export interface WorkExperience {
  positon: string;
  organization: string;
  period: string;
  description: string;
}

export interface PartyHistory {
  year: number;
  event: string;
  source: string | null;
  source_type: string | null;
}
// ============= INTERFACES BASE =============

export interface PoliticalPartyBase {
  id: string;
  name: string;
  acronym: string;
  logo_url: string | null;
  color_hex: string;
  active: boolean;
  foundation_date: string | null;
}

export interface ElectoralDistrictBasic {
  id: string;
  name: string;
}

export interface ElectoralDistrictBase {
  id: string;
  name: string;
  code: string;
  is_national: boolean;
  num_senators: number;
  num_deputies: number;
  active: boolean;
}

export interface ElectoralProcess {
  id: string;
  name: string;
  year: number;
  election_date: string;
  active: boolean;
  created_at: string;
}
// ============= PARTIDO ==========================
export interface SeatsByDistrict {
  district_name: string;
  district_code: string;
  seats: number;
}
export interface ElectedLegislatorBasic {
  id: string;
  full_name: string;
  photo_url: string | null;
  district_name: string | null;
  condition: string | null;
  person_id: string;
}
export interface PoliticalPartyDetail extends PoliticalPartyBase {
  founder: string | null;
  foundation_date: string | null;
  description: string | null;
  ideology: string | null;
  main_office: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  party_timeline: PartyHistory[];
  facebook_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  total_afiliates: number | null;
  total_seats: number;
  seats_by_district: SeatsByDistrict[];
  elected_legislators: ElectedLegislatorBasic[];
}

export interface PoliticalPartyListPaginated {
  items: PoliticalPartyBase[];
  total: number;
  limit: number;
  offset: number;
}
// ============= PERSONA Y LEGISLADOR =============

// ============= BANCADAS =============

// ============= EJECUTIVOS =============

export interface ExecutiveBase {
  id: string;
  role: ExecutiveRole;
  ministry: string | null;
  start_date: string;
}

export interface Executive extends ExecutiveBase {
  person: PersonBasicInfo;
}
// ============= CANDIDATURAS =============

export interface CandidateBase {
  id: string;
  type: CandidacyType;
  list_number: number | null;
  status: CandidacyStatus;
  votes_obtained: number | null;
  was_elected: boolean;
}

export interface CandidateList extends CandidateBase {
  person: PersonBase;
  political_party: PoliticalPartyBase;
  electoral_district: ElectoralDistrictBase | null;
  electoral_process: ElectoralProcess;
}

export interface CandidateDetail extends CandidateBase {
  person: PersonBase;
  legislative_periods: LegislatorDetail[] | [];
  political_party: PoliticalPartyBase;
  electoral_district: ElectoralDistrictBase | null;
  electoral_process: ElectoralProcess;

  // Propuestas y documentos
  proposals: string | null;
  government_plan_url: string | null;

  created_at: Date;
}

// ============= PROYECTOS DE LEY =============

export interface Bill {
  id: string;
  number: string;
  title: string;
  summary: string;
  submission_date: Date;
  status: string;
  document_url: string | null;
  created_at: Date;
}

// ============= ASISTENCIAS Y DENUNCIAS =============

export interface Attendance {
  id: string;
  date: Date;
  session_type: string;
  attended: boolean;
  created_at: Date;
}

// ============= ESCAÑOS =============

export interface SeatParliamentary {
  id: string;
  chamber: string;
  number_seat: number;
  row: number;
  legislator: LegislatorInSeat | null;
}

// ============= FILTROS Y OPCIONES =============

export interface FiltersPerson {
  is_legislator_active?: boolean;
  chamber?: ChamberType | string;
  groups?: string | string[];
  districts?: string | string[];
  search?: string;
  skip?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface FiltersCandidates {
  electoral_process_id?: string;
  type?: CandidacyType | string;
  districts?: string[] | string;
  search?: string;
  skip?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface FiltersRegulars {
  search?: string;
  skip?: number;
  limit?: number;
  [key: string]: unknown;
}
// ============= RESPUESTAS DE API =============

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}
