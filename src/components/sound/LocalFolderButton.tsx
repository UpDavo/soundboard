"use client";

import { FolderIcon, FolderPickerButton } from "@/components/ui";

interface LocalFolderButtonProps {
  onPick: (files: File[]) => void;
  busy?: boolean;
  isLocal?: boolean;
}

export function LocalFolderButton({ onPick, busy, isLocal }: LocalFolderButtonProps) {
  return (
    <FolderPickerButton onPick={onPick} disabled={busy} icon={<FolderIcon className="size-4" />}>
      {busy ? "Cargando…" : isLocal ? "Cambiar carpeta" : "Usar mi carpeta"}
    </FolderPickerButton>
  );
}
