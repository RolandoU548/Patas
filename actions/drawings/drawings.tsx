"use server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { uploadFile } from "@/firebase/config";
import { deleteFile } from "@/firebase/config";
import { v4 as uuidv4 } from "uuid";

export const getDrawings = async () => {
  const result = await prisma.drawing.findMany();
  return result;
};

export const createDrawing = async (formData: FormData) => {
  const id = uuidv4();
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const image = formData.get("image") as File;
  if (!title || !image) {
    console.log("Error creating the drawing");
    return;
  }
  let imageUrl;
  try {
    imageUrl = await uploadFile(image, `drawings/${id}`);
  } catch (error) {
    console.error(error);
    return;
  }

  const result = await prisma.drawing.create({
    data: { id, title, description, imageUrl },
  });
  console.log(result);
  redirect("/");
};

export const deleteDrawing = async (id: string) => {
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
    try {
      await deleteFile(`drawings/${id}`);
    } catch (error) {
      console.error(error);
      return;
    }
  }
};
