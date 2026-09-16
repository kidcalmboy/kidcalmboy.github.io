import { useEffect, useRef, useState, type ReactNode } from "react";
import { narration, person } from "./data";
import { chapter, tick, type AppId } from "./engine";
import { useGame, update, reset } from "./store";
import { Avatar, Icon, Modal, type Navigate } from "./shared";
import { Moment } from "./Moment";
import { Browser } from "./Browser";
import { Mail } from "./Mail";
import { Notes } from "./Notes";
import { Prologue } from "./Prologue";
const names: Record<AppId, string> = {
  moment: "Moment",
  browser: "Browser",
  mail: "Mail",
  notes: "Notes",
};
type Win = {
  id: AppId;
  x: number;
  y: number;
  z: number;
  min: boolean;
  max: boolean;
};
function AppWindow({
  w,
  front,
  focus,
  change,
  close,
  children,
}: {
  w: Win;
  front: boolean;
  focus: () => void;
  change: (props: Partial<Win>) => void;
  close: () => void;
  children: ReactNode;
}) {
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null,
  );
  return (
    <section
      className={`lp-window ${front ? "front" : ""} ${w.max ? "maximized" : ""}`}
      aria-label={names[w.id]}
      style={{
        left: w.max ? 12 : w.x,
        top: w.max ? 40 : w.y,
        zIndex: w.z,
        display: w.min ? "none" : undefined,
      }}
      onPointerDown={focus}
    >
      <header
        className="lp-titlebar"
        onDoubleClick={() => change({ max: !w.max })}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button") || w.max) return;
          drag.current = { x: w.x, y: w.y, px: e.clientX, py: e.clientY };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (drag.current) {
            const d = drag.current;
            change({
              x: Math.max(
                0,
                Math.min(innerWidth - 300, d.x + e.clientX - d.px),
              ),
              y: Math.max(
                34,
                Math.min(innerHeight - 140, d.y + e.clientY - d.py),
              ),
            });
          }
        }}
        onPointerUp={() => (drag.current = null)}
        onLostPointerCapture={() => (drag.current = null)}
      >
        <div className="lp-traffic">
          <button
            title="닫기"
            aria-label={`${names[w.id]} 닫기`}
            onClick={close}
          >
            ×
          </button>
          <button
            title="최소화"
            aria-label={`${names[w.id]} 최소화`}
            onClick={() => change({ min: true })}
          >
            −
          </button>
          <button
            title="확대"
            aria-label={`${names[w.id]} 확대`}
            onClick={() => change({ max: !w.max })}
          >
            ↗
          </button>
        </div>
        <span>{w.id === "browser" ? "NORTH" : names[w.id]}</span>
        <small>{w.id === "moment" ? "moment.local" : "NOVA OS"}</small>
      </header>
      <div className="lp-window-content">{children}</div>
    </section>
  );
}
export default function App() {
  const s = useGame(),
    [wins, setWins] = useState<Win[]>([
      {
        id: "moment",
        x: Math.max(12, (innerWidth - 1160) / 2),
        y: 56,
        z: 1,
        min: false,
        max: false,
      },
    ]),
    [routes, setRoutes] = useState<Record<AppId, string>>({
      moment: s.loggedIn ? "home" : "login",
      browser: "browser",
      mail: "mail:sister",
      notes: "notes",
    }),
    [menu, setMenu] = useState(""),
    [help, setHelp] = useState(false),
    [resetOpen, setResetOpen] = useState(false),
    [boot, setBoot] = useState(false),
    [prologue, setPrologue] = useState(() => localStorage.getItem('lastPostPrologue.v1') !== 'seen'),
    [notification, setNotification] = useState<{
      user: string;
      text: string;
    } | null>(null),
    [toast, setToast] = useState(""),
    [overlay, setOverlay] = useState<number | null>(null),
    [line, setLine] = useState(0),
    [endingDM, setEndingDM] = useState(false),
    [dmStep, setDmStep] = useState(0),
    [reduce, setReduce] = useState(
      localStorage.getItem("lastPostReduceMotion") === "true",
    );
  const front = [...wins]
    .filter((w) => !w.min)
    .sort((a, b) => b.z - a.z)[0]?.id;
  const open = (id: AppId) =>
    setWins((ws) => {
      const z = Math.max(0, ...ws.map((w) => w.z)) + 1;
      return ws.some((w) => w.id === id)
        ? ws.map((w) => (w.id === id ? { ...w, min: false, z } : w))
        : [
            ...ws,
            {
              id,
              x: Math.max(12, (innerWidth - 1160) / 2) + (ws.length % 3) * 18,
              y: 56 + (ws.length % 3) * 16,
              z,
              min: false,
              max: false,
            },
          ];
    });
  const navigate: Navigate = (target) => {
    let app: AppId = "moment";
    if (/^(search:|article:|image:|browser$)/.test(target)) app = "browser";
    else if (target.startsWith("mail:")) app = "mail";
    else if (target === "notes") app = "notes";
    setRoutes((r) => ({ ...r, ...(app!=='moment'&&/^(post|comment|story|likes):/.test(r.moment)?{moment:'home'}:{}), [app]: target }));
    open(app);
  };
  const change = (id: AppId, props: Partial<Win>) =>
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, ...props } : w)));
  const finishOverlay = () => {
    if (overlay !== null)
      update((s) => ({
        ...s,
        seenChapters: Math.max(s.seenChapters, overlay + 1),
      }));
    setOverlay(null);
  };
  useEffect(() => {
    const timer = setInterval(() => update((s) => tick(s)), 200);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.lpReduced = String(reduce);
    localStorage.setItem("lastPostReduceMotion", String(reduce));
  }, [reduce]);
  useEffect(() => {
    const fn = (e: Event) => setToast((e as CustomEvent<string>).detail);
    window.addEventListener("lp-toast", fn);
    return () => window.removeEventListener("lp-toast", fn);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);
  const lastMessage = s.messages.filter((m) => m.sender === "npc").at(-1),
    lastSeen = useRef(lastMessage?.id);
  useEffect(() => {
    if (lastMessage && lastSeen.current !== lastMessage.id) {
      lastSeen.current = lastMessage.id;
      setNotification({ user: lastMessage.user, text: lastMessage.text });
    }
  }, [lastMessage?.id]);
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(t);
  }, [notification]);
  useEffect(() => {
    if (boot) {
      const t = setTimeout(() => setBoot(false), 1800);
      return () => clearTimeout(t);
    }
  }, [boot]);
  const phase = chapter(s);
  useEffect(() => {
    if (s.ending) setOverlay(null);
  }, [s.ending]);
  useEffect(() => {
    if (phase > s.seenChapters && overlay === null && !s.ending && !prologue && !boot) {
      const t = setTimeout(() => {
        setOverlay(s.seenChapters);
        setLine(0);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [phase, s.seenChapters, overlay, s.ending, prologue, boot]);
  useEffect(() => {
    if (overlay === null || prologue || boot) return;
    const t = setInterval(() => setLine((l) => l + 1), 2800);
    return () => clearInterval(t);
  }, [overlay, prologue, boot]);
  useEffect(() => {
    if (overlay !== null && line >= narration[overlay].length) finishOverlay();
  }, [line]);
  useEffect(() => {
    if (endingDM && dmStep === 0) {
      const t = setTimeout(() => setDmStep(1), 5000);
      return () => clearTimeout(t);
    }
  }, [endingDM, dmStep]);
  useEffect(() => {
    const resized = () =>
      setWins((ws) =>
        ws.map((w) => ({
          ...w,
          x: Math.max(0, Math.min(w.x, innerWidth - 500)),
          y: Math.max(34, Math.min(w.y, innerHeight - 300)),
        })),
      );
    window.addEventListener("resize", resized);
    return () => window.removeEventListener("resize", resized);
  }, []);
  const start = () => {
    update((s) => ({ ...s, started: true }));
    setBoot(true);
  };
  if (prologue) return <Prologue onDone={() => {
    localStorage.setItem('lastPostPrologue.v1', 'seen');
    setPrologue(false);
    if (!s.started) start();
  }} />;
  if (!s.started)
    return (
      <main className="lp-start">
        <div className="lp-start-brand">NOVA / INTERACTIVE FICTION</div>
        <div>
          <small>A SCREENLIFE MYSTERY</small>
          <h1>
            LAST POST<span>.</span>
          </h1>
          <p>
            마지막 게시물을 올린 사람은
            <br />
            윤아가 아니었다.
          </p>
          <button onClick={() => setPrologue(true)}>
            이야기 시작 <span>↗</span>
          </button>
          <small className="lp-start-note">
            PC에서 플레이 · 자동 저장 · 모든 인물과 서비스는 허구입니다.
          </small>
        </div>
        <footer>
          JUNE 20, 2028 <span>08:42 AM</span>
        </footer>
      </main>
    );
  return (
    <main
      className="lp-desktop"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          if (menu) setMenu("");
          else if (front) setWins((ws) => ws.filter((w) => w.id !== front));
        }
      }}
    >
      <div className="lp-mobile">
        <h1>LAST POST</h1>
        <p>LAST POST is designed for desktop.</p>
        <small>1280 × 720 이상의 화면을 권장합니다.</small>
      </div>
      <div
        className="lp-desktop-ui"
        inert={!!s.ending || boot || undefined}
      >
        <header className="lp-menubar">
          <button
            className="lp-nova"
            onClick={() => setMenu(menu ? "" : "NOVA")}
          >
            NOVA
          </button>
          <b>{front ? names[front] : "Desktop"}</b>
          {["File", "Edit", "View", "Window", "Help"].map((m) => (
            <button
              key={m}
              onClick={() =>
                m === "Help" ? setHelp(true) : setMenu(menu === m ? "" : m)
              }
            >
              {m}
            </button>
          ))}
          <span />
          <Icon name="search" size={14} />
          <span className="lp-system-symbols">◔　▰ 84%</span>
          <time>
            Jun 20　{String(Math.floor((8*60+42+phase*4)/60)).padStart(2,'0')}:{String((42+phase*4)%60).padStart(2,'0')}
          </time>
        </header>
        {menu && (
          <div className="lp-os-menu">
            <button onClick={() => { setPrologue(true); setMenu(''); }}>프롤로그 다시 보기</button>
            <button
              onClick={() => {
                setHelp(true);
                setMenu("");
              }}
            >
              About LAST POST
            </button>
            <button
              onClick={() => {
                setWins((ws) => ws.map((w) => ({ ...w, min: true })));
                setMenu("");
              }}
            >
              Show desktop
            </button>
            <button
              onClick={() => {
                setReduce(!reduce);
                setMenu("");
              }}
            >
              {reduce ? "✓ " : ""}Reduce motion
            </button>
            <hr />
            <button
              onClick={() => {
                setResetOpen(true);
                setMenu("");
              }}
            >
              새 게임…
            </button>
          </div>
        )}
        <div className="lp-wallpaper" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        {wins.map((w) => (
          <AppWindow
            key={w.id}
            w={w}
            front={front === w.id}
            focus={() => {
              if (front !== w.id) open(w.id);
            }}
            change={(props) => change(w.id, props)}
            close={() => setWins((ws) => ws.filter((x) => x.id !== w.id))}
          >
            {w.id === "moment" ? (
              <Moment route={routes.moment} navigate={navigate} />
            ) : w.id === "browser" ? (
              <Browser route={routes.browser} navigate={navigate} />
            ) : w.id === "mail" ? (
              <Mail route={routes.mail} navigate={navigate} />
            ) : (
              <Notes navigate={navigate} />
            )}
          </AppWindow>
        ))}
        <nav className="lp-dock" aria-label="앱">
          {(["moment", "browser", "mail", "notes"] as AppId[]).map((id) => (
            <button
              key={id}
              aria-label={names[id]}
              title={names[id]}
              onClick={() => open(id)}
            >
              <span className={`lp-dock-icon ${id}`}>
                <Icon name={id} size={33} />
              </span>
              <span className="lp-dock-tooltip">{names[id]}</span>
              <i className={wins.some((w) => w.id === id) ? "open" : ""} />
            </button>
          ))}
        </nav>
        <small className="lp-autosave">NOVA OS · Saved locally</small>
        {notification && (
          <button
            className="lp-notification"
            onClick={() => {
              navigate(`dm:${notification.user}`);
              setNotification(null);
            }}
          >
            <Avatar id={notification.user} />
            <span>
              <small>MOMENT　·　now</small>
              <b>{person(notification.user).name}</b>
              <p>{notification.text}</p>
            </span>
          </button>
        )}
        {toast && (
          <div className="lp-toast" role="status">
            ✓　{toast}
          </div>
        )}
      </div>
      {boot && (
        <div className="lp-boot">
          <small>JUNE 20, 2028</small>
          <p>08:42 AM</p>
        </div>
      )}
      {overlay !== null && (
        <div
          className="lp-narration"
          role="dialog"
          aria-label="Chapter narration"
        >
          <small>CHAPTER {String(overlay + 1).padStart(2, "0")}</small>
          <p key={line}>{narration[overlay][line]}</p>
          <button aria-label="나레이션 닫기" onClick={finishOverlay}>닫기 ×</button>
        </div>
      )}
      {help && (
        <Modal title="About LAST POST" close={() => setHelp(false)}>
          <div className="lp-help">
            <h1>작은 기록을 따라가세요.</h1>
            <p>
              MOMENT에서 계정·게시물·댓글·스토리를 확인하고, NORTH에서 발견한
              단어를 검색하세요. Save to Notes로 출처를 보관하고 직접 생각을
              적을 수 있습니다.
            </p>
            <p>
              실제 SNS나 인터넷에 연결하지 않는 로컬 추리 게임입니다. 답장
              선택은 자동 저장되며 되돌릴 수 없습니다. 창은 드래그·최소화·확대할
              수 있습니다.
            </p>
            <label>
              <input
                type="checkbox"
                checked={reduce}
                onChange={(e) => setReduce(e.target.checked)}
              />{" "}
              동작 줄이기
            </label>
          </div>
        </Modal>
      )}
      {resetOpen && (
        <Modal title="새 게임" close={() => setResetOpen(false)}>
          <div className="lp-help">
            <p>
              LAST POST의 현재 진행과 메모가 초기화됩니다. 이전 LAST SEEN 저장은
              유지됩니다.
            </p>
            <button
              className="lp-primary"
              onClick={() => {
                reset();
                setResetOpen(false);
                setRoutes({
                  moment: "login",
                  browser: "browser",
                  mail: "mail:sister",
                  notes: "notes",
                });
                setWins([
                  { id: "moment", x: 60, y: 56, z: 1, min: false, max: false },
                ]);
                setOverlay(null);
                setEndingDM(false);
                setDmStep(0);
                setBoot(true);
              }}
            >
              초기화하고 시작
            </button>
          </div>
        </Modal>
      )}
      {s.ending && (
        <div className="lp-ending" role="dialog" aria-label="Ending">
          {s.ending === "true" && endingDM ? (
            <div className="lp-ending-chat">
              <Avatar id="youna" />
              <h2>한윤아</h2>
              <small>Active now</small>
              <p>야</p>
              {dmStep >= 1 && <p>내 계정 뒤졌냐</p>}
              {dmStep >= 1 && !s.epilogue && (
                <div>
                  {["조금.", "거의 다.", "미안."].map((t) => (
                    <button
                      key={t}
                      onClick={() => update((s) => ({ ...s, epilogue: t }))}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
              {s.epilogue && (
                <>
                  <p className="mine">{s.epilogue}</p>
                  <p>
                    ㅋㅋ
                    <br />
                    고마워
                  </p>
                  <p>
                    근데 내 흑역사 사진은
                    <br />
                    진짜 못 본 걸로 해라
                  </p>
                  <small>
                    SNS는 사람들이 보여주고 싶은 것들로 만들어진다.
                    <br />
                    하지만 보여주지 않으려 했던 것이 더 많은 것을 말해준다.
                  </small>
                </>
              )}
            </div>
          ) : (
            <div>
              <small>
                LAST POST / {s.ending === "true" ? "EPILOGUE" : "CASE REPORT"}
              </small>
              <h1>
                {
                  (
                    {
                      true: "그녀를 찾았다.",
                      normal: "마지막 게시물의 작성자",
                      wrong: "다른 사람의 이야기",
                      incomplete: "아직 남아 있는 빈칸",
                      lost: "지워진 흔적",
                    } as Record<string, string>
                  )[s.ending]
                }
              </h1>
              <p>
                {
                  (
                    {
                      true: "MOTIONLAB 대표 정민석 긴급체포.\n실종됐던 대학생 한윤아, 병원에서 신원 확인.",
                      normal:
                        "정민석의 계정과 조작된 게시물을 연결하는 자료가 접수됐다.\n하지만 윤아의 현재 행방은 아직 확인되지 않았다.",
                      wrong:
                        "자료는 전달됐다. 하지만 지목한 사람의 행적은 사건의 마지막 시간을 설명하지 못했다.",
                      incomplete:
                        "각 기록 사이를 연결할 자료가 부족하다.\n수사는 추가 자료를 기다리고 있다.",
                      lost: "연락 이후 공개 기록이 지워졌다.\n보관하지 못한 흔적을 연결하기에는 자료가 부족했다.",
                    } as Record<string, string>
                  )[s.ending]
                }
              </p>
              {s.ending === "true" && (
                <>
                  <p>
                    구 사무실에서 USB를 둘러싼 언쟁 끝에 윤아는 계단 아래로
                    추락했다. 민석은 구조 요청 대신 휴대전화를 가져가 게시물을
                    올렸다. 휴대전화와 지갑 없이 도로 인근에 남겨진 윤아는
                    지나가던 운전자에게 발견됐다.
                  </p>
                  <button
                    className="lp-primary"
                    onClick={() => setEndingDM(true)}
                  >
                    며칠 후 · 새 메시지
                  </button>
                </>
              )}
            </div>
          )}
          <button
            className="lp-ending-back"
            onClick={() => {
              update((s) => ({ ...s, ending: null }));
              setEndingDM(false);
            }}
          >
            조사로 돌아가기
          </button>
        </div>
      )}
    </main>
  );
}
