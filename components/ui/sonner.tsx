"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

export function Toaster() {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as "light" | "dark" | "system"}
      position="top-right"
      richColors={false} // Deshabilitamos los colores por defecto
      expand={true}
      duration={4000}
      gap={8}
      visibleToasts={5}
      closeButton
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: "group",
          title: "font-semibold",
          description: "text-sm opacity-90",
          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          cancelButton: "bg-muted text-muted-foreground hover:bg-muted/80",
          closeButton: "hover:bg-muted",
        },
      }}
    />
  );
}
