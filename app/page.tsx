import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Counter } from "@/components/Counter";
import { DrawingsGrid } from "@/components/DrawingsGrid";
import { Suspense } from "react";
import Loading from "./loading";

export default function Home() {
  return (
    <>
      <h2 className="text-4xl font-bold">Mis Dibujos</h2>
      <Link href="/new" className={`mt-5 ${buttonVariants()}`}>
        Subir nuevo dibujo
      </Link>
      <Link href="/prueba">La prueba</Link>
      <Counter />
      <Suspense fallback={<Loading className="mt-2 justify-center"></Loading>}>
        <DrawingsGrid className="mt-10" />
      </Suspense>
    </>
  );
}
