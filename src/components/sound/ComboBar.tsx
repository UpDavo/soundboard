"use client";

import { useMemo, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearComboDraft, deleteCombo, removeFromComboDraft, saveCombo } from "@/store/soundboard.slice";
import { selectComboDraft, selectCombos, selectSoundMap } from "@/store/selectors";
import { COMBO_NAME_MAX } from "@/services/combo.service";
import { chipClassName, CloseIcon, LayersIcon, Panel } from "@/components/ui";
import type { Combo } from "@/types/preferences";
import type { Sound } from "@/types/sound";

/** Mínimo de sonidos para que valga la pena guardar un combo. */
const MIN_COMBO_SOUNDS = 2;

/**
 * Combos guardados (tocar uno reproduce todos sus sonidos a la vez) y,
 * en modo múltiple, el combo en armado con los sonidos que se van tocando.
 */
export function ComboBar() {
  const dispatch = useAppDispatch();
  const combos = useAppSelector(selectCombos);
  const draft = useAppSelector(selectComboDraft);
  const soundMap = useAppSelector(selectSoundMap);
  const { voices, multi, player } = useAudioPlayer();
  const playingIds = useMemo(() => new Set(voices.map((v) => v.id)), [voices]);
  const [name, setName] = useState("");

  if (!multi && combos.length === 0) return null;

  const resolve = (ids: string[]): Sound[] => ids.flatMap((id) => soundMap.get(id) ?? []);
  const draftSounds = resolve(draft);
  const defaultName = `Combo ${combos.length + 1}`;

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (draftSounds.length < MIN_COMBO_SOUNDS) return;
    dispatch(saveCombo({ name: name || defaultName, soundIds: draftSounds.map((s) => s.id) }));
    setName("");
  };

  const toggleCombo = (combo: Combo) => {
    const sounds = resolve(combo.soundIds);
    const playing = sounds.length > 0 && sounds.every((s) => playingIds.has(s.id));
    if (playing) player.stopMany(sounds.map((s) => s.id));
    else player.playMany(sounds);
  };

  const remove = (combo: Combo) => {
    if (window.confirm(`¿Borrar el combo “${combo.name}”?`)) dispatch(deleteCombo(combo.id));
  };

  return (
    <div className="flex flex-col gap-3">
      {multi && (
        <Panel radius="md" className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            <span className="mr-1 text-sm font-semibold text-white">Nuevo combo</span>
            {draftSounds.length === 0 ? (
              <span className="text-sm text-white/50">Toca varios sonidos para armarlo.</span>
            ) : (
              draftSounds.map((s) => (
                <span
                  key={s.id}
                  className="flex items-center gap-1 rounded-full bg-white/10 py-1 pr-1 pl-2.5 text-xs text-white"
                >
                  {s.label}
                  <button
                    type="button"
                    aria-label={`Quitar ${s.label} del combo`}
                    onClick={() => dispatch(removeFromComboDraft(s.id))}
                    className="grid size-5 place-items-center rounded-full hover:bg-white/20"
                  >
                    <CloseIcon className="size-2.5" />
                  </button>
                </span>
              ))
            )}
          </div>

          {draftSounds.length > 0 && (
            <form onSubmit={save} className="flex shrink-0 items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={defaultName}
                aria-label="Nombre del combo"
                maxLength={COMBO_NAME_MAX}
                className="h-9 w-36 min-w-0 rounded-full border border-white/10 bg-neutral-900/60 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/30"
              />
              <button
                type="submit"
                disabled={draftSounds.length < MIN_COMBO_SOUNDS}
                title={draftSounds.length < MIN_COMBO_SOUNDS ? `Mínimo ${MIN_COMBO_SOUNDS} sonidos` : undefined}
                className="h-9 rounded-full bg-white px-3.5 text-sm font-semibold text-neutral-900 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => dispatch(clearComboDraft())}
                className="h-9 rounded-full bg-white/10 px-3 text-sm text-white hover:bg-white/20"
              >
                Limpiar
              </button>
            </form>
          )}
        </Panel>
      )}

      {combos.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Combos guardados">
          {combos.map((combo) => {
            const sounds = resolve(combo.soundIds);
            const playing = sounds.length > 0 && sounds.every((s) => playingIds.has(s.id));
            return (
              <div key={combo.id} className={chipClassName(playing, "gap-0 p-0")}>
                <button
                  type="button"
                  aria-pressed={playing}
                  onClick={() => toggleCombo(combo)}
                  title={sounds.map((s) => s.label).join(" · ")}
                  className="flex h-full items-center gap-2 rounded-full pl-4"
                >
                  <LayersIcon className="size-4" />
                  {combo.name}
                  <span className="tabular-nums opacity-60">{sounds.length}</span>
                </button>
                <button
                  type="button"
                  aria-label={`Borrar combo ${combo.name}`}
                  onClick={() => remove(combo)}
                  className={cn(
                    "mx-1.5 grid size-8 place-items-center rounded-full opacity-50 hover:opacity-100",
                    playing ? "hover:bg-black/10" : "hover:bg-white/10",
                  )}
                >
                  <CloseIcon className="size-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
