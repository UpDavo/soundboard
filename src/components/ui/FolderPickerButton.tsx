"use client";

import { useRef, type ReactNode } from "react";
import { chipClassName } from "./chip";

interface FolderPickerButtonProps {
  onPick: (files: File[]) => void;
  icon?: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

/** Atributos no estándar (pero soportados por todos los navegadores) para elegir carpetas. */
const DIRECTORY_ATTRS = { webkitdirectory: "", directory: "" } as Record<string, string>;

/** Botón que abre el selector de CARPETAS del sistema y devuelve sus archivos. */
export function FolderPickerButton({ onPick, icon, children, disabled, className }: FolderPickerButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className={chipClassName(false, className)}
      >
        {icon}
        {children}
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        {...DIRECTORY_ATTRS}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = ""; // permite volver a elegir la misma carpeta
          if (files.length) onPick(files);
        }}
      />
    </>
  );
}
