"use client";

import { useSoundSearch } from "@/hooks/useSoundSearch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setShowFavoritesOnly } from "@/store/soundboard.slice";
import {
  selectFavoriteIds,
  selectShowFavoritesOnly,
  selectSounds,
  selectVisibleSounds,
} from "@/store/selectors";
import { EmptyState } from "@/components/ui";
import { SoundToolbar } from "./SoundToolbar";
import { SoundGrid } from "./SoundGrid";

/** Orquesta toolbar (búsqueda + favoritos) + grilla + estados vacíos. */
export function SoundBoard() {
  const dispatch = useAppDispatch();
  const total = useAppSelector(selectSounds).length;
  const favoriteCount = useAppSelector(selectFavoriteIds).length;
  const favoritesOnly = useAppSelector(selectShowFavoritesOnly);
  const visible = useAppSelector(selectVisibleSounds);
  const { query, setQuery, deferredQuery, results } = useSoundSearch(visible);

  if (total === 0) {
    return (
      <EmptyState>
        No hay sonidos. Agrega archivos <code className="text-white">.mp3</code> en{" "}
        <code className="text-white">public/assets/mp3</code> y recarga.
      </EmptyState>
    );
  }

  return (
    <section className="flex flex-col gap-5">
      <SoundToolbar
        query={query}
        onQueryChange={setQuery}
        favoritesOnly={favoritesOnly}
        onFavoritesOnlyChange={(v) => dispatch(setShowFavoritesOnly(v))}
        favoriteCount={favoriteCount}
        resultCount={results.length}
        total={total}
      />

      {results.length > 0 ? (
        <SoundGrid sounds={results} animationKey={`${deferredQuery}|${favoritesOnly}`} />
      ) : query ? (
        <EmptyState>
          Sin resultados para <span className="font-semibold text-white">“{query}”</span>.
        </EmptyState>
      ) : (
        <EmptyState>Aún no tienes favoritos. Toca la ★ de un sonido para agregarlo.</EmptyState>
      )}
    </section>
  );
}
