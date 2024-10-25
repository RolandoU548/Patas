import { getDrawings } from "@/app/actions";
import { DrawingCard } from "@/components/DrawingCard";
import { cn } from "@/lib/utils";

interface DrawingsGridProps extends React.HTMLProps<HTMLElement> {
  className?: string;
  children?: React.ReactNode;
}

export const DrawingsGrid = async ({
  className,
  children,
  ...props
}: DrawingsGridProps) => {
  const drawings = await getDrawings();
  return (
    <main
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
        className
      )}
      {...props}
    >
      {children}
      {drawings?.map((drawing) => {
        return <DrawingCard key={drawing.id} drawing={drawing} />;
      })}
    </main>
  );
};
