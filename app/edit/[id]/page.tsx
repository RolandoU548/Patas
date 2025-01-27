import prisma from "@/lib/prisma";
import CanvasComponent from "@/components/edit/Canvas";
import NotFound from "@/app/not-found";

export default async function App({ params }: { params: { id: string } }) {
  const { id } = params;
  const drawing = await prisma.drawing.findFirst({ where: { id } });

  if (!drawing) return <NotFound />;
  if (drawing?.imageUrl)
    return <CanvasComponent drawing={drawing}></CanvasComponent>;
}
