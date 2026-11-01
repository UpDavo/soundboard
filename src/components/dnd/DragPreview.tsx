"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Envoltorio del elemento arrastrado: se "levanta" con GSAP. */
export function DragPreview({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ref.current,
      { scale: 1, rotate: 0 },
      { scale: 1.06, rotate: -2, duration: 0.25, ease: "back.out(2)" },
    );
  });

  return (
    <div ref={ref} className="cursor-grabbing drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]">
      {children}
    </div>
  );
}
