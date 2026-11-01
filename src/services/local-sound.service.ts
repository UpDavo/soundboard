import {
  localSoundRepository,
  type LocalFolderRecord,
  type LocalSoundRecord,
} from "@/repositories/local-sound.repository";
import { soundOrderService } from "./sound-order.service";
import type { SoundPreferences } from "@/types/preferences";
import type { Sound } from "@/types/sound";

export interface LocalLibrary {
  folderName: string;
  sounds: Sound[];
  favoriteIds: string[];
}

const MP3 = /\.mp3$/i;

function toLabel(fileName: string) {
  const base = fileName.replace(MP3, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return base.charAt(0).toUpperCase() + base.slice(1);
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
  /** Lee los .mp3 de la carpeta elegida (incluye subcarpetas). null si no hay ninguno. */
  async importFolder(files: FileList | File[]): Promise<LocalLibrary | null> {
    const list = Array.from(files).filter((f) => MP3.test(f.name));
    if (list.length === 0) return null;

    const folderName = list[0].webkitRelativePath.split("/")[0] || "Carpeta local";
    const seen = new Set<string>();
    const records: LocalSoundRecord[] = [];
    for (const file of list) {
      const id = (file.webkitRelativePath || file.name).replace(MP3, "").normalize("NFC");
      if (seen.has(id)) continue;
      seen.add(id);
      records.push({ id, label: toLabel(file.name.normalize("NFC")), blob: file });
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
