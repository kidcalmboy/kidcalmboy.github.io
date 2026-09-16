import { useState, type ReactNode } from "react";
import type { AppId } from "../game/model";
export interface WindowState {
  id: AppId;
  x: number;
  y: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}
export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const focusWindow = (id: AppId) =>
    setWindows((ws) =>
      ws.map((w) =>
        w.id === id
          ? {
              ...w,
              z: Math.max(0, ...ws.map((x) => x.z)) + 1,
              minimized: false,
            }
          : w,
      ),
    );
  const openWindow = (id: AppId) =>
    setWindows((ws) => {
      const z = Math.max(0, ...ws.map((w) => w.z)) + 1;
      return ws.some((w) => w.id === id)
        ? ws.map((w) => (w.id === id ? { ...w, minimized: false, z } : w))
        : [
            ...ws,
            {
              id,
              x: Math.min(110 + ws.length * 24, Math.max(0, innerWidth - 930)),
              y: 65 + (ws.length % 5) * 24,
              z,
              minimized: false,
              maximized: false,
            },
          ];
    });
  const closeWindow = (id: AppId) =>
    setWindows((ws) => ws.filter((w) => w.id !== id));
  const minimizeWindow = (id: AppId) =>
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    );
  const maximizeWindow = (id: AppId) =>
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
    );
  const moveWindow = (id: AppId, x: number, y: number) =>
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    maximizeWindow,
    moveWindow,
    clear: () => setWindows([]),
  };
}
export type WindowManager = ReturnType<typeof useWindowManager>;
export function Window({
  state,
  title,
  manager,
  children,
}: {
  state: WindowState;
  title: string;
  manager: WindowManager;
  children: ReactNode;
}) {
  const front =
    manager.windows.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0]
      ?.id === state.id;
  return (
    <section
      className={`nova-window ${front ? "active" : ""} ${state.maximized ? "maximized" : ""}`}
      style={{
        left: state.maximized ? 8 : state.x,
        top: state.maximized ? 38 : state.y,
        zIndex: 10 + state.z,
        display: state.minimized ? "none" : undefined,
      }}
      aria-label={title}
      onPointerDown={() => {
        if (!front) manager.focusWindow(state.id);
      }}
    >
      <header
        className="window-bar"
        onPointerDown={(e) => {
          if (state.maximized || (e.target as HTMLElement).closest("button"))
            return;
          const header = e.currentTarget,
            rect = header.parentElement!.getBoundingClientRect(),
            start = { x: e.clientX, y: e.clientY };
          header.setPointerCapture(e.pointerId);
          header.onpointermove = (event) =>
            manager.moveWindow(
              state.id,
              Math.max(
                0,
                Math.min(
                  innerWidth - rect.width,
                  rect.left + event.clientX - start.x,
                ),
              ),
              Math.max(
                33,
                Math.min(innerHeight - 130, rect.top + event.clientY - start.y),
              ),
            );
          header.onpointerup = header.onpointercancel = () => {
            header.onpointermove = null;
          };
        }}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest("button"))
            manager.maximizeWindow(state.id);
        }}
      >
        <div className="window-controls">
          <button
            aria-label={`${title} 닫기`}
            onClick={() => manager.closeWindow(state.id)}
          >
            ×
          </button>
          <button
            aria-label={`${title} 최소화`}
            onClick={() => manager.minimizeWindow(state.id)}
          >
            −
          </button>
          <button
            aria-label={`${title} 크기 전환`}
            onClick={() => manager.maximizeWindow(state.id)}
          >
            ↗
          </button>
        </div>
        <span>{title}</span>
        <small>NOVA OS</small>
      </header>
      <div className="window-content">{children}</div>
    </section>
  );
}
