import { useSyncExternalStore } from "react";
import type { GameState, Settings } from "./model";
import { defaults, loadSave, unlock } from "./rules.js";
import {reconcileStory,choose,startQuestion,tickDialogue} from './dialogueEngine.js';
export const SAVE_KEY = "lastSeenSave";
let current: GameState;
try {
  current = loadSave(
    localStorage.getItem(SAVE_KEY),
    localStorage.getItem("last-seen-save-v1"),
  ) as GameState;
} catch {
  current = defaults() as GameState;
}
const listeners = new Set<() => void>();
let storageError = false;
export const getState = () => current;
export const getStorageError = () => storageError;
export function setState(next: GameState) {
  current = reconcileStory(next) as GameState;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(current));
    storageError = false;
  } catch {
    storageError = true;
  }
  listeners.forEach((fn) => fn());
}
export function useGame() {
  return useSyncExternalStore((fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, getState);
}
export function addTo(
  key: "evidence" | "flags" | "restored" | "read" | "searches" | "events",
  id: string,
) {
  setState({ ...current, [key]: [...new Set([...current[key], id])] });
}
export const updateFlag = (id: string) => addTo("flags", id);
export const addEvidence = (id: string) => addTo("evidence", id);
export function unlockFile(id: string, password: string) {
  const next = unlock(current, id, password) as GameState;
  if (next === current) return false;
  setState(next);
  return true;
}
export function resetGame() {
  setState({ ...defaults(), settings: current.settings } as GameState);
}
export function updateSettings(value: Partial<Settings>) {
  setState({ ...current, settings: { ...current.settings, ...value } });
}
export function askQuestion(id:string){const next=startQuestion(current,id);if(next!==current)setState(next as GameState);}
export function selectReply(group:string,option:string){const next=choose(current,group,option);if(next!==current)setState(next as GameState);}
export function advanceDialogue(){const next=tickDialogue(current);if(next!==current)setState(next as GameState);}
export function nextCaseFeed(){const id=current.story.caseFeedQueue[0];if(!id)return;setState({...current,story:{...current.story,caseFeedQueue:current.story.caseFeedQueue.slice(1),caseFeedHistory:[...new Set([...current.story.caseFeedHistory,id])]}});}
