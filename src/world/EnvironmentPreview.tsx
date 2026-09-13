import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping } from 'three'
import { GAME_CONFIG } from '../config/game.ts'
import Player from '../player/Player.tsx'
import LabScene from './LabScene.tsx'
import Interaction from '../player/Interaction.tsx'

export default function EnvironmentPreview({ playing, onReady, onHint }: { playing: boolean; onReady: (canvas: HTMLCanvasElement) => void; onHint: (hint: string) => void }) {
  return <Canvas shadows frameloop={playing ? 'always' : 'demand'} dpr={[1, GAME_CONFIG.maxDpr]} camera={GAME_CONFIG.camera}
    gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
    onCreated={({ camera, gl }) => { camera.lookAt(1.8, GAME_CONFIG.eyeHeight, -4); onReady(gl.domElement) }}
    fallback={<div className="scene-message">이 환경에서 WebGL을 사용할 수 없습니다.</div>}>
    <color attach="background" args={['#343d3f']} />
    <ambientLight intensity={0.22} />
    <hemisphereLight args={['#dce8ed', '#5c6054', 0.45]} />
    <spotLight position={[0, 3.65, 1.5]} color="#edf2e6" intensity={100} angle={1.3} penumbra={0.8} decay={2} distance={14} castShadow shadow-mapSize={[2048, 2048]} shadow-normalBias={0.025} shadow-bias={-0.0001} />
    <LabScene />
    <Player />
    <Interaction onHint={onHint} />
  </Canvas>
}
