import { lazy, Suspense, useEffect, useState } from 'react'
import SceneBoundary from './components/game/SceneBoundary.tsx'
const EnvironmentPreview = lazy(() => import('./world/EnvironmentPreview.tsx'))

export default function App() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('')
  useEffect(() => {
    const change = () => {
      const locked = document.pointerLockElement === canvas && canvas !== null
      setPlaying(locked)
      if (locked) { setStarted(true); setError('') }
    }
    const fail = () => setError('마우스 잠금이 허용되지 않았습니다. 일반 브라우저에서 주소를 열고 다시 눌러주세요.')
    const pause = () => { if (document.pointerLockElement === canvas) document.exitPointerLock() }
    document.addEventListener('pointerlockchange', change)
    document.addEventListener('pointerlockerror', fail)
    window.addEventListener('blur', pause)
    return () => {
      document.removeEventListener('pointerlockchange', change)
      document.removeEventListener('pointerlockerror', fail)
      window.removeEventListener('blur', pause)
      pause()
    }
  }, [canvas])
  async function enter() {
    try { await canvas?.requestPointerLock() }
    catch { setError('마우스를 잠글 수 없습니다. 다시 클릭하거나 일반 브라우저에서 열어주세요.') }
  }
  return <main className="game-screen" aria-label="Infrastructure Lab 1인칭 탐험">
    <SceneBoundary><Suspense fallback={<div className="scene-message" role="status">Loading environment…</div>}>
      <EnvironmentPreview playing={playing} onReady={setCanvas} onHint={setHint} />
    </Suspense></SceneBoundary>
    {playing ? <>
      <div className="crosshair" aria-hidden="true">+</div>
      {hint && <div className="interaction-hint">{hint}</div>}
      <div className="game-location">INFRASTRUCTURE LAB</div>
      <div className="game-controls">WASD 이동 · SPACE 점프 · E 조사 · ESC 메뉴</div>
    </> : <div className="pause-overlay">
      <section className="pause-panel" aria-label="게임 메뉴">
        <p className="game-label">KIDCALMBOY</p>
        <h1>{started ? '일시 정지' : 'INFRASTRUCTURE LAB'}</h1>
        <p>WASD 이동 · SPACE 점프<br />마우스 시점 · ESC 메뉴</p>
        <button autoFocus disabled={!canvas} onClick={enter}>{canvas ? (started ? '계속 탐험하기' : '탐험 시작') : '공간 로딩 중…'}</button>
        <p className="pointer-note">마우스와 키보드로 플레이합니다.</p>
        {error && <p role="alert">{error}</p>}
      </section>
    </div>}
  </main>
}
