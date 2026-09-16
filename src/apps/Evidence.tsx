import { useState } from "react";
import { characters, evidence } from "../data/story";
import { getState, setState, useGame } from "../game/store";
import { resolveEnding, canFinalize } from "../game/dialogueEngine.js";
import { Deductions } from "./Deductions";
export function Evidence() {
  const s = useGame(),
    [category, setCategory] = useState("All"),
    [suspect, setSuspect] = useState(""),
    [strategy, setStrategy] = useState("police"),
    [early, setEarly] = useState(false);
  const ready = canFinalize(s);
  return (
    <article className="document investigation">
      <p className="eyebrow">PRIVATE INVESTIGATION</p>
      <h1>
        Evidence board <small>{s.evidence.length} records</small>
      </h1>
      <div className="filters">
        {[
          "All",
          "People",
          "Locations",
          "Documents",
          "Messages",
          "Timeline",
        ].map((c) => (
          <button
            key={c}
            className={category === c ? "selected" : ""}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="cards">
        {s.evidence
          .filter(
            (id) =>
              evidence[id] &&
              (category === "All" || evidence[id].category === category),
          )
          .map((id) => (
            <article key={id}>
              <small>{evidence[id].category}</small>
              <h3>{evidence[id].title}</h3>
              <p>{evidence[id].body}</p>
              <small>
                연결:{" "}
                {evidence[id].related
                  .filter((r) => s.evidence.includes(r))
                  .map((r) => evidence[r].title)
                  .join(" / ") || "다른 기록을 더 조사하세요"}
              </small>
            </article>
          ))}
      </div>
      {!s.evidence.length && <p>중요한 기록에서 ‘증거로 저장’을 선택하세요.</p>}
      <hr />
      <Deductions />
      <hr />
      <h2>최종 조사</h2>
      {['project_n','jihoon_payment','final_audio'].every(id=>s.evidence.includes(id))&&Object.keys(s.story.selectedChoices).length>0&&<div className="early-police"><button disabled={s.flags.includes('policeContacted')} onClick={()=>setState({...getState(),flags:[...new Set([...s.flags,'policeContacted'])]})}>{s.flags.includes('policeContacted')?'✓ 경찰 보관 사본 접수됨':'원본 사본을 경찰에 보관 요청'}</button><small>게임 속 비공개 보관 요청입니다. 최종 용의자 제출 전에도 조사를 계속할 수 있습니다.</small></div>}
      {!!s.evidence.length &&
        !!Object.keys(s.story.selectedChoices).length &&
        !ready && (
          <div className="early-police">
            <button onClick={() => setEarly(!early)}>
              경찰에 현재 자료 제출
            </button>
            {early && (
              <>
                <p>
                  게임 속 최종 제출입니다. 근거가 부족하면 TOO EARLY로 조사가
                  끝날 수 있습니다. 제출할까요?
                </p>
                <button onClick={() => setEarly(false)}>계속 조사</button>
                <button
                  onClick={() =>
                    setState({
                      ...getState(),
                      flags: [...new Set([...s.flags, "policeContacted"])],
                      ending: resolveEnding(s, "jihoon", "police"),
                    })
                  }
                >
                  확인 · 현재 자료 제출
                </button>
              </>
            )}
          </div>
        )}
      {ready ? (
        <>
          <p>서준의 실종에 책임이 있는 사람은 누구인가?</p>
          <fieldset className="strategy">
            <legend>자료 전달 전략</legend>
            {[
              ["police", "경찰에게 모든 자료 전송"],
              ["journalist", "강도윤 기자에게 전송"],
              ["approach", "지훈에게 계속 접근"],
              ["public", "증거를 공개한다"],
            ].map(([id, label]) => (
              <label key={id}>
                <input
                  type="radio"
                  name="strategy"
                  value={id}
                  checked={strategy === id}
                  disabled={
                    id === "journalist" &&
                    !s.flags.includes("journalistHelping")
                  }
                  onChange={() => setStrategy(id)}
                />
                {label}
              </label>
            ))}
          </fieldset>
          <div className="suspects">
            {[
              ...characters.filter((c) =>
                ["minjae", "harin", "jihoon"].includes(c.id),
              ),
              { id: "doyun", name: "강도윤" },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSuspect(c.id)}
                aria-pressed={suspect === c.id}
              >
                {c.name}
              </button>
            ))}
          </div>
          {suspect && (
            <div className="confirmation">
              <p>
                {characters.find((c) => c.id === suspect)?.name || "강도윤"}을
                지목하시겠습니까? 현재 수집한 증거를 함께 제출합니다.
              </p>
              <button onClick={() => setSuspect("")}>계속 조사</button>
              <button
                onClick={() =>
                  setState({
                    ...getState(),
                    flags:
                      strategy === "police"
                        ? [...new Set([...s.flags, "policeContacted"])]
                        : s.flags,
                    ending: resolveEnding(s, suspect, strategy),
                  })
                }
              >
                확인 · 자료 제출
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="dim">
          마지막 기록을 복원하고 Messenger에서 지훈에게 연락하거나 침묵을 선택한
          뒤, 최종 전략을 정할 수 있습니다.
        </p>
      )}
    </article>
  );
}
