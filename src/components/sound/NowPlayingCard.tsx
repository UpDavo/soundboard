"use client";

import { audioPlayer } from "@/services/audio-player.service";
import { usePlaybackTicker } from "@/hooks/usePlaybackTicker";
import { EqualizerBars, IconButton, MediaCard, StopIcon } from "@/components/ui";
import type { Sound } from "@/types/sound";
import { PlaybackBar, PlaybackTime } from "./PlaybackProgress";

interface NowPlayingCardProps {
  sound: Sound;
  /** Ya terminó y está animando su salida: deja de actualizar el tiempo. */
  leaving?: boolean;
}

/** Tarjeta de un sonido que está sonando: nombre, tiempo, cuánto falta y botón detener. */
export function NowPlayingCard({ sound, leaving = false }: NowPlayingCardProps) {
  const { fillRef, timeRef, remainingRef } = usePlaybackTicker(sound.id, !leaving);

  return (
    <MediaCard
      contentKey={sound.id}
      icon={<EqualizerBars active={!leaving} bars={3} size="sm" barClassName="bg-white" />}
      title={sound.label}
      subtitle={<span ref={remainingRef}>Cargando…</span>}
      aside={<PlaybackTime timeRef={timeRef} />}
      action={
        <IconButton
          aria-label={`Detener ${sound.label}`}
          onClick={() => audioPlayer.stop(sound.id)}
          disabled={leaving}
          className="size-8"
        >
          <StopIcon className="size-3" />
        </IconButton>
      }
    >
      <PlaybackBar fillRef={fillRef} />
    </MediaCard>
  );
}
