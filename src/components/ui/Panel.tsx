import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Superficie "burbuja": gris translúcido sólido con borde y brillo interno,
 * look glass sin usar blur.
 */
const RADIUS = { md: "rounded-[20px]", lg: "rounded-[28px]" } as const;

/**
 * translucent: sobre el fondo de la página.
 * solid: para elementos flotantes sobre contenido (si fuera translúcido se mezcla con lo de abajo).
 */
const SURFACE = { translucent: "bg-neutral-700/55", solid: "bg-[#2a2a2d]" } as const;

interface PanelProps extends ComponentProps<"div"> {
  radius?: keyof typeof RADIUS;
  surface?: keyof typeof SURFACE;
}

export function Panel({ className, radius = "lg", surface = "translucent", ...props }: PanelProps) {
  return (
    <div
      className={cn(
        RADIUS[radius],
        SURFACE[surface],
        "border border-white/10",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_40px_-12px_rgba(0,0,0,0.7)]",
        className,
      )}
      {...props}
    />
  );
}
