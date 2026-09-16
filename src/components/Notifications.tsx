import { useCallback, useEffect, useState } from "react";
import { characters } from "../data/story";
import { sound } from "../game/audio";
export function useNotifications() {
  const [queue, setQueue] = useState<
    Array<{ id: number; contact: string; text: string }>
  >([]);
  const notify = useCallback((contact: string, text: string) => {
    setQueue((q) => [...q, { id: Date.now() + Math.random(), contact, text }]);
    sound("notification");
  }, []);
  const dismiss = useCallback(() => setQueue((q) => q.slice(1)), []);
  useEffect(() => {
    if (!queue.length) return;
    const timer = setTimeout(dismiss, 4000);
    return () => clearTimeout(timer);
  }, [queue[0]?.id, dismiss]);
  return { queue, notify, dismiss, clear: () => setQueue([]) };
}
export function Notification({
  item,
  onClick,
}: {
  item: { contact: string; text: string };
  onClick: () => void;
}) {
  return (
    <button className="notification" onClick={onClick}>
      <span className="avatar">
        {characters.find((c) => c.id === item.contact)?.initials || "N"}
      </span>
      <span>
        <small>
          MESSENGER ·{" "}
          {characters.find((c) => c.id === item.contact)?.name || "NOVA"}
        </small>
        {item.text}
      </span>
      <b>↗</b>
    </button>
  );
}
