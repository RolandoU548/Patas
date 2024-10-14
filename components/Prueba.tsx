"use client";
import {
  useGetDrawingsQuery,
  useGetDrawingByIdQuery,
  useCreateDrawingMutation,
  useDeleteDrawingMutation,
  useUpdateDrawingMutation,
} from "@/lib/services/drawingApi";

export const Prueba = () => {
  const {
    data: drawings,
    error,
    isLoading,
    isFetching,
  } = useGetDrawingsQuery(null);
  const { data: drawing } = useGetDrawingByIdQuery(
    "ef8575bd-8c2e-4638-b4ed-bdbd410da769"
  );
  const [createDrawing] = useCreateDrawingMutation();
  const [deleteDrawing] = useDeleteDrawingMutation();
  const [updateDrawing] = useUpdateDrawingMutation();

  if (isLoading || isFetching) return <h2>Cargando...</h2>;
  if (error) return <h2>ERROR</h2>;
  if (drawings)
    return (
      <div>
        <button
          onClick={() => {
            createDrawing({
              id: "31404213",
              title: "Perro",
              description: "perro blanco",
              imageUrl:
                "https://es.mypet.com/wp-content/uploads/sites/23/2021/03/GettyImages-1143107320-e1597136744606.jpg",
            });
          }}
        >
          CREAR DIBUJO
        </button>
        <button
          onClick={() => {
            deleteDrawing("31404213");
          }}
        >
          Eliminar Dibujo
        </button>
        <button
          onClick={() => {
            updateDrawing({
              id: "dasd",
              imageUrl: "asd",
              description: "asdasd",
            });
          }}
        >
          Actualizar Dibujo
        </button>
        {drawings.map((drawing) => {
          return (
            <div key={drawing.id}>
              {drawing.id} {drawing.title} {drawing.description}
            </div>
          );
        })}
      </div>
    );
};
