import { dialogues, caseFeeds } from "../data/dialogues.js";
export const initialStory = () => ({
  selectedChoices: {},
  relationships: {
    minjae: { trust: 0, pressure: 0 },
    harin: { trust: 0, openness: 0 },
    jihoon: { trust: 0, suspicion: 0 },
    doyoon: { trust: 0, cooperation: 0 },
  },
  memoryFlags: {},
  conversationProgress: {},
  history: [],
  pending: [],
  deadlines: {},
  caseFeedHistory: [],
  caseFeedQueue: [],
  unlockedQuestions: [],
  endingVariables: {},
  deletedSeen: [],
});
export function condition(s, c) {
  const st = s.story;
  switch (c.type) {
    case "loggedIn":
      return s.loggedIn;
    case "evidence":
      return s.evidence.includes(c.key);
    case "flag":
      return s.flags.includes(c.key);
    case "notFlag":
      return !s.flags.includes(c.key);
    case "event":
      return s.events.includes(c.key);
    case "answered":
      return st.conversationProgress[c.key] === "done";
    case "memory":
      return st.memoryFlags[c.key] === true;
    case "notMemory":
      return !st.memoryFlags[c.key];
    case "stat":
      return (st.relationships[c.character]?.[c.stat] || 0) >= c.min;
    default:
      return false;
  }
}
export const matches = (s, conditions = []) =>
  conditions.every((c) => condition(s, c));
export function available(s, group) {
  return (
    matches(s, group.conditions) &&
    !s.story.selectedChoices[group.id] &&
    !s.story.pending.some((p) => p.group === group.id) &&
    !(
      group.character === "minjae" &&
      s.story.relationships.minjae.trust <= -2 &&
      !["intro", "minjae_memory"].includes(group.id)
    ) &&
    !(group.character === "jihoon" && s.flags.includes("jihoonFleeing"))
  );
}
export function queueFeed(s, id) {
  if (
    !caseFeeds[id] ||
    s.story.caseFeedHistory.includes(id) ||
    s.story.caseFeedQueue.includes(id)
  )
    return;
  s.story.caseFeedQueue.push(id);
}
function effect(s, e) {
  switch (e.type) {
    case "relationship":
    case "setStat": {
      const stats = s.story.relationships[e.character];
      if (stats && e.stat in stats)
        stats[e.stat] = Math.max(
          e.stat === "trust" ? -5 : 0,
          Math.min(
            10,
            e.type === "setStat" ? e.amount : stats[e.stat] + e.amount,
          ),
        );
      break;
    }
    case "memory":
      s.story.memoryFlags[e.key] = true;
      break;
    case "flag":
    case "unlockFile":
    case "unlockLocation":
      if (!s.flags.includes(e.key)) s.flags.push(e.key);
      break;
    case "evidence":
      if (!s.evidence.includes(e.key)) s.evidence.push(e.key);
      break;
    case "caseFeed":
      queueFeed(s, e.key);
      break;
  }
}
export function reconcileStory(state) {
  const s = structuredClone(state);
  if (s.loggedIn) queueFeed(s, "prologue");
  if (s.evidence.includes("receipt_2247")) queueFeed(s, "receipt");
  if (s.flags.includes("projectUnlocked")) queueFeed(s, "project");
  const suspicion = s.story.relationships.jihoon.suspicion;
  if (suspicion >= 6 && !s.flags.includes("paymentQuarantined")) {
    s.flags.push("paymentQuarantined");
    queueFeed(s, "file_missing");
  }
  if (
    suspicion >= 8 &&
    !s.evidence.includes("final_audio") &&
    !s.flags.includes("jihoonFleeing")
  ) {
    s.flags.push("jihoonFleeing");
    queueFeed(s, "flee");
  }
  for (const d of dialogues)
    if (available(s, d) && !s.story.unlockedQuestions.includes(d.id))
      s.story.unlockedQuestions.push(d.id);
  return s;
}
export function startQuestion(state, id, now = Date.now()) {
  const d = dialogues.find((x) => x.id === id);
  if (!d || !available(state, d) || state.story.conversationProgress[id])
    return state;
  const s = structuredClone(state);
  s.story.conversationProgress[id] = "prompt";
  s.story.history.push({
    id: id + "-prompt",
    group: id,
    contact: d.character,
    sender: d.character,
    text: d.prompt,
    at: now,
  });
  if (d.timeout) s.story.deadlines[id] = now + d.timeout;
  return s;
}
export function choose(state, id, optionId, now = Date.now()) {
  const d = dialogues.find((x) => x.id === id),
    o = d?.options.find((x) => x.id === optionId);
  if (
    !d ||
    !o ||
    !available(state, d) ||
    state.story.conversationProgress[id] !== "prompt"
  )
    return state;
  let s = structuredClone(state);
  s.story.selectedChoices[id] = optionId;
  delete s.story.deadlines[id];
  s.story.conversationProgress[id] = "pending";
  s.story.history.push({
    id: id + "-you",
    group: id,
    contact: d.character,
    sender: o.silent ? "silence" : "you",
    text: o.text,
    at: now,
  });
  for (const e of o.effects || []) effect(s, e);
  let reply = o.reply;
  const variant = o.variants?.find((v) => matches(s, v.conditions));
  if (variant) {
    reply = variant.reply;
    for (const e of variant.effects || []) effect(s, e);
  }
  s.story.pending.push({
    group: id,
    contact: d.character,
    texts: reply,
    deleteFirstAfter:o.deleteFirstAfter||0,
    due: now + Math.min(3000, Math.max(900, reply.join("").length * 35)),
  });
  return reconcileStory(s);
}
export function tickDialogue(state, now = Date.now()) {
  let s = state;
  for (const [id, deadline] of Object.entries(s.story.deadlines)) {
    if (now >= deadline) {
      const d = dialogues.find((x) => x.id === id);
      s = choose(s, id, d.defaultOption, now);
    }
  }
  const due = s.story.pending.filter((p) => p.due <= now);
  if (due.length) {
    s = structuredClone(s);
    for (const p of due) {
      p.texts.forEach((text, i) =>
        s.story.history.push({
          id: p.group + "-npc-" + i,
          group: p.group,
          contact: p.contact,
          sender: p.contact,
          text,
          at: now + i,
          ...(i===0&&p.deleteFirstAfter?{deleteAt:now+p.deleteFirstAfter}:{}),
        }),
      );
      s.story.conversationProgress[p.group] = "done";
      s.read = s.read.filter((c) => c !== p.contact);
    }
    s.story.pending = s.story.pending.filter((p) => p.due > now);
  }
  if(s.story.history.some(m=>m.deleteAt&&m.deleteAt<=now&&!m.deleted)){
    s=structuredClone(s);
    s.story.history=s.story.history.map(m=>m.deleteAt&&m.deleteAt<=now&&!m.deleted?{...m,text:'삭제된 메시지입니다.',deleted:true}:m);
  }
  return s;
}
export function normalizeStory(raw) {
  const d = initialStory();
  if (!raw || typeof raw !== "object") return d;
  for (const group of dialogues) {
    const choice = raw.selectedChoices?.[group.id];
    if (group.options.some((o) => o.id === choice))
      d.selectedChoices[group.id] = choice;
    const p = raw.conversationProgress?.[group.id];
    if (["prompt", "pending", "done"].includes(p))
      d.conversationProgress[group.id] = p;
    if (Number.isFinite(raw.deadlines?.[group.id]))
      d.deadlines[group.id] = raw.deadlines[group.id];
  }
  for (const [id, stats] of Object.entries(d.relationships))
    for (const key of Object.keys(stats))
      if (Number.isFinite(raw.relationships?.[id]?.[key]))
        stats[key] = Math.max(
          key === "trust" ? -5 : 0,
          Math.min(10, raw.relationships[id][key]),
        );
  for (const key of ["memoryFlags", "endingVariables"])
    if (raw[key] && typeof raw[key] === "object")
      for (const [id, v] of Object.entries(raw[key]))
        if (v === true) d[key][id] = true;
  const validGroup = (id) => dialogues.some((g) => g.id === id);
  d.deletedSeen=Array.isArray(raw.deletedSeen)?raw.deletedSeen.filter(id=>typeof id==='string'):[];
  d.history = Array.isArray(raw.history)
    ? raw.history.filter(
        (m) =>
          m &&
          validGroup(m.group) &&
          typeof m.id === "string" &&
          typeof m.contact === "string" &&
          typeof m.sender === "string" &&
          typeof m.text === "string" &&
          Number.isFinite(m.at),
      )
    : [];
  d.pending = Array.isArray(raw.pending)
    ? raw.pending.filter(
        (p) =>
          p &&
          validGroup(p.group) &&
          typeof p.contact === "string" &&
          Number.isFinite(p.due) &&
          Array.isArray(p.texts) &&
          p.texts.every((t) => typeof t === "string"),
      )
    : [];
  for (const key of ["caseFeedHistory", "caseFeedQueue"])
    d[key] = Array.isArray(raw[key])
      ? [...new Set(raw[key].filter((id) => id in caseFeeds))]
      : [];
  d.unlockedQuestions = Array.isArray(raw.unlockedQuestions)
    ? raw.unlockedQuestions.filter(validGroup)
    : [];
  return d;
}
export const core = [
  "receipt_2247",
  "project_n",
  "jihoon_payment",
  "draft_email",
  "final_audio",
  "hidden_location",
];
export function resolveEnding(s, person, strategy) {
  if (person !== "jihoon") return "bad";
  if (
    s.flags.includes("evidenceSharedWithJihoon") &&
    strategy === "approach" &&
    !s.evidence.includes("jihoon_payment") &&
    !s.restored.includes("payment")
  )
    return "trusted";
  if (s.flags.includes("jihoonFleeing")) return "he_knows";
  const strong = ["project_n", "jihoon_payment", "final_audio"].every((id) =>
    s.evidence.includes(id),
  );
  if (!strong) return "too_early";
  if (strategy === "journalist" || strategy === "public") return "the_story";
  if (strategy === "approach") return "he_knows";
  if (s.flags.includes("confession")) return "confession";
  const ally =
    s.story.relationships.minjae.trust >= 2 ||
    s.story.relationships.harin.trust >= 2;
  return core.every((id) => s.evidence.includes(id)) &&
    s.story.relationships.jihoon.suspicion < 8 &&
    ally
    ? "true"
    : "normal";
}
export function canFinalize(s) {
  return (
    s.flags.includes("audioRestored") &&
    (s.story.conversationProgress.final_audio === "done" ||
      s.flags.includes("jihoonFleeing"))
  );
}
