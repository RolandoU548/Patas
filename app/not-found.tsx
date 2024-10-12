import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-semibold">No Encontrado</h2>
      <p className="text-xl text-muted-foreground font-light">
        No se ha podido encontrar el recurso
      </p>
      <Link href="/" className={`mt-3 font-bold ${buttonVariants()}`}>
        Volver a Inicio
      </Link>
    </div>
  );
}
