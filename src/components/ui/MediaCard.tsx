"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { Panel } from "./Panel";

interface MediaCardProps {
  icon: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Texto pequeño a la derecha del título (ej. tiempo). */
  aside?: ReactNode;
  /** Acción a la derecha (ej. detener). */
  action?: ReactNode;
  /** Atenuado cuando no hay nada activo. */
  idle?: boolean;
  /** Cambia para animar el contenido (ej. id del sonido). */
  contentKey?: string;
  /** Debajo del texto (ej. barra de progreso). */
  children?: ReactNode;
  className?: string;
}

/** Tarjeta compacta de "reproduciendo", del mismo tamaño que ControlCard. */
export function MediaCard({
  icon,
  title,
  subtitle,
  aside,
  action,
  idle,
  contentKey,
  children,
  className,
}: MediaCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".media-text",
        { y: 6, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out", stagger: 0.04 },
      );
    },
    { scope: ref, dependencies: [contentKey] },
  );

  return (
    <div ref={ref}>
      <Panel radius="md" surface="solid" className={cn("px-3 py-3", className)}>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-900 transition-colors",
              idle ? "text-white/30" : "text-white",
            )}
          >
            {icon}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="media-text flex items-baseline justify-between gap-2">
              <p className={cn("truncate text-sm font-bold", idle ? "text-white/50" : "text-white")}>{title}</p>
              {aside}
            </div>
            {subtitle && <p className="media-text truncate text-xs text-white/50">{subtitle}</p>}
          </div>
          {action}
        </div>
        {children && <div className="mt-2.5">{children}</div>}
      </Panel>
    </div>
  );
}
