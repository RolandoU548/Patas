import { getDrawingById } from "../actions";
import { SpecificDrawing } from "@/components/id/SpecificDrawing";

export default async function editDrawing({
  params,
}: {
  params: { id: string };
}) {
  const drawing = await getDrawingById(params.id);
  if (drawing) return <SpecificDrawing drawing={drawing} />;
}
