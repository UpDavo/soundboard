"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { formatTime } from "@/lib/format";
import { audioPlayer } from "@/services/audio-player.service";

/**
 * Mientras `running`, escribe por frame (gsap.ticker) el progreso, el tiempo
 * y lo que falta para terminar del sonido `soundId`, directo en el DOM, sin re-render.
 */
export function usePlaybackTicker(soundId: string, running: boolean) {
  const fillRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const remainingRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!running) return;
      const tick = () => {
        gsap.set(fillRef.current, { scaleX: audioPlayer.getProgress(soundId) });
        const { current, duration } = audioPlayer.getTimes(soundId);
        if (timeRef.current) {
          timeRef.current.textContent = duration ? `${formatTime(current)} / ${formatTime(duration)}` : "";
        }
        if (remainingRef.current) {
          remainingRef.current.textContent = duration
            ? `Termina en ${formatTime(Math.ceil(duration - current))}`
            : "Cargando…";
        }
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { dependencies: [soundId, running] },
  );

  return { fillRef, timeRef, remainingRef };
}
