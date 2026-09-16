import { useEffect, useRef, useState, type ReactNode } from "react";
import { icons } from "../icons.js";
import { Window, useWindowManager } from "../components/WindowManager";
import { Notification, useNotifications } from "../components/Notifications";
import { EventEngine } from "../game/EventEngine";
import { AppContent } from "../apps";
import {
  getState,
  getStorageError,
  resetGame,
  setState,
  updateSettings,
  useGame,
} from "../game/store";
import { chapter } from "../game/rules.js";
import { endings } from "../data/story";
import { sound, startAmbient } from "../game/audio";
import type { AppId } from "../game/model";
import {DialogueRuntime} from '../components/DialogueRuntime';
import {CaseFeed} from '../components/CaseFeed';
const apps: Array<[AppId, string]> = [
  ["files", "Files"],
  ["messenger", "Messenger"],
  ["mail", "Mail"],
  ["browser", "Browser"],
  ["photos", "Photos"],
  ["notes", "Notes"],
  ["maps", "Maps"],
  ["evidence", "Evidence"],
  ["trash", "Trash"],
];
function Icon({ id }: { id: AppId }) {
  return (
    <span
      className={`dock-icon ${id}`}
      dangerouslySetInnerHTML={{ __html: icons[id] }}
    />
  );
}
function Dialog({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog ref={ref} onCancel={close}>
      <header>
        <h2>{title}</h2>
        <button onClick={close} aria-label="대화상자 닫기">
          ×
        </button>
      </header>
      {children}
    </dialog>
  );
}
export default function App() {
  const s = useGame(),
    wm = useWindowManager(),
    notifications = useNotifications();
  const [stage, setStage] = useState<"menu" | "boot" | "login" | "desktop">(
      "menu",
    ),
    [dialog, setDialog] = useState(""),
    [menu, setMenu] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(false),
    [contact, setContact] = useState("minjae"),
    [selection, setSelection] = useState("");
  const phase = chapter(s),
    active = [...wm.windows]
      .filter((w) => !w.minimized)
      .sort((a, b) => b.z - a.z)[0];
  const open = (id: AppId) => {
    wm.openWindow(id);
    setMenu("");
    sound("open");
  };
  useEffect(() => {
    if (stage !== "boot") return;
    const t = setTimeout(
      () => setStage(getState().loggedIn ? "desktop" : "login"),
      2300,
    );
    return () => clearTimeout(t);
  }, [stage]);
  useEffect(() => {
    document.documentElement.dataset.reduceMotion = s.settings.reduceMotion
      ? "true"
      : "false";
  }, [s.settings.reduceMotion]);
  useEffect(() => {
    if (stage !== "desktop" || s.ending) return;
    return startAmbient();
  }, [stage, s.ending, s.settings.master, s.settings.music]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || dialog) return;
      if (menu) {
        setMenu("");
        return;
      }
      if (active) wm.closeWindow(active.id);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [active, menu, dialog]);
  function newGame() {
    resetGame();
    wm.clear();
    notifications.clear();
    setPassword("");
    setError(false);
    setDialog("");
    setStage("boot");
  }
  const modal = dialog && (
    <Dialog
      title={
        dialog === "settings"
          ? "시스템 설정"
          : dialog === "credits"
            ? "LAST SEEN / Credits"
            : dialog === "reset"
              ? "새 게임"
              : "NOVA 사용 안내"
      }
      close={() => setDialog("")}
    >
      {dialog === "settings" ? (
        <div className="settings">
          {(["master", "music", "sfx"] as const).map((key, i) => (
            <label key={key}>
              {["전체 음량", "배경음", "효과음"][i]}
              <input
                aria-label={key}
                type="range"
                min="0"
                max="1"
                step=".05"
                value={s.settings[key]}
                onChange={(e) =>
                  updateSettings({ [key]: Number(e.target.value) })
                }
              />
            </label>
          ))}
          <label>
            자막 속도
            <select
              value={s.settings.textSpeed}
              onChange={(e) =>
                updateSettings({ textSpeed: Number(e.target.value) })
              }
            >
              <option value=".5">느리게</option>
              <option value="1">보통</option>
              <option value="2">빠르게</option>
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={s.settings.reduceMotion}
              onChange={(e) =>
                updateSettings({ reduceMotion: e.target.checked })
              }
            />{" "}
            동작 줄이기
          </label>
          <button onClick={() => setDialog("reset")}>저장 초기화</button>
        </div>
      ) : dialog === "reset" ? (
        <>
          <p>
            현재 조사 기록을 초기화할까요? 이전 프로토타입 저장 키는 삭제하지
            않습니다.
          </p>
          <button onClick={() => setDialog("")}>취소</button>
          <button onClick={newGame}>초기화하고 시작</button>
        </>
      ) : dialog === "credits" ? (
        <>
          <p>
            LAST SEEN · NOVA OS
            <br />
            시나리오: 사용자 제공 기획 기반
            <br />
            인터페이스 / 벡터 아트 / 코드: Codex와 공동 제작
          </p>
          <p>
            등장인물·업체·장소는 허구입니다.
            <br />
            사진은 벡터 재구성 이미지, 녹음은 음성 합성 재연입니다.
            <br />
            Apple의 로고나 기본 배경·아이콘은 사용하지 않았습니다.
          </p>
        </>
      ) : (
        <p>
          Dock은 한 번 클릭, 바탕화면은 두 번 클릭 또는 Enter로 실행합니다.
          <br />창 제목을 드래그하거나 두 번 클릭해 크기를 전환하세요. ESC는
          활성 창을 닫습니다.
          <br />
          <br />
          대화 → 삭제 파일 → 사진과 메모 → 프로젝트 → 초안 메일 순서로 기록을
          연결하세요.
          <br />
          증거 보드에서 연결된 단서를 확인할 수 있습니다.
        </p>
      )}
    </Dialog>
  );
  if (stage === "menu")
    return (
      <main className="main-menu">
        <p className="eyebrow">A SCREENLIFE MYSTERY</p>
        <h1>LAST SEEN</h1>
        <p>3일 전, 그는 마지막으로 온라인이었다.</p>
        <nav>
          <button
            disabled={!s.loggedIn}
            onClick={() => {
              sound("boot");
              setStage("boot");
            }}
          >
            CONTINUE{" "}
            <small>
              {s.loggedIn ? `CHAPTER ${phase}` : "저장된 기록 없음"}
            </small>
          </button>
          <button onClick={() => (s.loggedIn ? setDialog("reset") : newGame())}>
            NEW GAME
          </button>
          <button onClick={() => setDialog("settings")}>SETTINGS</button>
          <button onClick={() => setDialog("credits")}>CREDITS</button>
        </nav>
        <small>헤드폰 권장 · PC 브라우저에 최적화</small>
        {modal}
      </main>
    );
  if (stage === "boot")
    return (
      <main className="boot">
        <h1>NOVA</h1>
        <div className="boot-progress" />
        <small>개인 작업 공간을 불러오는 중</small>
      </main>
    );
  if (stage === "login")
    return (
      <main className="lock react-lock">
        <div className="login-card">
          <div className="avatar large">S</div>
          <h2>HAN SEOJUN</h2>
          <form
            className={error ? "shake" : ""}
            onSubmit={(e) => {
              e.preventDefault();
              if (password !== "0617") {
                setError(true);
                sound("error");
                return;
              }
              setState({ ...getState(), loggedIn: true });
              sound("unlock");
              setStage("desktop");
              notifications.notify("minjae", "너 서준이 노트북 가지고 있어?");
            }}
          >
            <div className="password">
              <input
                autoFocus
                aria-label="노트북 비밀번호"
                placeholder="비밀번호"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
              />
              <button aria-label="로그인">→</button>
            </div>
            <p role="alert">{error ? "Password incorrect" : ""}</p>
          </form>
          <div className="sticky">
            내가 내일까지 연락이 없으면,
            <br />내 노트북을 확인해.<strong>0617</strong>
          </div>
        </div>
        <footer>
          NOVA OS <button onClick={() => setStage("menu")}>메인 메뉴</button>
        </footer>
      </main>
    );
  if (s.ending) {
    const end = endings[s.ending];
    return (
      <main className="ending">
        <p className="eyebrow">{s.ending.toUpperCase()} ENDING</p>
        <h1>{end.title}</h1>
        <p>{end.body}</p>
        <blockquote>{end.message}</blockquote>
        <small>Last seen 3 days ago</small>
        {s.ending === "true" && s.flags.includes("hiddenEnding") && (
          <div className="hidden-record">
            N_02
            <br />
            PROJECT_N wasn't the first one.
          </div>
        )}
        <div>
          <button onClick={() => setState({ ...getState(), ending: null })}>
            조사로 돌아가기
          </button>
          <button onClick={() => setStage("menu")}>메인 메뉴</button>
        </div>
      </main>
    );
  }
  const menuItems =
    menu === "nova"
      ? [
          ["이 NOVA에 관하여", () => setDialog("credits")],
          ["시스템 설정…", () => setDialog("settings")],
          ["메인 메뉴", () => setStage("menu")],
        ]
      : menu === "file"
        ? [
            ["파일 열기", () => open("files")],
            ["메모 열기", () => open("notes")],
          ]
        : menu === "view"
          ? [
              [
                "데스크탑 보기",
                () => wm.windows.forEach((w) => wm.minimizeWindow(w.id)),
              ],
              ["증거 보드", () => open("evidence")],
            ]
          : menu === "window"
            ? wm.windows.map((w) => [
                apps.find((a) => a[0] === w.id)![1],
                () => wm.focusWindow(w.id),
              ])
            : [["사용 안내", () => setDialog("help")]];
  return (
    <main
      className="desktop nova-desktop"
      onPointerDown={(e) => {
        if (!(e.target as HTMLElement).closest(".topbar,.shell-dropdown"))
          setMenu("");
      }}
    >
      <EventEngine notify={notifications.notify} />
      <DialogueRuntime notify={notifications.notify}/>
      <CaseFeed openContact={id=>{setContact(id);open('messenger');}}/>
      <header className="topbar">
        <div>
          <button
            className="nova-menu"
            onClick={() => setMenu(menu === "nova" ? "" : "nova")}
          >
            NOVA
          </button>
          <span>
            {active ? apps.find((a) => a[0] === active.id)?.[1] : "Finder"}
          </span>
          {[
            ["file", "File"],
            ["view", "View"],
            ["window", "Window"],
            ["help", "Help"],
          ].map(([id, name]) => (
            <button
              key={id}
              onClick={() => setMenu(menu === id ? "" : id)}
              aria-expanded={menu === id}
            >
              {name}
            </button>
          ))}
        </div>
        <div>
          <button aria-label="검색" onClick={() => open("browser")}>
            ⌕
          </button>
          <button aria-label="소리 설정" onClick={() => setDialog("settings")}>
            ⌁ &nbsp; ▰ 84%
          </button>
          <span>
            {["21:32", "21:32", "21:46", "22:18", "23:47", "00:31","00:48"][phase]}{" "}
            &nbsp; {phase >= 5 ? "Oct 19" : "Oct 18"}
          </span>
        </div>
      </header>
      {menu && (
        <div className="shell-dropdown" role="menu">
          {menuItems.length ? (
            menuItems.map(([label, action], i) => (
              <button
                key={i}
                role="menuitem"
                onClick={() => {
                  (action as () => void)();
                  setMenu("");
                }}
              >
                {label as string}
              </button>
            ))
          ) : (
            <span>열린 창 없음</span>
          )}
        </div>
      )}
      <div className="desktop-shortcuts">
        {[
          ["files", "PROJECT"],
          ["notes", "README.txt"],
          ["trash", "Trash"],
        ].map(([id, title]) => (
          <button
            key={id}
            className={selection === id ? "selected" : ""}
            onClick={() => setSelection(id)}
            onDoubleClick={() => open(id as AppId)}
            onKeyDown={(e) => {
              if (e.key === "Enter") open(id as AppId);
            }}
          >
            <span
              className="desktop-art"
              dangerouslySetInnerHTML={{ __html: icons[id as AppId] }}
            />
            <b>{title}</b>
          </button>
        ))}
      </div>
      {wm.windows.map((w) => (
        <Window
          key={w.id}
          state={w}
          title={apps.find((a) => a[0] === w.id)![1]}
          manager={wm}
        >
          <AppContent id={w.id} contact={contact} />
        </Window>
      ))}
      <nav className="dock" aria-label="앱">
        {apps.map(([id, label]) => (
          <button
            key={id}
            className={wm.windows.some((w) => w.id === id) ? "running" : ""}
            onClick={() => open(id)}
            aria-label={label}
          >
            <Icon id={id} />
            <small>{label}</small>
            {id === "evidence" && !!s.evidence.length && (
              <em>{s.evidence.length}</em>
            )}
          </button>
        ))}
      </nav>
      <span className="save-state" role="status">
        {getStorageError()
          ? "저장 실패 · 브라우저 저장 공간을 확인하세요"
          : "이 브라우저에 자동 저장됨"}
      </span>
      {notifications.queue[0] && (
        <Notification
          item={notifications.queue[0]}
          onClick={() => {
            setContact(notifications.queue[0].contact);
            open("messenger");
            notifications.dismiss();
          }}
        />
      )}
      {import.meta.env.DEV && (
        <details className="debug">
          <summary>DEV · Chapter {phase}</summary>
          <pre>
            {JSON.stringify({ flags: s.flags, evidence: s.evidence,relationships:s.story.relationships,memory:s.story.memoryFlags,choices:s.story.selectedChoices,pending:s.story.pending }, null, 2)}
          </pre>
          <button onClick={() => setDialog("reset")}>Reset</button>
        </details>
      )}
      {modal}
    </main>
  );
}
