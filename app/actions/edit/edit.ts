"use server";
import prisma from "@/lib/prisma";

export const getDrawingById = async (id: string) => {
  return await prisma.drawing.findFirst({ where: { id } });
};
