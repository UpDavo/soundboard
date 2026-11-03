"use client";

import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { ControlCard } from "@/components/ui";
import { VolumeSlider } from "./VolumeSlider";

/** Tarjeta "Sound" conectada al volumen general del reproductor. */
export function VolumeCard({ className }: { className?: string }) {
  const { volume, voices, player } = useAudioPlayer();

  return (
    // Sólida: flota sobre los botones.
    <ControlCard
      title="Sound"
      meta={
        <span className="flex items-center gap-2">
          {voices.length > 1 && (
            <button
              type="button"
              onClick={() => player.stopAll()}
              className="rounded-full bg-white/10 px-2 py-0.5 font-medium text-white hover:bg-white/20"
            >
              Detener {voices.length}
            </button>
          )}
          {Math.round(volume * 100)}%
        </span>
      }
      surface="solid"
      className={className}
    >
      <VolumeSlider value={volume} onChange={(v) => player.setVolume(v)} />
    </ControlCard>
  );
}
