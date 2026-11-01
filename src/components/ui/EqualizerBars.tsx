"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

interface EqualizerBarsProps {
  active: boolean;
  bars?: number;
  className?: string;
  barClassName?: string;
}

const IDLE_SCALE = 0.25;

/** Barras de ecualizador animadas con GSAP mientras `active` es true. */
export function EqualizerBars({ active, bars = 4, className, barClassName }: EqualizerBarsProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const loop = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      loop.current?.kill();
      loop.current = null;
      if (active) {
        loop.current = gsap.to(".eq-bar", {
          scaleY: `random(${IDLE_SCALE}, 1)`,
          duration: 0.28,
          ease: "sine.inOut",
          repeat: -1,
          repeatRefresh: true,
          stagger: { each: 0.07 },
        });
      } else {
        gsap.to(".eq-bar", { scaleY: IDLE_SCALE, duration: 0.3, ease: "power2.out" });
      }
    },
    { scope: ref, dependencies: [active] },
  );

  return (
    <span ref={ref} aria-hidden className={cn("flex h-6 items-end gap-1", className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          // transform inline: las clases scale-* de Tailwind v4 usan `scale` y chocan con GSAP.
          style={{ transform: `scaleY(${IDLE_SCALE})` }}
          className={cn("eq-bar h-full w-1.5 origin-bottom rounded-full transition-colors", barClassName)}
        />
      ))}
    </span>
  );
}
