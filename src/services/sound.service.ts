import "server-only";
import { soundRepository } from "@/repositories/sound.repository";
import { soundOrderService } from "./sound-order.service";
import { stripAudioExtension, toSoundLabel } from "@/lib/audio-file";
import type { Sound, SoundFile } from "@/types/sound";

function toSound(file: SoundFile): Sound {
  return {
    id: stripAudioExtension(file.fileName),
    label: toSoundLabel(file.fileName),
    src: file.publicPath,
  };
}

/**
 * Servicio: reglas de negocio (mapeo a dominio, nombres legibles, orden).
 * No sabe de dónde salen los archivos; eso lo resuelve el repositorio.
 */
export const soundService = {
  getAll(): Sound[] {
    // "risa.mp3" y "risa.m4a" tendrían el mismo id: se queda el primero.
    const seen = new Set<string>();
    const sounds = soundRepository
      .findAll()
      .map(toSound)
      .filter((s) => !seen.has(s.id) && seen.add(s.id));
    return soundOrderService.sortByLabel(sounds);
  },
};
