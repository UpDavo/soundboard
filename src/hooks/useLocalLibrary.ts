"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AUDIO_EXTENSIONS_LABEL } from "@/lib/audio-file";
import { audioPlayer } from "@/services/audio-player.service";
import { localSoundService } from "@/services/local-sound.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadLocalSounds, restoreServerSounds } from "@/store/soundboard.slice";
import { selectSource } from "@/store/selectors";

/**
 * Carpeta local del usuario (solo navegador, cacheada en IndexedDB).
 * Úsalo una sola vez (en SoundBoard): al montar restaura la carpeta cacheada.
 */
export function useLocalLibrary() {
  const dispatch = useAppDispatch();
  const source = useAppSelector(selectSource);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** true mientras se revisa la caché al abrir (evita ver un instante los sonidos originales). */
  const [restoring, setRestoring] = useState(true);
  const restored = useRef(false);

  // Al abrir la app: si hay una carpeta cacheada, reemplaza los sonidos del servidor.
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    localSoundService
      .restoreCached()
      .then((library) => {
        if (library) dispatch(loadLocalSounds(library));
      })
      .finally(() => setRestoring(false));
  }, [dispatch]);

  const pickFolder = useCallback(
    async (files: File[]) => {
      setBusy(true);
      setError(null);
      try {
        audioPlayer.stop();
        const library = await localSoundService.importFolder(files);
        if (library) dispatch(loadLocalSounds(library));
        else setError(`Esa carpeta no tiene archivos ${AUDIO_EXTENSIONS_LABEL}.`);
      } finally {
        setBusy(false);
      }
    },
    [dispatch],
  );

  const restoreOriginals = useCallback(async () => {
    audioPlayer.stop();
    await localSoundService.clear();
    dispatch(restoreServerSounds());
    setError(null);
  }, [dispatch]);

  return {
    isLocal: source.kind === "local",
    folderName: source.kind === "local" ? source.folderName : null,
    busy,
    error,
    restoring,
    pickFolder,
    restoreOriginals,
  };
}
