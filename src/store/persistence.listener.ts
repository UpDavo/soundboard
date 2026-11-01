import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { savePreferencesAction } from "@/app/actions/preferences.action";
import { moveSound, toggleFavorite } from "./soundboard.slice";
import { selectPreferences } from "./selectors";
import type { RootState } from "./store";

const SAVE_DEBOUNCE_MS = 400;

/** Tras cambiar favoritos u orden, guarda en el archivo (con debounce). */
export const persistenceListener = createListenerMiddleware();

persistenceListener.startListening({
  matcher: isAnyOf(toggleFavorite, moveSound),
  effect: async (_action, api) => {
    api.cancelActiveListeners();
    await api.delay(SAVE_DEBOUNCE_MS);
    const result = await savePreferencesAction(selectPreferences(api.getState() as RootState));
    if (!result.ok) console.warn("No se pudieron guardar las preferencias");
  },
});
