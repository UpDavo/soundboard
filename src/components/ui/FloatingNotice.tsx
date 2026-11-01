import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Floating } from "./Floating";
import { Panel } from "./Panel";

interface FloatingNoticeProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Botón/acción a la derecha. */
  action?: ReactNode;
  /** Cambia para re-animar la entrada (ej. otra carpeta). */
  animationKey?: string;
  /** Posición; por defecto abajo a la izquierda. */
  className?: string;
}

/** Aviso informativo flotante. */
export function FloatingNotice({ icon, title, description, action, animationKey, className }: FloatingNoticeProps) {
  return (
    <Floating
      role="status"
      animationKey={animationKey}
      className={cn(className ?? "bottom-4 left-4 sm:bottom-6 sm:left-6", "max-w-[calc(100vw-2rem)]")}
    >
      <Panel radius="md" className="flex items-center gap-3 bg-neutral-700/80 py-2.5 pr-2.5 pl-3">
        {icon && (
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-neutral-900 text-white/80">
            {icon}
          </span>
        )}
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-semibold text-white">{title}</p>
          {description && <p className="truncate text-xs text-white/60">{description}</p>}
        </div>
        {action}
      </Panel>
    </Floating>
  );
}
