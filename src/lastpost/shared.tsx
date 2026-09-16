import { useEffect, useRef, type ReactNode } from "react";
import { person } from "./data";
import { addNote, type Note } from "./engine";
import { toast, update, useGame } from "./store";
export const img = (name: string) =>
  `${import.meta.env.BASE_URL}lastpost/${name}.png`;
export type Navigate = (target: string) => void;
const paths: Record<string, ReactNode> = {
  home: (
    <>
      <path d="m3 10 9-7 9 7v11h-6v-7H9v7H3z" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="7" />
      <path d="m16 16 5 5" />
    </>
  ),
  explore: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m16 8-3 5-5 3 3-5z" />
    </>
  ),
  messages: (
    <>
      <path d="M21 11a9 9 0 0 1-9 9H4l-2 2v-11a9 9 0 0 1 19 0Z" />
      <path d="M7 10h10M7 14h6" />
    </>
  ),
  heart: <path d="M12 21 3 12C-2 5 7 0 12 7c5-7 14-2 9 5Z" />,
  save: <path d="M6 3h12v19l-6-4-6 4z" />,
  archive: (
    <>
      <rect x="4" y="7" width="16" height="14" rx="2" />
      <path d="M3 3h18v4H3zM9 12h6" />
    </>
  ),
  activity: (
    <>
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 22v-3a8 8 0 0 1 16 0v3" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
  notes: (
    <>
      <rect x="5" y="2" width="15" height="20" rx="2" />
      <path d="M8 7h9M8 11h9M8 15h6M2 6h5M2 12h5M2 18h5" />
    </>
  ),
  moment: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="6" />
      <circle cx="12" cy="12" r="4" />
      <path d="m18 6 .1.1" />
    </>
  ),
  browser: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 8-2 5-5 3 2-5z" />
    </>
  ),
  bell: (
    <>
      <path d="M5 17h14l-2-4V8a5 5 0 0 0-10 0v5zM10 21h4" />
    </>
  ),
  send: (
    <>
      <path d="m2 3 20 9-20 9 4-9zM6 12h16" />
    </>
  ),
};
export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.profile}
    </svg>
  );
}
export function Avatar({ id, large = false }: { id: string; large?: boolean }) {
  const p = person(id);
  return (
    <span
      className={`lp-avatar avatar-${id} ${large ? "large" : ""}`}
      style={{ background: p.color }}
    >
      {id === "youna" ? (
        <img src={img("birthday")} alt="" />
      ) : id === "minsuk" ? (
        <img src={img("event")} alt="" />
      ) : (
        p.name.slice(0, 1)
      )}
    </span>
  );
}
export function Save({
  id,
  title,
  body,
  source,
  category = "Leads",
  time = "",
  fact,
}: {
  id: string;
  title: string;
  body: string;
  source: string;
  category?: string;
  time?: string;
  fact?: string;
}) {
  const s = useGame(),
    saved = s.notes.some((n) => n.id === id);
  return (
    <button
      className={`lp-save ${saved ? "saved" : ""}`}
      aria-label={`${saved ? "Saved" : "Save to Notes"}: ${title}`}
      title="Save to Notes"
      onClick={() => {
        update((s) =>
          addNote(s, { id, title, body, source, category, time, fact }),
        );
        toast(saved ? "Already in Notes" : "Saved to Notes");
      }}
    >
      <Icon name="save" size={16} />
      <span>{saved ? "Saved" : "Save to Notes"}</span>
    </button>
  );
}
export function Modal({
  title,
  close,
  children,
  wide = false,
}: {
  title: string;
  close: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const old = document.activeElement as HTMLElement;
    ref.current?.focus();
    return () => old?.focus();
  }, []);
  return (
    <div
      className="lp-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className={`lp-modal ${wide ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            close();
          }
          if (e.key === "Tab") {
            const a = Array.from(
              ref.current?.querySelectorAll<HTMLElement>(
                'button:not(:disabled),input,textarea,[tabindex="0"]',
              ) || [],
            );
            if (!a.length) return;
            const first = a[0],
              last = a[a.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <header>
          <b>{title}</b>
          <button aria-label="모달 닫기" title="닫기" onClick={close}>
            ×
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
export function SourceCard({
  note,
  navigate,
}: {
  note: Note;
  navigate: Navigate;
}) {
  return (
    <button className="lp-source-card" onClick={() => navigate(note.source)}>
      <small>{note.source.startsWith("article:") ? "NORTH" : "MOMENT"} ↗</small>
      <b>{note.title}</b>
      <p>{note.body}</p>
      <time>{note.time}</time>
    </button>
  );
}
