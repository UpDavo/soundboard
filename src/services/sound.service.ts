import "server-only";
import { soundRepository } from "@/repositories/sound.repository";
import type { Sound, SoundFile } from "@/types/sound";

/** "sirena_suave-2.mp3" -> "Sirena suave 2" */
function toLabel(fileName: string): string {
  const base = fileName
    .replace(/\.mp3$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function toSound(file: SoundFile): Sound {
  return {
    // NFC: macOS guarda "ñ"/acentos descompuestos (NFD); así coinciden con el txt escrito a mano.
    id: file.fileName.replace(/\.mp3$/i, "").normalize("NFC"),
    label: toLabel(file.fileName.normalize("NFC")),
    src: file.publicPath,
  };
}

/**
 * Servicio: reglas de negocio (mapeo a dominio, nombres legibles, orden).
 * No sabe de dónde salen los archivos; eso lo resuelve el repositorio.
 */
export const soundService = {
  getAll(): Sound[] {
    return soundRepository
      .findAll()
      .map(toSound)
      .sort((a, b) => a.label.localeCompare(b.label, "es"));
  },
};
