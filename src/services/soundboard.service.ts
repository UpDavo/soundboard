import "server-only";
import { soundService } from "./sound.service";
import { preferencesService } from "./preferences.service";
import { comboService } from "./combo.service";
import type { Combo, SoundPreferences } from "@/types/preferences";
import type { Sound } from "@/types/sound";

export interface Soundboard {
  sounds: Sound[];
  favoriteIds: string[];
  combos: Combo[];
}

/** Combina sonidos del disco + preferencias guardadas. */
export const soundboardService = {
  get(): Soundboard {
    return preferencesService.apply(soundService.getAll(), preferencesService.get());
  },

  /** Valida contra los sonidos reales antes de escribir: nada arbitrario llega al archivo. */
  async savePreferences(input: unknown): Promise<void> {
    const valid = new Set(soundService.getAll().map((s) => s.id));
    const clean = (value: unknown) =>
      Array.isArray(value)
        ? [...new Set(value.filter((id): id is string => typeof id === "string" && valid.has(id)))]
        : [];

    const prefs: SoundPreferences = {
      order: clean((input as SoundPreferences)?.order),
      favorites: clean((input as SoundPreferences)?.favorites),
      combos: comboService.sanitize((input as SoundPreferences)?.combos, (id) => valid.has(id)),
    };
    await preferencesService.save(prefs);
  },
};
