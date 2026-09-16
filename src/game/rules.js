import {initialStory,normalizeStory} from './dialogueEngine.js';
export const defaults = () => ({
  version: 2,
  loggedIn: false,
  evidence: [],
  flags: [],
  restored: [],
  read: [],
  searches: [],
  events: [],
  ending: null,
  story:initialStory(),
  settings: {
    master: 0.65,
    music: 0.1,
    sfx: 0.5,
    textSpeed: 1,
    reduceMotion: false,
  },
});
export function chapter(s) {
  if(s.flags.includes('audioRestored')&&s.story?.conversationProgress?.final_audio==='done')return 6;
  if (s.flags.includes("audioRestored")) return 5;
  if (s.flags.includes("projectUnlocked")) return 4;
  if (s.flags.includes("receiptRestored")) return 3;
  if (s.evidence.includes("minjae_chat")) return 2;
  return s.loggedIn ? 1 : 0;
}
export function endingFor(person, ids) {
  return person !== "jihoon"
    ? "bad"
    : [
          "receipt_2247",
          "project_n",
          "jihoon_payment",
          "draft_email",
          "final_audio",
          "hidden_location",
        ].every((id) => ids.includes(id))
      ? "true"
      : "normal";
}
export function unlock(s, id, password) {
  const valid =
    id === "projectUnlocked"
      ? s.flags.includes("receiptRestored") &&
        password.trim().toLowerCase() === "orbit"
      : id === "zipUnlocked"
        ? s.flags.includes("projectUnlocked") &&
          password.trim().toLowerCase() === "nobody_404"
        : false;
  return valid ? { ...s, flags: [...new Set([...s.flags, id])] } : s;
}
export function loadSave(raw, legacy) {
  try {
    const s = JSON.parse(raw);
    if (s?.version === 2) {
      const d = defaults();
      for (const key of [
        "evidence",
        "flags",
        "restored",
        "read",
        "searches",
        "events",
      ])
        d[key] = Array.isArray(s[key])
          ? [...new Set(s[key].filter((x) => typeof x === "string"))]
          : [];
      d.loggedIn = s.loggedIn === true;
      d.ending = ["bad", "normal", "true", "too_early", "he_knows", "the_story", "confession", "trusted"].includes(s.ending) ? s.ending : null;
      d.story=normalizeStory(s.story);
      for (const key of ["master", "music", "sfx"])
        if (Number.isFinite(s.settings?.[key]))
          d.settings[key] = Math.min(1, Math.max(0, s.settings[key]));
      d.settings.textSpeed = [0.5, 1, 2].includes(s.settings?.textSpeed)
        ? s.settings.textSpeed
        : 1;
      d.settings.reduceMotion = s.settings?.reduceMotion === true;
      return d;
    }
  } catch {}
  try {
    const old = JSON.parse(legacy);
    if (old?.version === 1) {
      const d = defaults();
      d.loggedIn = old.loggedIn === true;
      if (old.evidence?.includes("chat")) d.evidence.push("minjae_chat");
      if (old.evidence?.includes("receipt")) {
        d.evidence.push("receipt_2247");
        d.flags.push("receiptRestored");
        d.restored.push("receipt");
      }
      return d;
    }
  } catch {}
  return defaults();
}
