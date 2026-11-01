import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Panel } from "./Panel";

interface ControlCardProps {
  title: string;
  /** Texto auxiliar a la derecha del título (ej. "80%"). */
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Tarjeta estilo Control Center: título + control. */
export function ControlCard({ title, meta, children, className }: ControlCardProps) {
  return (
    <Panel radius="md" className={cn("px-4 pt-3 pb-3.5", className)}>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-sm font-bold text-white">{title}</h2>
        {meta && <span className="text-[11px] tabular-nums text-white/50">{meta}</span>}
      </div>
      {children}
    </Panel>
  );
}
