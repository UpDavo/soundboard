"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Floating } from "@/components/ui";
import { NowPlayingCard } from "./NowPlayingCard";
import { VolumeCard } from "./VolumeCard";

const GAP = 10;

/**
 * Dock flotante abajo a la derecha (en mobile, a todo el ancho).
 * El volumen está siempre visible; el reproductor vive escondido DETRÁS del volumen
 * y sube por encima cuando suena algo. Al terminar, baja y se esconde otra vez.
 */
export function PlayerDock() {
  const { current, isPlaying } = useAudioPlayer();
  const open = isPlaying && current !== null;
  const playerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set(playerRef.current, { y: 0, scale: 0.94, autoAlpha: 0 });
  });

  useGSAP(
    () => {
      const el = playerRef.current;
      if (!el) return;
      if (open) {
        gsap.to(el, {
          y: () => -(el.offsetHeight + GAP),
          scale: 1,
          autoAlpha: 1,
          duration: 0.55,
          ease: "back.out(1.4)",
        });
      } else {
        gsap.to(el, { y: 0, scale: 0.94, autoAlpha: 0, duration: 0.4, ease: "power2.in", delay: 0.15 });
      }
    },
    { dependencies: [open] },
  );

  return (
    <Floating className="right-4 bottom-4 left-4 z-50 md:right-6 md:bottom-6 md:left-auto md:w-[280px]">
      <div className="relative">
        {/* Reproductor: detrás del volumen (z-0), alineado abajo. */}
        <div ref={playerRef} className="invisible absolute inset-x-0 bottom-0 z-0">
          <NowPlayingCard />
        </div>
        <div className="relative z-10">
          <VolumeCard />
        </div>
      </div>
    </Floating>
  );
}
