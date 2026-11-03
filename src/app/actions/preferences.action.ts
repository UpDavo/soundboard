"use server";

import { soundboardService } from "@/services/soundboard.service";
import type { SoundPreferences } from "@/types/preferences";

/** Server Action: persiste orden + favoritos + combos en data/soundboard.json. */
export async function savePreferencesAction(prefs: SoundPreferences): Promise<{ ok: boolean }> {
  try {
    await soundboardService.savePreferences(prefs);
    return { ok: true };
  } catch (err) {
    console.error("[savePreferences]", err);
    return { ok: false };
  }
}
