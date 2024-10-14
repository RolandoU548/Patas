import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { DrawingsGrid } from "@/components/DrawingsGrid";

export default function Home() {
  return (
    <>
      <h2 className="text-4xl font-bold">Mis Dibujos</h2>
      <Link href="/new" className={`mt-5 ${buttonVariants()}`}>
        Subir nuevo dibujo
      </Link>
      <Link href="/prueba">La prueba</Link>
      <DrawingsGrid className="mt-5" />
    </>
  );
}
