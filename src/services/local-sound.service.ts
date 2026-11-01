import {
  localSoundRepository,
  type LocalFolderRecord,
  type LocalSoundRecord,
} from "@/repositories/local-sound.repository";
import { soundOrderService } from "./sound-order.service";
import { isAudioFile, stripAudioExtension, toSoundLabel } from "@/lib/audio-file";
import type { SoundPreferences } from "@/types/preferences";
import type { Sound } from "@/types/sound";

export interface LocalLibrary {
  folderName: string;
  sounds: Sound[];
  favoriteIds: string[];
}

/** URLs blob vivas; se liberan al cambiar de carpeta o volver a los originales. */
const liveUrls = new Set<string>();

function toSounds(records: LocalSoundRecord[]): Sound[] {
  return records.map((r) => {
    const src = URL.createObjectURL(r.blob);
    liveUrls.add(src);
    return { id: r.id, label: r.label, src };
  });
}

function toLibrary(folder: LocalFolderRecord, prefs?: SoundPreferences): LocalLibrary {
  const sounds = soundOrderService.sortByLabel(toSounds(folder.sounds));
  const applied = soundOrderService.apply(sounds, prefs ?? { order: [], favorites: [] });
  return { folderName: folder.folderName, ...applied };
}

/**
 * Servicio (cliente): convierte una carpeta elegida en el navegador en sonidos
 * reproducibles y la mantiene cacheada en IndexedDB.
 */
export const localSoundService = {
  /** Lee los audios (.mp3, .m4a) de la carpeta elegida, incluye subcarpetas. null si no hay ninguno. */
  async importFolder(files: FileList | File[]): Promise<LocalLibrary | null> {
    const list = Array.from(files).filter((f) => isAudioFile(f.name));
    if (list.length === 0) return null;

    const folderName = list[0].webkitRelativePath.split("/")[0] || "Carpeta local";
    const seen = new Set<string>();
    const records: LocalSoundRecord[] = [];
    for (const file of list) {
      const id = stripAudioExtension(file.webkitRelativePath || file.name);
      if (seen.has(id)) continue;
      seen.add(id);
      records.push({ id, label: toSoundLabel(file.name), blob: file });
    }

    const folder = { folderName, sounds: records };
    try {
      await localSoundRepository.saveFolder(folder);
    } catch (err) {
      // Sin caché (cuota llena, modo privado…): igual se usa en esta sesión.
      console.warn("[localSound] no se pudo cachear la carpeta", err);
    }
    this.releaseUrls();
    return toLibrary(folder);
  },

  /** Carpeta cacheada de una sesión anterior, si existe. */
  async restoreCached(): Promise<LocalLibrary | null> {
    try {
      const folder = await localSoundRepository.getFolder();
      if (!folder?.sounds.length) return null;
      const prefs = await localSoundRepository.getPreferences();
      this.releaseUrls();
      return toLibrary(folder, prefs);
    } catch {
      return null;
    }
  },

  savePreferences: (prefs: SoundPreferences) => localSoundRepository.savePreferences(prefs),

  async clear() {
    this.releaseUrls();
    await localSoundRepository.clear().catch(() => undefined);
  },

  releaseUrls() {
    liveUrls.forEach((url) => URL.revokeObjectURL(url));
    liveUrls.clear();
  },
};
