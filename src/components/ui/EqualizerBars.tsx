"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const SIZES = {
  sm: { box: "h-4 gap-0.5", bar: "w-1" },
  md: { box: "h-6 gap-1", bar: "w-1.5" },
} as const;

interface EqualizerBarsProps {
  active: boolean;
  bars?: number;
  size?: keyof typeof SIZES;
  className?: string;
  barClassName?: string;
}

const IDLE_SCALE = 0.25;

/** Barras de ecualizador animadas con GSAP mientras `active` es true. */
export function EqualizerBars({ active, bars = 4, size = "md", className, barClassName }: EqualizerBarsProps) {
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
    <span ref={ref} aria-hidden className={cn("flex items-end", SIZES[size].box, className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          // transform inline: las clases scale-* de Tailwind v4 usan `scale` y chocan con GSAP.
          style={{ transform: `scaleY(${IDLE_SCALE})` }}
          className={cn("eq-bar h-full origin-bottom rounded-full transition-colors", SIZES[size].bar, barClassName)}
        />
      ))}
    </span>
  );
}
