import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Merienda } from "next/font/google";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";

const merienda = Merienda({
  subsets: ["latin"],
  weight: "400",
});

export const Navbar = () => {
  return (
    <>
      <div className="flex justify-between items-center p-4">
        <Link
          href="/"
          className={`text-4xl text-primary ${merienda.className}`}
        >
          Patas
        </Link>
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¡Feliz Cumpleaños, Josmarly!</AlertDialogTitle>
              <AlertDialogDescription className="text-pretty">
                Espero que la pases muy bien, mi patita, y que cumplas muchos
                más. Muchas gracias por todo. Te quiero mucho.
                <Image
                  priority
                  className="mt-5 mx-auto rounded"
                  src="kiss.gif"
                  alt="Besito"
                  width={150}
                  height={150}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant={"outline"}>Ser Muy Bonita</Button>
              <Button variant={"outline"}>Ser Muy Genial</Button>
              <AlertDialogAction>Ser Ambas</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <ModeToggle />
      </div>
      <hr />
    </>
  );
};
