import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Sound } from "@/types/sound";

export interface SoundboardState {
  /** Sonidos en el orden en que se muestran. */
  sounds: Sound[];
  favoriteIds: string[];
  showFavoritesOnly: boolean;
}

export const initialSoundboardState: SoundboardState = {
  sounds: [],
  favoriteIds: [],
  showFavoritesOnly: false,
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
  },
});

export const { toggleFavorite, moveSound, setShowFavoritesOnly } = soundboardSlice.actions;
export const soundboardReducer = soundboardSlice.reducer;
