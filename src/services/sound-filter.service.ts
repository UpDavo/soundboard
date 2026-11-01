import type { Sound } from "@/types/sound";

/** Minúsculas y sin acentos: "Canción" coincide con "cancion". */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

/** Servicio puro (cliente y servidor): reglas de búsqueda de sonidos. */
export const soundFilterService = {
  filter(sounds: Sound[], query: string): Sound[] {
    const q = normalize(query);
    if (!q) return sounds;
    return sounds.filter((s) => normalize(s.label).includes(q));
  },
};
