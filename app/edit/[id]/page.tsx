import CanvasComponent from "@/components/edit/Canvas";
import { getDrawingById } from "@/app/actions";
import ErrorComponent from "@/app/error";
export default async function App({ params }: { params: { id: string } }) {
  const { id } = params;
  const drawing = await getDrawingById(id);
  if ("error" in drawing) {
    console.error(drawing.error);
    return (
      <ErrorComponent description="Ha ocurrido un error al editar el dibujo" />
    );
  }
  if (drawing?.imageUrl)
    return <CanvasComponent url={drawing.imageUrl}></CanvasComponent>;
}
