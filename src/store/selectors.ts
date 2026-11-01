import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export const selectSounds = (s: RootState) => s.soundboard.sounds;
export const selectFavoriteIds = (s: RootState) => s.soundboard.favoriteIds;
export const selectShowFavoritesOnly = (s: RootState) => s.soundboard.showFavoritesOnly;

export const selectFavoriteSet = createSelector(selectFavoriteIds, (ids) => new Set(ids));

/** Sonidos visibles según el filtro de favoritos (antes de la búsqueda). */
export const selectVisibleSounds = createSelector(
  [selectSounds, selectFavoriteSet, selectShowFavoritesOnly],
  (sounds, favs, onlyFavs) => (onlyFavs ? sounds.filter((s) => favs.has(s.id)) : sounds),
);

/** Lo que se guarda en el archivo. */
export const selectPreferences = createSelector(
  [selectSounds, selectFavoriteIds],
  (sounds, favorites) => ({ order: sounds.map((s) => s.id), favorites }),
);
