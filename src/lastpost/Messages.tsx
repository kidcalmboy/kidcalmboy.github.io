import { useEffect, useRef, useState } from "react";
import { dialogues, person, people } from "./data";
import { available, choose, discover } from "./engine";
import { attachments } from "./dialogueExtras";
import { update, useGame } from "./store";
import { Avatar, Save, Icon, type Navigate } from "./shared";
import { ProgressGuide } from "./ProgressGuide";
const history: Record<string, string[]> = {
  gaeun: [
    "June 18 · 21:17 · 스토리에 보낸 답장",
    "걔 만나러 가는 거야?",
    "윤아: ㅇㅇ. 말로 해야 알아듣지.",
    "혼자 가지마.",
    "June 18 · 22:06 · 삭제된 스토리에 보낸 답장",
    "너 미쳤어?",
  ],
  hyunwoo: [
    "June 18 · 21:26",
    "윤아: 혹시 내가 연락 안 되면",
    "또 뭔데",
    "윤아: 아니 됐어",
    "야. 뭔데. 전화 받아.",
  ],
  taejun: [
    "June 18 · 20:12",
    "윤아: 너 회사에 뭐까지 넘겼어?",
    "사진만. 계약서는 내가 한 거 아님.",
    "June 18 · 22:06 · 삭제된 스토리에 보낸 답장",
    "야 이거 내려",
  ],
  ocean: [
    "May 19 · 메시지 요청",
    "아직 가지고 있어?",
    "June 4",
    "그 자료 괜히 갖고 있어봤자 너만 피곤해져.",
    "June 11",
    "좋게 말할 때 정리해.",
  ],
  minsuk: [],
  sera: [],
};
export function Messages({
  user,
  navigate,
}: {
  user: string;
  navigate: Navigate;
}) {
  const s = useGame(),
    [query, setQuery] = useState(""),
    [question, setQuestion] = useState<string | null>(null),
    [more, setMore] = useState(false);
  const root = useRef<HTMLDivElement>(null),
    list = useRef<HTMLDivElement>(null),
    nearBottom = useRef(true);
  const messages = s.messages.filter((m) => m.user === user),
    pending = s.pending.some((p) => p.user === user),
    groups = dialogues.filter((d) => d.user === user && available(s, d.id));
  const selected =
    groups.find((d) => d.id === question) ||
    (user === "gaeun" ? groups.find((d) => d.id === "intro") : undefined);
  const delivered = dialogues.filter(
    (d) => d.user === user && s.facts.includes("reply:" + d.id),
  );
  useEffect(() => {
    setQuestion(null);
    setMore(false);
    nearBottom.current = true;
    update((s) => discover(s, "dm:" + user));
  }, [user]);
  useEffect(() => {
    if (
      root.current?.closest(".lp-window.front") &&
      root.current.getClientRects().length &&
      !s.readUsers.includes(user)
    )
      update((s) => ({
        ...s,
        readUsers: [...new Set([...s.readUsers, user])],
      }));
  }, [user, messages.length, s.readUsers]);
  useEffect(() => {
    if (list.current && nearBottom.current)
      list.current.scrollTop = list.current.scrollHeight;
  }, [user, messages.length, question, pending]);
  const clock = (index: number) => {
    const min = 8 * 60 + 43 + Math.floor(index / 3);
    return (
      String(Math.floor(min / 60)).padStart(2, "0") +
      ":" +
      String(min % 60).padStart(2, "0")
    );
  };
  return (
    <div ref={root} className="lp-dms lp-dms-v2">
      <aside className="lp-conversation-list">
        <h2>
          메시지 <small>MOMENT</small>
        </h2>
        <input
          aria-label="대화 검색"
          placeholder="이름 또는 계정 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="lp-contact-list-label">대화 목록</div>
        {people
          .filter(
            (p) =>
              history[p.id] &&
              `${p.name} ${p.handle}`
                .toLowerCase()
                .includes(query.toLowerCase()),
          )
          .map((p) => {
            const options = dialogues.filter(
                (d) => d.user === p.id && available(s, d.id),
              ).length,
              unread = s.messages.some(
                (m) => m.user === p.id && !s.readUsers.includes(p.id),
              );
            return (
              <button
                key={p.id}
                aria-current={p.id === user ? "true" : undefined}
                className={`lp-dm-contact ${p.id === user ? "selected" : ""}`}
                onClick={() => navigate("dm:" + p.id)}
              >
                <Avatar id={p.id} />
                <span>
                  <b>{p.name}</b>
                  <small>
                    {s.pending.some((x) => x.user === p.id)
                      ? "입력 중…"
                      : s.messages
                          .filter((m) => m.user === p.id && m.sender === "npc")
                          .at(-1)?.text || "@" + p.handle}
                  </small>
                  {options > 0 && <em>질문 가능 {options}</em>}
                </span>
                {unread && <i aria-label="읽지 않은 메시지" />}
              </button>
            );
          })}
        {!people.some(
          (p) =>
            history[p.id] &&
            `${p.name} ${p.handle}`.toLowerCase().includes(query.toLowerCase()),
        ) && <p className="lp-muted">검색 결과가 없습니다.</p>}
      </aside>
      <section className="lp-conversation">
        <header>
          <button
            className="lp-user"
            onClick={() => navigate("profile:" + user)}
          >
            <Avatar id={user} />
            <span>
              <b>{person(user).name}</b>
              <small>{pending ? "입력 중…" : "@" + person(user).handle}</small>
            </span>
          </button>
          <span className="lp-chat-mode">You로 대화 중</span>
        </header>
        <div
          ref={list}
          className="lp-message-list"
          onScroll={(e) => {
            const t = e.currentTarget;
            nearBottom.current =
              t.scrollHeight - t.scrollTop - t.clientHeight < 70;
          }}
        >
          <details className="lp-chat-archive">
            <summary>
              윤아와의 이전 대화{" "}
              <small>
                {
                  (history[user] || []).filter((t) => !/^(June|May)/.test(t))
                    .length
                }
                개 메시지
              </small>
            </summary>
            <div>
              {(history[user] || []).map((text, i) =>
                /^(June|May)/.test(text) ? (
                  <p className="lp-chat-date" key={i}>
                    {text}
                  </p>
                ) : (
                  <div
                    key={i}
                    className={`lp-bubble ${text.startsWith("윤아:") ? "mine" : ""}`}
                  >
                    <small>
                      {text.startsWith("윤아:") ? "윤아" : person(user).name}
                    </small>
                    <p>{text.replace(/^윤아: /, "")}</p>
                    <Save
                      id={`history-${user}-${i}`}
                      title={person(user).name + " · 보관된 대화"}
                      body={text}
                      source={"dm:" + user}
                      category="People"
                    />
                  </div>
                ),
              )}
            </div>
          </details>
          <div className="lp-today-divider">
            <span>6월 20일 · 현재 대화</span>
          </div>
          <p className="lp-dialogue-context">
            지금 보내는 메시지는 윤아가 아닌, 친구인 당신의 답장입니다.
          </p>
          {messages.map((m, i) => {
            const group = m.id.slice(0, m.id.lastIndexOf("-")),
              links =
                m.sender === "npc" &&
                !messages[i + 1]?.id.startsWith(group + "-")
                  ? attachments[group]
                  : undefined;
            return (
              <div className="lp-message-group" key={m.id}>
                <div
                  className={`lp-bubble ${m.sender === "you" ? "mine" : ""}`}
                >
                  <p>{m.text}</p>
                  <div className="lp-bubble-meta">
                    <small>
                      {clock(s.messages.indexOf(m))}
                      {m.sender === "you"
                        ? " · " + (pending ? "보냄" : "읽음")
                        : ""}
                    </small>
                    <Save
                      id={"dm-" + m.id}
                      title={person(user).name + " · DM"}
                      body={m.text}
                      source={"dm:" + user}
                      fact={
                        m.sender === "npc" &&
                        m.id.startsWith("verify-minsuk-") &&
                        s.facts.includes("admission")
                          ? "admission"
                          : user === "hyunwoo" && s.facts.includes("hyunwoo-dm")
                            ? "hyunwoo-dm"
                            : undefined
                      }
                      category="People"
                    />
                  </div>
                </div>
                {links && (
                  <div className="lp-chat-attachments">
                    {links.map((link) => (
                      <button
                        key={link.target}
                        onClick={() => navigate(link.target)}
                      >
                        <Icon
                          name={
                            link.target.startsWith("article:")
                              ? "browser"
                              : "archive"
                          }
                          size={20}
                        />
                        <span>
                          <b>{link.title}</b>
                          <small>{link.detail}</small>
                        </span>
                        <span>↗</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {user === "gaeun" && s.facts.includes("deleted-story") && (
            <div className="lp-story-cache">
              <small>6월 18일 · 22:06 · 캡처 사본</small>
              <p>
                사람 사진 마음대로 쓰고
                <br />
                계약서까지 장난쳐놓고
                <br />
                <br />
                끝까지 아니라고 하네
                <br />
                <br />
                오늘 끝낸다.
              </p>
              <Save
                id="deleted-story"
                title="22:06 스토리 사본"
                body="가은과의 DM에 보관된 캡처"
                source="dm:gaeun"
                fact="deleted-story"
                time="2028.06.18 22:06"
              />
            </div>
          )}
          {pending && (
            <div className="lp-typing" role="status">
              {person(user).name} 입력 중<span>•••</span>
            </div>
          )}
          {!messages.length && !pending && (
            <div className="lp-chat-welcome">
              <Avatar id={user} large />
              <h3>{person(user).name}</h3>
              <p>
                아래에서 질문을 골라 대화를 시작하세요.
                <br />
                보관된 과거 대화도 확인할 수 있습니다.
              </p>
            </div>
          )}
        </div>
        <footer className="lp-reply-composer">
          {selected ? (
            <>
              <div className="lp-composer-heading">
                <b>{selected.question}</b>
                {selected.id !== "intro" && (
                  <button
                    aria-label="질문 목록으로 돌아가기"
                    onClick={() => setQuestion(null)}
                  >
                    ← 다른 질문
                  </button>
                )}
              </div>
              <small>보낼 답장을 선택하세요. 선택은 기록에 남습니다.</small>
              <div className="lp-choice-buttons">
                {selected.options.map((o, i) => (
                  <button
                      key={o.id}
                      aria-label={o.text}
                    onClick={() => {
                      nearBottom.current = true;
                      update((s) => choose(s, selected.id, o.id));
                      setQuestion(null);
                    }}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {o.text}
                    <Icon name="send" size={15} />
                  </button>
                ))}
              </div>
            </>
          ) : pending ? (
            <small>
              답장을 기다리는 중… 다른 사람의 대화를 확인해도 답장은 도착합니다.
            </small>
          ) : groups.length ? (
            <>
              <div className="lp-composer-heading">
                <b>무엇을 물어볼까요?</b>
                <small>{groups.length}개 질문</small>
              </div>
              <div className="lp-question-buttons">
                {groups.slice(0, more ? groups.length : 3).map((d) => (
                  <button
                      key={d.id}
                      aria-label={d.question}
                    onClick={() => {
                      nearBottom.current = true;
                      setQuestion(d.id);
                    }}
                  >
                    {d.question}
                    <span>↗</span>
                  </button>
                ))}
              </div>
              {groups.length > 3 && (
                <button
                  className="lp-more-questions"
                  onClick={() => setMore(!more)}
                >
                  {more ? "질문 접기" : `질문 ${groups.length - 3}개 더 보기`}
                </button>
              )}
            </>
          ) : (
            <div className="lp-no-replies">
              <b>지금 나눌 이야기는 여기까지예요.</b>
              <p>
                오른쪽 조사 메모에서 다음 행동을 확인하세요. 새 기록을 확인하면
                질문이 추가됩니다.
              </p>
            </div>
          )}
        </footer>
      </section>
      <aside className="lp-message-context">
        <ProgressGuide navigate={navigate} />
        <h3>이 대화에서 받은 자료</h3>
        {delivered
          .flatMap((d) => attachments[d.id] || [])
          .map((link, i) => (
            <button
              className="lp-context-attachment"
              key={link.target + i}
              onClick={() => navigate(link.target)}
            >
              <b>{link.title}</b>
              <small>{link.detail}</small>
              <span>열기 ↗</span>
            </button>
          ))}
        {!delivered.some((d) => attachments[d.id]?.length) && (
          <p className="lp-muted">
            대화를 통해 받은 링크가
            <br />
            여기에 모입니다.
          </p>
        )}
        <button className="lp-link" onClick={() => navigate("notes")}>
          내 조사 메모 열기 ↗
        </button>
      </aside>
    </div>
  );
}
