"use client";
import { DrawingCard } from "@/components/DrawingCard";
import { cn } from "@/lib/utils";
import { useGetDrawingsQuery } from "@/lib/services/drawingApi";
import Loading from "@/app/loading";
import ErrorComponent from "@/app/error";

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
      <ErrorComponent description="Ha ocurrido un error al recuperar los dibujos. Por favor inténtalo de nuevo." />
    );

  if (drawings)
    return (
      <main
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
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
