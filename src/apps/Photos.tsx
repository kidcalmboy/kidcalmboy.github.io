import { useState } from "react";
import { photos, type Photo } from "../data/photos";
import { useGame } from "../game/store";
import { EvidenceButton } from "./shared";
export function PhotoArt({ photo }: { photo: Photo }) {
  if (photo.kind === "chat")
    return (
      <div className="transit-capture" role="img" aria-label={photo.caption}>
        <small>하린이 공유한 대화 캡처</small>
        <h2>한서준</h2>
        <p>프로젝트 자료는 지우지 말고 따로 보관해 둬.</p>
        <p>내가 연락이 안 되면 노트북부터 확인해.</p>
        <hr />
        <small>개인 대화 · 보관된 사본</small>
      </div>
    );
  if (photo.kind === "transit")
    return (
      <div className="transit-capture" role="img" aria-label={photo.caption}>
        <small>교통 이용 내역 · 김민재</small>
        <h2>10월 15일</h2>
        <p>
          청운역 <b>22:09 승차</b>
        </p>
        <div className="transit-line" />
        <p>
          솔빛역 <b>22:19 하차</b>
        </p>
        <hr />
        <small>민재가 공유한 화면 캡처</small>
      </div>
    );
  if (photo.kind === "stairs")
    return (
      <svg
        className="photo-art"
        viewBox="0 0 480 320"
        role="img"
        aria-label={photo.caption}
      >
        <rect width="480" height="320" fill="#253137" />
        <path
          d="M40 320V240h65v-40h65v-40h65v-40h70v-40h100v240"
          fill="#596466"
        />
        <path d="m40 238 365-178" stroke="#a0aaaa" strokeWidth="6" />
        <rect x="48" y="25" width="155" height="64" fill="#d2cabc" />
        <text x="60" y="50" fontSize="15" fill="#333">
          청운물류 B동
        </text>
        <text x="60" y="73" fontSize="13" fill="#333">
          B1 · 야간 출입구
        </text>
      </svg>
    );
  if (photo.kind === "receipt")
    return (
      <div className="receipt">
        <span>COFFEE & RECORDS</span>
        <h2>BLUE ROOM</h2>
        <p>청운로 17 · 1F</p>
        <hr />
        <div>
          2028.10.15 <b>22:47</b>
        </div>
        <hr />
        <div>
          아메리카노 <span>4,500</span>
        </div>
        <div>
          카페라떼 <span>5,000</span>
        </div>
        <hr />
        <div>
          TOTAL <b>9,500</b>
        </div>
        <div className="barcode" />
        <small>004821-1015-2247</small>
      </div>
    );
  if (photo.kind === "orbit")
    return (
      <div className="orbit-photo">
        <span>UNIVERSITY HACKATHON / 2026</span>
        <h2>ORBIT</h2>
        <p>our first little universe.</p>
        <small>서준 · 민재 · 하린</small>
      </div>
    );
  const seed = photo.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return (
    <svg
      viewBox="0 0 480 320"
      className="photo-art"
      role="img"
      aria-label={photo.caption}
    >
      <rect
        width="480"
        height="320"
        fill={["#384656", "#615554", "#55646c"][seed % 3]}
      />
      <rect y="225" width="480" height="95" fill="#232e37" />
      {photo.kind === "coffee" ? (
        <>
          <ellipse cx="244" cy="250" rx="100" ry="22" fill="#b7ab96" />
          <path d="M178 113h124l-15 124h-94z" fill="#ded8c9" />
          <ellipse cx="240" cy="115" rx="62" ry="16" fill="#5f4233" />
          <path
            d="M302 140q55 0 15 65h-18"
            fill="none"
            stroke="#ded8c9"
            strokeWidth="15"
          />
        </>
      ) : photo.kind === "desk" ? (
        <>
          <path d="M113 80h255v152H113z" fill="#141c29" />
          <path d="M126 92h228v125H126z" fill="#7b8c95" />
          <path d="m113 232-40 22h331l-36-22" fill="#b4bec3" />
          <path
            d="M145 125h160m-160 22h97m-97 22h138"
            stroke="#d3dccf"
            strokeWidth="5"
          />
        </>
      ) : photo.kind === "plant" ? (
        <>
          <path d="M213 183h80l-10 83h-60z" fill="#b3967c" />
          <path
            d="M252 190V84m0 69q-60-3-62-48 51 0 62 48m0-20q65-2 58-57-51 10-58 57"
            stroke="#84977b"
            strokeWidth="8"
            fill="#657e67"
          />
        </>
      ) : (
        <>
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i}>
              <rect
                x={i * 75 - 10}
                y={90 + ((i * 31 + seed) % 85)}
                width="65"
                height="220"
                fill={i % 2 ? "#243645" : "#304251"}
              />
              {Array.from({ length: 8 }, (_, j) => (
                <rect
                  key={j}
                  x={i * 75 + (j % 3) * 17}
                  y={155 + Math.floor(j / 3) * 30}
                  width="5"
                  height="9"
                  fill="#cfbc8c"
                  opacity=".6"
                />
              ))}
            </g>
          ))}
          <circle cx="373" cy="48" r="16" fill="#d1c8bd" />
        </>
      )}
      {photo.kind === "cafe" && (
        <>
          <rect x="90" y="90" width="300" height="60" fill="#202b33" />
          <text
            x="240"
            y="127"
            fill="#dcd0b4"
            textAnchor="middle"
            fontSize="25"
          >
            BLUE ROOM
          </text>
          <text x="240" y="290" textAnchor="middle" fill="#ddd" fontSize="12">
            청운물류 B동 →
          </text>
        </>
      )}
    </svg>
  );
}
export function Photos() {
  const s = useGame(),
    list = photos.filter(
      (p) =>
        (!p.flag || s.flags.includes(p.flag)) &&
        (p.id !== "receipt" || s.flags.includes("receiptRestored")),
    ),
    [selected, setSelected] = useState<string | null>(null),
    [zoom, setZoom] = useState(false),
    [info, setInfo] = useState(true);
  const [inspected, setInspected] = useState<string[]>([]);
  const item = list.find((p) => p.id === selected);
  return (
    <div className="photo-library">
      <div className="toolbar">
        <button onClick={() => setSelected(null)}>
          모든 사진 · {list.length}
        </button>
        {item && (
          <>
            <button
              onClick={() => {
                const i = list.findIndex((p) => p.id === item.id);
                setSelected(list[(i + list.length - 1) % list.length].id);
              }}
            >
              ←
            </button>
            <button
              onClick={() => {
                const i = list.findIndex((p) => p.id === item.id);
                setSelected(list[(i + 1) % list.length].id);
              }}
            >
              →
            </button>
            <button onClick={() => setZoom(!zoom)} aria-pressed={zoom}>
              확대 / 축소
            </button>
            <button onClick={() => setInfo(!info)}>ⓘ 정보</button>
          </>
        )}
      </div>
      {item ? (
        <>
          <div className={`photo-stage ${zoom ? "large-photo" : ""}`}>
            <PhotoArt photo={item} />
          </div>
          {item.inspection && (
            <div className="photo-inspection">
              <button
                onClick={() =>
                  setInspected((ids) => [...new Set([...ids, item.id])])
                }
              >
                {item.inspection.label}
              </button>
              {inspected.includes(item.id) && <p>{item.inspection.text}</p>}
            </div>
          )}
          {info && (
            <div className="metadata">
              <div>
                <small>{item.title}</small>
                <b>{item.date}</b>
              </div>
              <div>
                <small>위치</small>
                <b>{item.location || "위치 정보 없음"}</b>
              </div>
              {item.evidenceId &&
                (!item.inspection ||
                  inspected.includes(item.id) ||
                  s.evidence.includes(item.evidenceId)) && (
                  <EvidenceButton id={item.evidenceId} />
                )}
            </div>
          )}
        </>
      ) : (
        <div className="photo-grid">
          {list.map((p) => (
            <button
              key={p.id}
              aria-label={p.title}
              onClick={() => {
                setSelected(p.id);
                setZoom(false);
              }}
            >
              <div>
                <PhotoArt photo={p} />
              </div>
              <small>{p.title}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
