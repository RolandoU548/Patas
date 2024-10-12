import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const drawing = await prisma.drawing.findUnique({
    where: { id: Number(id) },
  });
  return NextResponse.json(drawing);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  const drawing = await prisma.drawing.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (drawing) {
    const updateDrawing = await prisma.drawing.update({
      where: {
        id: Number(id),
      },
      data: body,
    });
    return NextResponse.json(updateDrawing);
  }
  return NextResponse.json(
    { message: "Drawing doesn't exist" },
    { status: 404 }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const drawing = await prisma.drawing.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (drawing) {
    const deletedDrawing = await prisma.drawing.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json(deletedDrawing);
  }
  return NextResponse.json(
    { message: "Drawing doesn't exist" },
    { status: 404 }
  );
}
