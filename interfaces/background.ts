export enum BackgroundType {
  PENAL = "penal",
  ETICA = "etica",
  CIVIL = "civil",
  ADMINISTRATIVO = "administrativo",
}

export enum BackgroundStatus {
  EN_INVESTIGACION = "en_investigacion",
  EN_PROCESO_JUDICIAL = "en_proceso_judicial",
  SENTENCIADO = "sentenciado",
  SANCIONADO = "sancionado",
  ARCHIVADO = "archivado",
  ABSUELTO = "absuelto",
  NO_ESPECIFICADO = "no_especificado",
}

export interface BackgroundBase {
  id: string;
  publication_date: string;
  type: BackgroundType;
  status: BackgroundStatus;
  title: string;
  summary: string;
  sanction: string | null;
  source: string | null;
  source_url: string | null;
}
