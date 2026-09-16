import { useEffect, useState } from "react";
import { activity, people, person, posts, stories } from "./data";
import { discover, login } from "./engine";
import { toast, update, useGame } from "./store";
import { Avatar, Icon, Modal, Save, img, type Navigate } from "./shared";
import { PostCard, PostDetail } from "./Posts";
import { Messages } from "./Messages";
import {ProgressGuide} from './ProgressGuide';
export function Moment({
  route,
  navigate,
}: {
  route: string;
  navigate: Navigate;
}) {
  const s = useGame();
  const [section, arg = ""] = route.split(/:(.*)/s),
    [q, setQ] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [profileTab, setProfileTab] = useState("POSTS"),
    [list, setList] = useState<string[] | null>(null),
    [listQuery, setListQuery] = useState(""),
    [act, setAct] = useState("All"),
    [zoom, setZoom] = useState(false);
  useEffect(() => {
    setZoom(false);
    setProfileTab("POSTS");
    if (section === "profile") update((s) => discover(s, `profile:${arg}`));
    if (section === "story" && s.loggedIn) {
      const item = stories.find((x) => x.id === arg);
      update((s) =>
        discover(s, `story:${arg}`, ...(item?.fact ? [item.fact] : [])),
      );
    }
  }, [route, s.loggedIn]);
  const nav = [
    ["home", "Home", "home"],
    ["search", "Search", "search"],
    ["explore", "Explore", "explore"],
    ["dm:gaeun", "Messages", "messages"],
    ["notifications", "Notifications", "heart"],
    ["profile:youna", "Profile", "profile"],
    ...(s.loggedIn
      ? [
          ["archive", "Archive", "archive"],
          ["activity", "Activity", "activity"],
        ]
      : []),
  ];
  const openPost =
    section === "post"
      ? arg
      : section === "comment"
        ? posts.find((p) => p.comments.some((c) => c.id === arg))?.id
        : undefined;
  const u = person(arg),
    privateView =
      !s.loggedIn && ["dm", "archive", "activity"].includes(section);
  const saveSearch = () => {
    if (q.trim())
      update((s) => ({
        ...s,
        searches: [q.trim(), ...s.searches.filter((x) => x !== q.trim())].slice(
          0,
          30,
        ),
      }));
  };
  const profilePosts = posts.filter((p) =>
    profileTab === "TAGGED" ? p.tags.includes(arg) : p.user === arg,
  );
  const results = posts.filter((p) =>
    `${p.caption} ${p.location} ${p.tags.map((x) => person(x).handle).join(" ")}`
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  const story = stories.find((x) => x.id === arg),
    storyAllowed = story && (s.loggedIn || story.user !== "youna");
  return (
    <div className="lp-moment">
      <nav className="lp-moment-nav" aria-label="MOMENT">
        <button className="lp-wordmark" onClick={() => navigate("home")}>
          moment<span>®</span>
        </button>
        {nav.map(([target, label, icon]) => (
          <button
            key={target}
            className={
              route === target || (target === "home" && !!openPost)
                ? "selected"
                : ""
            }
            onClick={() => navigate(target)}
          >
            <Icon name={icon} />
            <span>{label}</span>
            {label === "Messages" &&
              s.loggedIn &&
              s.messages.some((m) => !s.readUsers.includes(m.user)) && (
                <i className="lp-dot" />
              )}
          </button>
        ))}
        <div className="lp-nav-bottom">
          <button
            className="lp-user"
            onClick={() => navigate(s.loggedIn ? "profile:youna" : "login")}
          >
            <Avatar id="youna" />
            <span>
              <b>{s.loggedIn ? "youna.zip" : "Your account"}</b>
              <small>
                {s.loggedIn ? "Personal account" : "Switch account"}
              </small>
            </span>
          </button>
          <button className="lp-muted" onClick={() => navigate("mail:sister")}>
            Help & account access ↗
          </button>
        </div>
      </nav>
      <div className={`lp-moment-main ${section === "dm" ? "dm-main" : ""}`}>
        {section !== 'dm' && <ProgressGuide navigate={navigate} compact/>}
        {(section === "login" || privateView) && (
          <div className="lp-login">
            <div className="lp-login-photo">
              <img src={img("birthday")} alt="윤아의 생일 사진" />
              <span>
                Small moments.
                <br />
                Everything else.
              </span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (password === "1103") {
                  update((s) => login(s, password));
                  setError("");
                  navigate("home");
                  toast("Password Accepted");
                } else setError("비밀번호가 일치하지 않습니다.");
              }}
            >
              <h1 className="lp-wordmark">moment</h1>
              <p>Your moments, kept close.</p>
              <label>
                Username
                <input value="@youna.zip" readOnly />
              </label>
              <label>
                Password
                <input
                  aria-label="MOMENT 비밀번호"
                  type="password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <button className="lp-primary" type="submit">
                Log in
              </button>
              {error && <p role="alert">{error}</p>}
              <div className="lp-or">OR</div>
              <button
                type="button"
                className="lp-link"
                onClick={() => navigate("profile:youna")}
              >
                내 계정으로 공개 프로필 보기
              </button>
              <small>개인 메시지와 아카이브는 로그인 후 표시됩니다.</small>
            </form>
          </div>
        )}
        {!privateView && section === "dm" && (
          <Messages user={arg || "gaeun"} navigate={navigate} />
        )}
        {(section === "home" ||
          !!openPost ||
          section === "likes" ||
          section === "story") && (
          <div className="lp-feed-layout">
            <main className="lp-feed">
              <header className="lp-feed-heading">
                <b>For you</b>
                <button onClick={() => navigate("explore")}>Following</button>
              </header>
              <div className="lp-story-row">
                {["gaeun", "taejun", "minsuk"].map((id, i) => (
                  <button
                    key={id}
                    onClick={() =>
                      navigate(
                        id === "minsuk"
                          ? "story:highlight"
                          : id === "taejun"
                            ? "post:live"
                            : "story:gaeun-today",
                      )
                    }
                  >
                    <span className={`lp-ring ring-${i}`}>
                      <Avatar id={id} />
                    </span>
                    <small>{person(id).handle}</small>
                  </button>
                ))}
                <button
                  onClick={() => navigate(s.loggedIn ? "archive" : "login")}
                >
                  <span className="lp-ring muted">
                    <Avatar id="youna" />
                  </span>
                  <small>{s.loggedIn ? "Your archive" : "youna.zip"}</small>
                </button>
              </div>
              {posts
                .filter((p) =>
                  ["last", "daily", "usb", "birthday"].includes(p.id),
                )
                .map((p) => (
                  <PostCard key={p.id} post={p} navigate={navigate} />
                ))}
            </main>
            <aside className="lp-context">
              <button
                className="lp-user"
                onClick={() => navigate("profile:youna")}
              >
                <Avatar id="youna" />
                <span>
                  <b>youna.zip</b>
                  <small>한윤아</small>
                </span>
              </button>
              <div className="lp-suggestions-title">People you may know</div>
              {["gaeun", "hyunwoo", "taejun"].map((id) => (
                <div className="lp-suggestion" key={id}>
                  <button
                    className="lp-user"
                    onClick={() => navigate(`profile:${id}`)}
                  >
                    <Avatar id={id} />
                    <span>
                      <b>{person(id).handle}</b>
                      <small>{person(id).name}</small>
                    </span>
                  </button>
                  <button
                    className="lp-link"
                    onClick={() => navigate(`profile:${id}`)}
                  >
                    View
                  </button>
                </div>
              ))}
              <p className="lp-legal">
                About · Help · Privacy · Terms
                <br />
                Locations · Language
                <br />
                <br />© 2028 MOMENT
              </p>
              <div className="lp-context-foot">
                A little closer to your world.
              </div>
            </aside>
          </div>
        )}
        {section === "profile" && (
          <div className="lp-profile">
            <header>
              <Avatar id={arg} large />
              <section>
                <div className="lp-profile-title">
                  <h1>{u.handle}</h1>
                  <button
                    className="lp-soft"
                    onClick={() => navigate(s.loggedIn ? `dm:${arg}` : "login")}
                  >
                    Message
                  </button>
                  <button
                    className="lp-soft"
                    onClick={() =>
                      update((s) => ({
                        ...s,
                        followed: s.followed.includes(arg)
                          ? s.followed.filter((x) => x !== arg)
                          : [...s.followed, arg],
                      }))
                    }
                  >
                    {s.followed.includes(arg) ? "Following" : "Follow"}
                  </button>
                </div>
                <div className="lp-profile-stats">
                  <span>
                    <b>{posts.filter((p) => p.user === arg).length}</b> posts
                  </span>
                  <button
                    onClick={() => {
                      setList(
                        people
                          .filter((p) => p.following.includes(arg))
                          .map((p) => p.id),
                      );
                      setListQuery("");
                    }}
                  >
                    <b>{u.followers}</b> followers
                  </button>
                  <button
                    onClick={() => {
                      setList(u.following);
                      setListQuery("");
                    }}
                  >
                    <b>{arg === "youna" ? "611" : u.following.length}</b>{" "}
                    following
                  </button>
                </div>
                <b>{u.name}</b>
                <p>{u.bio}</p>
                <details>
                  <summary>About this account</summary>
                  <p>
                    Joined {u.created}
                    <br />
                    Former usernames: {u.former}
                  </p>
                </details>
                <Save
                  id={`person-${arg}`}
                  title={u.name}
                  body={`@${u.handle}\n${u.bio}\nJoined ${u.created}`}
                  source={`profile:${arg}`}
                  category="People"
                />
              </section>
            </header>
            {arg === "minsuk" && (
              <button
                className="lp-highlight"
                onClick={() => navigate("story:highlight")}
              >
                <img src={img("desk")} alt="" />
                <span>Office days</span>
              </button>
            )}
            <div className="lp-profile-tabs">
              {[
                "POSTS",
                "TAGGED",
                ...(arg === "youna" && s.loggedIn
                  ? ["ARCHIVE", "ACTIVITY"]
                  : []),
              ].map((t) => (
                <button
                  key={t}
                  className={profileTab === t ? "selected" : ""}
                  onClick={() =>
                    t === "ARCHIVE"
                      ? navigate("archive")
                      : t === "ACTIVITY"
                        ? navigate("activity")
                        : setProfileTab(t)
                  }
                >
                  {t}
                </button>
              ))}
            </div>
            {u.private ? (
              <div className="lp-empty">
                <Icon name="profile" size={42} />
                <h3>This account is private</h3>
                <p>Follow to see their photos and videos.</p>
                <small>계정 정보와 연결 목록은 공개되어 있습니다.</small>
              </div>
            ) : (
              <div className="lp-grid">
                {profilePosts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`post:${p.id}`)}
                    aria-label={`게시물 열기 ${p.id}`}
                  >
                    <img src={img(p.image)} alt={p.caption} />
                    <span>{p.caption.split("\n")[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {(section === "search" || section === "explore") && (
          <div className="lp-search-page">
            <h1>{section === "explore" ? "Explore" : "Search"}</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveSearch();
              }}
            >
              <input
                aria-label="MOMENT 검색"
                placeholder="Search accounts, places, topics…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
            {!q && s.searches.length > 0 && (
              <div className="lp-recent">
                <small>Recent</small>
                {s.searches.slice(0, 6).map((x) => (
                  <button key={x} onClick={() => setQ(x)}>
                    {x}
                  </button>
                ))}
              </div>
            )}
            <h3>Accounts</h3>
            <div className="lp-account-results">
              {people
                .filter((p) =>
                  `${p.name} ${p.handle} ${p.bio}`
                    .toLowerCase()
                    .includes(q.toLowerCase()),
                )
                .map((p) => (
                  <button
                    className="lp-user"
                    key={p.id}
                    onClick={() => {
                      saveSearch();
                      navigate(`profile:${p.id}`);
                    }}
                  >
                    <Avatar id={p.id} />
                    <span>
                      <b>{p.handle}</b>
                      <small>{p.name}</small>
                    </span>
                  </button>
                ))}
            </div>
            <h3>Posts & places</h3>
            <div className="lp-grid">
              {results.map((p) => (
                <button
                  key={p.id}
                  aria-label={`게시물 열기 ${p.id}`}
                  onClick={() => {
                    saveSearch();
                    navigate(`post:${p.id}`);
                  }}
                >
                  <img src={img(p.image)} alt={p.caption} />
                  <span>{p.location}</span>
                </button>
              ))}
            </div>
            {q && !results.length && (
              <p className="lp-muted">No posts found.</p>
            )}
          </div>
        )}
        {section === "archive" && s.loggedIn && (
          <div className="lp-archive">
            <h1>Stories archive</h1>
            <p className="lp-muted">Only you can see your archived stories.</p>
            <div className="lp-archive-grid">
              {stories
                .filter((x) => x.user === "youna")
                .map((x) => (
                  <button
                    key={x.id}
                    onClick={() => navigate(`story:${x.id}`)}
                    style={
                      x.image
                        ? {
                            backgroundImage: `linear-gradient(transparent,#0009),url(${img(x.image)})`,
                          }
                        : {}
                    }
                  >
                    <b>{x.text}</b>
                    <time>{x.time}</time>
                  </button>
                ))}
            </div>
          </div>
        )}
        {section === "activity" && s.loggedIn && (
          <div className="lp-activity">
            <h1>Your activity</h1>
            <p className="lp-muted">A place to review your account history.</p>
            <div className="lp-pills">
              {[
                "All",
                "Likes",
                "Comments",
                "Search history",
                "Login activity",
                "Account history",
                "Link history",
              ].map((t) => (
                <button
                  key={t}
                  className={act === t ? "selected" : ""}
                  onClick={() => setAct(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            {act === "Search history"
              ? s.searches.map((x) => (
                  <button
                    key={x}
                    className="lp-record"
                    onClick={() => navigate(`search:${x}`)}
                  >
                    {x} ↗
                  </button>
                ))
              : activity
                  .filter((a) => act === "All" || a.type === act)
                  .map((a) => (
                    <article className="lp-record" key={a.id}>
                      <small>
                        {a.type} · {a.time}
                      </small>
                      <h3>{a.title}</h3>
                      <p>{a.detail}</p>
                      <div>
                        <button
                          className="lp-link"
                          onClick={() => {
                            if (a.fact) update((s) => discover(s, a.fact!));
                            navigate(a.target);
                          }}
                        >
                          View record ↗
                        </button>
                        <Save
                          id={`activity-${a.id}`}
                          title={a.title}
                          body={a.detail}
                          source="activity"
                          category="Timeline"
                          time={a.time}
                          fact={a.fact}
                        />
                      </div>
                    </article>
                  ))}
          </div>
        )}
        {section === "notifications" && (
          <div className="lp-activity">
            <h1>Notifications</h1>
            <small>Recent activity</small>
            {[
              "liked your photo",
              "started following you",
              "mentioned you in a comment",
              "liked your photo",
            ].map((x, i) => (
              <button
                className="lp-record lp-user"
                key={i}
                onClick={() => navigate(`profile:${people[i + 1].id}`)}
              >
                <Avatar id={people[i + 1].id} />
                <span>
                  <b>{people[i + 1].handle}</b> {x}
                  <small>{i + 1}d</small>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      {openPost && (
        <PostDetail
          key={openPost}
          id={openPost}
          navigate={navigate}
          close={() => navigate("home")}
        />
      )}
      {list && (
        <Modal title="Connections" close={() => setList(null)}>
          <div className="lp-connections">
            <input
              aria-label="연결된 계정 검색"
              value={listQuery}
              onChange={(e) => setListQuery(e.target.value)}
              placeholder="Search"
            />
            {list
              .filter((id) =>
                `${person(id).name} ${person(id).handle}`
                  .toLowerCase()
                  .includes(listQuery.toLowerCase()),
              )
              .map((id) => (
                <button
                  key={id}
                  className="lp-user"
                  onClick={() => {
                    setList(null);
                    navigate(`profile:${id}`);
                  }}
                >
                  <Avatar id={id} />
                  <span>
                    <b>{person(id).handle}</b>
                    <small>{person(id).name}</small>
                  </span>
                </button>
              ))}
            <small>공개된 계정 목록</small>
          </div>
        </Modal>
      )}
      {section === "likes" && (
        <Modal title="Likes" close={() => navigate("home")}>
          <div className="lp-connections">
            {["ocean", "gaeun", "hyunwoo", "taejun"].map((id) => (
              <button
                className="lp-user"
                key={id}
                onClick={() => navigate(`profile:${id}`)}
              >
                <Avatar id={id} />
                {person(id).handle}
              </button>
            ))}
          </div>
        </Modal>
      )}
      {section === "story" && storyAllowed && (
        <Modal
          title={`Story · ${person(story.user).handle}`}
          close={() => navigate("home")}
          wide
        >
          <div className="lp-story-view">
            <div
              className="lp-story-picture"
              style={
                  story.image && !(story.user === 'minsuk' && s.risk >= 4)
                  ? {
                      backgroundImage: `linear-gradient(transparent,#0008),url(${img(story.image)})`,
                    }
                  : {}
              }
            >
              <div className="lp-progress-bars">
                {stories
                  .filter((x) => x.user === story.user)
                  .map((x) => (
                    <i
                      key={x.id}
                      className={x.id === story.id ? "selected" : ""}
                    />
                  ))}
              </div>
              <small>{story.time}</small>
              <button
                className="lp-story-full"
                aria-label="스토리 사진 확대"
                onClick={() => {
                  if (story.image && !(story.user === 'minsuk' && s.risk >= 4)) {
                    setZoom(true);
                    if (story.image === "desk" && s.risk < 4)
                      update((s) => discover(s, "identity"));
                  }
                }}
              >
                {story.user === "minsuk" && s.risk >= 4
                  ? "Story unavailable"
                  : story.text}
              </button>
              <div className="lp-story-controls">
                <button
                  onClick={() => {
                    const same = stories.filter((x) => x.user === story.user);
                    navigate(
                      `story:${same[(same.indexOf(story) + same.length - 1) % same.length].id}`,
                    );
                  }}
                >
                  ←
                </button>
                <button
                  onClick={() => {
                    const same = stories.filter((x) => x.user === story.user);
                    navigate(
                      `story:${same[(same.indexOf(story) + 1) % same.length].id}`,
                    );
                  }}
                >
                  →
                </button>
              </div>
            </div>
            <aside>
              <h3>
                {story.unavailable
                  ? "Replies to unavailable story"
                  : "Story replies"}
              </h3>
              {story.replies.map((r) => (
                <button
                  className="lp-record"
                  key={r.user}
                  onClick={() => navigate(`dm:${r.user}`)}
                >
                  <b>{person(r.user).name}</b>
                  <p>{r.text}</p>
                </button>
              ))}
              <Save
                id={`story-${story.id}`}
                title={story.text}
                body={story.time}
                source={`story:${story.id}`}
                time={story.time}
                category="Timeline"
              />
              <button
                className="lp-soft"
                onClick={() =>
                  navigate(
                    `dm:${story.user === "youna" ? "gaeun" : story.user}`,
                  )
                }
              >
                Reply…
              </button>
            </aside>
          </div>
          {zoom && story.image && !(story.user === 'minsuk' && s.risk >= 4) && (
            <div className="lp-story-zoom">
              <button onClick={() => setZoom(false)}>확대 닫기 ×</button>
              <div>
                <img src={img(story.image)} alt="스토리 원본 확대" />
              </div>
              <Save
                id={`zoom-${story.id}`}
                title={story.image === 'desk' ? 'Office days · 노트북 화면' : story.text}
                body={story.image === 'desk' ? '프로필 화면에 ocean021 표시' : '스토리 원본 확대'}
                source={`story:${story.id}`}
                fact={story.image === 'desk' ? 'identity' : undefined}
                time={story.time}
              />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
