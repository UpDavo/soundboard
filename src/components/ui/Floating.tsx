"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

interface FloatingProps {
  /** Clases de posición (bottom/left/right/width). */
  className?: string;
  /** Cambia para re-animar la entrada. */
  animationKey?: string;
  role?: string;
  children: ReactNode;
}

/** Contenedor fijo sobre la página que entra desde abajo con GSAP. */
export function Floating({ className, animationKey, role, children }: FloatingProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { y: 24, autoAlpha: 0, scale: 0.96 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" },
      );
    },
    { dependencies: [animationKey] },
  );

  return (
    <div ref={ref} role={role} className={cn("invisible fixed z-40", className)}>
      {children}
    </div>
  );
}
