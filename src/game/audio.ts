import { getState } from "./store";
let context: AudioContext | undefined;
export function sound(kind = "click") {
  try {
    context ??= new AudioContext();
    void context.resume();
    const s = getState().settings,
      osc = context.createOscillator(),
      gain = context.createGain();
    osc.connect(gain);
    gain.connect(context.destination);
    osc.frequency.value =
      kind === "error"
        ? 160
        : kind === "notification"
          ? 740
          : kind === "unlock"
            ? 880
            : 440;
    gain.gain.setValueAtTime(s.master * s.sfx * 0.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
    osc.start();
    osc.stop(context.currentTime + 0.24);
  } catch {
    /* Audio unsupported: the game remains playable. */
  }
}
export function startAmbient() {
  try {
    context ??= new AudioContext();
    const osc = context.createOscillator(),
      gain = context.createGain();
    osc.type = "sine";
    osc.frequency.value = 65;
    osc.connect(gain);
    gain.connect(context.destination);
    gain.gain.value =
      getState().settings.master * getState().settings.music * 0.015;
    osc.start();
    return () => osc.stop();
  } catch {
    return () => {};
  }
}
