"use client";

import { useSyncExternalStore } from "react";
import { audioPlayer } from "@/services/audio-player.service";

export function useAudioPlayer() {
  const state = useSyncExternalStore(
    audioPlayer.subscribe,
    audioPlayer.getSnapshot,
    audioPlayer.getServerSnapshot,
  );
  return { ...state, player: audioPlayer };
}
