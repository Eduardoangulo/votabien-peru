import {
  ChamberType,
  CandidacyType,
  CandidacyStatus,
  LegislatorCondition,
  PersonList,
} from "@/interfaces/politics";

// ============= PERSON =============
export interface BiographyDetail {
  type: string;
  date: string;
  title: string;
  description: string;
  relevance?: string;
  source: string;
  source_type: string;
  source_url?: string;
}

export interface WorkExperience {
  position: string;
  organization: string;
  period: string;
  description: string;
}

export interface PreviousCase {
  type: string;
  title: string;
  description: string;
  status?: string;
  sanction?: string;
  date?: string;
  period?: string;
  source: string;
  source_type: string;
  source_url?: string;
}

export interface Person {
  id: string;
  name: string;
  lastname: string;
  fullname: string;
  image_url?: string;
  birth_date?: string;
  profession?: string;
  detailed_biography?: BiographyDetail[];
  technical_education?: string;
  university_education?: string;
  academic_degree?: string;
  professional_title?: string;
  postgraduate_education?: string;
  resume_url?: string;
  work_experience?: WorkExperience[];
  previous_cases?: PreviousCase[];
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  created_at: string;
}

// ============= POLITICAL PARTY =============
export interface PoliticalParty {
  id: string;
  name: string;
  acronym?: string;
  logo_url?: string;
  color_hex?: string;
  active: boolean;
}

// ============= ELECTORAL DISTRICT =============
export interface ElectoralDistrictBase {
  id: string;
  name: string;
  code: string;
  is_national: boolean;
  num_senators: number;
  num_deputies: number;
  active: boolean;
}

// ============= ELECTORAL PROCESS =============
export interface ElectoralProcess {
  id: string;
  name: string;
  year: number;
  election_date: string;
  active: boolean;
}

// ============= LEGISLATOR =============
export interface AdminLegislator {
  id: string;
  person_id: string;
  fullname: string;
  original_party_id: string;
  current_party_id?: string;
  electoral_district_id: string;
  chamber: ChamberType;
  condition: LegislatorCondition;
  start_date: string;
  end_date: string;
  active: boolean;
  institutional_email?: string;
  parliamentary_group?: string;
  created_at: string;
  // Relaciones populadas
  person: PersonList;
  original_party: PoliticalParty;
  current_party?: PoliticalParty;
  electoral_district: ElectoralDistrictBase;
}

// ============= CANDIDATE =============
export interface Candidate {
  id: string;
  person_id: string;
  electoral_process_id: string;
  type: CandidacyType;
  political_party_id: string;
  electoral_district_id?: string;
  list_number?: number;
  proposals?: string;
  government_plan_url?: string;
  status: CandidacyStatus;
  votes_obtained?: number;
  was_elected: boolean;
  created_at: string;
  // Relaciones populadas
  person?: Person;
  political_party?: PoliticalParty;
  electoral_district?: ElectoralDistrictBase;
  electoral_process?: ElectoralProcess;
}

// ============= REQUEST SCHEMAS =============
export interface CreatePersonRequest {
  name: string;
  lastname: string;
  image_url?: string;
  birth_date?: string;
  profession?: string;
  technical_education?: string;
  university_education?: string;
  academic_degree?: string;
  professional_title?: string;
  postgraduate_education?: string;
  resume_url?: string;
  work_experience?: WorkExperience[];
  detailed_biography?: BiographyDetail[];
  previous_cases?: PreviousCase[];
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
}

export interface UpdatePersonRequest extends Partial<CreatePersonRequest> {
  id: string;
}

export interface CreateLegislatorPeriodRequest {
  person_id: string;
  original_party_id: string;
  current_party_id: string | null;
  electoral_district_id: string;
  chamber: ChamberType;
  condition: LegislatorCondition;
  start_date: string;
  end_date: string;
  active: boolean;
  institutional_email?: string;
  parliamentary_group?: string;
}
export interface updateLegislatorPeriodRequest
  extends Partial<CreateLegislatorPeriodRequest> {
  id: string;
}

export interface CreateCandidateRequest {
  person_id: string;
  electoral_process_id: string;
  type: CandidacyType;
  political_party_id: string;
  electoral_district_id?: string;
  list_number?: number;
  proposals?: string;
  government_plan_url?: string;
  status: CandidacyStatus;
  votes_obtained?: number;
  was_elected: boolean;
}

// ============= TABLE DATA =============
export interface LegislatorTableRow {
  id: string;
  fullname: string;
  chamber: ChamberType;
  party: string;
  district: string;
  parliamentary_group?: string;
  active: boolean;
  start_date: string;
  end_date: string;
  person_id: string;
}

export interface CandidateTableRow {
  id: string;
  fullname: string;
  type: CandidacyType;
  party: string;
  district?: string;
  electoral_process: string;
  status: CandidacyStatus;
  list_number?: number;
  was_elected: boolean;
  person_id: string;
}
