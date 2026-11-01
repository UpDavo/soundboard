import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { initialSoundboardState, soundboardReducer, type SoundboardState } from "./soundboard.slice";
import { persistenceListener } from "./persistence.listener";

const rootReducer = combineReducers({ soundboard: soundboardReducer });

export type RootState = ReturnType<typeof rootReducer>;

/** Un store por request/árbol (patrón recomendado en Next.js App Router). */
export function makeStore(preloaded?: Partial<SoundboardState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: { soundboard: { ...initialSoundboardState, ...preloaded } },
    middleware: (getDefault) => getDefault().prepend(persistenceListener.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
