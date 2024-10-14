import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const drawings = await prisma.drawing.findMany();
  return NextResponse.json(drawings);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.title || !body.imageUrl) {
    return NextResponse.json(
      { message: "'title' and 'imageUrl' are required." },
      { status: 400 }
    );
  }
  if (body.id == "") {
    return NextResponse.json(
      { message: "'id' cannot be an empty string." },
      { status: 400 }
    );
  }
  if (body.id) {
    const existingDrawing = await prisma.drawing.findUnique({
      where: { id: body.id },
    });
    if (existingDrawing) {
      return NextResponse.json(
        { message: "The provided 'id' already exists." },
        { status: 400 }
      );
    }
  }

  const result = await prisma.drawing.create({
    data: { ...body },
  });
  return NextResponse.json(result, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const drawing = await prisma.drawing.findUnique({
    where: {
      id: body.id,
    },
  });
  if (drawing) {
    const updatedDrawing = await prisma.drawing.update({
      where: {
        id: body.id,
      },
      data: body,
    });
    return NextResponse.json(updatedDrawing);
  }
  return NextResponse.json(
    { message: "Drawing doesn't exist" },
    { status: 404 }
  );
}
