"use client";

import { FloatingNotice, FolderIcon, UndoIcon } from "@/components/ui";

interface LocalSourceBannerProps {
  folderName: string;
  count: number;
  onRestore: () => void;
}

/** Aviso flotante (abajo a la izquierda) de que se usa una carpeta local. */
export function LocalSourceBanner({ folderName, count, onRestore }: LocalSourceBannerProps) {
  return (
    <FloatingNotice
      animationKey={folderName}
      // Mobile: encima del volumen (el reproductor lo tapa mientras suena). Desktop: abajo a la izquierda.
      className="bottom-[100px] left-4 md:bottom-6 md:left-6"
      icon={<FolderIcon className="size-[18px]" />}
      title={folderName}
      description={`${count} ${count === 1 ? "sonido" : "sonidos"}`}
      action={
        <button
          type="button"
          onClick={onRestore}
          title="Volver a los originales"
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/20"
        >
          <UndoIcon className="size-3.5" />
          Originales
        </button>
      }
    />
  );
}
