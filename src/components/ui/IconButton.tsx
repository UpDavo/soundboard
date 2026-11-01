import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function IconButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "grid size-7 place-items-center rounded-full border border-white/10 bg-neutral-600/90",
        "text-white/80 transition-colors hover:bg-neutral-500 hover:text-white",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        className,
      )}
      {...props}
    />
  );
}
