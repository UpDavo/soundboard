/** Combo guardado: un grupo de sonidos que se reproducen juntos. */
export interface Combo {
  id: string;
  name: string;
  soundIds: string[];
}

/** Preferencias del usuario: orden manual, favoritos y combos (por id de sonido). */
export interface SoundPreferences {
  order: string[];
  favorites: string[];
  /** Opcional: archivos/cachés anteriores a los combos no lo tienen. */
  combos?: Combo[];
}
