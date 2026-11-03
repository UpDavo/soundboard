import type { Sound } from "@/types/sound";

export interface PlayerState {
  /** Sonidos que suenan ahora, en orden de inicio. */
  voices: Sound[];
  /** Modo múltiple: tocar un sonido NO corta los que ya suenan. */
  multi: boolean;
  volume: number; // 0..1
}

type Listener = () => void;

/**
 * Servicio de reproducción (cliente). Un <audio> por sonido sonando:
 * - modo normal: reproducir un sonido corta todos los demás.
 * - modo múltiple: los sonidos se superponen.
 * Expone subscribe/getSnapshot para usarse con useSyncExternalStore.
 */
class AudioPlayerService {
  private audios = new Map<string, HTMLAudioElement>();
  private listeners = new Set<Listener>();
  private state: PlayerState = { voices: [], multi: false, volume: 0.8 };

  private static readonly SERVER_STATE: PlayerState = { voices: [], multi: false, volume: 0.8 };

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

  /** Corta el <audio> de un sonido sin tocar el estado. */
  private release(id: string) {
    const audio = this.audios.get(id);
    if (!audio) return;
    this.audios.delete(id);
    audio.pause();
  }

  private releaseAll() {
    [...this.audios.keys()].forEach((id) => this.release(id));
  }

  /** Crea y arranca el <audio> de un sonido (reinicia si ya sonaba). */
  private startVoice(sound: Sound) {
    this.release(sound.id);
    const audio = new Audio(sound.src);
    audio.preload = "auto";
    audio.volume = this.state.volume;
    // Solo si sigue siendo la voz actual de ese sonido (no una reemplazada).
    const end = () => {
      if (this.audios.get(sound.id) === audio) this.stop(sound.id);
    };
    audio.addEventListener("ended", end);
    audio.addEventListener("error", end);
    this.audios.set(sound.id, audio);
    audio.play().catch((err: DOMException) => {
      // AbortError = se pausó antes de arrancar; es esperado.
      if (err.name !== "AbortError") end();
    });
  }

  play(sound: Sound) {
    if (!this.state.multi) this.releaseAll();
    this.startVoice(sound);
    const others = this.state.multi ? this.state.voices.filter((v) => v.id !== sound.id) : [];
    this.setState({ voices: [...others, sound] });
  }

  /** Reproduce varios sonidos a la vez (combo), cortando lo que sonaba. */
  playMany(sounds: Sound[]) {
    this.releaseAll();
    const unique = [...new Map(sounds.map((s) => [s.id, s])).values()];
    unique.forEach((s) => this.startVoice(s));
    this.setState({ voices: unique });
  }

  stop(id: string) {
    this.release(id);
    this.setState({ voices: this.state.voices.filter((v) => v.id !== id) });
  }

  stopMany(ids: string[]) {
    const set = new Set(ids);
    set.forEach((id) => this.release(id));
    this.setState({ voices: this.state.voices.filter((v) => !set.has(v.id)) });
  }

  stopAll() {
    this.releaseAll();
    this.setState({ voices: [] });
  }

  isPlaying(id: string) {
    return this.audios.has(id);
  }

  /** Alterna: si el sonido ya suena lo detiene, si no lo reproduce. */
  toggle(sound: Sound) {
    if (this.isPlaying(sound.id)) this.stop(sound.id);
    else this.play(sound);
  }

  /** Al salir del modo múltiple solo sigue sonando el último. */
  setMulti(multi: boolean) {
    const { voices } = this.state;
    if (!multi && voices.length > 1) {
      voices.slice(0, -1).forEach((v) => this.release(v.id));
      this.setState({ multi, voices: voices.slice(-1) });
    } else {
      this.setState({ multi });
    }
  }

  setVolume(volume: number) {
    const v = Math.min(1, Math.max(0, volume));
    this.audios.forEach((a) => (a.volume = v));
    this.setState({ volume: v });
  }

  /** Tiempo actual y duración (0 si aún no se conoce) de un sonido sonando. */
  getTimes(id: string) {
    const a = this.audios.get(id);
    return {
      current: a?.currentTime ?? 0,
      duration: a && Number.isFinite(a.duration) ? a.duration : 0,
    };
  }

  /** Progreso 0..1 de un sonido (se lee por frame, sin re-render). */
  getProgress(id: string): number {
    const { current, duration } = this.getTimes(id);
    return duration ? current / duration : 0;
  }
}

export const audioPlayer = new AudioPlayerService();
