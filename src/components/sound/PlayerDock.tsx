"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useExitList } from "@/hooks/useExitList";
import { Floating } from "@/components/ui";
import type { Sound } from "@/types/sound";
import { NowPlayingCard } from "./NowPlayingCard";
import { VolumeCard } from "./VolumeCard";

const GAP = 10;
/** Debe cubrir la animación de salida de DockItem (fade + colapso). */
const EXIT_MS = 450;

/** Una tarjeta de la pila: entra desde abajo; al terminar se desvanece y colapsa su alto. */
function DockItem({ sound, leaving }: { sound: Sound; leaving: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useGSAP(() => {
    gsap.fromTo(
      ref.current,
      { y: 16, scale: 0.94, autoAlpha: 0 },
      { y: 0, scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(1.4)" },
    );
  });

  useGSAP(
    () => {
      if (!mounted.current) {
        mounted.current = true;
        return;
      }
      const el = ref.current;
      if (leaving) {
        gsap
          .timeline()
          .to(el, { autoAlpha: 0, scale: 0.94, duration: 0.2, ease: "power2.in" })
          .to(el, { height: 0, paddingBottom: 0, duration: 0.2, ease: "power2.inOut" });
      } else {
        // Volvió a sonar antes de desmontarse.
        gsap.to(el, { height: "auto", paddingBottom: GAP, autoAlpha: 1, scale: 1, duration: 0.3, overwrite: true });
      }
    },
    { dependencies: [leaving] },
  );

  return (
    <div ref={ref} className="invisible" style={{ paddingBottom: GAP }}>
      <NowPlayingCard sound={sound} leaving={leaving} />
    </div>
  );
}

/**
 * Dock flotante abajo a la derecha (en mobile, a todo el ancho).
 * El volumen está siempre visible; encima se apila una tarjeta por cada sonido
 * que suena (varias en modo múltiple), con su tiempo y lo que falta para terminar.
 */
export function PlayerDock() {
  const { voices } = useAudioPlayer();
  const items = useExitList(voices, EXIT_MS);

  return (
    <Floating className="right-4 bottom-4 left-4 z-50 md:right-6 md:bottom-6 md:left-auto md:w-[280px]">
      {/* Con muchos sonidos la pila hace scroll en vez de salirse de la pantalla. */}
      <div className="max-h-[min(55dvh,28rem)] overflow-y-auto overscroll-contain [scrollbar-width:none]">
        {items.map(({ item, leaving }) => (
          <DockItem key={item.id} sound={item} leaving={leaving} />
        ))}
      </div>
      <VolumeCard />
    </Floating>
  );
}
