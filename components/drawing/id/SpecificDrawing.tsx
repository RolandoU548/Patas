"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Drawing } from "@/types";
import { updateDrawing } from "@/app/actions";
import { useRouter } from "next/navigation";

export const SpecificDrawing = ({ drawing }: { drawing: Drawing }) => {
  const router = useRouter();
  return (
    <form
      action={async (formData: FormData) => {
        await updateDrawing(drawing.id, formData);
        router.push("/");
      }}
    >
      <Card className="max-w-3xl mx-auto shadow-none border-0 bg-inherit">
        <CardHeader className="p-3 md:p-6 pt-0 md:pt-0">
          <CardTitle className="text-3xl">Editar Dibujo</CardTitle>
          <CardDescription>Edita las propiedades de tu dibujo.</CardDescription>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <main className="flex flex-col gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Título</Label>
              <Input
                className="p-3"
                type="text"
                name="title"
                id="title"
                defaultValue={drawing.title}
                required
                maxLength={200}
                placeholder="Título del dibujo"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                className="p-3"
                name="description"
                id="description"
                defaultValue={drawing.description ?? undefined}
                maxLength={400}
                placeholder="Descripción"
              />
            </div>
            <div className="flex flex-col">
              <Image
                className="border-2 border-primary rounded max-h-[90dvh] max-w-[90vw] w-auto object-contain"
                priority
                src={drawing.imageUrl}
                alt={drawing.title}
                width={768}
                height={600}
                sizes="(max-width:768px) calc(100vw - 44px), 768px"
              />
            </div>
          </main>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Volver
          </Link>
          <Button type="submit">Guardar</Button>
        </CardFooter>
      </Card>
    </form>
  );
};
