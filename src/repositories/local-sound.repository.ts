import { idb } from "@/lib/idb";
import type { SoundPreferences } from "@/types/preferences";

/** Un audio de la carpeta local, guardado como Blob. */
export interface LocalSoundRecord {
  id: string;
  label: string;
  blob: Blob;
}

export interface LocalFolderRecord {
  folderName: string;
  sounds: LocalSoundRecord[];
}

const FOLDER_KEY = "local-folder";
const PREFS_KEY = "local-preferences";

/**
 * Repositorio (cliente): caché en IndexedDB de la carpeta local
 * y de su orden/favoritos. Equivalente local de los repositorios del servidor.
 */
export const localSoundRepository = {
  getFolder: () => idb.get<LocalFolderRecord>(FOLDER_KEY),

  /** Reemplaza la carpeta cacheada y reinicia sus preferencias. */
  async saveFolder(folder: LocalFolderRecord) {
    await idb.set(FOLDER_KEY, folder);
    await idb.del(PREFS_KEY);
    // Pide almacenamiento persistente para que el navegador no lo borre bajo presión.
    await navigator.storage?.persist?.().catch(() => false);
  },

  async clear() {
    await idb.del(FOLDER_KEY);
    await idb.del(PREFS_KEY);
  },

  getPreferences: () => idb.get<SoundPreferences>(PREFS_KEY),
  savePreferences: (prefs: SoundPreferences) => idb.set(PREFS_KEY, prefs),
};
