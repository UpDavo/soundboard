import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Superficie "burbuja": gris translúcido sólido con borde y brillo interno,
 * look glass sin usar blur.
 */
const RADIUS = { md: "rounded-[20px]", lg: "rounded-[28px]" } as const;

interface PanelProps extends ComponentProps<"div"> {
  radius?: keyof typeof RADIUS;
}

export function Panel({ className, radius = "lg", ...props }: PanelProps) {
  return (
    <div
      className={cn(
        RADIUS[radius],
        "border border-white/10 bg-neutral-700/55",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_40px_-12px_rgba(0,0,0,0.7)]",
        className,
      )}
      {...props}
    />
  );
}
