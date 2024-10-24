import CanvasComponent from "@/components/edit/Canvas";
import { getDrawingById } from "@/app/actions/edit/edit";
export default async function App({ params }: { params: { id: string } }) {
  const { id } = params;
  const drawing = await getDrawingById(id);
  if (drawing?.imageUrl)
    return <CanvasComponent url={drawing.imageUrl}></CanvasComponent>;
}
