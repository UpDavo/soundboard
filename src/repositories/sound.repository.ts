import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { SoundFile } from "@/types/sound";

/** Carpeta (relativa a /public) donde viven los mp3. */
export const SOUNDS_PUBLIC_DIR = "/assets/mp3";

const SOUNDS_FS_DIR = path.join(process.cwd(), "public", SOUNDS_PUBLIC_DIR);

/**
 * Repositorio: única capa que sabe DÓNDE y CÓMO se guardan los sonidos.
 * Si mañana vienen de S3 o de una DB, solo cambia este archivo.
 */
export const soundRepository = {
  findAll(): SoundFile[] {
    if (!fs.existsSync(SOUNDS_FS_DIR)) return [];

    return fs
      .readdirSync(SOUNDS_FS_DIR, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.mp3$/i.test(entry.name))
      .map((entry) => ({
        fileName: entry.name,
        publicPath: `${SOUNDS_PUBLIC_DIR}/${encodeURIComponent(entry.name)}`,
      }));
  },
};
