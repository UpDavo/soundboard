import type { ReactNode } from "react";
import { chipClassName } from "./chip";

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
      className={chipClassName(pressed, className)}
    >
      {icon}
      {children}
    </button>
  );
}
