import { useEffect, useState } from "react";
import { posts, person, type Post } from "./data";
import { discover } from "./engine";
import { useGame, update, toast } from "./store";
import { Avatar, Icon, img, Modal, Save, type Navigate } from "./shared";
export function PostCard({
  post: p,
  navigate,
}: {
  post: Post;
  navigate: Navigate;
}) {
  const s = useGame();
  return (
    <article className="lp-post">
      <header>
        <button
          className="lp-user"
          onClick={() => navigate(`profile:${p.user}`)}
        >
          <Avatar id={p.user} />
          <span>
            <b>{person(p.user).handle}</b>
            <small>{p.location}</small>
          </span>
        </button>
        <time>{p.date.slice(0, 10)}</time>
        <button
          aria-label={`게시물 메뉴 ${p.id}`}
          onClick={() => navigate(`post:${p.id}`)}
        >
          •••
        </button>
      </header>
      <button
        className="lp-post-image"
        aria-label={`게시물 열기 ${p.id}`}
        onClick={() => navigate(`post:${p.id}`)}
      >
        <img src={img(p.image)} alt={p.caption.split("\n")[0]} loading="lazy" />
      </button>
      <div className="lp-post-actions">
        <button
          className={s.liked.includes(p.id) ? "liked" : ""}
          aria-label="좋아요"
          onClick={() =>
            update((s) => ({
              ...s,
              liked: s.liked.includes(p.id)
                ? s.liked.filter((x) => x !== p.id)
                : [...s.liked, p.id],
            }))
          }
        >
          <Icon name="heart" />
        </button>
        <button aria-label="댓글 보기" onClick={() => navigate(`post:${p.id}`)}>
          <Icon name="messages" />
        </button>
        <button
          aria-label="게시물 링크 복사"
          onClick={() => {
            navigator.clipboard
              ?.writeText(`moment.local/p/${p.id}`)
              .then(() => toast("Link copied"))
              .catch(() => toast(`moment.local/p/${p.id}`));
          }}
        >
          <Icon name="send" />
        </button>
        <span />
        <Save
          id={`post-${p.id}`}
          title={`${person(p.user).handle} · ${p.caption.split("\n")[0]}`}
          body={p.caption}
          source={`post:${p.id}`}
          time={p.date}
          fact={s.facts.includes(p.fact || "") ? p.fact : undefined}
        />
      </div>
      <button
        className="lp-like-count"
        onClick={() => navigate(`likes:${p.id}`)}
      >
        {(p.likes + (s.liked.includes(p.id) ? 1 : 0)).toLocaleString()} likes
      </button>
      <p>
        <b>{person(p.user).handle}</b> {p.caption}
      </p>
      <button className="lp-muted" onClick={() => navigate(`post:${p.id}`)}>
        View {p.id === "last" ? "all 87" : p.comments.length} comments
      </button>
      {p.edited && <small className="lp-edited">Edited</small>}
    </article>
  );
}
export function PostDetail({
  id,
  navigate,
  close,
}: {
  id: string;
  navigate: Navigate;
  close: () => void;
}) {
  const s = useGame(),
    p = posts.find((p) => p.id === id);
  const [info, setInfo] = useState(false),
    [zoom, setZoom] = useState(false),
    [cache, setCache] = useState(false);
  useEffect(() => {
    if (p && p.fact && p.fact !== "scheduled")
      update((s) => discover(s, p.fact!));
  }, [id]);
  if (!p) return null;
  const removed = p.id === "desk" && s.risk >= 4;
  return (
    <Modal title={`Post · ${person(p.user).handle}`} close={close} wide>
      <div className="lp-post-detail">
        <div className={`lp-photo-pane ${zoom ? "zoomed" : ""}`}>
          <button
            aria-label="사진 확대"
            disabled={removed}
            onClick={() => {
              setZoom(!zoom);
              if (!zoom && p.id === "desk")
                update((s) => discover(s, "identity"));
            }}
          >
            {removed ? (
              <p>Post unavailable</p>
            ) : (
              <img src={img(p.image)} alt={p.caption} />
            )}
          </button>
          {zoom && (
            <span className="lp-zoom-label">
              확대 보기 · 사진을 다시 누르면 축소
            </span>
          )}
        </div>
        <section>
          <button
            className="lp-user"
            onClick={() => navigate(`profile:${p.user}`)}
          >
            <Avatar id={p.user} />
            <b>{person(p.user).handle}</b>
          </button>
          <p className="lp-caption">{p.caption}</p>
          <button
            className="lp-location"
            onClick={() => navigate(`search:${p.location}`)}
          >
            {p.location}
          </button>
          <small>
            {p.date} {p.edited ? "· Edited" : ""}
          </small>
          <div className="lp-comments">
            {p.comments
              .filter((c) => !c.cached || (cache && s.risk < 4))
              .map((c) => (
                <div id={c.id} key={c.id}>
                  <button
                    className="lp-user"
                    onClick={() => navigate(`profile:${c.user}`)}
                  >
                    <Avatar id={c.user} />
                    <b>{person(c.user).handle}</b>
                  </button>
                  <p>{c.text}</p>
                  <small>
                    {c.time}
                    {c.cached ? " · cached comment" : ""}
                  </small>
                  <Save
                    id={`comment-${c.id}`}
                    title={`${person(c.user).handle}의 댓글`}
                    body={c.text}
                    source={`comment:${c.id}`}
                    category="Timeline"
                    time={c.time}
                  />
                </div>
              ))}
            {p.comments.some((c) => c.cached) && (
              <button
                className="lp-link"
                onClick={() => {
                  setCache(!cache);
                  if (s.risk < 4) update((s) => discover(s, "scheduled"));
                }}
              >
                {cache ? "Hide cached comments" : "View cached comments"}
              </button>
            )}
            {cache && s.risk >= 4 && (
              <p>캐시가 만료되었습니다. 저장한 사본은 Notes에 남아 있습니다.</p>
            )}
          </div>
          <div className="lp-detail-tools">
            <button onClick={() => setInfo(!info)}>
              {p.original ? "View original" : "View information"}
            </button>
            <button disabled={removed} onClick={() => navigate(`image:${p.image}`)}>
              Search image on web ↗
            </button>
            <Save
              id={`post-${p.id}`}
              title={
                p.id === "desk"
                  ? "Office days · 확대된 화면"
                  : p.caption.split("\n")[0]
              }
              body={p.caption + (info && p.original ? "\n" + p.original : "")}
              source={`post:${p.id}`}
              time={p.date}
              fact={
                zoom && p.id === "desk" && !removed
                  ? "identity"
                  : p.fact && s.facts.includes(p.fact)
                    ? p.fact
                    : undefined
              }
            />
          </div>
          {info && (
            <div className="lp-info">
              <b>{p.original || `${p.id}.JPG`}</b>
              <p>
                {p.id === "last"
                  ? "Location unavailable · Edited"
                  : `공개 게시물 원본 · ${p.location}`}
              </p>
              <Save
                id={`original-${p.id}`}
                title="사진 원본 정보"
                body={p.original || p.date}
                source={`post:${p.id}`}
                time={p.original || p.date}
                category="Timeline"
              />
            </div>
          )}
          {p.tags.length > 0 && (
            <div className="lp-tags">
              {p.tags.map((u) => (
                <button key={u} onClick={() => navigate(`profile:${u}`)}>
                  Tagged @{person(u).handle}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
}
