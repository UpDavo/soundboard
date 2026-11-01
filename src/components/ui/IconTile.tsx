import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Cuadro redondeado para un ícono (como el ícono de app en una notificación). */
export function IconTile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "grid size-14 shrink-0 place-items-center rounded-2xl bg-neutral-900 text-white shadow-inner",
        className,
      )}
    >
      {children}
    </div>
  );
}
