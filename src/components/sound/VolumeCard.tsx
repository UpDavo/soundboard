"use client";

import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { ControlCard } from "@/components/ui";
import { VolumeSlider } from "./VolumeSlider";

/** Tarjeta "Sound" conectada al volumen general del reproductor. */
export function VolumeCard({ className }: { className?: string }) {
  const { volume, player } = useAudioPlayer();

  return (
    <ControlCard title="Sound" meta={`${Math.round(volume * 100)}%`} className={className}>
      <VolumeSlider value={volume} onChange={(v) => player.setVolume(v)} />
    </ControlCard>
  );
}
