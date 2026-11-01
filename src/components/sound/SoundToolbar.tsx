"use client";

import { SearchInput, StarIcon, ToggleChip } from "@/components/ui";

interface SoundToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  favoritesOnly: boolean;
  onFavoritesOnlyChange: (value: boolean) => void;
  favoriteCount: number;
  resultCount: number;
  total: number;
}

/** Buscador + filtro de favoritos + contador. */
export function SoundToolbar({
  query,
  onQueryChange,
  favoritesOnly,
  onFavoritesOnlyChange,
  favoriteCount,
  resultCount,
  total,
}: SoundToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder="Buscar sonidos"
        className="min-w-0 flex-1 sm:max-w-sm"
      />
      <ToggleChip
        pressed={favoritesOnly}
        onPressedChange={onFavoritesOnlyChange}
        icon={<StarIcon filled={favoritesOnly} className="size-4" />}
      >
        Favoritos
        <span className="tabular-nums opacity-60">{favoriteCount}</span>
      </ToggleChip>
      <span className="text-sm tabular-nums text-white/50">
        {resultCount} de {total}
      </span>
    </div>
  );
}
