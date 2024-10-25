"use server";
import prisma from "@/lib/prisma";
import { uploadDrawingToFirebase } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export const getDrawingById = async (id: string) => {
  try {
    const drawing = await prisma.drawing.findUnique({
      where: { id },
    });
    if (!drawing) {
      return { error: "Dibujo no encontrado" };
    }
    return drawing;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Ha ocurrido un error" };
  }
};

export const getDrawings = async () => {
  try {
    const drawings = await prisma.drawing.findMany();
    return drawings;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Ha ocurrido un error" };
  }
};

export const createDrawing = async (data: {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
}) => {
  try {
    if (!data.title || !data.imageUrl) {
      throw new Error("Title and Image are required");
    }
    if (data.id == "") {
      throw new Error("ID cannot be an empty string");
    }
    if (data.id) {
      const existingDrawing = await prisma.drawing.findUnique({
        where: { id: data.id },
      });
      if (existingDrawing) {
        throw new Error("The provided 'id' already exists");
      }
    }
    const result = await prisma.drawing.create({
      data,
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Ha ocurrido un error" };
  }
};

export const createAndUploadDrawing = async (formData: FormData) => {
  try {
    const drawingId = uuidv4();
    uploadDrawingToFirebase(drawingId, formData.get("image") as File);
    return createDrawing({
      id: drawingId,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("image") as string,
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Ha ocurrido un error" };
  }
};

export const updatedDrawing = async (drawingId: string, formData: FormData) => {
  try {
    if (!drawingId) throw new Error("ID cannot be an empty string");
    const drawing = await prisma.drawing.findUnique({
      where: {
        id: drawingId,
      },
    });
    if (!drawing) throw new Error("Drawing not found to update");
    return await prisma.drawing.update({
      where: {
        id: drawingId,
      },
      data: formData,
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Ha ocurrido un error" };
  }
};

export const deleteDrawing = async (drawingId: string) => {
  try {
    if (!drawingId) throw new Error("ID cannot be an empty string");
    const drawing = await prisma.drawing.findUnique({
      where: {
        id: drawingId,
      },
    });
    if (!drawing) throw new Error("Drawing not found to update");
    return await prisma.drawing.delete({
      where: {
        id: drawingId,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Ha ocurrido un error" };
  }
};
