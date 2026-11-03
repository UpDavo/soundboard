"use client";

import { useMemo, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToComboDraft, moveSound, toggleFavorite } from "@/store/soundboard.slice";
import { selectFavoriteSet } from "@/store/selectors";
import { SortableGrid } from "@/components/dnd/SortableGrid";
import { SoundButton } from "./SoundButton";
import type { Sound } from "@/types/sound";

interface SoundGridProps {
  sounds: Sound[];
  /** Al cambiar, los botones visibles reaparecen con animación (búsqueda / filtro). */
  animationKey?: string;
}

/** Grilla reordenable de botones, conectada al reproductor y a Redux. */
export function SoundGrid({ sounds, animationKey }: SoundGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);
  const { voices, multi, player } = useAudioPlayer();
  const playingIds = useMemo(() => new Set(voices.map((v) => v.id)), [voices]);
  const favorites = useAppSelector(selectFavoriteSet);
  const dispatch = useAppDispatch();

  useGSAP(
    () => {
      const first = isFirstRun.current;
      isFirstRun.current = false;
      gsap.fromTo(
        ".sound-btn",
        { y: first ? 24 : 10, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: first ? 0.6 : 0.35,
          ease: first ? "power3.out" : "power2.out",
          stagger: first ? 0.04 : 0.025,
          overwrite: "auto",
        },
      );
    },
    { scope: ref, dependencies: [animationKey] },
  );

  const renderButton = (sound: Sound) => (
    <SoundButton
      sound={sound}
      active={playingIds.has(sound.id)}
      favorite={favorites.has(sound.id)}
      onPress={(s) => {
        const starting = !player.isPlaying(s.id);
        player.toggle(s);
        // En modo múltiple, lo que se toca se va sumando al combo en armado.
        if (starting && multi) dispatch(addToComboDraft(s.id));
      }}
      onToggleFavorite={(s) => dispatch(toggleFavorite(s.id))}
    />
  );

  return (
    <SortableGrid
      gridRef={ref}
      items={sounds}
      onMove={(activeId, overId) => dispatch(moveSound({ activeId, overId }))}
      renderItem={renderButton}
      renderOverlay={renderButton}
    />
  );
}
