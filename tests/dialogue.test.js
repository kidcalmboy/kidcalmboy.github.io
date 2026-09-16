import test from "node:test";
import assert from "node:assert/strict";
import { defaults, loadSave } from "../src/game/rules.js";
import { dialogues } from "../src/data/dialogues.js";
import {
  available,
  startQuestion,
  choose,
  tickDialogue,
  normalizeStory,
  reconcileStory,
  resolveEnding,
  core,
  canFinalize,
} from "../src/game/dialogueEngine.js";
const fresh = () => ({ ...defaults(), loggedIn: true });
function answer(s, id, option) {
  s = startQuestion(s, id, 100);
  s = choose(s, id, option, 200);
  return tickDialogue(s, 4000);
}
test("choice is immutable, survives reload mid-typing, effects happen once", () => {
  let s = startQuestion(fresh(), "intro", 100);
  s = choose(s, "intro", "lie", 200);
  assert.equal(s.story.relationships.minjae.trust, -1);
  assert.equal(choose(s, "intro", "admit", 250), s);
  const restored = loadSave(JSON.stringify(s), null);
  assert.equal(restored.story.pending.length, 1);
  const done = tickDialogue(restored, 4000);
  assert.equal(done.story.selectedChoices.intro, "lie");
  assert.equal(done.story.relationships.minjae.trust, -1);
  assert.equal(done.story.conversationProgress.intro, "done");
  assert.equal(tickDialogue(done, 5000), done);
  assert.equal(done.story.history.filter((m) => m.sender === "you").length, 1);
});
test("past lie unlocks conditional callback; honest answers unlock witness", () => {
  let s = answer(fresh(), "intro", "lie");
  s.flags.push("projectUnlocked");
  assert.ok(
    available(
      s,
      dialogues.find((d) => d.id === "minjae_memory"),
    ),
  );
  s = answer(s, "minjae_memory", "apologize");
  assert.ok(s.story.history.some((m) => m.text === "다음엔 그냥 말해."));
  let honest = answer(fresh(), "intro", "admit");
  honest.evidence.push("minjae_chat");
  honest = answer(honest, "last_contact", "honest");
  assert.equal(honest.story.relationships.minjae.trust, 2);
  assert.ok(honest.evidence.includes("minjae_witness"));
});
test("every declared option is selectable and resolves without duplicate replies", () => {
  for (const d of dialogues)
    for (const o of d.options) {
      let s = fresh();
      s.flags = [
        ...new Set(
          dialogues.flatMap((g) =>
            (g.conditions || [])
              .filter((c) => c.type === "flag")
              .map((c) => c.key),
          ),
        ),
      ];
      s.evidence = [...core, "minjae_chat", "journalist"];
      s.events = ["project_warning"];
      s.story.relationships.minjae.trust = 0;
      for (const c of d.conditions || []) {
        if (c.type === "answered") s.story.conversationProgress[c.key] = "done";
        if (c.type === "memory") s.story.memoryFlags[c.key] = true;
      }
      s = startQuestion(s, d.id, 100);
      assert.equal(s.story.conversationProgress[d.id], "prompt", d.id);
      const picked = choose(s, d.id, o.id, 200);
      assert.equal(picked.story.selectedChoices[d.id], o.id);
      const done = tickDialogue(picked, 9999);
      assert.equal(done.story.conversationProgress[d.id], "done");
      const settled = tickDialogue(done, 12000);
      assert.equal(tickDialogue(settled, 15000), settled);
      if (o.deleteFirstAfter) assert.ok(settled.story.history.some(m => m.deleted));
    }
});
test("timed question defaults to silence, reload cannot reset deadline", () => {
  let s = fresh();
  s.flags.push("whereQuestion");
  s.story.conversationProgress.final_audio = "done";
  s = startQuestion(s, "where_now", 100);
  s = loadSave(JSON.stringify(s), null);
  assert.equal(s.story.deadlines.where_now, 10100);
  s = tickDialogue(s, 10200);
  assert.equal(s.story.selectedChoices.where_now, "silence");
  assert.ok(s.story.history.some((m) => m.sender === "silence"));
});
test("risk quarantines source without deleting collected evidence; fleeing remains finalizable", () => {
  let s = fresh();
  s.evidence = ["jihoon_payment"];
  s.story.relationships.jihoon.suspicion = 8;
  s = reconcileStory(s);
  assert.ok(s.flags.includes("paymentQuarantined"));
  assert.ok(s.evidence.includes("jihoon_payment"));
  assert.ok(s.flags.includes("jihoonFleeing"));
  s.flags.push("audioRestored");
  assert.ok(canFinalize(s));
});
test("all seven new endings plus normal compatibility, precedence and recovery", () => {
  const s = fresh();
  s.evidence = [...core];
  s.story.relationships.harin.trust = 2;
  s.flags = ["audioRestored"];
  s.story.conversationProgress.final_audio = "done";
  assert.equal(resolveEnding(s, "minjae", "police"), "bad");
  assert.equal(
    resolveEnding({ ...s, evidence: [] }, "jihoon", "police"),
    "too_early",
  );
  assert.equal(
    resolveEnding({ ...s, flags: ["jihoonFleeing"] }, "jihoon", "police"),
    "he_knows",
  );
  assert.equal(resolveEnding(s, "jihoon", "journalist"), "the_story");
  assert.equal(
    resolveEnding({ ...s, flags: ["confession"] }, "jihoon", "police"),
    "confession",
  );
  assert.equal(resolveEnding(s, "jihoon", "police"), "true");
  const shared = {
    ...s,
    flags: ["evidenceSharedWithJihoon"],
    evidence: s.evidence.filter((id) => id !== "jihoon_payment"),
  };
  assert.equal(resolveEnding(shared, "jihoon", "approach"), "trusted");
  assert.notEqual(
    resolveEnding({ ...shared, restored: ["payment"] }, "jihoon", "approach"),
    "trusted",
  );
  s.story.relationships.harin.trust = 0;
  assert.equal(resolveEnding(s, "jihoon", "police"), "normal");
  assert.equal(
    canFinalize({ ...s, story: { ...s.story, conversationProgress: {} } }),
    false,
  );
});
test("feed queue is deduplicated and corrupt story values are normalized", () => {
  let s = reconcileStory(fresh());
  s = reconcileStory(s);
  assert.deepEqual(s.story.caseFeedQueue, ["prologue"]);
  const normalized = normalizeStory({
    selectedChoices: { intro: "invalid" },
    relationships: { jihoon: { suspicion: 999 } },
    history: [null],
    pending: [{ group: "invented" }],
  });
  assert.deepEqual(normalized.selectedChoices, {});
  assert.equal(normalized.relationships.jihoon.suspicion, 10);
  assert.deepEqual(normalized.history, []);
  assert.deepEqual(normalized.pending, []);
});
