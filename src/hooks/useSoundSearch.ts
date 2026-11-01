"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { soundFilterService } from "@/services/sound-filter.service";
import type { Sound } from "@/types/sound";

export function useSoundSearch(sounds: Sound[]) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(
    () => soundFilterService.filter(sounds, deferredQuery),
    [sounds, deferredQuery],
  );

  return { query, setQuery, deferredQuery, results, total: sounds.length };
}
