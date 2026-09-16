import { useEffect, useRef } from "react";
import { events } from "../data/story";
import { getState, setState, useGame } from "./store";
export function EventEngine({
  notify,
}: {
  notify: (contact: string, text: string) => void;
}) {
  const state = useGame();
  const pending = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  useEffect(() => {
    for (const event of events) {
      if (
        !state.flags.includes(event.flag) ||
        state.events.includes(event.id) ||
        pending.current.has(event.id)
      )
        continue;
      pending.current.set(
        event.id,
        setTimeout(() => {
          pending.current.delete(event.id);
          const latest = getState();
          if (latest.events.includes(event.id)) return;
          setState({
            ...latest,
            events: [...latest.events, event.id],
            read: latest.read.filter((id) => id !== event.contact),
          });
          notify(event.contact, event.text);
        }, event.delay),
      );
    }
  }, [state.flags.join(","), state.events.join(","), notify]);
  useEffect(
    () => () => {
      pending.current.forEach(clearTimeout);
      pending.current.clear();
    },
    [],
  );
  return null;
}
