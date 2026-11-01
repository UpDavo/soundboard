import type { Ref } from "react";
import { ProgressBar } from "@/components/ui";

/** Tiempo "0:01 / 0:03"; el texto lo escribe usePlaybackTicker. */
export function PlaybackTime({ timeRef }: { timeRef: Ref<HTMLSpanElement> }) {
  return <span ref={timeRef} className="shrink-0 text-xs tabular-nums text-white/60" />;
}

/** Barra de progreso; su escala la anima usePlaybackTicker. */
export function PlaybackBar({ fillRef }: { fillRef: Ref<HTMLDivElement> }) {
  return <ProgressBar fillRef={fillRef} />;
}
