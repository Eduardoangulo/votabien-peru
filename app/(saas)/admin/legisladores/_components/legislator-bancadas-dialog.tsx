import React, { useState, useEffect, useContext, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  ExternalLink,
  SquarePen,
  AlertCircle,
  Trash2,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarDatePicker } from "@/components/date-picker";
import { toast } from "sonner";
import { AdminLegislatorContext } from "@/components/context/admin-legislator";
import { GroupChangeReason } from "@/interfaces/politics";
import Link from "next/link";
import Image from "next/image";
import {
  createParliamentaryMembership,
  deleteParliamentaryMembership,
  updateParliamentaryMembership,
} from "../_lib/actions";
import {
  CreateParliamentaryMembershipResult,
  ParliamentaryMembershipWithGroup,
} from "@/interfaces/parliamentary-membership";

const REASON_CONFIG = {
  [GroupChangeReason.INICIAL]: {
    label: "Inicial",
    color: "bg-info/10 text-info border-info/20",
  },
  [GroupChangeReason.CAMBIO_VOLUNTARIO]: {
    label: "Cambio Voluntario",
    color: "bg-primary/10 text-primary border-primary/20",
  },
  [GroupChangeReason.EXPULSION]: {
    label: "Expulsión",
    color: "bg-destructive/10 text-destructive border-destructive/20",
  },
  [GroupChangeReason.RENUNCIA]: {
    label: "Renuncia",
    color: "bg-warning/10 text-warning border-warning/20",
  },
  [GroupChangeReason.DISOLUCION_BANCADA]: {
    label: "Disolución de Bancada",
    color:
      "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
  },
  [GroupChangeReason.CAMBIO_ESTRATEGICO]: {
    label: "Cambio Estratégico",
    color: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  },
  [GroupChangeReason.SANCION_DISCIPLINARIA]: {
    label: "Sanción Disciplinaria",
    color: "bg-destructive/15 text-destructive border-destructive/25",
  },
  [GroupChangeReason.OTRO]: {
    label: "Otro",
    color: "bg-muted text-muted-foreground border-border",
  },
};

const membershipSchema = z
  .object({
    id: z.string(),
    parliamentary_group_id: z
      .string()
      .min(1, "Debe seleccionar un grupo parlamentario"),
    start_date: z.string().min(1, "Fecha de inicio requerida"),
    end_date: z.string().nullable(),
    change_reason: z.enum(GroupChangeReason),
    source_url: z
      .union([z.string().url({ message: "URL inválida" }), z.literal("")])
      .optional(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message:
        "La fecha de fin debe ser posterior o igual a la fecha de inicio",
      path: ["end_date"],
    },
  );

type MembershipFormValues = z.infer<typeof membershipSchema>;

interface ParliamentaryMembershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  legislatorName: string;
  legislator_id: string;
  memberships: ParliamentaryMembershipWithGroup[];
}

export function ParliamentaryMembershipDialog({
  open,
  onOpenChange,
  legislatorName,
  legislator_id,
  memberships: initialMemberships,
}: ParliamentaryMembershipDialogProps) {
  const [memberships, setMemberships] =
    useState<ParliamentaryMembershipWithGroup[]>(initialMemberships);
  const [editingMembership, setEditingMembership] =
    useState<ParliamentaryMembershipWithGroup | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { parliamentaryGroups } = useContext(AdminLegislatorContext);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const form = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      id: "",
      parliamentary_group_id: "",
      start_date: "",
      end_date: null,
      change_reason: GroupChangeReason.CAMBIO_VOLUNTARIO,
      source_url: "",
    },
  });

  useEffect(() => {
    setMemberships(initialMemberships);
  }, [initialMemberships]);

  useEffect(() => {
    if (!open) {
      form.reset();
      setEditingMembership(null);
      setShowForm(false);
    }
  }, [open, form]);

  const handleEdit = useCallback(
    (membership: ParliamentaryMembershipWithGroup) => {
      setEditingMembership(membership);
      form.reset({
        id: membership.id,
        parliamentary_group_id: membership.parliamentary_group_id,
        start_date: membership.start_date,
        end_date: membership.end_date || null,
        change_reason: membership.change_reason,
        source_url: membership.source_url || "",
      });
      setShowForm(true);
    },
    [form],
  );

  const handleCancel = useCallback(() => {
    form.reset();
    setEditingMembership(null);
    setShowForm(false);
  }, [form]);
  const handleDelete = async (membershipId: string) => {
    // Confirmación antes de eliminar
    if (
      !confirm("¿Estás seguro de que deseas eliminar este cambio de bancada?")
    ) {
      return;
    }

    setIsDeleting(membershipId);

    try {
      const result = await deleteParliamentaryMembership(
        legislator_id,
        membershipId,
      );

      if (!result.success) {
        toast.error(result.error || "Error al eliminar el cambio de bancada");
        return;
      }

      // Eliminar de la lista local
      setMemberships((prev) => prev.filter((m) => m.id !== membershipId));

      toast.success("Cambio de bancada eliminado exitosamente");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al eliminar el cambio de bancada",
      );
    } finally {
      setIsDeleting(null);
    }
  };
  const onSubmit = async (values: MembershipFormValues) => {
    const isEditing = !!editingMembership;
    const actionLabel = isEditing ? "actualizado" : "creado";

    setIsSubmitting(true);

    try {
      let result;

      if (isEditing) {
        // Solo devuelve la membresía actualizada
        result = await updateParliamentaryMembership(legislator_id, values);

        if (!result.success) {
          toast.error(
            result.error || `Error al ${actionLabel} el cambio de bancada`,
          );
          return;
        }

        if (result.data) {
          const updatedMembership =
            result.data as ParliamentaryMembershipWithGroup;

          setMemberships((prev) =>
            prev.map((m) =>
              m.id === updatedMembership.id ? updatedMembership : m,
            ),
          );
        }
      } else {
        const { id, ...createData } = values;
        result = await createParliamentaryMembership(legislator_id, createData);

        if (!result.success) {
          toast.error(
            result.error || `Error al ${actionLabel} el cambio de bancada`,
          );
          return;
        }

        if (result.data) {
          const { created, updated } =
            result.data as CreateParliamentaryMembershipResult;

          setMemberships((prev) => {
            // 1. Si existe updated, actualizar la membresía anterior
            const updatedList = updated
              ? prev.map((m) => (m.id === updated.id ? updated : m))
              : prev;

            // 2. Agregar la nueva membresía al inicio
            return [created, ...updatedList];
          });
        }
      }

      toast.success(`Cambio de bancada ${actionLabel} exitosamente`);
      handleCancel();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Error al ${actionLabel} el cambio de bancada`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Actualidad";
    return new Date(dateString).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const sortedMemberships = [...memberships].sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
  );

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent className="sm:max-w-3xl md:max-h-[95vh]">
        <CredenzaHeader>
          <CredenzaTitle>Historial de Bancadas</CredenzaTitle>
        </CredenzaHeader>

        <CredenzaBody className="space-y-4 md:max-h-[70vh] md:overflow-y-auto">
          {/* Lista de membresías existentes */}
          {!showForm && (
            <div className="space-y-3 sm:space-y-4">
              {/* Header mejorado */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 pb-3 border-b">
                <div>
                  <h3 className="font-semibold text-sm sm:text-lg">
                    {legislatorName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {memberships.length}{" "}
                    {memberships.length === 1
                      ? "cambio registrado"
                      : "cambios registrados"}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowForm(true)}
                  className="gap-2 shadow-sm hover:shadow-md transition-shadow w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo Cambio
                </Button>
              </div>

              {memberships.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-muted to-muted/50 mb-3">
                    <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium text-sm sm:text-base mb-1">
                    Sin cambios registrados
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                    Comienza agregando el primer cambio de bancada
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowForm(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar Primer Cambio
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5 sm:space-y-3">
                  {sortedMemberships.map((membership) => {
                    const isBeingDeleted = isDeleting === membership.id;
                    const isCurrentMembership = !membership.end_date;

                    return (
                      <div
                        key={membership.id}
                        className={`
                        relative rounded-lg sm:rounded-xl border-2 bg-card overflow-hidden
                        transition-all duration-300
                        ${
                          isBeingDeleted
                            ? "opacity-40 scale-[0.98] border-destructive/30 bg-destructive/5"
                            : isCurrentMembership
                              ? "border-primary/30 bg-primary/5 shadow-md shadow-primary/5"
                              : "border-border hover:border-primary/20 hover:shadow-sm"
                        }
                      `}
                      >
                        {/* Accent bar */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
                          style={{
                            backgroundColor: isCurrentMembership
                              ? "hsl(var(--primary))"
                              : membership.parliamentary_group?.color_hex ||
                                "transparent",
                          }}
                        />

                        <div className="p-2.5 sm:p-4 pl-3.5 sm:pl-5">
                          <div className="flex gap-2.5 sm:gap-3">
                            {/* Logo con badge */}
                            <div className="relative flex-shrink-0">
                              {membership.parliamentary_group?.logo_url ? (
                                <div
                                  className={`
                                  relative w-14 h-14 sm:w-16 sm:h-16 p-1.5 rounded-xl 
                                  bg-gradient-to-br from-background to-muted/30
                                  border-2 shadow-sm
                                  transition-all duration-300
                                  sm:group-hover:shadow-lg sm:group-hover:scale-105
                                `}
                                  style={{
                                    borderColor:
                                      membership.parliamentary_group
                                        ?.color_hex || "hsl(var(--border))",
                                  }}
                                >
                                  <Image
                                    src={
                                      membership.parliamentary_group.logo_url
                                    }
                                    alt={`Logo ${membership.parliamentary_group.name}`}
                                    className="w-full h-full object-contain"
                                    width={64}
                                    height={64}
                                  />
                                </div>
                              ) : (
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-muted to-muted/50 border-2 flex items-center justify-center">
                                  <span className="text-2xl text-muted-foreground/50">
                                    ?
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Contenido principal */}
                            <div className="flex-1 min-w-0">
                              {/* Nombre del grupo */}
                              <div className="mb-1.5 sm:mb-2">
                                <h4 className="font-bold text-sm sm:text-base leading-tight mb-0.5 sm:mb-1">
                                  {membership.parliamentary_group?.name ||
                                    "Grupo no encontrado"}
                                </h4>
                                {membership.parliamentary_group?.acronym && (
                                  <span className="inline-flex items-center text-xs sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground font-semibold">
                                    {membership.parliamentary_group.acronym}
                                  </span>
                                )}
                              </div>

                              {/* Fechas compactas */}
                              <div className="flex items-center gap-1.5 mb-2 text-xs sm:text-sm">
                                <div className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-muted/50">
                                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500" />
                                  <span className="font-medium text-xs sm:text-xs">
                                    {formatDate(membership.start_date)}
                                  </span>
                                </div>

                                <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />

                                <div
                                  className={`
                                  flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md
                                  ${
                                    isCurrentMembership
                                      ? "bg-primary/10 ring-1 ring-primary/30"
                                      : "bg-muted/50"
                                  }
                                `}
                                >
                                  <div
                                    className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                                      isCurrentMembership
                                        ? "bg-primary"
                                        : "bg-red-500"
                                    }`}
                                  />
                                  <span
                                    className={`font-medium text-xs sm:text-xs ${
                                      isCurrentMembership ? "text-primary" : ""
                                    }`}
                                  >
                                    {membership.end_date
                                      ? formatDate(membership.end_date)
                                      : "Actualidad"}
                                  </span>
                                </div>
                              </div>

                              {/* Tags */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <div
                                  className={`
                                  inline-flex items-center gap-1 text-xs sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border font-semibold
                                  ${REASON_CONFIG[membership.change_reason]?.color || REASON_CONFIG[GroupChangeReason.OTRO].color}
                                `}
                                >
                                  {/* <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-current" /> */}
                                  <span>
                                    {REASON_CONFIG[membership.change_reason]
                                      ?.label || membership.change_reason}
                                  </span>
                                </div>

                                {membership.source_url && (
                                  <Link
                                    href={membership.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                                  >
                                    <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    <span className="hidden sm:inline">
                                      Ver fuente
                                    </span>
                                    <span className="sm:hidden">Fuente</span>
                                  </Link>
                                )}
                              </div>

                              {/* Botones de acción */}
                              <div className="flex gap-1.5 mt-2 sm:mt-2.5">
                                <Button
                                  size="sm"
                                  type="button"
                                  variant="outline"
                                  onClick={() => handleEdit(membership)}
                                  disabled={isBeingDeleted}
                                  className="flex-1 h-7 sm:h-8 px-2 sm:px-3 gap-1 sm:text-xs hover:bg-primary/10 hover:text-primary hover:border-primary disabled:opacity-30 transition-all"
                                >
                                  <SquarePen className="h-3 w-3" />
                                  <span className="font-medium">Editar</span>
                                </Button>
                                <Button
                                  size="sm"
                                  type="button"
                                  variant="outline"
                                  onClick={() => handleDelete(membership.id)}
                                  disabled={isBeingDeleted}
                                  className="flex-1 h-7 sm:h-8 px-2 sm:px-3 gap-1 sm:text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive disabled:opacity-70 transition-all"
                                >
                                  {isBeingDeleted ? (
                                    <>
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                      <span className="font-medium">
                                        Eliminando...
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="h-3 w-3" />
                                      <span className="font-medium">
                                        Eliminar
                                      </span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Formulario de creación/edición */}
          {showForm && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 sm:space-y-4"
              >
                <div className="bg-muted/30 border rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
                  <h3 className="text-sm sm:text-base font-semibold">
                    {editingMembership
                      ? "Editar Cambio de Bancada"
                      : "Nuevo Cambio de Bancada"}
                  </h3>

                  {/* Grupo Parlamentario */}
                  <FormField
                    control={form.control}
                    name="parliamentary_group_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                          Grupo Parlamentario *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 sm:h-10">
                              <SelectValue placeholder="Seleccionar grupo parlamentario" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[250px] sm:max-h-[400px]">
                            {parliamentaryGroups.map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name}{" "}
                                {group.acronym && `(${group.acronym})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fechas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">
                            Fecha de Inicio *
                          </FormLabel>
                          <FormControl>
                            <CalendarDatePicker
                              date={{
                                from: field.value
                                  ? new Date(field.value)
                                  : undefined,
                                to: field.value
                                  ? new Date(field.value)
                                  : undefined,
                              }}
                              onDateSelect={({ from }) => {
                                if (from) {
                                  form.setValue(
                                    "start_date",
                                    from.toISOString(),
                                  );
                                }
                              }}
                              variant="outline"
                              numberOfMonths={1}
                              withoutdropdown
                              closeOnSelect
                              yearsRange={13}
                              centerCurrentYear
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => {
                        const currentDate = field.value
                          ? new Date(field.value)
                          : null;

                        return (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm">
                              Fecha de Fin
                            </FormLabel>
                            <div className="flex gap-1.5 items-start">
                              <FormControl className="flex-1">
                                <CalendarDatePicker
                                  date={{
                                    from: currentDate || undefined,
                                    to: currentDate || undefined,
                                  }}
                                  onDateSelect={({ from }) => {
                                    if (from) {
                                      field.onChange(from.toISOString());
                                    } else {
                                      field.onChange(null);
                                    }
                                  }}
                                  variant="outline"
                                  numberOfMonths={1}
                                  withoutdropdown
                                  yearsRange={13}
                                  centerCurrentYear
                                  className="w-full"
                                />
                              </FormControl>
                              {field.value && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => field.onChange(null)}
                                  className="shrink-0 h-9 w-9"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  {/* Motivo del Cambio */}
                  <FormField
                    control={form.control}
                    name="change_reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                          Motivo del Cambio *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 sm:h-10">
                              <SelectValue placeholder="Seleccionar motivo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(REASON_CONFIG).map(
                              ([key, config]) => (
                                <SelectItem key={key} value={key}>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`inline-block w-2 h-2 rounded-full ${config.color
                                        .split(" ")[0]
                                        .replace("/10", "")}`}
                                    />
                                    {config.label}
                                  </div>
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* URL de Fuente */}
                  <FormField
                    control={form.control}
                    name="source_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                          URL de Fuente
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://ejemplo.com/noticia"
                            {...field}
                            value={field.value || ""}
                            disabled={isSubmitting}
                            className="h-9 sm:h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Botones de acción */}
                  <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto h-9"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto h-9"
                    >
                      {isSubmitting
                        ? "Guardando..."
                        : editingMembership
                          ? "Actualizar"
                          : "Crear"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          )}
        </CredenzaBody>

        {!showForm && (
          <CredenzaFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto h-9"
            >
              Cerrar
            </Button>
          </CredenzaFooter>
        )}
      </CredenzaContent>
    </Credenza>
  );
}
