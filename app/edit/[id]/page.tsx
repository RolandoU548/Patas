import CanvasComponent from "@/components/edit/Canvas";
import { useGetDrawingByIdQuery } from "@/lib/services/drawingApi";
import ErrorComponent from "@/app/error";
import Loading from "@/app/loading";
export default async function App({ params }: { params: { id: string } }) {
  const { id } = params;
  const {
    data: drawing,
    error,
    isLoading,
    isFetching,
  } = useGetDrawingByIdQuery(id);
  if (drawing) {
    if (error) {
      console.error(error);
      return (
        <ErrorComponent description="Ha ocurrido un error al editar el dibujo" />
      );
    }
    if (isLoading || isFetching) {
      return <Loading />;
    }
    return <CanvasComponent drawing={drawing}></CanvasComponent>;
  }
}
