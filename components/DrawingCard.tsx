"use client";
import Image from "next/image";
import Link from "next/link";
import type { Drawing } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React, { useState } from "react";
import { deleteDrawing } from "@/app/actions";
import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

export const DrawingCard = ({ drawing }: { drawing: Drawing }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDownload = async (url: string, name: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const href = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = href;
    a.download = name;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(href);
  };

  return (
    <>
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="w-[100vw] h-[100dvh] fixed top-0 left-0 bg-black opacity-80 z-30"
          />
          <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-50">
            <Image
              className="rounded max-h-[90dvh] max-w-[90vw] w-auto object-contain outline-double outline-4 outline-offset-4 outline-primary"
              src={drawing.imageUrl}
              alt={drawing.title}
              width={400}
              height={400}
            />
          </div>
        </>
      )}
      <Card className="flex flex-col justify-between hover:shadow-dark transition duration-300">
        <CardContent className="pt-4 px-4 pb-0 h-48">
          <Image
            className="rounded w-full h-full object-cover hover:scale-105 transition duration-300 cursor-pointer"
            onClick={() => setIsOpen(true)}
            priority
            width={100}
            height={100}
            src={drawing.imageUrl}
            alt={drawing.title}
          />
        </CardContent>
        <CardHeader className="py-2">
          <CardTitle className="font-semibold text-lg uppercase line-clamp-1 py-0">
            {drawing.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground break-words line-clamp-2">
            {drawing.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="pb-4 flex justify-between flex-wrap gap-1">
          <Link
            aria-label="Ver"
            href={`drawing/${drawing.id}`}
            className={buttonVariants()}
          >
            <FaEye />
          </Link>
          <Link
            aria-label="Editar"
            href={`edit/${drawing.id}`}
            className={buttonVariants()}
          >
            <FaEdit />
          </Link>
          <Button
            aria-label="Descargar"
            onClick={() => {
              handleDownload(drawing.imageUrl, drawing.title);
            }}
          >
            <FaDownload />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"} aria-label="Borrar">
                <FaTrash />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿Estás completamente seguro?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Eliminará permanentemente el
                  dibujo y sus datos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground"
                  onClick={() => {
                    deleteDrawing(drawing.id);
                  }}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </>
  );
};
