"use server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { uploadFile } from "@/firebase/config";

export const getDrawings = async () => {
  const result = await prisma.drawing.findMany();
  return result;
};

export const createDrawing = async (formData: FormData) => {
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const image = formData.get("image") as File;
  if (!title || !image) {
    console.log("Error creating the drawing");
    return;
  }
  let imageUrl;
  try {
    imageUrl = await uploadFile(image);
  } catch (error) {
    console.error(error);
    return;
  }

  const result = await prisma.drawing.create({
    data: { title, description, imageUrl },
  });
  console.log(result);
  redirect("/");
};

export const deleteDrawing = async (id: number) => {
  const drawing = await prisma.drawing.findUnique({
    where: {
      id,
    },
  });
  if (drawing) {
    await prisma.drawing.delete({
      where: {
        id,
      },
    });
  }
};
