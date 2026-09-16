import { useState } from "react";
import { nextLead } from "./leads";
import { useGame } from "./store";
import type { Navigate } from "./shared";
export function ProgressGuide({
  navigate,
  compact = false,
}: {
  navigate: Navigate;
  compact?: boolean;
}) {
  const s = useGame(),
    lead = nextLead(s),
    [expanded, setExpanded] = useState(true);
  return (
    <section
      className={`lp-progress-guide ${compact ? "compact" : ""}`}
      aria-label="다음 조사 안내"
    >
      <header>
        <small>
          조사 메모
        </small>
        <button
          aria-expanded={expanded}
          aria-label="조사 안내 펼치기 또는 접기"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "−" : "＋"}
        </button>
      </header>
      <h3>{lead.title}</h3>
      {expanded && (
        <>
          <p>{lead.why}</p>
          <button
            className="lp-guide-action"
            onClick={() => navigate(lead.target)}
          >
            {lead.action} <span>↗</span>
          </button>
        </>
      )}
    </section>
  );
}
