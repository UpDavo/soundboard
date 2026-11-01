import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Sound } from "@/types/sound";

/** De dónde vienen los sonidos visibles. */
export type SoundSource = { kind: "server" } | { kind: "local"; folderName: string };

export interface SoundboardState {
  /** Sonidos en el orden en que se muestran. */
  sounds: Sound[];
  favoriteIds: string[];
  showFavoritesOnly: boolean;
  source: SoundSource;
  /** Sonidos del servidor guardados mientras se usa una carpeta local. */
  serverSnapshot: { sounds: Sound[]; favoriteIds: string[] } | null;
}

export const initialSoundboardState: SoundboardState = {
  sounds: [],
  favoriteIds: [],
  showFavoritesOnly: false,
  source: { kind: "server" },
  serverSnapshot: null,
};

const soundboardSlice = createSlice({
  name: "soundboard",
  initialState: initialSoundboardState,
  reducers: {
    toggleFavorite(state, { payload: id }: PayloadAction<string>) {
      const i = state.favoriteIds.indexOf(id);
      if (i >= 0) state.favoriteIds.splice(i, 1);
      else state.favoriteIds.push(id);
    },

    /** Mueve `activeId` a la posición de `overId` (drag & drop). */
    moveSound(state, { payload }: PayloadAction<{ activeId: string; overId: string }>) {
      const from = state.sounds.findIndex((s) => s.id === payload.activeId);
      const to = state.sounds.findIndex((s) => s.id === payload.overId);
      if (from < 0 || to < 0 || from === to) return;
      const [moved] = state.sounds.splice(from, 1);
      state.sounds.splice(to, 0, moved);
    },

    setShowFavoritesOnly(state, { payload }: PayloadAction<boolean>) {
      state.showFavoritesOnly = payload;
    },

    /** Reemplaza los sonidos por los de una carpeta local (guarda los del servidor). */
    loadLocalSounds(
      state,
      { payload }: PayloadAction<{ folderName: string; sounds: Sound[]; favoriteIds: string[] }>,
    ) {
      if (state.source.kind === "server") {
        state.serverSnapshot = { sounds: state.sounds, favoriteIds: state.favoriteIds };
      }
      state.sounds = payload.sounds;
      state.favoriteIds = payload.favoriteIds;
      state.source = { kind: "local", folderName: payload.folderName };
      state.showFavoritesOnly = false;
    },

    /** Vuelve a los sonidos del servidor. */
    restoreServerSounds(state) {
      if (!state.serverSnapshot) return;
      state.sounds = state.serverSnapshot.sounds;
      state.favoriteIds = state.serverSnapshot.favoriteIds;
      state.serverSnapshot = null;
      state.source = { kind: "server" };
      state.showFavoritesOnly = false;
    },
  },
});

export const {
  toggleFavorite,
  moveSound,
  setShowFavoritesOnly,
  loadLocalSounds,
  restoreServerSounds,
} = soundboardSlice.actions;
export const soundboardReducer = soundboardSlice.reducer;
