import "server-only";
import { soundService } from "./sound.service";
import { preferencesService } from "./preferences.service";
import type { SoundPreferences } from "@/types/preferences";
import type { Sound } from "@/types/sound";

export interface Soundboard {
  sounds: Sound[];
  favoriteIds: string[];
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
    };
    await preferencesService.save(prefs);
  },
};
