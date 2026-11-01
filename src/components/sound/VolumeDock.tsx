import { Floating } from "@/components/ui";
import { VolumeCard } from "./VolumeCard";

/** Volumen flotante: abajo a la derecha (en mobile, a todo el ancho abajo). */
export function VolumeDock() {
  return (
    <Floating className="right-4 bottom-4 left-4 md:right-6 md:bottom-6 md:left-auto md:w-[280px]">
      <VolumeCard />
    </Floating>
  );
}
