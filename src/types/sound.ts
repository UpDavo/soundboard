/** Entidad de dominio: un sonido disponible en el tablero. */
export interface Sound {
  /** Identificador estable (nombre de archivo sin extensión). */
  id: string;
  /** Texto legible para mostrar en el botón. */
  label: string;
  /** URL pública desde donde el navegador carga el audio. */
  src: string;
}

/** Registro crudo tal como lo entrega el repositorio. */
export interface SoundFile {
  fileName: string;
  publicPath: string;
}
