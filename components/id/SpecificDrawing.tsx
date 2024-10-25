"use client";
import ErrorComponent from "@/app/error";
import { useGetDrawingByIdQuery } from "@/lib/services/drawingApi";
import Loading from "@/app/loading";
import { useParams } from "next/navigation";
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
import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";

import { useUpdateDrawingMutation } from "@/lib/services/drawingApi";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface FormData {
  title?: string;
  description?: string;
}

export const SpecificDrawing = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const {
    data: drawing,
    error,
    isLoading,
    isFetching,
  } = useGetDrawingByIdQuery(id);

  const [formData, setFormData] = useState<FormData>({});
  const [formPending, setFormPending] = useState(false);
  const [buttonAttributes, setButtonAttributes] = useState({
    disabled: true,
  });
  const router = useRouter();

  const [updateDrawing] = useUpdateDrawingMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormPending(true);
    try {
      updateDrawing({
        id,
        title: formData.title,
        description: formData.description,
      });
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setFormPending(false);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData, [e.target.name]: e.target.value };

      const keys: (keyof FormData)[] = Object.keys(
        newFormData
      ) as (keyof FormData)[];

      if (drawing) {
        for (const key of keys) {
          if (drawing[key] != newFormData[key]) {
            setButtonAttributes({ disabled: false });
            return newFormData;
          }
        }
        setButtonAttributes({ disabled: true });
      }
      return newFormData;
    });
  };

  if (isLoading || isFetching)
    return <Loading className="mt-5 justify-center" />;

  if (error)
    return (
      <ErrorComponent description="Ha ocurrido un error al recuperar el dibujo. Por favor inténtalo de nuevo." />
    );
  if (drawing)
    return (
      <form onSubmit={handleSubmit}>
        <Card className="max-w-3xl mx-auto shadow-none border-0 bg-inherit">
          <CardHeader className="pt-0">
            <CardTitle className="text-3xl">Editar Dibujo</CardTitle>
            <CardDescription>
              Edita las propiedades de tu dibujo.
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
                  defaultValue={drawing.title}
                  required
                  maxLength={200}
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
                  defaultValue={drawing.description ?? undefined}
                  maxLength={400}
                  placeholder="Descripción"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Image
                  className="rounded max-h-[90dvh] max-w-[90vw] w-auto object-contain"
                  priority
                  src={drawing.imageUrl}
                  alt={drawing.title}
                  width={800}
                  height={800}
                />
              </div>
            </main>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              Volver
            </Link>
            {formPending ? (
              <Button disabled>
                <Loader className="mr-2 animate-spin" />
                Guardando...
              </Button>
            ) : (
              <Button type="submit" {...buttonAttributes}>
                Guardar
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    );
};
