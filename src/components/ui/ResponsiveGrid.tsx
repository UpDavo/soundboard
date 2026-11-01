import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Grilla de tiles a todo el ancho: 2 → 3 → 4 → 5 → 6 → 8 columnas. */
export function ResponsiveGrid({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8",
        className,
      )}
      {...props}
    />
  );
}
