import type { Ref } from "react";
import { cn } from "@/lib/cn";

interface ProgressBarProps {
  /** Ref al relleno; se anima con transform scaleX desde fuera (sin re-render). */
  fillRef?: Ref<HTMLDivElement>;
  className?: string;
}

export function ProgressBar({ fillRef, className }: ProgressBarProps) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/15", className)}>
      <div
        ref={fillRef}
        className="h-full w-full origin-left rounded-full bg-white"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
