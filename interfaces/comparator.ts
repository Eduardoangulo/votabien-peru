// interfaces/comparator.ts

import { LegislatorBasicInfo } from "./legislator";
import { LegislatorMetricsWithComputed } from "./legislator-metrics";

// ============================================
// TIPOS COMPARTIDOS
// ============================================

export type ComparisonDataStatus = "available" | "no_metrics" | "not_found";

// ============================================
// TIPOS PARA LEGISLADORES
// ============================================

// 🔥 Para comparación (con métricas completas)
export interface LegislatorWithMetrics {
  legislator: LegislatorBasicInfo;
  metrics: LegislatorMetricsWithComputed;
}

export interface LegislatorCompareItem {
  legislator_id: string;
  legislator_name: string | null;
  status: ComparisonDataStatus;
  data: LegislatorWithMetrics | null;
  message: string | null;
}

export interface LegislatorComparison {
  total_requested: number;
  total_available: number;
  comparison_date: string;
  items: LegislatorCompareItem[];
}

// ============================================
// TIPOS PARA CANDIDATOS
// ============================================

// 🔥 Métricas de candidatos (ajusta según tu backend)
export interface CandidateMetrics {
  candidate_id: string;
  total_proposals?: number;
  media_appearances?: number;
  social_media_followers?: number;
  // ... agrega lo que tenga tu API
  last_updated: string;
}

// 🔥 Para comparación (con métricas completas)
export interface CandidateWithMetrics {
  candidate: {
    id: string;
    person: {
      fullname: string;
      image_url: string | null;
    };
    political_party?: {
      id: string | number;
      name: string;
      color_hex: string | null;
      logo_url?: string | null;
    } | null;
    alliance?: {
      name: string;
      color_hex: string | null;
      logo_url?: string | null;
    } | null;
    electoral_district?: {
      name: string;
    } | null;
    electoral_process_id: string | number;
  };
  metrics: CandidateMetrics | null; // 🔥 Tipado específico
}

export interface CandidateCompareItem {
  candidate_id: string;
  candidate_name: string | null;
  status: ComparisonDataStatus;
  data: CandidateWithMetrics | null;
  message: string | null;
}

export interface CandidateComparison {
  total_requested: number;
  total_available: number;
  comparison_date: string;
  items: CandidateCompareItem[];
}

// ============================================
// PAYLOADS PARA API
// ============================================

export interface LegislatorComparisonPayload {
  ids: string[];
}

export interface CandidateComparisonPayload {
  ids: string[];
  candidacy_type?: string;
  process_id?: string;
}

export type ComparisonPayload =
  | LegislatorComparisonPayload
  | CandidateComparisonPayload;

// ============================================
// TIPO UNIFICADO
// ============================================

export type ComparisonResponse =
  | LegislatorComparison
  | CandidateComparison
  | null;
