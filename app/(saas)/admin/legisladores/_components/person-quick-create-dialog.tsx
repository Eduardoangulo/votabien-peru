"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPerson } from "../_lib/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  CreatePersonRequest,
  PersonWithActivePeriod,
} from "@/interfaces/person";

interface PersonQuickCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPersonCreated: (person: PersonWithActivePeriod) => void;
}

export function PersonQuickCreateDialog({
  open,
  onOpenChange,
  onPersonCreated,
}: PersonQuickCreateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePersonRequest>({
    name: "",
    lastname: "",
    profession: "",
    birth_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createPerson(formData);

      if (result.success) {
        toast.success("Persona creada exitosamente");
        onPersonCreated(result.data as PersonWithActivePeriod);
        // Reset form
        setFormData({
          name: "",
          lastname: "",
          profession: "",
          birth_date: "",
        });
      } else {
        toast.error(result.error || "Error al crear persona");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error inesperado al crear persona");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nueva Persona</DialogTitle>
          <DialogDescription>
            Ingresa los datos básicos. Podrás completar más información después.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombres *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Juan Carlos"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastname">Apellidos *</Label>
            <Input
              id="lastname"
              value={formData.lastname}
              onChange={(e) =>
                setFormData({ ...formData, lastname: e.target.value })
              }
              placeholder="García López"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profesión</Label>
            <Input
              id="profession"
              value={formData.profession}
              onChange={(e) =>
                setFormData({ ...formData, profession: e.target.value })
              }
              placeholder="Abogado, Ingeniero, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) =>
                setFormData({ ...formData, birth_date: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Persona
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
