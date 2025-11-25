import { BillApprovalStatus } from "@/interfaces/enums";

export type BadgeVariant =
  | "default"
  | "success"
  | "secondary"
  | "destructive"
  | "outline"
  | "warning";

/**
 * Obtiene la variante de badge según el estado de aprobación
 */
export const getStatusBadgeVariant = (
  status: BillApprovalStatus,
): BadgeVariant => {
  const map: Record<BillApprovalStatus, BadgeVariant> = {
    [BillApprovalStatus.PRESENTADO]: "default",
    [BillApprovalStatus.EN_COMISION]: "warning",
    [BillApprovalStatus.DICTAMEN]: "outline",
    [BillApprovalStatus.EN_AGENDA_PLENO]: "outline",
    [BillApprovalStatus.ORDEN_DEL_DIA]: "outline",
    [BillApprovalStatus.EN_CUARTO_INTERMEDIO]: "warning",
    [BillApprovalStatus.APROBADO_PRIMERA_VOTACION]: "success",
    [BillApprovalStatus.PENDIENTE_SEGUNDA_VOTACION]: "warning",
    [BillApprovalStatus.APROBADO]: "success",
    [BillApprovalStatus.AUTOGRAFA]: "success",
    [BillApprovalStatus.PUBLICADO]: "success",
    [BillApprovalStatus.EN_RECONSIDERACION]: "warning",
    [BillApprovalStatus.RETORNA_A_COMISION]: "warning",
    [BillApprovalStatus.AL_ARCHIVO]: "destructive",
    [BillApprovalStatus.DECRETO_ARCHIVO]: "destructive",
    [BillApprovalStatus.RETIRADO_POR_AUTOR]: "destructive",
  };

  return map[status] ?? "default";
};

/**
 * Formatea una fecha a formato legible en español (Perú)
 */
export const formatterDate = (date: string): string => {
  return new Date(date).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
