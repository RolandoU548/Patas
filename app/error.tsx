"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";

interface ErrorProps {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  primaryButton?: React.ReactNode;
  secondaryButton?: React.ReactNode;
}

export default function Error({
  className,
  title,
  description,
  primaryButton,
  secondaryButton,
  ...props
}: ErrorProps) {
  return (
    <AlertDialog defaultOpen {...props}>
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title ?? "¡Ups! Ha ocurrido un error"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ??
              "Ha ocurrido un error en la aplicación. Por favor inténtalo de nuevo."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{secondaryButton ?? "Cancelar"}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              window.location.reload();
            }}
          >
            {primaryButton ?? "Intentar de nuevo"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
