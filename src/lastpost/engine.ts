import { dialogues, evidenceLabels } from "./data.ts";
export type AppId = "moment" | "browser" | "mail" | "notes";
export type Note = {
  id: string;
  title: string;
  body: string;
  source: string;
  category: string;
  time: string;
  fact?: string;
  pinned: boolean;
};
export type Message = {
  id: string;
  user: string;
  sender: "you" | "npc";
  text: string;
  time: number;
};
export type Pending = {
  id: string;
  user: string;
  due: number;
  texts: string[];
  facts: string[];
};
export type Game = {
  version: 1;
  started: boolean;
  loggedIn: boolean;
  facts: string[];
  choices: Record<string, string>;
  trust: number;
  risk: number;
  messages: Message[];
  pending: Pending[];
  notes: Note[];
  searches: string[];
  seenChapters: number;
  readUsers: string[];
  ending: string | null;
  epilogue: string | null;
  liked: string[];
  followed: string[];
};
export const SAVE_KEY = "lastPostSave.v1";
export function fresh(): Game {
  return {
    version: 1,
    started: false,
    loggedIn: false,
    facts: [],
    choices: {},
    trust: 0,
    risk: 0,
    messages: [],
    pending: [],
    notes: [],
    searches: [],
    seenChapters: 0,
    readUsers: [],
    ending: null,
    epilogue: null,
    liked: [],
    followed: [],
  };
}
const unique = (xs: string[]) => [...new Set(xs)];
export function load(raw: string | null): Game {
  try {
    const r = JSON.parse(raw || "null");
    if (!r || r.version !== 1) return fresh();
    const s = fresh();
    for (const key of ["started", "loggedIn"] as const)
      s[key] = r[key] === true;
    for (const key of [
      "facts",
      "searches",
      "readUsers",
      "liked",
      "followed",
    ] as const)
      s[key] = Array.isArray(r[key])
        ? unique(r[key].filter((v: unknown) => typeof v === "string")).slice(
            0,
            500,
          )
        : [];
    s.trust = Number.isFinite(r.trust) ? Math.max(-5, Math.min(5, r.trust)) : 0;
    s.risk = Number.isFinite(r.risk) ? Math.max(0, Math.min(10, r.risk)) : 0;
    s.seenChapters = Number.isInteger(r.seenChapters)
      ? Math.max(0, Math.min(5, r.seenChapters))
      : 0;
    if (r.choices && typeof r.choices === "object")
      for (const d of dialogues)
        if (d.options.some((o) => o.id === r.choices[d.id]))
          s.choices[d.id] = r.choices[d.id];
    s.messages = Array.isArray(r.messages)
      ? r.messages.filter(
          (m: Message) =>
            m &&
            typeof m.id === "string" &&
            typeof m.text === "string" &&
            typeof m.user === "string" &&
            ["you", "npc"].includes(m.sender) &&
            Number.isFinite(m.time),
        )
      : [];
    s.pending = Array.isArray(r.pending)
      ? r.pending.filter(
          (p: Pending) =>
            p &&
            dialogues.some((d) => d.id === p.id) &&
            s.choices[p.id] &&
            Number.isFinite(p.due) &&
            Array.isArray(p.texts) &&
            p.texts.every((t) => typeof t === "string") &&
            Array.isArray(p.facts) &&
            p.facts.every((t) => typeof t === "string"),
        )
      : [];
    s.notes = Array.isArray(r.notes)
      ? r.notes
          .filter(
            (n: Note) =>
              n &&
              ["id", "title", "body", "source", "category", "time"].every(
                (k) =>
                  typeof (n as unknown as Record<string, unknown>)[k] ===
                  "string",
              ),
          )
          .map((n: Note) => ({ ...n, pinned: n.pinned === true }))
      : [];
    s.ending = ["true", "normal", "wrong", "incomplete", "lost"].includes(
      r.ending,
    )
      ? r.ending
      : null;
    s.epilogue = typeof r.epilogue === "string" ? r.epilogue : null;
    return s;
  } catch {
    return fresh();
  }
}
export const has = (s: Game, ...facts: string[]) =>
  facts.every((f) => s.facts.includes(f));
export function discover(s: Game, ...facts: string[]): Game {
  const next = unique([...s.facts, ...facts]);
  return next.length === s.facts.length ? s : { ...s, facts: next };
}
export function login(s: Game, password: string): Game {
  if (password !== "1103" || s.loggedIn) return s;
  return {
    ...s,
    loggedIn: true,
    messages: [
      ...s.messages,
      {
        id: "intro-prompt",
        user: "gaeun",
        sender: "npc",
        text: "너 지금 윤아 계정 들어갔어?",
        time: Date.now(),
      },
    ],
  };
}
export function available(s: Game, id: string) {
  const d = dialogues.find((d) => d.id === id);
  return (
    !!d &&
    s.loggedIn &&
    !s.choices[id] &&
    !s.pending.some((p) => p.user === d.user) &&
    has(s, ...d.requires)
  );
}
export function choose(
  s: Game,
  id: string,
  option: string,
  now = Date.now(),
): Game {
  const d = dialogues.find((d) => d.id === id),
    o = d?.options.find((o) => o.id === option);
  if (!d || !o || !available(s, id)) return s;
  const silent = id === "minsuk" && option === "silent";
  let reply = o.reply.filter(Boolean);
  let responseFacts = o.facts || [];
  if (id === 'gaeun-story' && option !== 'threat' && s.trust + (o.trust || 0) < 1) {
    reply = ['지금은 누구를 믿어야 할지 모르겠어. 조금만 시간을 줘.'];
    responseFacts = [];
  }
  if (id === "gaeun-story" && s.choices.intro === "lie")
    reply = ["아까 계정 안 들어갔다며. 다음부터는 솔직히 말해줘.", ...reply];
  const next = {
    ...s,
    choices: { ...s.choices, [id]: option },
    trust: Math.max(-5, Math.min(5, s.trust + (o.trust || 0))),
    risk: s.risk + (o.risk || 0),
    messages: silent
      ? s.messages
      : [
          ...s.messages,
          ...(id !== 'intro' && d.question !== o.text ? [{
            id: `${id}-question`, user: d.user, sender: 'you' as const,
            text: d.question, time: now,
          }] : []),
          {
            id: `${id}-you`,
            user: d.user,
            sender: "you" as const,
            text: o.text,
            time: now,
          },
        ],
    pending: [
      ...s.pending,
      {
        id,
        user: d.user,
        due: now + 1200,
        texts: reply,
        facts: [...responseFacts, `reply:${id}`],
      },
    ],
  };
  return next;
}
export function tick(s: Game, now = Date.now()): Game {
  const due = s.pending.filter((p) => p.due <= now);
  if (!due.length) return s;
  let n = {
    ...s,
    pending: s.pending.filter((p) => p.due > now),
    messages: [...s.messages],
    readUsers: s.readUsers.filter((u) => !due.some((p) => p.user === u)),
  };
  for (const p of due) {
    p.texts.forEach((text, i) =>
      n.messages.push({
        id: `${p.id}-${i}`,
        user: p.user,
        sender: "npc",
        text,
        time: now + i,
      }),
    );
    n = discover(n, ...p.facts);
  }
  return n;
}
export function chapter(s: Game): number {
  if (!s.loggedIn || !has(s, "last", "sea-dislike", "hyunwoo-dm")) return 0;
  if (!has(s, "story-reply", "taejun-meeting", "usb-testimony", "live"))
    return 1;
  if (!has(s, "profile:ocean", "sera-testimony", "seoul", "scheduled"))
    return 2;
  if (!has(s, "deleted-story", "meeting", "hyunwoo-alibi")) return 3;
  if (!has(s, "image-source", "import") || (!has(s,'identity') && !has(s,'admission'))) return 4;
  return 5;
}
export function addNote(s: Game, n: Omit<Note, "pinned">): Game {
  const old = s.notes.find((x) => x.id === n.id);
  if (old)
    return n.fact && !old.fact
      ? {
          ...s,
          notes: s.notes.map((x) =>
            x.id === n.id ? { ...x, fact: n.fact } : x,
          ),
        }
      : s;
  return { ...s, notes: [{ ...n, pinned: false }, ...s.notes] };
}
export function savedEvidence(s: Game) {
  return unique(
    s.notes.map((n) => n.fact || "").filter((f) => f in evidenceLabels),
  );
}
export function endingFor(
  s: Game,
  suspect: string,
  evidence: string[],
): string {
  if (suspect !== "minsuk") return "wrong";
  const selected = unique(evidence);
  if (
    selected.length !== 3 ||
    selected.some((f) => !savedEvidence(s).includes(f))
  )
    return "incomplete";
  if (!['image-source','seoul'].every(f=>selected.includes(f)) || !selected.some(f=>['identity','admission'].includes(f)))
    return s.risk >= 4 ? "lost" : "incomplete";
  if (!has(s, "meeting", "usb-testimony", "import", "contract"))
    return "incomplete";
  return has(s, "rescue") ? "true" : "normal";
}
