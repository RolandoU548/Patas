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
  const result = await prisma.drawing.create({
    data: body,
  });
  return NextResponse.json(result, { status: 201 });
}
