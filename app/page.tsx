import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getDrawings } from "@/actions/drawings/drawings";
import { DrawingCard } from "@/components/DrawingCard";

export default async function Home() {
  const drawings = await getDrawings();
  return (
    <>
      <h2 className="text-4xl font-bold">Mis Dibujos</h2>
      <Link href="/new" className={`mt-5 ${buttonVariants()}`}>
        Subir nuevo dibujo
      </Link>
      <Link href="/prueba">La prueba</Link>
      <main className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {drawings.map((drawing) => {
          return <DrawingCard key={drawing.id} drawing={drawing} />;
        })}
      </main>
    </>
  );
}
