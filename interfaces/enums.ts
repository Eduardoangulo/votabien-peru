export enum BillApprovalStatus {
  // # PRESENTADO
  PRESENTADO = "presentado",
  EN_COMISION = "en_comision",

  // # EN PROCESO
  DICTAMEN = "dictamen",
  EN_AGENDA_PLENO = "en_agenda_pleno",
  ORDEN_DEL_DIA = "orden_del_dia",
  EN_CUARTO_INTERMEDIO = "en_cuarto_intermedio",
  APROBADO_PRIMERA_VOTACION = "aprobado_primera_votacion",
  PENDIENTE_SEGUNDA_VOTACION = "pendiente_segunda_votacion",
  EN_RECONSIDERACION = "en_reconsideracion",
  RETORNA_A_COMISION = "retorna_a_comision",

  // # APROBADO
  APROBADO = "aprobado",
  AUTOGRAFA = "autografa",
  PUBLICADO = "publicado", // # Diario el Peruano

  //# ARCHIVADO
  // # proyectos rechazados en comision o en votacion por el pleno
  AL_ARCHIVO = "al_archivo",
  // # proyectos rechazados por no cumplir requisitos o tiene problemas
  // # formales o constitucionles
  DECRETO_ARCHIVO = "decreto_archivo",

  //# RETIRADO
  RETIRADO_POR_AUTOR = "retirado_por_autor",
}

// ============================================================
// ======= GRUPOS DE ESTADOS DE PROYECTOS =====================
// ============================================================

// Grupos de estados para filtrado y visualización
export enum BillStatusGroup {
  PRESENTADO = "PRESENTADO",
  EN_PROCESO = "EN PROCESO",
  APROBADO = "APROBADO",
  ARCHIVADO = "ARCHIVADO",
  RETIRADO = "RETIRADO",
}

// Mapeo de estados individuales a grupos
export const STATUS_TO_GROUP: Record<BillApprovalStatus, BillStatusGroup> = {
  [BillApprovalStatus.PRESENTADO]: BillStatusGroup.PRESENTADO,
  [BillApprovalStatus.EN_COMISION]: BillStatusGroup.PRESENTADO,

  [BillApprovalStatus.DICTAMEN]: BillStatusGroup.EN_PROCESO,
  [BillApprovalStatus.EN_AGENDA_PLENO]: BillStatusGroup.EN_PROCESO,
  [BillApprovalStatus.ORDEN_DEL_DIA]: BillStatusGroup.EN_PROCESO,
  [BillApprovalStatus.EN_CUARTO_INTERMEDIO]: BillStatusGroup.EN_PROCESO,
  [BillApprovalStatus.APROBADO_PRIMERA_VOTACION]: BillStatusGroup.EN_PROCESO,
  [BillApprovalStatus.PENDIENTE_SEGUNDA_VOTACION]: BillStatusGroup.EN_PROCESO,
  [BillApprovalStatus.EN_RECONSIDERACION]: BillStatusGroup.EN_PROCESO,
  [BillApprovalStatus.RETORNA_A_COMISION]: BillStatusGroup.EN_PROCESO,

  [BillApprovalStatus.APROBADO]: BillStatusGroup.APROBADO,
  [BillApprovalStatus.AUTOGRAFA]: BillStatusGroup.APROBADO,
  [BillApprovalStatus.PUBLICADO]: BillStatusGroup.APROBADO,

  [BillApprovalStatus.AL_ARCHIVO]: BillStatusGroup.ARCHIVADO,
  [BillApprovalStatus.DECRETO_ARCHIVO]: BillStatusGroup.ARCHIVADO,

  [BillApprovalStatus.RETIRADO_POR_AUTOR]: BillStatusGroup.RETIRADO,
};

// Labels amigables para los estados
export const STATUS_LABELS: Record<BillApprovalStatus, string> = {
  [BillApprovalStatus.PRESENTADO]: "Presentado",
  [BillApprovalStatus.EN_COMISION]: "En Comisión",
  [BillApprovalStatus.DICTAMEN]: "Dictamen",
  [BillApprovalStatus.EN_AGENDA_PLENO]: "En Agenda Pleno",
  [BillApprovalStatus.ORDEN_DEL_DIA]: "Orden del Día",
  [BillApprovalStatus.EN_CUARTO_INTERMEDIO]: "En Cuarto Intermedio",
  [BillApprovalStatus.APROBADO_PRIMERA_VOTACION]: "Aprobado 1ra Votación",
  [BillApprovalStatus.PENDIENTE_SEGUNDA_VOTACION]: "Pendiente 2da Votación",
  [BillApprovalStatus.EN_RECONSIDERACION]: "En Reconsideración",
  [BillApprovalStatus.RETORNA_A_COMISION]: "Retorna a Comisión",
  [BillApprovalStatus.APROBADO]: "Aprobado",
  [BillApprovalStatus.AUTOGRAFA]: "Autógrafa",
  [BillApprovalStatus.PUBLICADO]: "Publicado",
  [BillApprovalStatus.AL_ARCHIVO]: "Al Archivo",
  [BillApprovalStatus.DECRETO_ARCHIVO]: "Decreto Archivo",
  [BillApprovalStatus.RETIRADO_POR_AUTOR]: "Retirado por Autor",
};

// Función helper para obtener el grupo de un estado
export const getStatusGroup = (status: BillApprovalStatus): BillStatusGroup => {
  return STATUS_TO_GROUP[status];
};
