import { useState } from "react";
import { unlockFile, updateFlag, useGame } from "../game/store";
import { EvidenceButton } from "./shared";
import { sound } from "../game/audio";
const documents: Record<string, string> = {
  'harin_chat.txt':'하린이 전달한 캡처\n서준: 나 뭐 잘못 건드린 거 같다\n서준: 혹시 내가 갑자기 연락 안 되면\n하린: 뭐야 무섭게\n서준: 아니 그냥 ㅋㅋ',
  'journalist_analysis.txt':'비공개 검증 자료 / 강도윤\n계정 군집 A의 게시 시각은 6개 업체에서 30초 간격으로 반복된다.\n원본 데이터와 기사 공개용 사본은 분리해서 보관할 것.',
  'sharing_log.txt':'NOVA CLOUD / 2028-10-14\nPROJECT_N external sharing: disabled\nLocal watcher process: n_sync_agent\nOwner: JH\n\n외부 공유 알림은 중지됐지만 로컬 감시 프로그램은 남아 있다.',
  "accounts.csv":
    "account_id,reviews,group,first_seen\nnobody_404,114,A,2028-09-02\nbluefox_11,87,A,2028-09-03\nx_user119,92,A,2028-09-04",
  "review_network.json":
    '{\n  "cluster": "A",\n  "shared_targets": 6,\n  "posting_interval": "30 seconds",\n  "same_text": true,\n  "operator_contact": "N Reputation"\n}',
  "memo.txt":
    "우연이라고 보기엔 시간이 너무 정확하다.\n같은 문장, 같은 별점.\n원본은 강도윤이라는 사람에게 보여줘야겠다.\n기자 맞는지 먼저 확인.",
  "target_list.pdf":
    "PROJECT N / 조사 대상\n\nBLUE ROOM — 협박성 리뷰 17건\n우연서점 — 별점 공격 28건\n오늘식당 — 삭제 대가 요구 3건\n\n실제 상점이 아닌 게임 속 기록입니다.",
  "강의 일정.txt":
    "월: 알고리즘 / 수: 데이터베이스 / 금: 팀 프로젝트\n중간 발표 10월 21일",
  "resume.txt": "한서준\n컴퓨터공학과\n프로젝트: ORBIT, 상권 리뷰 데이터 분석",
  "next.txt": "PROJECT_N wasn't the first one.\n\nN_02",
};
export function Files() {
  const s = useGame(),
    [folder, setFolder] = useState("Home"),
    [file, setFile] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState("");
  const locked = folder === "PROJECT_N" && !s.flags.includes("projectUnlocked");
  const items =
    folder === "Home"
      ? ["Desktop", "Documents", "Downloads"]
      : folder === "Desktop"
        ? ["강의 일정.txt"]
        : folder === "Documents"
          ? ["University", "Resume", "PROJECT_N"]
          : folder === "Downloads"
            ? ["receipt.pdf", "map.png",...(s.flags.includes('harinScreenshot')?['harin_chat.txt']:[]),...(s.flags.includes('journalistDocument')?['journalist_analysis.txt']:[])]
            : folder === "University"
              ? ["강의 일정.txt"]
              : folder === "Resume"
                ? ["resume.txt"]
                : folder === "PROJECT_N"
                  ? [
                      "accounts.csv",
                      "review_network.json",
                      "memo.txt",
                      "target_list.pdf",
                      "sharing_log.txt",
                      "archive",
                    ]
                  : folder === "archive"
                    ? s.flags.includes("zipUnlocked")
                      ? ["next.txt"]
                      : []
                    : [];
  const navigate = (id: string) => {
    if (id in documents || id === "receipt.pdf" || id === "map.png") {
      setFile(id);
    } else {
      setFolder(id);
      setFile("");
      setError("");
    }
  };
  return (
    <div className="split-app">
      <aside>
        <h3>즐겨찾기</h3>
        {["Home", "Desktop", "Documents", "Downloads"].map((id) => (
          <button
            key={id}
            onClick={() => {
              setFolder(id);
              setFile("");
            }}
          >
            {id}
          </button>
        ))}
      </aside>
      <article className="document">
        <div className="toolbar">
          <button
            onClick={() => {
              setFolder("Home");
              setFile("");
            }}
          >
            ⌂ 홈
          </button>
          <span>
            서준 / {folder}
            {file && ` / ${file}`}
          </span>
        </div>
        {locked ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (unlockFile("projectUnlocked", password)) {
                setError("");
                sound("unlock");
              } else {
                setError(
                  s.flags.includes("receiptRestored")
                    ? "암호가 일치하지 않습니다."
                    : "삭제된 기록을 먼저 복원해야 합니다.",
                );
                sound("error");
              }
            }}
          >
            <h2>PROJECT_N</h2>
            <p>잠긴 폴더 · 처음 만들었던 것</p>
            <input
              autoFocus
              aria-label="PROJECT_N 암호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button>잠금 해제</button>
            <p role="alert">{error}</p>
          </form>
        ) : file ? (
          <>
            <h2>{file}</h2>
            {file === "accounts.csv" ? (
              <table>
                <tbody>
                  {documents[file].split("\n").map((r, i) => (
                    <tr key={i}>
                      {r
                        .split(",")
                        .map((cell, j) =>
                          i === 0 ? (
                            <th key={j}>{cell}</th>
                          ) : (
                            <td key={j}>{cell}</td>
                          ),
                        )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <pre>
                {documents[file] ||
                  (file === "receipt.pdf"
                    ? "영수증 원본은 삭제됨. 휴지통을 확인하세요."
                    : "BLUE ROOM · 청운로 17 / Maps에 저장됨")}
              </pre>
            )}
            {[
              "accounts.csv",
              "review_network.json",
              "target_list.pdf",
            ].includes(file) && <EvidenceButton id="project_n" />}
            {file === "next.txt" && (
              <button onClick={() => updateFlag("hiddenEnding")}>
                보관된 메타데이터 열기 · N_02
              </button>
            )}
          </>
        ) : (
          <>
            <h2>{folder}</h2>
            <div className="file-grid">
              {items.map((id) => (
                <button key={id} onClick={() => navigate(id)}>
                  <span aria-hidden="true">{id.includes(".") ? "▤" : "▱"}</span>
                  {id}
                  {id === "PROJECT_N" && !s.flags.includes("projectUnlocked")
                    ? " 🔒"
                    : ""}
                </button>
              ))}
            </div>
            {!items.length && (
              <p>보관함의 권한은 첨부 자료 확인 후 동기화됩니다.</p>
            )}
          </>
        )}
      </article>
    </div>
  );
}
