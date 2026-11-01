import "server-only";
import fs from "node:fs";
import path from "node:path";

/** Archivo local que hace de "base de datos" de preferencias. */
export const PREFERENCES_FILE = path.join(process.cwd(), "data", "soundboard.json");

/**
 * Repositorio: solo lee/escribe el texto crudo del archivo.
 * El formato lo decide el servicio.
 */
export const preferencesRepository = {
  read(): string | null {
    try {
      return fs.readFileSync(PREFERENCES_FILE, "utf8");
    } catch {
      return null; // aún no existe
    }
  },

  /** Renombra el archivo actual a .corrupt-<timestamp>.json y devuelve la ruta. */
  backupCorrupt(): string {
    const backup = PREFERENCES_FILE.replace(/\.json$/, `.corrupt-${Date.now()}.json`);
    fs.renameSync(PREFERENCES_FILE, backup);
    return backup;
  },

  async write(content: string): Promise<void> {
    await fs.promises.mkdir(path.dirname(PREFERENCES_FILE), { recursive: true });
    // Escritura atómica: archivo temporal + rename, para no dejarlo a medias.
    const tmp = `${PREFERENCES_FILE}.tmp`;
    await fs.promises.writeFile(tmp, content, "utf8");
    await fs.promises.rename(tmp, PREFERENCES_FILE);
  },
};
