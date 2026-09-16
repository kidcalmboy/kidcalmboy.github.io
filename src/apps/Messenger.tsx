import { useEffect, useRef, useState } from "react";
import { characters, events, messages } from "../data/story";
import { addTo, getState,setState,useGame } from "../game/store";
import { EvidenceButton } from "./shared";
import {ReplyPanel} from './ReplyPanel';
export function Messenger({ selected = "minjae" }: { selected?: string }) {
  const s = useGame(),
    [contact, setContact] = useState(selected),
    [search, setSearch] = useState(""),
    bottom = useRef<HTMLDivElement>(null);
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(!root.current?.closest('.nova-window.active')||document.visibilityState!=='visible')return;const ids=s.story.history.filter(m=>m.contact===contact&&m.deleteAt&&!m.deleted&&!s.story.deletedSeen.includes(m.id)).map(m=>m.id);if(ids.length){const latest=getState();setState({...latest,story:{...latest.story,deletedSeen:[...latest.story.deletedSeen,...ids]}});}},[contact,s.story.history]);
  useEffect(() => setContact(selected), [selected]);
  useEffect(() => {
    if (!s.read.includes(contact)) addTo("read", contact);
  }, [contact, s.read]);
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest" });
  }, [contact, s.events.length,s.story.history.length]);
  const list = characters.filter(
    (c) => c.id !== "unknown" || s.flags.includes("projectUnlocked"),
  );
  const rows = [
    ...(messages[contact] || []),
    ...events
      .filter((e) => e.contact === contact && s.events.includes(e.id))
      .map((e) => ({
        who: contact,
        text: e.text,
        time: "지금",
        date: "10월 18일",
      })),
  ].filter((m) => m.text.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="messenger" ref={root}>
      <aside>
        <div className="aside-heading">메시지</div>
        <input
          className="app-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="대화 검색"
          aria-label="대화 검색"
        />
        {list.map((c) => (
          <button
            key={c.id}
            className={`contact ${c.id === contact ? "selected" : ""}`}
            onClick={() => setContact(c.id)}
          >
            <span className={`avatar ${c.id}`}>{c.initials}</span>
            <span>
              <b>{c.name}</b>
              <small>{messages[c.id]?.at(-1)?.text}</small>
            </span>
            {!s.read.includes(c.id) && <i />}
          </button>
        ))}
      </aside>
      <section className="conversation">
        <header>
          <span className={`avatar ${contact}`}>
            {characters.find((c) => c.id === contact)?.initials}
          </span>
          <div>
            <b>{characters.find((c) => c.id === contact)?.name}</b>
            <small>로컬 기록 · 마지막 동기화 10월 18일</small>
          </div>
        </header>
        <div className="messages">
          {rows.map((m, i) => (
            <div key={`${contact}-${i}`}>
              {m.date && <p className="date">{m.date}</p>}
              {m.who === "deleted" ? (
                <p className="deleted">
                  {s.restored.includes("chat")
                    ? "복원된 메시지: 뒤쪽 청운물류 계단으로 와. 사람 없는 데서 얘기하자."
                    : m.text}
                </p>
              ) : (
                <div
                  className={`message ${m.who === "seojun" ? "me" : "them"}`}
                >
                  <p>{m.text}</p>
                  <time>{m.time}</time>
                </div>
              )}
            </div>
          ))}
          {!rows.length && <p className="dim">검색 결과가 없습니다.</p>}
          {s.story.history.some(m=>m.contact===contact)&&<p className="date live-divider">현재 대화 · You</p>}
          {s.story.history.filter(m=>m.contact===contact&&m.text.toLowerCase().includes(search.toLowerCase())).map(m=><div key={m.id} className={m.sender==='silence'?'silence-record':`message ${m.sender==='you'?'me player-reply':'them'}`}><p>{m.sender==='silence'?'[답하지 않음]':m.text}</p>{m.sender==='you'&&<time>You</time>}</div>)}
          <div ref={bottom} />
        </div>
        <footer>
          {contact === "minjae" ? (
            <EvidenceButton id="minjae_chat" />
          ) : (
            <span className="dim">보관 기록 + 현재 대화</span>
          )}
          <span>선택한 답장은 기록에 남습니다</span>
        </footer>
        <ReplyPanel contact={contact}/>
      </section>
    </div>
  );
}
