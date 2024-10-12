import { cn } from "@/lib/utils";

interface LoadingProps extends React.HTMLProps<HTMLElement> {
  className?: string;
  children?: React.ReactNode;
}

export default function Loading({ className, children }: LoadingProps) {
  return (
    <>
      <h2
        className={cn(
          "flex items-center gap-1 text-2xl font-semibold",
          className
        )}
      >
        <svg
          className="size-6 animate-spin text-dark"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-50"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Cargando...
      </h2>
      {children}
    </>
  );
}
