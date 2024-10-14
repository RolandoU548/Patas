"use client";
import { DrawingCard } from "@/components/DrawingCard";
import { cn } from "@/lib/utils";
import { useGetDrawingsQuery } from "@/lib/services/drawingApi";
import Loading from "@/app/loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DrawingsGridProps extends React.HTMLProps<HTMLElement> {
  className?: string;
  children?: React.ReactNode;
}

export const DrawingsGrid = ({
  className,
  children,
  ...props
}: DrawingsGridProps) => {
  const {
    data: drawings,
    error,
    isLoading,
    isFetching,
  } = useGetDrawingsQuery(null);

  if (isLoading || isFetching)
    return <Loading className="mt-5 justify-center" />;

  if (error)
    return (
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¡Oops! Ha ocurrido un error</AlertDialogTitle>
            <AlertDialogDescription>
              Ha ocurrido un error al recuperar los dibujos. Por favor inténtalo
              de nuevo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => location.reload()}>
              Intentar de nuevo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

  if (drawings)
    return (
      <main
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
          className
        )}
        {...props}
      >
        {children}
        {drawings.map((drawing) => {
          return <DrawingCard key={drawing.id} drawing={drawing} />;
        })}
      </main>
    );
};
