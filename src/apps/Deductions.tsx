import { useState } from "react";
import { deductions } from "../data/deductions";
import { updateFlag, useGame } from "../game/store";
export function Deductions() {
  const s = useGame(),
    [feedback, setFeedback] = useState<Record<string, string>>({});
  return (
    <section className="deductions">
      <h2>기록 비교</h2>
      <p className="dim">
        기록이 말하는 사실과, 아직 확인하지 못한 가정을 구분하세요.
      </p>
      {deductions.map((d) => {
        const available = d.requires.every((id) => s.evidence.includes(id)),
          solved = s.flags.includes(`deduction-${d.id}`);
        return (
          <article key={d.id}>
            <h3>{d.title}</h3>
            {!available ? (
              <p className="dim">
                비교할 기록{" "}
                {d.requires.filter((id) => s.evidence.includes(id)).length} /{" "}
                {d.requires.length}
              </p>
            ) : solved ? (
              <p className="deduction-conclusion">✓ {d.conclusion}</p>
            ) : (
              <>
                <p>{d.question}</p>
                <div>
                  {d.choices.map((choice, index) => (
                    <button
                      key={choice}
                      onClick={() => {
                        if (index === d.answer) {
                          updateFlag(`deduction-${d.id}`);
                        } else
                          setFeedback({
                            ...feedback,
                            [d.id]:
                              "그 결론까지 뒷받침하는 기록은 없습니다. 각 기록의 시각과 출처를 다시 비교해 보세요.",
                          });
                      }}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
                <p role="status">{feedback[d.id]}</p>
              </>
            )}
          </article>
        );
      })}
    </section>
  );
}
