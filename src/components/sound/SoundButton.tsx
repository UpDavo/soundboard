"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { EqualizerBars, StarToggle } from "@/components/ui";
import type { Sound } from "@/types/sound";

interface SoundButtonProps {
  sound: Sound;
  active: boolean;
  favorite: boolean;
  onPress: (sound: Sound) => void;
  onToggleFavorite: (sound: Sound) => void;
}

export function SoundButton({ sound, active, favorite, onPress, onToggleFavorite }: SoundButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Hundido mientras suena; rebote elástico al soltarse.
  useGSAP(
    () => {
      gsap.to(ref.current, active
        ? { scale: 0.94, duration: 0.18, ease: "power2.out" }
        : { scale: 1, duration: 0.7, ease: "elastic.out(1, 0.45)" });
    },
    { scope: ref, dependencies: [active] },
  );

  return (
    <div
      ref={ref}
      className={cn(
        "sound-btn relative aspect-square rounded-[28px] border transition-colors duration-300",
        active
          ? "border-white bg-white text-neutral-900 shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)]"
          : "border-white/10 bg-neutral-800/70 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-neutral-700/70",
      )}
    >
      <button
        type="button"
        aria-pressed={active}
        onClick={() => onPress(sound)}
        className={cn(
          "absolute inset-0 flex flex-col justify-between rounded-[28px] p-4 text-left",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
        )}
      >
        <EqualizerBars active={active} barClassName={active ? "bg-neutral-900" : "bg-white/40"} />
        <span className="line-clamp-2 pr-2 text-[15px] leading-tight font-semibold">{sound.label}</span>
      </button>

      <StarToggle
        active={favorite}
        onToggle={() => onToggleFavorite(sound)}
        label={favorite ? `Quitar ${sound.label} de favoritos` : `Agregar ${sound.label} a favoritos`}
        className="absolute top-2.5 right-2.5"
      />
    </div>
  );
}
