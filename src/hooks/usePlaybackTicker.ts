"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { formatTime } from "@/lib/format";
import { audioPlayer } from "@/services/audio-player.service";

/**
 * Mientras `running`, escribe por frame (gsap.ticker) el progreso y el tiempo
 * del sonido actual directo en el DOM, sin re-render de React.
 */
export function usePlaybackTicker(running: boolean, resetKey?: string) {
  const fillRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!running) {
        // Sin reproducción: barra vacía y sin tiempo.
        gsap.to(fillRef.current, { scaleX: 0, duration: 0.3, ease: "power2.out" });
        if (timeRef.current) timeRef.current.textContent = "";
        return;
      }
      const tick = () => {
        gsap.set(fillRef.current, { scaleX: audioPlayer.getProgress() });
        const { current, duration } = audioPlayer.getTimes();
        if (timeRef.current) timeRef.current.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { dependencies: [running, resetKey] },
  );

  return { fillRef, timeRef };
}
