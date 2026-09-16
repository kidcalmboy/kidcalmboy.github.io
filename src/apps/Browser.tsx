import { useRef, useState } from "react";
import { searchPages } from "../data/story";
import { addTo, useGame } from "../game/store";
import { EvidenceButton } from "./shared";
interface Tab {
  id: number;
  history: string[];
  index: number;
  input: string;
}
const makeTab = (id: number): Tab => ({
  id,
  history: [],
  index: -1,
  input: "",
});
export function Browser() {
  const s = useGame(),
    [tabs, setTabs] = useState<Tab[]>([makeTab(1)]),
    [active, setActive] = useState(1),
    [bookmarks, setBookmarks] = useState<string[]>(["BLUE ROOM", "강도윤"]),
    [menu, setMenu] = useState(false),
    [revision, setRevision] = useState(0);
  const nextId = useRef(2),
    address = useRef<HTMLInputElement>(null),
    tab = tabs.find((t) => t.id === active)!,
    current = tab.history[tab.index] || "";
  function patch(values: Partial<Tab>) {
    setTabs((ts) => ts.map((t) => (t.id === active ? { ...t, ...values } : t)));
  }
  function navigate(value: string) {
    const query = value.trim();
    patch({
      history: [...tab.history.slice(0, tab.index + 1), query],
      index: tab.index + 1,
      input: query,
    });
    if (query) addTo("searches", query);
    setMenu(false);
  }
  function addTab() {
    if (tabs.length >= 6) return;
    const id = nextId.current++;
    setTabs([...tabs, makeTab(id)]);
    setActive(id);
    setMenu(false);
  }
  function closeTab(id: number) {
    if (tabs.length === 1) {
      setTabs([makeTab(id)]);
      return;
    }
    const rest = tabs.filter((t) => t.id !== id);
    setTabs(rest);
    if (active === id) setActive(rest.at(-1)!.id);
  }
  const results = searchPages.filter((p) =>
    p.terms.some((term) => current.toLowerCase().includes(term)),
  );
  return (
    <div className="browser-app chrome-browser">
      <div className="chrome-tabs" role="tablist" aria-label="브라우저 탭">
        {tabs.map((t) => (
          <div
            className={`chrome-tab ${t.id === active ? "selected" : ""}`}
            key={t.id}
          >
            <button
              role="tab"
              aria-selected={t.id === active}
              onClick={() => setActive(t.id)}
            >
              <span className="tab-favicon">N</span>
              <span>{t.history[t.index] || "새 탭"}</span>
            </button>
            <button
              aria-label={`${t.history[t.index] || "새 탭"} 탭 닫기`}
              onClick={() => closeTab(t.id)}
            >
              ×
            </button>
          </div>
        ))}
        <button
          className="new-tab"
          aria-label="새 탭 열기"
          disabled={tabs.length >= 6}
          onClick={addTab}
        >
          +
        </button>
      </div>
      <form
        className="chrome-toolbar"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(tab.input);
        }}
      >
        <button
          type="button"
          aria-label="뒤로"
          disabled={tab.index <= 0}
          onClick={() =>
            patch({ index: tab.index - 1, input: tab.history[tab.index - 1] })
          }
        >
          ←
        </button>
        <button
          type="button"
          aria-label="앞으로"
          disabled={tab.index >= tab.history.length - 1}
          onClick={() =>
            patch({ index: tab.index + 1, input: tab.history[tab.index + 1] })
          }
        >
          →
        </button>
        <button
          type="button"
          aria-label="다시 불러오기"
          onClick={() => {
            setRevision((r) => r + 1);
            patch({ input: current });
          }}
        >
          ↻
        </button>
        <button
          type="button"
          aria-label="새 탭 페이지"
          onClick={() => navigate("")}
        >
          ⌂
        </button>
        <div className="omnibox">
          <span aria-hidden="true">⌕</span>
          <input
            ref={address}
            aria-label="주소 또는 검색어"
            placeholder="NOVA에서 검색하거나 기록 주소 입력"
            value={tab.input}
            onFocus={(e) => e.target.select()}
            onChange={(e) => patch({ input: e.target.value })}
          />
          <button
            type="button"
            aria-label="북마크 저장"
            disabled={!current}
            onClick={() =>
              setBookmarks((b) =>
                b.includes(current)
                  ? b.filter((x) => x !== current)
                  : [...b, current],
              )
            }
          >
            {bookmarks.includes(current) ? "★" : "☆"}
          </button>
        </div>
        <button
          className="chrome-profile"
          type="button"
          aria-label="서준의 브라우저 프로필"
          onClick={() => setMenu(!menu)}
        >
          S
        </button>
        <button
          type="button"
          aria-label="브라우저 메뉴"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          ⋮
        </button>
      </form>
      <div className="bookmarks">
        <span>▱</span>
        {bookmarks.map((b) => (
          <button key={b} onClick={() => navigate(b)}>
            <span className="bookmark-dot" />
            {b}
          </button>
        ))}
        <small>로컬 검색 아카이브</small>
      </div>
      {menu && (
        <div className="chrome-menu">
          <small>서준 · 개인 프로필</small>
          <button onClick={addTab}>새 탭</button>
          <button
            onClick={() => {
              address.current?.focus();
              setMenu(false);
            }}
          >
            주소창으로 이동
          </button>
          <p>
            이 브라우저는 게임 속 기록만 검색합니다. 실제 인터넷에 접속하지
            않습니다.
          </p>
        </div>
      )}
      <article
        className={`document chrome-page ${current ? "results-page" : "new-tab-page"}`}
        key={`${active}-${revision}`}
      >
        {!current ? (
          <>
            <h1>
              NOVA<span>Search</span>
            </h1>
            <form
              className="home-search"
              onSubmit={(e) => {
                e.preventDefault();
                navigate(tab.input);
              }}
            >
              <span>⌕</span>
              <input
                aria-label="새 탭 검색"
                placeholder="검색어를 입력하세요"
                value={tab.input}
                onChange={(e) => patch({ input: e.target.value })}
              />
              <button aria-label="검색 실행">→</button>
            </form>
            <div className="search-shortcuts">
              {[
                ...new Set([
                  ...s.searches.slice(-3).reverse(),
                  "BLUE ROOM",
                  "리뷰 조작",
                  "도서관",
                ]),
              ]
                .slice(0, 5)
                .map((q) => (
                  <button key={q} onClick={() => navigate(q)}>
                    <span>⌕</span>
                    {q}
                  </button>
                ))}
            </div>
            <p className="local-note">
              서준이 저장한 페이지에서 단서를 찾아보세요.
            </p>
          </>
        ) : (
          <>
            <div className="search-nav">
              <b>전체</b>
              <span>저장된 페이지</span>
              <small>{results.length}개의 기록</small>
            </div>
            <h1>{current}</h1>
            {results.length ? (
              results.map((p) => (
                <section key={p.title} className="search-result">
                  <small>
                    <span className="result-favicon">N</span>archive.nova /{" "}
                    {p.terms[0]}
                  </small>
                  <h2>{p.title}</h2>
                  <p>{p.body}</p>
                  {p.evidence && <EvidenceButton id={p.evidence} />}
                </section>
              ))
            ) : (
              <p>
                저장된 페이지에 일치하는 기록이 없습니다. 다른 검색어를
                입력하세요.
              </p>
            )}
            {s.flags.includes("journalistDocument") &&
              (current.includes("리뷰") || current.includes("계정")) && (
                <section className="search-result">
                  <small>비공개 검증 / 강도윤</small>
                  <h2>계정 군집 비교 자료</h2>
                  <p>
                    동일 계정이 6개 업체에서 30초 간격으로 같은 문장을
                    게시했습니다. 원본 자료는 Downloads에 있습니다.
                  </p>
                </section>
              )}
          </>
        )}
      </article>
    </div>
  );
}
