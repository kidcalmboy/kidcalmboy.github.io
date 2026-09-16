import { useState } from "react";
import { notes, searchPages } from "../data/story";
import { addTo, unlockFile, useGame } from "../game/store";
import { EvidenceButton } from "./shared";
export function Notes() {
  const s = useGame(),
    [selected, setSelected] = useState("todo");
  const note = notes.find((n) => n.id === selected)!;
  return (
    <div className="split-app">
      <aside>
        <h3>메모</h3>
        {notes.map((n) => (
          <button
            key={n.id}
            className={n.id === selected ? "selected" : ""}
            onClick={() => setSelected(n.id)}
          >
            {n.title}
            {n.flag && !s.flags.includes(n.flag) ? " 🔒" : ""}
          </button>
        ))}
      </aside>
      <article className="document">
        <h2>{note.title}</h2>
        <pre>
          {note.flag && !s.flags.includes(note.flag)
            ? "첨부 자료 확인 후 보안 메모가 동기화됩니다."
            : note.text}
        </pre>
      </article>
    </div>
  );
}
export {Browser} from './Browser';
export function Mail() {
  const s = useGame(),
    [box, setBox] = useState("Inbox"),
    [selected, setSelected] = useState("library"),
    [password, setPassword] = useState(""),
    [error, setError] = useState("");
  const items =
    box === "Inbox"
      ? [
          ["library", "도서 반납 예정일 안내"],
          ["delivery", "예약 접수가 완료되었습니다."],
        ]
      : box === "Drafts" && s.flags.includes("projectUnlocked")
        ? [["draft", "제보하고 싶은 게 있습니다."]]
        : box === "Sent"
          ? [["professor", "중간 발표 일정 문의"]]
          : [];
  return (
    <div className="mail-app">
      <aside>
        {["Inbox", "Drafts", "Sent", "Archive"].map((b) => (
          <button
            key={b}
            onClick={() => {
              setBox(b);
              setSelected("");
            }}
          >
            {b}
          </button>
        ))}
      </aside>
      <nav className="mail-list">
        {items.map(([id, title]) => (
          <button
            key={id}
            onClick={() => {
              setSelected(id);
              addTo("read", `mail-${id}`);
            }}
          >
            <small>{id === "draft" ? "미발송 초안" : "2028.10.15"}</small>
            {title}
          </button>
        ))}
        {!items.length && <p className="dim">메일이 없습니다.</p>}
      </nav>
      <article className="document">
        {selected === "library" ? (
          <>
            <h2>도서 반납 예정일 안내</h2>
            <p>대출 도서의 반납 예정일은 10월 17일입니다.</p>
          </>
        ) : selected === "delivery" ? (
          <>
            <h2>예약 접수가 완료되었습니다.</h2>
            <p>
              보낸 사람: 한서준
              <br />
              물품: 노트북 1대
              <br />
              발송 조건: 10월 18일까지 미취소 시 지정 수신인에게 전달
            </p>
            <EvidenceButton id="delivery" />
          </>
        ) : selected === "professor" ? (
          <>
            <h2>중간 발표 일정 문의</h2>
            <p>
              교수님 안녕하세요. 컴퓨터공학과 한서준입니다.
              <br />
              21일 발표에 사용 가능한 강의실을 문의드립니다.
            </p>
          </>
        ) : selected === "draft" ? (
          <>
            <small>받는 사람: 강도윤 · 사회부 / 미발송</small>
            <h2>제보하고 싶은 게 있습니다.</h2>
            <p>
              리뷰 데이터 프로젝트를 진행하다가 이상한 네트워크를 발견했습니다.
              단순 광고 계정은 아닌 것 같습니다.
            </p>
            <EvidenceButton id="draft_email" />
            <hr />
            <h3>첨부파일 · evidence.zip</h3>
            {s.flags.includes('zipUnlocked')&&s.flags.includes('paymentQuarantined')&&!s.restored.includes('payment')?<p className="missing-file">payment_1012.txt · 공유 사본을 찾을 수 없습니다. 휴지통의 로컬 복구본을 확인하세요.</p>:s.flags.includes("zipUnlocked") ? (
              <>
                <h3>payment_1012.txt</h3>
                <pre>
                  N Reputation → 박지훈{"\n"}2028.10.12 / 2,400,000원{"\n"}지급
                  사유: 계정 자동화 운영
                </pre>
                <p>
                  업체: 삭제 요청 안 받으면 다음 주에도 같은 방식으로 해.
                  <br />
                  지훈: 이거 협박으로 문제 생기는 거 아니에요?
                  <br />
                  업체: 넌 프로그램만 돌려.
                  <br />
                  지훈: 알겠습니다. 다음 주분 예약해 둘게요.
                </p>
                <EvidenceButton id="jihoon_payment" />
              </>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setError(
                    unlockFile("zipUnlocked", password)
                      ? ""
                      : "암호가 일치하지 않습니다. Notes의 PROJECT 메모를 확인하세요.",
                  );
                }}
              >
                <p>암호 힌트: 우리가 처음 발견한 계정</p>
                <input
                  aria-label="ZIP 암호"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button>압축 열기</button>
                <p role="alert">{error}</p>
              </form>
            )}
          </>
        ) : (
          <p className="dim">메일을 선택하세요.</p>
        )}
      </article>
    </div>
  );
}
