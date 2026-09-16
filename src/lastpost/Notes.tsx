import { useState } from "react";
import { useGame, update } from "./store";
import { SourceCard, type Navigate } from "./shared";
export function Notes({ navigate }: { navigate: Navigate }) {
  const s = useGame(),
    [folder, setFolder] = useState("All Notes"),
    [selected, setSelected] = useState<string | null>(s.notes[0]?.id || null),
    [query, setQuery] = useState("");
  const notes = s.notes
    .filter(
      (n) =>
        (folder === "All Notes" ||
          (folder === "Pinned" && n.pinned) ||
          n.category === folder) &&
        `${n.title} ${n.body}`.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      folder === "Timeline"
        ? a.time.localeCompare(b.time)
        : Number(b.pinned) - Number(a.pinned),
    );
  const note = s.notes.find((n) => n.id === selected);
  return (
    <div className="lp-notes">
      <aside>
        <h3>Notes</h3>
        {["All Notes", "Pinned", "People", "Places", "Timeline", "Leads"].map(
          (f) => (
            <button
              key={f}
              className={folder === f ? "selected" : ""}
              onClick={() => setFolder(f)}
            >
              {f}
              <small>
                {
                  s.notes.filter(
                    (n) =>
                      f === "All Notes" ||
                      (f === "Pinned" && n.pinned) ||
                      n.category === f,
                  ).length
                }
              </small>
            </button>
          ),
        )}
      </aside>
      <section className="lp-note-list">
        <header>
          <input
            aria-label="메모 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes"
          />
          <button
            aria-label="새 메모"
            onClick={() => {
              const id = crypto.randomUUID();
              update((s) => ({
                ...s,
                notes: [
                  {
                    id,
                    title: "새 메모",
                    body: "",
                    source: "",
                    category: "Leads",
                    time: "2028.06.20",
                    pinned: false,
                  },
                  ...s.notes,
                ],
              }));
              setSelected(id);
            }}
          >
            ＋
          </button>
        </header>
        {notes.map((n) => (
          <button
            key={n.id}
            className={n.id === selected ? "selected" : ""}
            onClick={() => setSelected(n.id)}
          >
            <b>{n.title}</b>
            <small>{n.time}</small>
            <p>{n.body.slice(0, 60)}</p>
          </button>
        ))}
        {!notes.length && <p className="lp-muted">저장한 메모가 없습니다.</p>}
      </section>
      <main className="lp-note-editor">
        {note ? (
          <>
            <header>
              <small>{note.time}</small>
              <button
                onClick={() =>
                  update((s) => ({
                    ...s,
                    notes: s.notes.map((n) =>
                      n.id === note.id ? { ...n, pinned: !n.pinned } : n,
                    ),
                  }))
                }
              >
                {note.pinned ? "Unpin" : "Pin note"}
              </button>
              <select
                aria-label="메모 폴더"
                value={note.category}
                onChange={(e) =>
                  update((s) => ({
                    ...s,
                    notes: s.notes.map((n) =>
                      n.id === note.id ? { ...n, category: e.target.value } : n,
                    ),
                  }))
                }
              >
                {["People", "Places", "Timeline", "Leads"].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </header>
            <input
              className="lp-note-title"
              aria-label="메모 제목"
              value={note.title}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  notes: s.notes.map((n) =>
                    n.id === note.id ? { ...n, title: e.target.value } : n,
                  ),
                }))
              }
            />
            <textarea
              aria-label="메모 본문"
              placeholder="생각을 적어 보세요…"
              value={note.body}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  notes: s.notes.map((n) =>
                    n.id === note.id ? { ...n, body: e.target.value } : n,
                  ),
                }))
              }
            />
            {note.source && <SourceCard note={note} navigate={navigate} />}
            <small className="lp-muted">이 브라우저에 자동 저장됨</small>
          </>
        ) : (
          <div className="lp-empty">
            <h2>Your thoughts, in one place.</h2>
            <p>
              게시물이나 대화에서 Save to Notes를 누르세요.
              <br />
              직접 메모를 작성할 수도 있습니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
