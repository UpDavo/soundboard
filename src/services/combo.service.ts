import type { Combo } from "@/types/preferences";

export const COMBO_NAME_MAX = 40;
const COMBO_ID_MAX = 64;
const COMBOS_MAX = 100;

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Lógica pura (cliente y servidor) de combos. */
export const comboService = {
  /** Id corto; no usa crypto.randomUUID porque no existe fuera de HTTPS/localhost. */
  newId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  },

  normalizeName(name: string, fallback = "Combo") {
    return name.trim().slice(0, COMBO_NAME_MAX) || fallback;
  },

  /**
   * Datos desconocidos -> combos válidos. Tolerante: descarta entradas inválidas,
   * ids repetidos y sonidos que no pasen `isValidSound`; un combo sin sonidos se descarta.
   */
  sanitize(raw: unknown, isValidSound: (id: string) => boolean = () => true): Combo[] {
    if (!Array.isArray(raw)) return [];
    const combos: Combo[] = [];
    const seen = new Set<string>();
    for (const entry of raw) {
      if (combos.length >= COMBOS_MAX) break;
      if (!isObject(entry) || typeof entry.id !== "string" || !Array.isArray(entry.soundIds)) continue;
      const id = entry.id.trim().slice(0, COMBO_ID_MAX);
      if (!id || seen.has(id)) continue;
      const soundIds = [
        ...new Set(
          entry.soundIds
            .filter((s): s is string => typeof s === "string")
            .map((s) => s.trim().normalize("NFC"))
            .filter((s) => s && isValidSound(s)),
        ),
      ];
      if (soundIds.length === 0) continue;
      seen.add(id);
      combos.push({ id, name: this.normalizeName(typeof entry.name === "string" ? entry.name : ""), soundIds });
    }
    return combos;
  },
};
