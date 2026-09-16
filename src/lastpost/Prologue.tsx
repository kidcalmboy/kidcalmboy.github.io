import { useEffect, useState } from 'react';

const scenes = [
  { label: 'JUNE 18 · 23:48', lines: ['윤아의 계정에 사진 한 장이 올라왔다.', '평소처럼 보이는 바다 사진이었다.'] },
  { label: 'JUNE 19', lines: ['그 후, 윤아는 연락을 받지 않았다.', '가족은 실종 신고를 했다.'] },
  { label: 'JUNE 20 · 08:42', lines: ['오늘 아침, 윤아의 언니에게 메일이 왔다.', '“네가 윤아를 잘 아니까. 최근에 무슨 일이 있었는지 봐 줄래?”'] },
  { label: 'YOU', lines: ['나는 윤아의 친구다.', '내가 가진 건, 그녀가 온라인에 남긴 흔적뿐이다.'] },
  { label: 'THE LAST POST', lines: ['윤아에게 무슨 일이 있었을까?', '마지막 게시물에는 답이 남아 있을까?'] },
  { label: '첫 번째 조사', lines: ['윤아의 SNS, MOMENT에 접속하자.', '공개 게시물을 살펴보고, 그녀를 아는 사람들에게 말을 걸어 보자.'] },
];

export function Prologue({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const last = step === scenes.length - 1;
  useEffect(() => {
    if (paused || last) return;
    const timer = setTimeout(() => setStep(s => s + 1), 6500);
    return () => clearTimeout(timer);
  }, [step, paused, last]);
  return <main className="lp-prologue" aria-label="프롤로그">
    <header><span>LAST POST <i>/ PROLOGUE</i></span><button onClick={onDone}>프롤로그 건너뛰기 ↗</button></header>
    <section key={step} className="lp-prologue-scene" aria-live="polite" aria-atomic="true">
      <small>{scenes[step].label}</small>
      <h1>{scenes[step].lines[0]}</h1><p>{scenes[step].lines[1]}</p>
      {last && <button className="lp-prologue-enter" onClick={onDone}>윤아의 MOMENT 열기 <span>↗</span></button>}
    </section>
    <footer><div className="lp-prologue-track" aria-label={`${step + 1} / ${scenes.length} 장면`}>{scenes.map((_, i) => <span key={i} className={i <= step ? 'seen' : ''} />)}</div>
      <div className="lp-prologue-controls"><button disabled={step === 0} onClick={() => setStep(s => s - 1)}>이전</button><button onClick={() => setPaused(v => !v)}>{paused ? '자동 재생' : '잠시 멈추기'}</button><button onClick={() => last ? onDone() : setStep(s => s + 1)}>{last ? '조사 시작 ↗' : '다음 장면 →'}</button></div>
      <small>가상의 인물과 SNS로 진행되는 이야기 · 소리 없이도 플레이할 수 있습니다.</small>
    </footer>
  </main>;
}
