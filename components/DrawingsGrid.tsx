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
        "grid grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] gap-4",
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
