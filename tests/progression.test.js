import test from "node:test";
import assert from "node:assert/strict";
import {
  defaults,
  chapter,
  endingFor,
  loadSave,
  unlock,
} from "../src/game/rules.js";
test("chapter progression and password gates", () => {
  let s = defaults();
  assert.equal(chapter(s), 0);
  s.loggedIn = true;
  assert.equal(chapter(s), 1);
  assert.equal(unlock(s, "projectUnlocked", "ORBIT"), s);
  s.evidence.push("minjae_chat");
  assert.equal(chapter(s), 2);
  s.flags.push("receiptRestored");
  assert.equal(chapter(s), 3);
  assert.equal(unlock(s, "projectUnlocked", "wrong"), s);
  s = unlock(s, "projectUnlocked", " orbit ");
  assert.equal(chapter(s), 4);
  s = unlock(s, "zipUnlocked", "nobody_404");
  assert.ok(s.flags.includes("zipUnlocked"));
  s.flags.push("audioRestored");
  assert.equal(chapter(s), 5);
});
test("all three endings and incomplete evidence", () => {
  assert.equal(endingFor("minjae", []), "bad");
  assert.equal(endingFor("jihoon", []), "normal");
  const core = [
    "receipt_2247",
    "project_n",
    "jihoon_payment",
    "draft_email",
    "final_audio",
    "hidden_location",
  ];
  assert.equal(endingFor("jihoon", core), "true");
  for (const id of core)
    assert.equal(
      endingFor(
        "jihoon",
        core.filter((x) => x !== id),
      ),
      "normal",
    );
});
test("legacy prototype migration preserves collected clues", () => {
  const s = loadSave(
    null,
    JSON.stringify({
      version: 1,
      loggedIn: true,
      evidence: ["chat", "receipt"],
    }),
  );
  assert.equal(s.loggedIn, true);
  assert.deepEqual(s.evidence, ["minjae_chat", "receipt_2247"]);
  assert.ok(s.flags.includes("receiptRestored"));
});
test("save validation, round trip and corrupted data", () => {
  assert.deepEqual(loadSave("{bad", null), defaults());
  const s = defaults();
  s.flags.push("projectUnlocked");
  assert.deepEqual(loadSave(JSON.stringify(s), null), s);
  const malformed = loadSave(
    JSON.stringify({
      version: 2,
      settings: { master: 20, sfx: -5 },
      flags: "bad",
    }),
    null,
  );
  assert.deepEqual(malformed.flags, []);
  assert.equal(malformed.settings.master, 1);
  assert.equal(malformed.settings.sfx, 0);
});
