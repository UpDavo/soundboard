import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Sound } from "@/types/sound";
import type { Combo } from "@/types/preferences";
import { comboService } from "@/services/combo.service";

/** De dónde vienen los sonidos visibles. */
export type SoundSource = { kind: "server" } | { kind: "local"; folderName: string };

export interface SoundboardState {
  /** Sonidos en el orden en que se muestran. */
  sounds: Sound[];
  favoriteIds: string[];
  showFavoritesOnly: boolean;
  source: SoundSource;
  /** Combos guardados (se persisten junto a favoritos y orden). */
  combos: Combo[];
  /** Sonidos tocados en modo múltiple, pendientes de guardar como combo (no se persiste). */
  comboDraft: string[];
  /** Sonidos del servidor guardados mientras se usa una carpeta local. */
  serverSnapshot: { sounds: Sound[]; favoriteIds: string[]; combos: Combo[] } | null;
}

export const initialSoundboardState: SoundboardState = {
  sounds: [],
  favoriteIds: [],
  showFavoritesOnly: false,
  source: { kind: "server" },
  combos: [],
  comboDraft: [],
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

    /** Agrega un sonido al combo en armado (sin repetir). */
    addToComboDraft(state, { payload: id }: PayloadAction<string>) {
      if (!state.comboDraft.includes(id)) state.comboDraft.push(id);
    },

    removeFromComboDraft(state, { payload: id }: PayloadAction<string>) {
      state.comboDraft = state.comboDraft.filter((x) => x !== id);
    },

    clearComboDraft(state) {
      state.comboDraft = [];
    },

    /** Guarda el combo en armado con un nombre. */
    saveCombo: {
      reducer(state, { payload }: PayloadAction<Combo>) {
        if (payload.soundIds.length === 0) return;
        state.combos.push(payload);
        state.comboDraft = [];
      },
      prepare(input: { name: string; soundIds: string[] }) {
        return {
          payload: {
            id: comboService.newId(),
            name: comboService.normalizeName(input.name),
            soundIds: [...new Set(input.soundIds)],
          },
        };
      },
    },

    deleteCombo(state, { payload: id }: PayloadAction<string>) {
      state.combos = state.combos.filter((c) => c.id !== id);
    },

    /** Reemplaza los sonidos por los de una carpeta local (guarda los del servidor). */
    loadLocalSounds(
      state,
      {
        payload,
      }: PayloadAction<{ folderName: string; sounds: Sound[]; favoriteIds: string[]; combos: Combo[] }>,
    ) {
      if (state.source.kind === "server") {
        state.serverSnapshot = { sounds: state.sounds, favoriteIds: state.favoriteIds, combos: state.combos };
      }
      state.sounds = payload.sounds;
      state.favoriteIds = payload.favoriteIds;
      state.combos = payload.combos;
      state.comboDraft = [];
      state.source = { kind: "local", folderName: payload.folderName };
      state.showFavoritesOnly = false;
    },

    /** Vuelve a los sonidos del servidor. */
    restoreServerSounds(state) {
      if (!state.serverSnapshot) return;
      state.sounds = state.serverSnapshot.sounds;
      state.favoriteIds = state.serverSnapshot.favoriteIds;
      state.combos = state.serverSnapshot.combos;
      state.comboDraft = [];
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
  addToComboDraft,
  removeFromComboDraft,
  clearComboDraft,
  saveCombo,
  deleteCombo,
} = soundboardSlice.actions;
export const soundboardReducer = soundboardSlice.reducer;
