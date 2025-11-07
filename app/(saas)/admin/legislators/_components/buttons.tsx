"use client";
// import IncidentModal from "@/components/modals/incident-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { LegislatorFormDialog } from "./legislator-form-dialog";

export function CreateLegislator() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Plus />
        Crear
      </Button>
      <LegislatorFormDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
