/** Formatos de audio soportados (servidor y carpeta local). Agrega aquí nuevos formatos. */
export const AUDIO_EXTENSIONS = ["mp3", "m4a"] as const;

const AUDIO_FILE = new RegExp(`\\.(${AUDIO_EXTENSIONS.join("|")})$`, "i");

/** Texto para la UI: ".mp3 o .m4a" */
export const AUDIO_EXTENSIONS_LABEL = AUDIO_EXTENSIONS.map((e) => `.${e}`).join(" o ");

export function isAudioFile(fileName: string) {
  return AUDIO_FILE.test(fileName);
}

/** "carpeta/sirena.MP3" -> "carpeta/sirena" (NFC para que acentos de macOS coincidan). */
export function stripAudioExtension(fileName: string) {
  return fileName.replace(AUDIO_FILE, "").normalize("NFC");
}

/** "sirena_suave-2.m4a" -> "SIRENA SUAVE 2" (todo en mayúsculas para que se vean uniformes). */
export function toSoundLabel(fileName: string) {
  return stripAudioExtension(fileName)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleUpperCase("es");
}
