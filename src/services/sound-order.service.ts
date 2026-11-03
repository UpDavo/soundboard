import type { SoundPreferences } from "@/types/preferences";
import type { Sound } from "@/types/sound";

/** Lógica pura (cliente y servidor) para aplicar orden y favoritos a una lista de sonidos. */
export const soundOrderService = {
  /**
   * Primero los ids guardados en ese orden, luego los sonidos nuevos
   * (en su orden original). Ids que ya no existen se descartan
   * (también dentro de los combos; un combo que queda vacío se descarta).
   */
  apply(sounds: Sound[], prefs: SoundPreferences) {
    const byId = new Map(sounds.map((s) => [s.id, s]));
    const ordered = prefs.order.flatMap((id) => byId.get(id) ?? []);
    const placed = new Set(ordered.map((s) => s.id));
    const rest = sounds.filter((s) => !placed.has(s.id));
    return {
      sounds: [...ordered, ...rest],
      favoriteIds: prefs.favorites.filter((id) => byId.has(id)),
      combos: (prefs.combos ?? [])
        .map((c) => ({ ...c, soundIds: c.soundIds.filter((id) => byId.has(id)) }))
        .filter((c) => c.soundIds.length > 0),
    };
  },

  sortByLabel(sounds: Sound[]) {
    return [...sounds].sort((a, b) => a.label.localeCompare(b.label, "es"));
  },
};
