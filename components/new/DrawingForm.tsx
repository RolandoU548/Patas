"use client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createAndUploadDrawing } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function DrawingForm() {
  const router = useRouter();

  return (
    <form
      action={async (formData: FormData) => {
        await createAndUploadDrawing(formData);
        router.push("/");
      }}
    >
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
                className="p-3"
                type="text"
                name="title"
                id="title"
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
                maxLength={400}
                placeholder="Descripción opcional"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="image">Dibujo</Label>
              <Input
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
          <Button type="submit">Subir</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
