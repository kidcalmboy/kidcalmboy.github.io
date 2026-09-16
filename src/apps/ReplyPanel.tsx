import { useEffect, useState } from "react";
import { dialogues } from "../data/dialogues.js";
import { available } from "../game/dialogueEngine.js";
import { askQuestion, selectReply, useGame } from "../game/store";
export function ReplyPanel({ contact }: { contact: string }) {
  const s = useGame(),
    [questions, setQuestions] = useState(false),
    [now, setNow] = useState(Date.now());
  const groups = dialogues.filter((d) => d.character === contact),
    pending = s.story.pending.find((p) => p.contact === contact);
  const current = groups.find(
    (d) =>
      s.story.conversationProgress[d.id] === "prompt" &&
      !s.story.selectedChoices[d.id],
  );
  const automatic = groups.find(
    (d) =>
      d.automatic && available(s, d) && !s.story.conversationProgress[d.id],
  );
  useEffect(() => {
    if (automatic && !current && !pending) askQuestion(automatic.id);
  }, [automatic?.id, current?.id, pending?.group]);
  useEffect(() => {
    if (!current?.timeout) return;
    const t = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(t);
  }, [current?.id]);
  if (contact === "jihoon" && s.flags.includes("jihoonFleeing"))
    return (
      <div className="reply-panel">
        <p>This account is unavailable.</p>
      </div>
    );
  const pool = groups.filter(
    (d) => !d.automatic && (available(s, d) || s.story.selectedChoices[d.id]),
  );
  return (
    <section className="reply-panel" aria-label="답장 선택">
      {pending ? (
        <p className="typing" role="status">
          입력 중<span>…</span>
        </p>
      ) : current ? (
        <>
          <small>
            답장은 저장되며 되돌릴 수 없습니다.
            {current.timeout &&
              ` · ${Math.max(0, Math.ceil(((s.story.deadlines[current.id] || now) - now) / 1000))}초 후 침묵`}
          </small>
          <div className="reply-options">
            {current.options.map((o) => (
              <button
                key={o.id}
                aria-label={o.text}
                onClick={() => selectReply(current.id, o.id)}
              >
                {o.text}
              </button>
            ))}
          </div>
        </>
      ) : pool.length ? (
        <>
          <button
            onClick={() => setQuestions(!questions)}
            aria-expanded={questions}
          >
            Message · 질문하기
          </button>
          {questions && (
            <div className="question-pool">
              {pool.map((d) => (
                <button
                  key={d.id}
                  disabled={!!s.story.selectedChoices[d.id]}
                  onClick={() => {
                    askQuestion(d.id);
                    setQuestions(false);
                  }}
                >
                  {s.story.selectedChoices[d.id] ? "✓ " : ""}
                  {d.question}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <small>조사를 계속하면 새로운 질문이 열립니다.</small>
      )}
    </section>
  );
}
