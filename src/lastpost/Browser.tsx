import { useEffect, useState } from "react";
import { articles, person } from "./data";
import { discover } from "./engine";
import { update, useGame, toast } from "./store";
import { Icon, Modal, Save, img, type Navigate } from "./shared";
type Tab = { id: number; history: string[]; index: number };
export function Browser({
  route,
  navigate,
}: {
  route: string;
  navigate: Navigate;
}) {
  const s = useGame();
  const [tabs, setTabs] = useState<Tab[]>([
      { id: 1, history: ["new"], index: 0 },
    ]),
    [active, setActive] = useState(1),
    [input, setInput] = useState(""),
    [zoom, setZoom] = useState(false),
    [showHistory, setShowHistory] = useState(false);
  const tab = tabs.find((t) => t.id === active) || tabs[0],
    url = tab.history[tab.index];
  function go(value: string) {
    setZoom(false);
    setTabs((ts) =>
      ts.map((t) =>
        t.id === tab.id
          ? {
              ...t,
              history: [...t.history.slice(0, t.index + 1), value],
              index: t.index + 1,
            }
          : t,
      ),
    );
    if (value.startsWith("search:")) {
      const text = value.slice(7);
      update((s) => ({
        ...s,
        searches: [text, ...s.searches.filter((q) => q !== text)].slice(0, 30),
      }));
    }
  }
  useEffect(() => {
    if (route && route !== "browser") go(route);
  }, [route]);
  useEffect(() => {
    setInput(
      url === "new"
        ? ""
        : url.startsWith("search:")
          ? url.slice(7)
          : url.startsWith("article:")
            ? `north.local/read/${url.slice(8)}`
            : url,
    );
    setZoom(false);
    if (url.startsWith("article:")) {
      const a = articles.find((a) => a.id === url.slice(8));
      if (a)
        update((s) =>
          discover(
            s,
            `article:${a.id}`,
            ...(a.fact && a.id !== "event" ? [a.fact] : []),
          ),
        );
    }
  }, [url]);
  const article = articles.find((a) => url === `article:${a.id}`),
    q = url.startsWith("search:") ? url.slice(7) : "",
    imageSearch = url.startsWith("image:"),
    imageName = url.slice(6);
  const norm = (q: string) => q.toLowerCase().replace(/[\s.#@]/g, "");
  const results = articles.filter((a) =>
    imageSearch
      ? a.image === imageName
      : q &&
        a.keys.some(
          (k) => norm(q).includes(norm(k)) || norm(k).includes(norm(q)),
        ),
  );
  const label = (url: string) =>
    url === "new"
      ? "New tab"
      : url.startsWith("article:")
        ? articles.find((a) => url === `article:${a.id}`)?.title || "Article"
        : url.replace(/^(search|image):/, "");
  return (
    <div className="lp-browser">
      <div className="lp-browser-tabs" role="tablist">
        {tabs.map((t) => (
          <div className={t.id === tab.id ? "selected" : ""} key={t.id}>
            <button
              role="tab"
              aria-selected={t.id === tab.id}
              onClick={() => setActive(t.id)}
            >
              <span className="lp-north-mark">N</span>
              {label(t.history[t.index])}
            </button>
            <button
              aria-label={`탭 닫기 ${t.id}`}
              onClick={() => {
                if (tabs.length === 1) {
                  setTabs([{ id: t.id, history: ["new"], index: 0 }]);
                  return;
                }
                setTabs(tabs.filter((x) => x.id !== t.id));
                if (t.id === active)
                  setActive(tabs.find((x) => x.id !== t.id)!.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          aria-label="새 탭"
          disabled={tabs.length >= 6}
          onClick={() => {
            const id = Math.max(...tabs.map((t) => t.id)) + 1;
            setTabs([...tabs, { id, history: ["new"], index: 0 }]);
            setActive(id);
          }}
        >
          ＋
        </button>
      </div>
      <form
        className="lp-omnibar"
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) go(`search:${input.trim()}`);
        }}
      >
        <button
          type="button"
          aria-label="뒤로"
          disabled={tab.index === 0}
          onClick={() =>
            setTabs(
              tabs.map((t) =>
                t.id === tab.id ? { ...t, index: t.index - 1 } : t,
              ),
            )
          }
        >
          ←
        </button>
        <button
          type="button"
          aria-label="앞으로"
          disabled={tab.index === tab.history.length - 1}
          onClick={() =>
            setTabs(
              tabs.map((t) =>
                t.id === tab.id ? { ...t, index: t.index + 1 } : t,
              ),
            )
          }
        >
          →
        </button>
        <button
          type="button"
          aria-label="새로고침"
          onClick={() => toast("로컬 아카이브가 최신 상태입니다.")}
        >
          ↻
        </button>
        <label>
          <Icon name="search" size={16} />
          <input
            aria-label="NORTH 주소 또는 검색어"
            value={input}
            placeholder="Search or enter an address"
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="button"
            aria-label="검색 기록"
            onClick={() => setShowHistory(!showHistory)}
          >
            ◷
          </button>
        </label>
        <span className="lp-browser-user">Y</span>
      </form>
      <div className="lp-bookmarks">
        <button onClick={() => go("new")}>⌂ New tab</button>
        <button onClick={() => go("search:뉴스")}>News</button>
        <small>NORTH · Local web archive</small>
      </div>
      {showHistory && (
        <div className="lp-browser-history">
          <h3>History</h3>
          {s.searches.map((q) => (
            <button
              key={q}
              onClick={() => {
                go(`search:${q}`);
                setShowHistory(false);
              }}
            >
              {q} ↗
            </button>
          ))}
        </div>
      )}
      <div className="lp-browser-page">
        {url === "new" ? (
          <div className="lp-newtab">
            <span className="lp-north-logo">
              north<span>·</span>
            </span>
            <p>A little curiosity goes a long way.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) go(`search:${input.trim()}`);
              }}
            >
              <Icon name="search" />
              <input
                aria-label="NORTH 새 탭 검색"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search the web"
              />
              <button>→</button>
            </form>
            <small>웹페이지·기사·이미지의 보관된 기록을 검색합니다.</small>
          </div>
        ) : article ? (
          <article className="lp-news">
            <header>
              <strong>{article.site}</strong>
              <small>NEWS / CULTURE / PEOPLE</small>
            </header>
            <div className="lp-news-body">
              <main>
                <small>
                  {article.id === "sea-source"
                    ? "TRAVEL JOURNAL"
                    : "NEWS & REPORTS"}
                </small>
                <h1>{article.title}</h1>
                <p className="lp-byline">편집부 · {article.date}</p>
                {article.image && (
                  <button
                    className="lp-article-image"
                    aria-label="기사 사진 확대"
                    onClick={() => {
                      setZoom(true);
                      if (article.fact)
                        update((s) => discover(s, article.fact!));
                    }}
                  >
                    <img src={img(article.image)} alt="기사 첨부 사진" />
                  </button>
                )}
                <p>{article.body}</p>
                {article.comment && (
                  <div className="lp-news-comment">
                    <button
                      onClick={() => navigate(`profile:${article.comment}`)}
                    >
                      <b>@{person(article.comment).handle}</b>
                    </button>
                    <p>나도 여기랑 비슷한 일 있었음.</p>
                    <Save
                      id="sera-comment"
                      title="기사 댓글 · sera.archive"
                      body="나도 여기랑 비슷한 일 있었음."
                      source="profile:sera"
                      category="People"
                    />
                  </div>
                )}
                <Save
                  id={`article-${article.id}`}
                  title={article.title}
                  body={article.body}
                  source={`article:${article.id}`}
                  time={article.date}
                  fact={
                    article.fact && s.facts.includes(article.fact)
                      ? article.fact
                      : undefined
                  }
                  category={article.id === "office" ? "Places" : "Timeline"}
                />
              </main>
              <aside>
                <b>Related articles</b>
                {articles
                  .filter(
                    (a) =>
                      a.id !== article.id &&
                      a.id !== "rescue" &&
                      a.id !== "sea-source",
                  )
                  .slice(0, 2)
                  .map((a) => (
                    <button key={a.id} onClick={() => go(`article:${a.id}`)}>
                      {a.title} ↗
                    </button>
                  ))}
              </aside>
            </div>
          </article>
        ) : (
          <div className="lp-results">
            <header>
              <strong>north</strong>
              <span>{imageSearch ? "Images" : "All"}　News　Places</span>
            </header>
            <h2>{imageSearch ? "Visual matches" : q}</h2>
            {imageSearch && (
              <img
                className="lp-search-thumb"
                src={img(imageName)}
                alt="검색 이미지"
              />
            )}
            <p className="lp-muted">{results.length} archived results</p>
            {results.map((a) => (
              <article key={a.id}>
                <small>
                  {a.site}　› {a.id}
                </small>
                <button onClick={() => go(`article:${a.id}`)}>{a.title}</button>
                <p>{a.body.slice(0, 115)}…</p>
                <time>{a.date}</time>
              </article>
            ))}
            {!results.length && (
              <p>No results found. 다른 단어나 띄어쓰기로 검색해 보세요.</p>
            )}
          </div>
        )}
      </div>
      {zoom && article?.image && (
        <Modal title="Original image" close={() => setZoom(false)} wide>
          <div className="lp-original-image">
            <img src={img(article.image)} alt="기사 원본 사진" />
          </div>
          <p className="lp-image-meta">
            {article.id === "event"
              ? "촬영 2028.06.18 21:51 · Seoul, Gangnam"
              : article.date}
          </p>
          <Save
            id={`article-${article.id}`}
            title={article.title}
            body={article.body}
            source={`article:${article.id}`}
            time={article.id === "event" ? "2028.06.18 21:51" : article.date}
            fact={article.fact}
          />
        </Modal>
      )}
    </div>
  );
}
