import "server-only";
import { preferencesRepository } from "@/repositories/preferences.repository";
import { soundOrderService } from "./sound-order.service";
import type { SoundPreferences } from "@/types/preferences";
import type { Sound } from "@/types/sound";

/**
 * Formato de data/soundboard.json (versionado para poder migrar después):
 * {
 *   "version": 1,
 *   "sounds": [{ "id": "vibrato", "favorite": true }, { "id": "tono-la", "favorite": false }]
 * }
 * El orden del array es el orden en pantalla.
 */
const FILE_VERSION = 1;

interface SoundEntry {
  id: string;
  favorite: boolean;
}

interface PreferencesFile {
  version: number;
  sounds: SoundEntry[];
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** JSON -> preferencias. Tolerante: ignora entradas inválidas y duplicados. Lanza si el JSON no parsea. */
function parse(text: string): SoundPreferences {
  const data: unknown = JSON.parse(text);
  const entries = isObject(data) && Array.isArray(data.sounds) ? data.sounds : [];

  const order: string[] = [];
  const favorites: string[] = [];
  const seen = new Set<string>();

  for (const entry of entries) {
    if (!isObject(entry) || typeof entry.id !== "string") continue;
    const id = entry.id.trim().normalize("NFC");
    if (!id || seen.has(id)) continue;
    seen.add(id);
    order.push(id);
    if (entry.favorite === true) favorites.push(id);
  }
  return { order, favorites };
}

/** Preferencias -> JSON legible (indentado, con salto final). */
function serialize({ order, favorites }: SoundPreferences): string {
  const fav = new Set(favorites);
  const file: PreferencesFile = {
    version: FILE_VERSION,
    sounds: order.map((id) => ({ id, favorite: fav.has(id) })),
  };
  return `${JSON.stringify(file, null, 2)}\n`;
}

export const preferencesService = {
  get(): SoundPreferences {
    const text = preferencesRepository.read();
    if (!text) return { order: [], favorites: [] };
    try {
      return parse(text);
    } catch {
      // JSON roto (ej. editado a mano): se respalda para no perderlo en el próximo guardado.
      const backup = preferencesRepository.backupCorrupt();
      console.warn(`[preferences] JSON inválido; respaldo en ${backup}`);
      return { order: [], favorites: [] };
    }
  },

  async save(prefs: SoundPreferences): Promise<void> {
    await preferencesRepository.write(serialize(prefs));
  },

  /** Aplica orden + favoritos guardados a los sonidos del disco. */
  apply(sounds: Sound[], prefs: SoundPreferences) {
    return soundOrderService.apply(sounds, prefs);
  },
};
