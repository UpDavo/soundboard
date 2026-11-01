"use client";

import { cn } from "@/lib/cn";

interface SliderProps {
  value: number; // 0..1
  onChange: (value: number) => void;
  label: string;
  className?: string;
}

/** Slider estilo Control Center: barra gruesa, relleno blanco, sin thumb visible. */
export function Slider({ value, onChange, label, className }: SliderProps) {
  return (
    <div className={cn("relative h-1.5 w-full", className)}>
      <div className="absolute inset-0 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute -inset-y-3 inset-x-0 w-full cursor-pointer opacity-0"
      />
    </div>
  );
}
