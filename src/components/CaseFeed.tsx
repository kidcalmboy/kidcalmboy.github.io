import { useEffect, useState } from "react";
import { caseFeeds } from "../data/dialogues.js";
import { nextCaseFeed, useGame } from "../game/store";
type FeedId = keyof typeof caseFeeds;
export function CaseFeed({
  openContact,
}: {
  openContact: (id: string) => void;
}) {
  const s = useGame(),
    [visible, setVisible] = useState(true),
    [history, setHistory] = useState(false),
    [count, setCount] = useState(0);
  const id = s.story.caseFeedQueue[0] as FeedId | undefined,
    item = id ? caseFeeds[id] : undefined;
  useEffect(() => {
    if (id) {
      setVisible(true);
      setHistory(false);
      setCount(0);
    }
  }, [id]);
  useEffect(() => {
    if (!item) return;
    const reduced =
      s.settings.reduceMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setCount(item.text.length);
      return;
    }
    const timer = setInterval(
      () => setCount((n) => Math.min(item.text.length, n + 2)),
      30 / s.settings.textSpeed,
    );
    return () => clearInterval(timer);
  }, [id, s.settings.reduceMotion, s.settings.textSpeed]);
  const lead = s.flags.includes("audioRestored")
    ? "마지막 녹음에 대해 어떻게 답할지 결정하고, 전달할 자료를 검토한다."
    : s.flags.includes("projectUnlocked")
      ? "프로젝트를 아는 사람과 연락하고 초안 메일의 원본을 확인한다."
      : s.evidence.includes("receipt_2247")
        ? "귀가 기록과 영수증을 비교하고 민재·하린에게 질문한다."
        : "민재에게 답장하고 실종 전 약속을 확인한다.";
  return (
    <aside className="case-feed-shell">
      <button
        className="case-toggle"
        onClick={() => {
          setVisible(!visible);
          setHistory(true);
        }}
        aria-expanded={visible}
      >
        CASE {s.story.caseFeedQueue.length || ""}
      </button>
      {visible && (
        <section className="case-feed" aria-label="CASE FEED">
          <header>
            <small>
              CASE /{" "}
              {String(s.story.caseFeedHistory.length + 1).padStart(2, "0")}
            </small>
            <button
              aria-label="CASE FEED 접기"
              onClick={() => setVisible(false)}
            >
              −
            </button>
          </header>
          {history || !item ? (
            <>
              <small>ACTIVE LEAD</small>
              <p>{lead}</p>
              <h3>Previous discoveries</h3>
              {s.story.caseFeedHistory.map((key) => (
                <details key={key}>
                  <summary>{caseFeeds[key as FeedId]?.title}</summary>
                  <p>{caseFeeds[key as FeedId]?.text}</p>
                </details>
              ))}
              {item && (
                <button onClick={() => setHistory(false)}>새 기록 보기</button>
              )}
            </>
          ) : (
            <>
              <small>{item.type.toUpperCase()}</small>
              <h2>{item.title}</h2>
              <p className="feed-text" aria-label={item.text}>
                {item.text.slice(0, count)}
                <span aria-hidden="true">
                  {count < item.text.length ? "▏" : ""}
                </span>
              </p>
              <div>
                {"contact" in item && (
                  <button
                    onClick={() => {
                      openContact(String(item.contact));
                      setVisible(false);
                    }}
                  >
                    대화 열기 ↗
                  </button>
                )}
                <button
                  onClick={() => {
                    if (count < item.text.length) setCount(item.text.length);
                    else {
                      nextCaseFeed();
                      if (s.story.caseFeedQueue.length === 1) setVisible(false);
                    }
                  }}
                >
                  {count < item.text.length ? "전체 보기" : "CONTINUE"}
                </button>
              </div>
            </>
          )}
          <button className="feed-history" onClick={() => setHistory(!history)}>
            {history ? "새 기록" : "현재 단서 / 지난 기록"}
          </button>
        </section>
      )}
    </aside>
  );
}
