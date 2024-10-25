"use server";
import prisma from "@/lib/prisma";
import {
  uploadDrawingToFirebase,
  deleteDrawingFromFirebase,
} from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { Drawing } from "@/types";
import { cache } from "react";

export const getDrawingById = cache(
  async (id: string): Promise<Drawing | undefined> => {
    try {
      const drawing = await prisma.drawing.findUnique({
        where: { id },
      });
      if (!drawing) {
        throw new Error("Dibujo no encontrado");
      }
      return drawing;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      console.error("Ha ocurrido un error");
    }
  }
);

export const getDrawings = cache(async (): Promise<Drawing[] | undefined> => {
  try {
    const drawings: Drawing[] = await prisma.drawing.findMany();
    return drawings;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error("Ha ocurrido un error");
  }
});

export const createDrawing = async (data: {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
}): Promise<void> => {
  try {
    if (!data.title || !data.imageUrl) {
      throw new Error("Títlo e imagen son requeridos");
    }
    if (data.id == "") {
      throw new Error("El ID del dibujo no puede ser vacío");
    }
    if (data.id) {
      const existingDrawing = await prisma.drawing.findUnique({
        where: { id: data.id },
      });
      if (existingDrawing) {
        throw new Error("El dibujo con el 'id' dado ya existe");
      }
    }
    await prisma.drawing.create({
      data,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error("Ha ocurrido un error");
  }
};

export const createAndUploadDrawing = async (
  formData: FormData
): Promise<void> => {
  try {
    const drawingId = uuidv4();
    const existingDrawing = await prisma.drawing.findUnique({
      where: { id: drawingId },
    });
    if (existingDrawing) {
      throw new Error("El dibujo con el 'id' dado ya existe");
    }
    const imageUrl = await uploadDrawingToFirebase(
      drawingId,
      formData.get("image") as File
    );
    await createDrawing({
      id: drawingId,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      imageUrl,
    });
    revalidatePath("/");
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error("Ha ocurrido un error");
  }
};

export const updateDrawing = async (
  drawingId: string,
  formData: FormData
): Promise<void> => {
  try {
    if (!drawingId) throw new Error("ID cannot be an empty string");
    const drawing = await prisma.drawing.findUnique({
      where: {
        id: drawingId,
      },
    });
    if (!drawing) throw new Error("Drawing not found to update");
    const data: Partial<Drawing> = {};
    formData.forEach((value, key) => {
      data[key as keyof Drawing] = value as string;
    });
    await prisma.drawing.update({
      where: {
        id: drawingId,
      },
      data,
    });
    revalidatePath("/");
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error("Ha ocurrido un error");
  }
};

export const deleteDrawing = async (drawingId: string): Promise<void> => {
  try {
    if (!drawingId) throw new Error("ID cannot be an empty string");
    const drawing = await prisma.drawing.findUnique({
      where: {
        id: drawingId,
      },
    });
    if (!drawing) throw new Error("Drawing not found to update");
    await Promise.all([
      prisma.drawing.delete({
        where: {
          id: drawingId,
        },
      }),
      deleteDrawingFromFirebase(drawingId),
    ]);
    revalidatePath("/");
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error("Ha ocurrido un error");
  }
};
