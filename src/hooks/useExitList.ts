"use client";

import { useEffect, useState } from "react";

export interface ExitItem<T> {
  item: T;
  /** Ya no está en la lista: se muestra mientras anima su salida. */
  leaving: boolean;
}

/**
 * Mantiene montados `exitMs` los elementos que salen de `items`,
 * marcados como `leaving`, para poder animar su salida antes de desmontarlos.
 */
export function useExitList<T extends { id: string }>(items: T[], exitMs: number): ExitItem<T>[] {
  const [prev, setPrev] = useState(items);
  const [rendered, setRendered] = useState<ExitItem<T>[]>(() => items.map((item) => ({ item, leaving: false })));

  // Estado derivado del render anterior (patrón recomendado por React, sin efecto).
  if (prev !== items) {
    setPrev(items);
    const byId = new Map(items.map((i) => [i.id, i]));
    const kept = rendered.map((r) => {
      const next = byId.get(r.item.id);
      return next ? { item: next, leaving: false } : { ...r, leaving: true };
    });
    const known = new Set(rendered.map((r) => r.item.id));
    const added = items.filter((i) => !known.has(i.id)).map((item) => ({ item, leaving: false }));
    setRendered([...kept, ...added]);
  }

  useEffect(() => {
    if (!rendered.some((r) => r.leaving)) return;
    const t = setTimeout(() => setRendered((rs) => rs.filter((r) => !r.leaving)), exitMs);
    return () => clearTimeout(t);
  }, [rendered, exitMs]);

  return rendered;
}
