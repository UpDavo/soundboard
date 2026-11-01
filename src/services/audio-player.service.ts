import type { Sound } from "@/types/sound";

export interface PlayerState {
  current: Sound | null;
  isPlaying: boolean;
  volume: number; // 0..1
}

type Listener = () => void;

/**
 * Servicio de reproducción (cliente). Un único <audio> compartido:
 * reproducir un sonido nuevo cancela automáticamente el anterior.
 * Expone subscribe/getSnapshot para usarse con useSyncExternalStore.
 */
class AudioPlayerService {
  private audio: HTMLAudioElement | null = null;
  private listeners = new Set<Listener>();
  private state: PlayerState = { current: null, isPlaying: false, volume: 0.8 };

  private static readonly SERVER_STATE: PlayerState = {
    current: null,
    isPlaying: false,
    volume: 0.8,
  };

  private getAudio(): HTMLAudioElement {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = "auto";
      this.audio.volume = this.state.volume;
      this.audio.addEventListener("ended", () => this.setState({ isPlaying: false }));
      this.audio.addEventListener("error", () => this.setState({ isPlaying: false }));
    }
    return this.audio;
  }

  private setState(patch: Partial<PlayerState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.state;
  getServerSnapshot = () => AudioPlayerService.SERVER_STATE;

  async play(sound: Sound) {
    const audio = this.getAudio();
    audio.pause();
    audio.src = sound.src;
    audio.currentTime = 0;
    this.setState({ current: sound, isPlaying: true });
    try {
      await audio.play();
    } catch (err) {
      // AbortError = otro play() interrumpió este; es esperado.
      if ((err as DOMException).name !== "AbortError") {
        this.setState({ isPlaying: false });
      }
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.setState({ isPlaying: false });
  }

  /** Alterna: si el sonido ya suena lo detiene, si no lo reproduce. */
  toggle(sound: Sound) {
    if (this.state.isPlaying && this.state.current?.id === sound.id) this.stop();
    else void this.play(sound);
  }

  setVolume(volume: number) {
    const v = Math.min(1, Math.max(0, volume));
    if (this.audio) this.audio.volume = v;
    this.setState({ volume: v });
  }

  /** Progreso 0..1 del sonido actual (se lee por frame, sin re-render). */
  getProgress(): number {
    const a = this.audio;
    if (!a || !a.duration || !Number.isFinite(a.duration)) return 0;
    return a.currentTime / a.duration;
  }

  getTimes() {
    const a = this.audio;
    return {
      current: a?.currentTime ?? 0,
      duration: a && Number.isFinite(a.duration) ? a.duration : 0,
    };
  }
}

export const audioPlayer = new AudioPlayerService();
