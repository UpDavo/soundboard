import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ToggleChipProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ToggleChip({ pressed, onPressedChange, icon, children, className }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        "flex h-12 shrink-0 items-center gap-2 rounded-full border px-4 text-[15px] font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        pressed
          ? "border-white bg-white text-neutral-900"
          : "border-white/10 bg-neutral-800/70 text-white/80 hover:bg-neutral-700/70",
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}
