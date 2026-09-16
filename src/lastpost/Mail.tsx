import { useEffect, useState } from "react";
import { emails, evidenceLabels, person } from "./data";
import { chapter, discover, endingFor, savedEvidence } from "./engine";
import { useGame, update } from "./store";
import { Save, type Navigate } from "./shared";
export function Mail({
  route,
  navigate,
}: {
  route: string;
  navigate: Navigate;
}) {
  const s = useGame(),
    [id, setId] = useState("sister"),
    [folder, setFolder] = useState("Inbox"),
    [compose, setCompose] = useState(false),
    [suspect, setSuspect] = useState(""),
    [selected, setSelected] = useState<string[]>([]);
  useEffect(() => {
    if (route.startsWith("mail:")) setId(route.slice(5));
  }, [route]);
  const list = emails.filter((m) => !m.private || s.loggedIn),
    mail = list.find((m) => m.id === id) || list[0];
  useEffect(() => {
    if (mail.fact) update((s) => discover(s, mail.fact!));
  }, [mail.id]);
  return (
    <div className="lp-mail">
      <aside>
        <h3>Mailboxes</h3>
        {["Inbox", "Sent", "Archive", "Trash"].map((f) => (
          <button
            className={folder === f ? "selected" : ""}
            key={f}
            onClick={() => setFolder(f)}
          >
            {f}
            <small>{f === "Inbox" ? list.length : ""}</small>
          </button>
        ))}
      </aside>
      <section className="lp-mail-list">
        <h3>{folder}</h3>
        {folder === "Inbox" ? (
          list.map((m) => (
            <button
              key={m.id}
              className={m.id === mail.id ? "selected" : ""}
              onClick={() => {
                setId(m.id);
                setCompose(false);
              }}
            >
              <b>{m.from}</b>
              <strong>{m.subject}</strong>
              <small>{m.date}</small>
              <p>{m.body.slice(0, 70)}</p>
            </button>
          ))
        ) : (
          <p className="lp-muted">보관된 메시지가 없습니다.</p>
        )}
      </section>
      <main className="lp-mail-reader">
        {folder === "Inbox" &&
          (compose ? (
            <form
              className="lp-submission"
              onSubmit={(e) => {
                e.preventDefault();
                update((s) => ({
                  ...s,
                  ending: endingFor(s, suspect, selected),
                  seenChapters: Math.max(s.seenChapters, chapter(s)),
                }));
                setCompose(false);
              }}
            >
              <small>To: 한유진 · 사건 담당자 전달용</small>
              <h2>WHO POSTED YOUNA’S LAST POST?</h2>
              <p>확인한 자료 세 개와 조사 의견을 전달합니다.</p>
              <fieldset>
                <legend>게시물을 작성한 사람</legend>
                {["hyunwoo", "gaeun", "taejun", "minsuk"].map((id) => (
                  <label key={id}>
                    <input
                      type="radio"
                      name="suspect"
                      checked={suspect === id}
                      onChange={() => setSuspect(id)}
                    />
                    {person(id).name}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>Notes에 보관된 자료 · {selected.length}/3</legend>
                {savedEvidence(s).map((f) => (
                  <label key={f}>
                    <input
                      type="checkbox"
                      checked={selected.includes(f)}
                      disabled={selected.length === 3 && !selected.includes(f)}
                      onChange={() =>
                        setSelected((xs) =>
                          xs.includes(f)
                            ? xs.filter((x) => x !== f)
                            : [...xs, f],
                        )
                      }
                    />
                    {evidenceLabels[f]}
                  </label>
                ))}
                {!savedEvidence(s).length && (
                  <p>Notes에 저장한 자료가 없습니다.</p>
                )}
              </fieldset>
              <button
                className="lp-primary"
                disabled={!suspect || selected.length !== 3}
              >
                자료 전달
              </button>
              <button type="button" onClick={() => setCompose(false)}>
                취소
              </button>
              <small>
                게임 안에서만 전송됩니다. 실제 메일은 보내지 않습니다.
              </small>
            </form>
          ) : (
            <>
              <header>
                <h1>{mail.subject}</h1>
                <p>
                  <b>{mail.from}</b>
                  <small>{mail.date}</small>
                </p>
                <small>To: {mail.private ? "youna.zip" : "You"}</small>
              </header>
              <p className="lp-mail-body">{mail.body}</p>
              {mail.id === "export" && (
                <button
                  className="lp-soft"
                  onClick={() => navigate("activity")}
                >
                  Open account activity ↗
                </button>
              )}
              <Save
                id={`mail-${mail.id}`}
                title={mail.subject}
                body={mail.body}
                source={`mail:${mail.id}`}
                fact={mail.fact}
              />
              {mail.id === "sister" && (
                <div className="lp-mail-reply">
                  <button
                    className="lp-primary"
                    disabled={!s.loggedIn}
                    onClick={() => setCompose(true)}
                  >
                    조사 자료를 첨부해 답장
                  </button>
                </div>
              )}
            </>
          ))}
      </main>
    </div>
  );
}
