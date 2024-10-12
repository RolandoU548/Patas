import { createDrawing } from "@/actions/drawings/drawings";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Button } from "./ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DrawingForm() {
  return (
    <form action={createDrawing}>
      <Card className="max-w-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Subir nuevo dibujo</CardTitle>
          <CardDescription>
            Agrega un nuevo dibujo a tu colección.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <main className="flex flex-col gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Título</Label>
              <Input
                className="p-3 border border-dark"
                type="text"
                name="title"
                id="title"
                required
                placeholder="Título del dibujo"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                className="p-3 border border-dark"
                name="description"
                id="description"
                placeholder="Descripción opcional"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="image">Dibujo</Label>
              <Input
                className="border border-dark"
                type="file"
                name="image"
                id="image"
                accept="image/png, image/jpeg, image/gif"
                required
              />
            </div>
          </main>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Volver
          </Link>
          <Button type="submit">Siguiente</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
