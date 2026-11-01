"use client";

import { useRef, type SyntheticEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { StarIcon } from "./icons";

interface StarToggleProps {
  active: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
}

/** No deja que el gesto inicie un drag del contenedor. */
const stop = (e: SyntheticEvent) => e.stopPropagation();

/** Estrella de favorito con "pop" animado por GSAP al cambiar. */
export function StarToggle({ active, onToggle, label, className }: StarToggleProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const mounted = useRef(false);

  useGSAP(
    () => {
      if (!mounted.current) {
        mounted.current = true;
        return;
      }
      gsap.fromTo(
        ref.current,
        { scale: active ? 1.5 : 0.8, rotate: active ? -25 : 0 },
        { scale: 1, rotate: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" },
      );
    },
    { dependencies: [active] },
  );

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={active}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      onMouseDown={stop}
      onTouchStart={stop}
      onPointerDown={stop}
      className={cn(
        "grid size-8 place-items-center rounded-full transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
        active ? "text-amber-400" : "text-current opacity-40 hover:opacity-90",
        className,
      )}
    >
      <StarIcon filled={active} className="size-5" />
    </button>
  );
}
