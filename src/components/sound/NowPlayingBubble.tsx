"use client";

import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { IconTile, NoteIcon, NotificationBubble } from "@/components/ui";
import { usePlaybackTicker } from "@/hooks/usePlaybackTicker";
import { PlaybackBar, PlaybackTime } from "./PlaybackProgress";

/** Burbuja "reproduciendo" conectada al reproductor. */
export function NowPlayingBubble() {
  const { current, isPlaying, player } = useAudioPlayer();
  const open = isPlaying && current !== null;
  const { fillRef, timeRef } = usePlaybackTicker(open, current?.id);

  return (
    <NotificationBubble
      open={open}
      contentKey={current?.id}
      icon={
        <IconTile>
          <NoteIcon className="size-7" />
        </IconTile>
      }
      title={current?.label ?? ""}
      aside={<PlaybackTime timeRef={timeRef} />}
      subtitle="Reproduciendo"
      onClose={() => player.stop()}
      closeLabel="Detener sonido"
      // Desktop: a la izquierda de la tarjeta de volumen (280px + gutter 24px + gap 16px).
      className="sm:top-6 sm:right-6 lg:right-[320px]"
    >
      <PlaybackBar fillRef={fillRef} />
    </NotificationBubble>
  );
}
