import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const drawing = await prisma.drawing.findUnique({
    where: { id },
  });
  return NextResponse.json(drawing);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const drawing = await prisma.drawing.findUnique({
    where: {
      id,
    },
  });
  if (drawing) {
    const deletedDrawing = await prisma.drawing.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(deletedDrawing);
  }
  return NextResponse.json(
    { message: "Drawing doesn't exist" },
    { status: 404 }
  );
}
