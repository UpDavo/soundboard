"use client";

import { Slider, SpeakerIcon } from "@/components/ui";

interface VolumeSliderProps {
  value: number; // 0..1
  onChange: (value: number) => void;
}

function levelFor(volume: number): 0 | 1 | 2 | 3 {
  if (volume === 0) return 0;
  if (volume < 0.34) return 1;
  if (volume < 0.67) return 2;
  return 3;
}

/** Bocina (mute) + slider + bocina con ondas según el nivel. */
export function VolumeSlider({ value, onChange }: VolumeSliderProps) {
  return (
    <div className="flex items-center gap-3 text-white">
      <button
        type="button"
        aria-label={value === 0 ? "Activar sonido" : "Silenciar"}
        onClick={() => onChange(value === 0 ? 0.8 : 0)}
        className="shrink-0"
      >
        <SpeakerIcon level={0} muted={value === 0} className="size-4" />
      </button>
      <Slider value={value} onChange={onChange} label="Volumen general" />
      <SpeakerIcon level={levelFor(value)} muted={value === 0} className="size-5 shrink-0" />
    </div>
  );
}
