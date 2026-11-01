import { cn } from "@/lib/cn";

/** Estilos compartidos de los botones tipo "chip" (pill de 48px). */
export function chipClassName(pressed = false, className?: string) {
  return cn(
    "flex h-12 shrink-0 items-center gap-2 rounded-full border px-4 text-[15px] font-medium transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
    "disabled:cursor-wait disabled:opacity-60",
    pressed
      ? "border-white bg-white text-neutral-900"
      : "border-white/10 bg-neutral-800/70 text-white/80 hover:bg-neutral-700/70",
    className,
  );
}
