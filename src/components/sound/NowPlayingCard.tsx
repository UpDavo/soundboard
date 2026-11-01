"use client";

import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { usePlaybackTicker } from "@/hooks/usePlaybackTicker";
import { EqualizerBars, IconButton, MediaCard, NoteIcon, StopIcon } from "@/components/ui";
import { PlaybackBar, PlaybackTime } from "./PlaybackProgress";

/** Tarjeta del sonido actual (o "Sin nada sonando" si no hay nada). */
export function NowPlayingCard() {
  const { current, isPlaying, player } = useAudioPlayer();
  const playing = isPlaying && current !== null;
  const { fillRef, timeRef } = usePlaybackTicker(playing, current?.id);

  return (
    <MediaCard
      idle={!playing}
      contentKey={playing ? current.id : "idle"}
      icon={
        playing ? (
          <EqualizerBars active bars={3} size="sm" barClassName="bg-white" />
        ) : (
          <NoteIcon className="size-5" />
        )
      }
      title={playing ? current.label : "Sin nada sonando"}
      subtitle={playing ? "Reproduciendo" : "Toca un sonido para reproducirlo"}
      aside={playing && <PlaybackTime timeRef={timeRef} />}
      action={
        playing && (
          <IconButton aria-label="Detener sonido" onClick={() => player.stop()} className="size-8">
            <StopIcon className="size-3" />
          </IconButton>
        )
      }
    >
      <PlaybackBar fillRef={fillRef} />
    </MediaCard>
  );
}
