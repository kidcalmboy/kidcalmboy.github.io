import { useSyncExternalStore } from "react";
import { fresh, load, SAVE_KEY, type Game } from "./engine.ts";
let state = load(localStorage.getItem(SAVE_KEY));
const listeners = new Set<() => void>();
export function update(fn: (s: Game) => Game) {
  const next = fn(state);
  if (next === state) return;
  state = next;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    window.dispatchEvent(
      new CustomEvent("lp-toast", {
        detail:
          "저장 공간이 부족합니다. 이번 진행은 브라우저를 닫으면 사라질 수 있습니다.",
      }),
    );
  }
  listeners.forEach((f) => f());
}
export const useGame = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
  );
export const reset = () => update(() => ({ ...fresh(), started: true }));
export const toast = (text: string) =>
  window.dispatchEvent(new CustomEvent("lp-toast", { detail: text }));
