"use client";

import type { ReactNode } from "react";
import { LayersIcon, SearchInput, StarIcon, ToggleChip } from "@/components/ui";

interface SoundToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  favoritesOnly: boolean;
  onFavoritesOnlyChange: (value: boolean) => void;
  favoriteCount: number;
  /** Modo múltiple: varios sonidos a la vez. */
  multi: boolean;
  onMultiChange: (value: boolean) => void;
  resultCount: number;
  total: number;
  /** Acciones extra al final (ej. elegir carpeta local). */
  actions?: ReactNode;
}

/** Buscador + filtro de favoritos + modo múltiple + contador. */
export function SoundToolbar({
  query,
  onQueryChange,
  favoritesOnly,
  onFavoritesOnlyChange,
  favoriteCount,
  multi,
  onMultiChange,
  resultCount,
  total,
  actions,
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
      <ToggleChip pressed={multi} onPressedChange={onMultiChange} icon={<LayersIcon className="size-4" />}>
        Múltiple
      </ToggleChip>
      <span className="text-sm tabular-nums text-white/50">
        {resultCount} de {total}
      </span>
      {actions && <div className="flex items-center gap-3 sm:ml-auto">{actions}</div>}
    </div>
  );
}
