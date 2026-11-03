import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { savePreferencesAction } from "@/app/actions/preferences.action";
import { localSoundService } from "@/services/local-sound.service";
import { deleteCombo, moveSound, saveCombo, toggleFavorite } from "./soundboard.slice";
import { selectPreferences } from "./selectors";
import type { RootState } from "./store";

const SAVE_DEBOUNCE_MS = 400;

/**
 * Tras cambiar favoritos, orden o combos, guarda (con debounce):
 * - sonidos del servidor -> data/soundboard.json (Server Action)
 * - carpeta local        -> IndexedDB del navegador
 */
export const persistenceListener = createListenerMiddleware();

persistenceListener.startListening({
  matcher: isAnyOf(toggleFavorite, moveSound, saveCombo, deleteCombo),
  effect: async (_action, api) => {
    api.cancelActiveListeners();
    await api.delay(SAVE_DEBOUNCE_MS);
    const state = api.getState() as RootState;
    const prefs = selectPreferences(state);

    if (state.soundboard.source.kind === "local") {
      await localSoundService.savePreferences(prefs).catch((err) => console.warn(err));
      return;
    }
    const result = await savePreferencesAction(prefs);
    if (!result.ok) console.warn("No se pudieron guardar las preferencias");
  },
});
