"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { Panel } from "./Panel";
import { IconButton } from "./IconButton";
import { CloseIcon } from "./icons";

interface NotificationBubbleProps {
  open: boolean;
  icon: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Texto a la derecha del título (ej. tiempo). */
  aside?: ReactNode;
  /** Cambia esta key para animar el contenido (ej. id del sonido). */
  contentKey?: string;
  onClose?: () => void;
  closeLabel?: string;
  children?: ReactNode;
  className?: string;
}

const HIDDEN = { autoAlpha: 0, y: -24, scale: 0.96 };

/** Burbuja flotante arriba a la derecha estilo notificación de macOS. Entra/sale con GSAP. */
export function NotificationBubble({
  open,
  icon,
  title,
  subtitle,
  aside,
  contentKey,
  onClose,
  closeLabel = "Cerrar",
  children,
  className,
}: NotificationBubbleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set(ref.current, HIDDEN);
  }, { scope: ref });

  useGSAP(
    () => {
      gsap.to(ref.current, open
        ? { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.6)" }
        : { ...HIDDEN, duration: 0.35, ease: "power2.in", delay: 0.15 });
    },
    { scope: ref, dependencies: [open] },
  );

  useGSAP(
    () => {
      if (!contentKey) return;
      gsap.fromTo(".bubble-text", { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: "power2.out" });
    },
    { scope: ref, dependencies: [contentKey] },
  );

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={cn("invisible fixed top-4 right-4 left-4 z-50 sm:left-auto sm:w-[400px]", className)}
    >
      <Panel className="relative bg-neutral-600/70 py-4 pr-5 pl-4">
        {onClose && (
          <IconButton aria-label={closeLabel} onClick={onClose} className="absolute -top-2 -left-2">
            <CloseIcon className="size-3.5" />
          </IconButton>
        )}
        <div className="flex items-center gap-4">
          {icon}
          <div className="min-w-0 flex-1">
            <div className="bubble-text flex items-baseline justify-between gap-3">
              <p className="truncate text-[17px] font-bold text-white">{title}</p>
              {aside}
            </div>
            {subtitle && <p className="bubble-text mb-2.5 text-[15px] text-white/75">{subtitle}</p>}
            {children}
          </div>
        </div>
      </Panel>
    </div>
  );
}
