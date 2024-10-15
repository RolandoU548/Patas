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
import { useState } from "react";
import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { useDeleteDrawingMutation } from "@/lib/services/drawingApi";
import { deleteDrawingFromFirebase } from "@/lib/utils";

export const DrawingCard = ({ drawing }: { drawing: Drawing }) => {
  const [deleteDrawing] = useDeleteDrawingMutation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
              className="rounded max-h-[90dvh] max-w-[90vw] w-auto object-contain"
              src={drawing.imageUrl}
              alt="dibujo"
              width={600}
              height={600}
            />
          </div>
        </>
      )}
      <Card
        onClick={() => setIsOpen(true)}
        className="flex flex-col justify-between cursor-pointer hover:shadow-dark transition duration-300"
      >
        <CardContent className="pt-4 px-4 pb-0 h-48">
          <Image
            className="rounded w-full h-full object-cover"
            priority
            width={700}
            height={500}
            src={drawing.imageUrl}
            alt={`drawing${drawing.id}`}
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
        <CardFooter className="pb-4 flex justify-between">
          <Link href="edit" className={buttonVariants()}>
            Editar
          </Link>
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteDrawing(drawing.id);
              deleteDrawingFromFirebase(drawing.id);
            }}
          >
            BORRAR
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
