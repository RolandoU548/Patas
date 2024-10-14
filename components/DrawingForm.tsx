"use client";
import { useState } from "react";
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
import { v4 as uuidv4 } from "uuid";
import { useCreateDrawingMutation } from "@/lib/services/drawingApi";
import { uploadDrawingToFirebase } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface FormData {
  title: string;
  description: string;
  image: File | null;
}

export default function DrawingForm() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    image: null,
  });
  const router = useRouter();

  const [createDrawing] = useCreateDrawingMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = uuidv4();
    if (!formData.title || !formData.image) {
      console.log("Title and Image are required");
      return;
    }
    try {
      const imageUrl = await uploadDrawingToFirebase(id, formData.image);
      createDrawing({
        id,
        title: formData.title,
        description: formData.description,
        imageUrl,
      });
      router.push("/");
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
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
                placeholder="Título del dibujo"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                className="p-3"
                name="description"
                id="description"
                placeholder="Descripción opcional"
                onChange={handleChange}
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
                onChange={(e) => {
                  if (e.target.files) {
                    setFormData({ ...formData, image: e.target.files[0] });
                  }
                }}
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
