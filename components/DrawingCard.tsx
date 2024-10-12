"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { deleteDrawing } from "@/actions/drawings/drawings";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "./ui/button";

interface Drawing {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
}

interface DrawingCardProps {
  drawing: Drawing;
}

export const DrawingCard = ({ drawing }: DrawingCardProps) => {
  return (
    <Card key={drawing.id} className="flex flex-col justify-between">
      <CardContent className="pt-4 px-4 pb-0 h-48">
        <Image
          className="rounded w-full h-full object-cover"
          priority
          width={100}
          height={100}
          src={drawing.imageUrl}
          alt={`drawing${drawing.id}`}
        />
      </CardContent>
      <CardHeader className="py-2">
        <CardTitle className="font-semibold text-lg uppercase line-clamp-1 py-0">
          {drawing.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground break-words line-clamp-2">
          {drawing.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pb-4 flex justify-between">
        <Link href="edit" className={buttonVariants()}>
          Editar
        </Link>
        <Button
          variant={"destructive"}
          onClick={() => {
            deleteDrawing(drawing.id);
          }}
        >
          BORRAR
        </Button>
      </CardFooter>
    </Card>
  );
};
