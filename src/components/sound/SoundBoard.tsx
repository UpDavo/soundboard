"use client";

import { useSoundSearch } from "@/hooks/useSoundSearch";
import { useLocalLibrary } from "@/hooks/useLocalLibrary";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setShowFavoritesOnly } from "@/store/soundboard.slice";
import {
  selectFavoriteIds,
  selectShowFavoritesOnly,
  selectSounds,
  selectVisibleSounds,
} from "@/store/selectors";
import { AUDIO_EXTENSIONS_LABEL } from "@/lib/audio-file";
import { EmptyState } from "@/components/ui";
import { SoundToolbar } from "./SoundToolbar";
import { SoundGrid } from "./SoundGrid";
import { LocalFolderButton } from "./LocalFolderButton";
import { LocalSourceBanner } from "./LocalSourceBanner";
import { SoundBoardSkeleton } from "./SoundBoardSkeleton";

/** Orquesta origen (servidor / carpeta local) + toolbar + grilla + estados vacíos. */
export function SoundBoard() {
  const dispatch = useAppDispatch();
  const total = useAppSelector(selectSounds).length;
  const favoriteCount = useAppSelector(selectFavoriteIds).length;
  const favoritesOnly = useAppSelector(selectShowFavoritesOnly);
  const visible = useAppSelector(selectVisibleSounds);
  const { query, setQuery, deferredQuery, results } = useSoundSearch(visible);
  const local = useLocalLibrary();

  const folderButton = (
    <LocalFolderButton onPick={local.pickFolder} busy={local.busy} isLocal={local.isLocal} />
  );
  const folderError = local.error && <p className="text-sm text-amber-300">{local.error}</p>;

  // Skeleton al abrir (revisando caché) y mientras se importa una carpeta.
  if (local.restoring || local.busy) return <SoundBoardSkeleton />;

  if (total === 0) {
    return (
      <section className="flex flex-col items-start gap-4">
        <EmptyState>
          No hay sonidos. Agrega archivos <code className="text-white">{AUDIO_EXTENSIONS_LABEL}</code> en{" "}
          <code className="text-white">public/assets/mp3</code> y recarga, o usa una carpeta de tu PC.
        </EmptyState>
        {folderButton}
        {folderError}
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-5">
      {local.folderName && (
        <LocalSourceBanner
          folderName={local.folderName}
          count={total}
          onRestore={local.restoreOriginals}
        />
      )}

      <SoundToolbar
        query={query}
        onQueryChange={setQuery}
        favoritesOnly={favoritesOnly}
        onFavoritesOnlyChange={(v) => dispatch(setShowFavoritesOnly(v))}
        favoriteCount={favoriteCount}
        resultCount={results.length}
        total={total}
        actions={folderButton}
      />
      {folderError}

      {results.length > 0 ? (
        <SoundGrid
          sounds={results}
          animationKey={`${local.folderName ?? "server"}|${deferredQuery}|${favoritesOnly}`}
        />
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
