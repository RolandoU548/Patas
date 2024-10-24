import prisma from "@/lib/prisma";
import CanvasComponent from "@/components/edit/Canvas";
export default async function App({ params }: { params: { id: string } }) {
  const { id } = params;
  const drawing = await prisma.drawing.findFirst({ where: { id } });

  if (drawing?.imageUrl)
    return <CanvasComponent url={drawing.imageUrl}></CanvasComponent>;
}
