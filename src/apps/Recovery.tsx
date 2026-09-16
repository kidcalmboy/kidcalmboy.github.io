import { useEffect, useState } from "react";
import { addTo, updateFlag, useGame } from "../game/store";
import { transcript } from "../data/story";
import { EvidenceButton } from "./shared";
export function Recording() {
  const s = useGame(),
    [playing, setPlaying] = useState(false),
    [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        setElapsed((t) => {
          if (t >= 19) {
            setPlaying(false);
            return 20;
          }
          return t + 1;
        }),
      1000 / s.settings.textSpeed,
    );
    return () => clearInterval(timer);
  }, [playing, s.settings.textSpeed]);
  // The timed transcript is always available, including on systems without speech voices.
  useEffect(() => {
    if (!playing || !("speechSynthesis" in window)) return;
    const row = transcript[Math.floor(elapsed / 4)];
    if (!row) return;
    const u = new SpeechSynthesisUtterance(row[1]);
    u.lang = "ko-KR";
    u.rate = 0.9 * s.settings.textSpeed;
    u.volume = s.settings.master * s.settings.sfx;
    window.speechSynthesis.speak(u);
    return () => window.speechSynthesis.cancel();
  }, [
    playing,
    Math.floor(elapsed / 4),
    s.settings.master,
    s.settings.sfx,
    s.settings.textSpeed,
  ]);
  return (
    <section className="recording">
      <h3>2028_10_15_2314.m4a</h3>
      <p className="dim">복원 기록 · 음성 합성 재연 / 원문 자막 제공</p>
      <button
        onClick={() => {
          if (elapsed >= 20) setElapsed(0);
          setPlaying(!playing);
        }}
      >
        {playing ? "Ⅱ 일시 정지" : "▶ 재생"}
      </button>
      <progress max="20" value={elapsed} />
      <span>00:{String(elapsed).padStart(2, "0")} / 00:20</span>
      <div>
        {transcript.map(([who, text], i) => (
          <p key={i} className={elapsed >= i * 4 ? "" : "dim"}>
            <b>{who}</b> {text}
          </p>
        ))}
      </div>
      <EvidenceButton id="final_audio" />
    </section>
  );
}
export function Trash() {
  const s = useGame(),
    [selected, setSelected] = useState("");
  const unlocked = s.evidence.includes("minjae_chat");
  const items = [
    {id:'payment',name:'payment_1012_recovery.txt',available:s.flags.includes('paymentQuarantined')&&s.flags.includes('zipUnlocked')},
    { id: "draft", name: "발표초안.txt", available: true },
    { id: "receipt", name: "receipt_old.jpg", available: unlocked },
    {
      id: "chat",
      name: "deleted_chat.txt",
      available: s.flags.includes("zipUnlocked"),
    },
    {
      id: "audio",
      name: "voice_temp.m4a",
      available: s.flags.includes("zipUnlocked"),
    },
    {
      id: "location",
      name: "location_sync.json",
      available: s.flags.includes("audioRestored"),
    },
  ].filter((x) => x.available);
  function restore(id: string) {
    addTo("restored", id);
    if (id === "receipt") updateFlag("receiptRestored");
    if (id === "audio") updateFlag("audioRestored");
    if (id === "location") updateFlag("locationRestored");
    setSelected(id);
  }
  return (
    <article className="document">
      <p className="eyebrow">RECOVERY / {items.length} FILES</p>
      <h2>삭제된 기록</h2>
      {items.map((item) => (
        <div className="recovery-row" key={item.id}>
          <button onClick={() => setSelected(item.id)}>▤ {item.name}</button>
          <button
            onClick={() => restore(item.id)}
            disabled={s.restored.includes(item.id)}
          >
            {s.restored.includes(item.id) ? "✓ 복원됨" : "복원"}
          </button>
        </div>
      ))}
      {!unlocked && (
        <p className="dim">
          동기화된 대화 기록을 조사하면 연결된 삭제 파일을 찾을 수 있습니다.
        </p>
      )}
      {selected && s.restored.includes(selected) && (
        <section className="recovered">
          {selected==='payment'?<><h3>로컬 송금 기록 복원</h3><p>N Reputation → 박지훈 / 2028.10.12 / 2,400,000원<br/>자동화 운영 개발비. 삭제 시도 이전 로컬 백업.</p><EvidenceButton id="jihoon_payment"/></>:selected === "receipt" ? (
            <>
              <h3>BLUE ROOM · 22:47</h3>
              <p>
                2028.10.15 / 아메리카노 4,500 / 카페라떼 5,000
                <br />
                촬영: 22:48. 원본이 Photos 보관함으로 돌아왔습니다.
              </p>
              <EvidenceButton id="receipt_2247" />
            </>
          ) : selected === "audio" ? (
            <Recording />
          ) : selected === "location" ? (
            <>
              <h3>location_sync.json</h3>
              <pre>
                2028-10-15T23:16:02{"\n"}site: cheongun_B_basement{"\n"}source:
                seojun_mobile_cloud
              </pre>
              <p>지도 앱에 복원된 좌표가 표시됩니다.</p>
            </>
          ) : selected === "chat" ? (
            <p>
              박지훈 · 22:44
              <br />
              뒤쪽 청운물류 계단으로 와. 사람 없는 데서 얘기하자.
            </p>
          ) : (
            <p>발표 순서: 개요, 수집 방식, 결과, 질의응답</p>
          )}
        </section>
      )}
    </article>
  );
}
export function Maps() {
  const s = useGame(),
    [place, setPlace] = useState("blue");
  const places = [
    ...(s.flags.includes('riversideUnlocked')?[{id:'riverside',name:'RIVERSIDE PARKING',x:76,y:78,desc:'지훈이 제안한 강변 주차장. 직접 이동하지 않고 Evidence에서 접근 전략을 결정할 수 있다.'}]:[]),
    ...(s.flags.includes('confessionLocation')&&!s.flags.includes('locationRestored')?[{id:'confession_site',name:'청운물류 B동 · 진술',x:58,y:63,desc:'지훈의 자백에서 언급된 장소. 독립된 동기화 좌표는 아직 복원되지 않았다.'}]:[]),
    {
      id: "blue",
      name: "BLUE ROOM",
      x: 38,
      y: 48,
      desc: "청운로 17. 카페 뒤편에 청운물류 진입로가 있다.",
    },
    {
      id: "university",
      name: "대학교",
      x: 18,
      y: 23,
      desc: "서준과 친구들이 다니는 대학교.",
    },
    {
      id: "home",
      name: "서준 집",
      x: 72,
      y: 26,
      desc: "노트북 배송이 접수된 장소.",
    },
    {
      id: "minjae",
      name: "민재 집",
      x: 15,
      y: 76,
      desc: "민재가 메시지에서 귀가했다고 주장한 장소.",
    },
    ...(s.flags.includes("locationRestored")
      ? [
          {
            id: "hidden",
            name: "청운물류 B동",
            x: 58,
            y: 63,
            desc: "마지막 동기화: 10월 15일 23:16. 지하 계단.",
          },
        ]
      : []),
  ];
  const target = places.find((p) => p.id === place)!;
  return (
    <article className="document">
      <p className="eyebrow">NOVA MAPS / 저장된 지도</p>
      <div className="investigation-map">
        {places.map((p) => (
          <button
            key={p.id}
            style={{ left: p.x + "%", top: p.y + "%" }}
            onClick={() => setPlace(p.id)}
          >
            <span>⌖</span>
            {p.name}
          </button>
        ))}
      </div>
      <h2>{target.name}</h2>
      <p>{target.desc}</p>
      {place === "blue" && s.flags.includes("deduction-route") && (
        <section className="route-comparison">
          <h3>사진에서 확인한 경로</h3>
          <p>BLUE ROOM 옆 표지판 → 청운물류 B동 → B1 야간 출입구</p>
          <small>
            사진으로 확인한 건물 경로입니다. 실제 마지막 위치는 동기화 기록과
            대조해야 합니다.
          </small>
        </section>
      )}
      {place === "hidden" && <EvidenceButton id="hidden_location" />}
      <small>실제 좌표가 아닌 게임 속 가상 지도입니다.</small>
    </article>
  );
}
