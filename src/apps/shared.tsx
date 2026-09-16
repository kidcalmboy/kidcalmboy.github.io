import { addEvidence, useGame } from "../game/store";
import { sound } from "../game/audio";
export function EvidenceButton({ id }: { id: string }) {
  const s = useGame();
  const saved = s.evidence.includes(id);
  return (
    <button
      className={`pin ${saved ? "saved" : ""}`}
      disabled={saved}
      onClick={() => {
        addEvidence(id);
        sound("unlock");
      }}
    >
      {saved ? "✓ 증거 보관됨" : "+ 증거로 저장"}
    </button>
  );
}
export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="empty-state">{children}</div>;
}
