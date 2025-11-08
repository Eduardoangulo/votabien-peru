"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChamberType,
  LegislatorCondition,
  PersonWithActivePeriod,
} from "@/interfaces/politics";
import { AdminLegislator } from "@/interfaces/admin";
import {
  createLegislatorPeriod,
  updateLegislatorPeriod,
} from "../_lib/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PersonSelector } from "./person-selector";
import { AdminLegislatorContext } from "@/components/context/admin-legislator";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { CalendarDatePicker } from "@/components/date-picker";

const legislatorPeriodSchema = z
  .object({
    id: z.string(),
    person_id: z.string().min(1, "Debe seleccionar una persona"),
    chamber: z.enum(ChamberType),
    condition: z.enum(LegislatorCondition),
    electoral_district_id: z
      .string()
      .min(1, "Debe seleccionar un distrito electoral"),
    original_party_id: z
      .string()
      .min(1, "Debe seleccionar el partido original"),
    current_party_id: z.string().nullable(),
    start_date: z.string(),
    end_date: z.string(),
    parliamentary_group: z.string().transform((val) =>
      val
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim(),
    ),
    institutional_email: z
      .union([z.email({ message: "Email inválido" }), z.literal("")])
      .optional(),
    active: z.boolean(),
  })
  .refine(
    (data) => {
      // Validar que end_date sea posterior a start_date
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

type LegislatorPeriodFormValues = z.infer<typeof legislatorPeriodSchema>;

interface LegislatorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  mode?: "create" | "edit";
  initialData?: Partial<AdminLegislator>;
}

export function LegislatorFormDialog({
  open,
  onOpenChange,
  mode = "create",
  initialData,
}: LegislatorFormDialogProps) {
  const { districts, parties } = useContext(AdminLegislatorContext);
  const [selectedPerson, setSelectedPerson] =
    useState<PersonWithActivePeriod | null>(null);
  const router = useRouter();
  const form = useForm<z.output<typeof legislatorPeriodSchema>>({
    resolver: zodResolver(legislatorPeriodSchema),
    defaultValues: {
      id: initialData?.id || "",
      person_id: initialData?.person_id || "",
      chamber: initialData?.chamber || ChamberType.CONGRESO,
      condition: initialData?.condition || LegislatorCondition.EN_EJERCICIO,
      electoral_district_id: "",
      original_party_id: "",
      current_party_id: null,
      start_date: "",
      end_date: "",
      parliamentary_group: "",
      institutional_email: "",
      active: true,
    },
  });

  // Actualizar formulario cuando cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...form.getValues(),
        ...initialData,
      });
      setSelectedPerson(initialData.person ?? null);
    }
  }, [initialData, form]);

  const handlePersonSelect = (person: PersonWithActivePeriod | null) => {
    setSelectedPerson(person);
    if (person) {
      form.setValue("person_id", person.id);
    } else {
      form.setValue("person_id", "");
    }
  };

  const onSubmit = async (values: LegislatorPeriodFormValues) => {
    const isEditing = mode === "edit";
    const action = isEditing ? updateLegislatorPeriod : createLegislatorPeriod;
    const message = isEditing ? "actualizado" : "creado";

    toast.promise(action(values), {
      loading: `${isEditing ? "Actualizando" : "Creando"} periodo legislativo...`,
      success: `Periodo legislativo ${message} exitosamente`,
      error: (err) =>
        err?.message || `Error al ${message} el periodo legislativo`,
    });

    onOpenChange(false);
    router.refresh();
    form.reset();
  };

  useEffect(() => {
    if (!open) {
      form.reset();
      setSelectedPerson(null);
    }
  }, [open, form]);

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent className="md:min-w-2xl">
        <CredenzaHeader>
          <CredenzaTitle>
            {mode === "create"
              ? "Nuevo Periodo Legislativo"
              : "Editar Periodo Legislativo"}
          </CredenzaTitle>
          <CredenzaDescription>
            Asigna un periodo legislativo a una persona existente
          </CredenzaDescription>
        </CredenzaHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CredenzaBody className="space-y-4">
              {/* Selector de Persona */}
              <FormField
                control={form.control}
                name="person_id"
                render={() => (
                  <FormItem>
                    <FormLabel>Persona *</FormLabel>
                    <FormControl>
                      <PersonSelector
                        onSelect={handlePersonSelect}
                        selectedPerson={selectedPerson}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cámara y Distrito */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="chamber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cámara *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cámara" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ChamberType).map((cam) => (
                            <SelectItem key={cam} value={cam}>
                              {cam}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="electoral_district_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distrito Electoral *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar distrito" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {districts?.map((district) => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha Inicio *</FormLabel>
                      <FormControl>
                        <CalendarDatePicker
                          date={{
                            from: field.value
                              ? new Date(field.value)
                              : undefined,
                            to: field.value ? new Date(field.value) : undefined,
                          }}
                          onDateSelect={({ from }) => {
                            if (from) {
                              form.setValue("start_date", from.toISOString());
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha Fin *</FormLabel>
                      <FormControl>
                        <CalendarDatePicker
                          date={{
                            from: field.value
                              ? new Date(field.value)
                              : undefined,
                            to: field.value ? new Date(field.value) : undefined,
                          }}
                          onDateSelect={({ from }) => {
                            if (from) {
                              form.setValue("end_date", from.toISOString());
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
              </div>
              {/* Partidos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Partido Original */}
                <FormField
                  control={form.control}
                  name="original_party_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partido Original *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);

                          // Si estamos creando, igualar también el current_party
                          if (mode === "create") {
                            form.setValue("current_party_id", value);
                          }
                        }}
                        defaultValue={field.value}
                        disabled={mode === "edit"} // 🔒 Solo lectura en modo edición
                      >
                        <FormControl>
                          <SelectTrigger
                            className="
                w-full 
                h-auto min-h-15
                text-left
                whitespace-normal break-words
              "
                          >
                            <SelectValue placeholder="Seleccione Partido" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent
                          className="w-[var(--radix-select-trigger-width)]"
                          position="popper"
                          sideOffset={4}
                        >
                          <div className="max-h-[300px] overflow-y-auto">
                            {parties?.map((party) => (
                              <SelectItem
                                key={party.id}
                                value={party.id}
                                className="cursor-pointer h-auto py-2 whitespace-normal break-words leading-snug"
                              >
                                {party.name}
                              </SelectItem>
                            ))}
                          </div>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Partido Actual */}
                <FormField
                  control={form.control}
                  name="current_party_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partido Actual (opcional)</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "none" ? undefined : value)
                        }
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={`
                              w-full 
                              h-auto min-h-15
                              text-left
                              whitespace-normal break-words  
                            `}
                          >
                            <SelectValue placeholder="Seleccione Doctor" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent
                          className="w-[var(--radix-select-trigger-width)]"
                          position="popper"
                          sideOffset={4}
                        >
                          <div className="max-h-[300px] overflow-y-auto">
                            <SelectItem
                              value="none"
                              className="cursor-pointer h-auto py-2"
                            >
                              <span className="block text-left break-words leading-snug">
                                Sin partido
                              </span>
                            </SelectItem>

                            {parties?.map((party) => (
                              <SelectItem
                                key={party.id}
                                value={party.id}
                                className="cursor-pointer h-auto py-2"
                              >
                                <span className="block text-left break-words leading-snug">
                                  {party.name}
                                </span>
                              </SelectItem>
                            ))}
                          </div>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Grupo Parlamentario */}
                <FormField
                  control={form.control}
                  name="parliamentary_group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo Parlamentario</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Bloque Magisterial"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                              .normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "") // quita tildes
                              .toUpperCase() // convierte a mayúsculas
                              .trimStart(); // evita espacios iniciales mientras escribe

                            field.onChange(value);
                          }}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condición *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cámara" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(LegislatorCondition).map((leg) => (
                            <SelectItem key={leg} value={leg}>
                              {leg}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email Institucional */}
              <FormField
                control={form.control}
                name="institutional_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Institucional</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="ejemplo@congreso.gob.pe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Estado Activo */}
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Periodo activo</FormLabel>
                      <FormDescription>
                        Marcar si este periodo legislativo está actualmente en
                        curso
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Botones */}
            </CredenzaBody>
            <CredenzaFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {mode === "create" ? "Crear Periodo" : "Guardar Cambios"}
              </Button>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
}
