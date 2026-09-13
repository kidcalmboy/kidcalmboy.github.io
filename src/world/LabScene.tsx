import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { CanvasTexture, DataTexture, MeshStandardMaterial, PMREMGenerator, RepeatWrapping, RGBAFormat, SRGBColorSpace } from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import type { Material } from 'three'
import Door from '../objects/Door.tsx'

type Vec3 = [number, number, number]
function Box({ at, size, material, solid = true }: { at: Vec3; size: Vec3; material: Material; solid?: boolean }) {
  return <mesh position={at} material={material} castShadow receiveShadow userData={{ solid }}><boxGeometry args={size} /></mesh>
}

function concreteTexture() {
  const size = 256
  const data = new Uint8Array(size * size * 4)
  let seed = 4217
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    const grain = seed / 4294967296
    const value = Math.round(183 + grain * 33 + 6 * Math.sin(x / 27) * Math.cos(y / 39))
    const i = (y * size + x) * 4
    data[i] = data[i + 1] = data[i + 2] = value; data[i + 3] = 255
  }
  const texture = new DataTexture(data, size, size, RGBAFormat)
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.repeat.set(4, 4)
  texture.needsUpdate = true
  return texture
}

function Sign({ at, width, height, lines, color = '#d6e3d9', background = '#202d2b' }: { at: Vec3; width: number; height: number; lines: string[]; color?: string; background?: string }) {
  const map = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = background; ctx.fillRect(0, 0, 1024, 512)
    ctx.fillStyle = color
    lines.forEach((line, i) => {
      ctx.font = `${i === 0 ? '600 64' : '34'}px monospace`
      ctx.fillText(line, 55, 100 + i * 74)
    })
    const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace
    return texture
  }, [lines, color, background])
  useEffect(() => () => map.dispose(), [map])
  return <mesh position={at}><planeGeometry args={[width, height]} /><meshBasicMaterial map={map} toneMapped={false} /></mesh>
}

function Reflections() {
  const get = useThree(state => state.get)
  useEffect(() => {
    const { gl, scene } = get()
    const generator = new PMREMGenerator(gl)
    const room = new RoomEnvironment()
    const target = generator.fromScene(room, 0.04)
    const previous = scene.environment
    scene.environment = target.texture
    scene.environmentIntensity = 0.35
    room.dispose(); generator.dispose()
    return () => { scene.environment = previous; target.dispose() }
  }, [get])
  return null
}

export default function LabScene() {
  const materials = useMemo(() => {
    const texture = concreteTexture()
    return {
      wall: new MeshStandardMaterial({ color: '#b1b3aa', roughness: 0.92, bumpMap: texture, bumpScale: 0.025 }),
      floor: new MeshStandardMaterial({ color: '#6b7573', roughness: 0.48, metalness: 0.08, bumpMap: texture, bumpScale: 0.012 }),
      dark: new MeshStandardMaterial({ color: '#171f24', roughness: 0.48, metalness: 0.65 }),
      steel: new MeshStandardMaterial({ color: '#7d8b8f', roughness: 0.3, metalness: 0.85 }),
      wood: new MeshStandardMaterial({ color: '#897251', roughness: 0.74, bumpMap: texture, bumpScale: 0.007 }),
      trim: new MeshStandardMaterial({ color: '#303e40', roughness: 0.55, metalness: 0.3 }),
      light: new MeshStandardMaterial({ color: '#f0f4e9', emissive: '#f0f4e9', emissiveIntensity: 3 }),
      led: new MeshStandardMaterial({ color: '#8daea0', emissive: '#68c398', emissiveIntensity: 1.6 }),
      paint: new MeshStandardMaterial({ color: '#b4a477', roughness: 0.85 }),
    }
  }, [])
  useEffect(() => () => {
    materials.wall.bumpMap?.dispose()
    Object.values(materials).forEach(m => m.dispose())
  }, [materials])
  const m = materials
  return <group>
    <Reflections />
    <Box at={[0, -0.15, 0]} size={[12, 0.3, 9]} material={m.floor} />
    <Box at={[-2.625, 2, -4.5]} size={[6.75, 4, 0.25]} material={m.wall} />
    <Box at={[4.425, 2, -4.5]} size={[3.15, 4, 0.25]} material={m.wall} />
    <Box at={[1.8, 3.5, -4.5]} size={[2.1, 1, 0.25]} material={m.wall} />
    <Box at={[0, 2, 4.5]} size={[12, 4, 0.25]} material={m.wall} />
    <Box at={[-6, 2, 0]} size={[0.25, 4, 9]} material={m.wall} />
    <Box at={[6, 2, 0]} size={[0.25, 4, 9]} material={m.wall} />
    <Box at={[0, 4.12, 0]} size={[12, 0.24, 9]} material={m.trim} />
    {/* Narrow seams and skirting keep scale readable from human eye height. */}
    {Array.from({ length: 9 }, (_, i) => <Box key={`floorz${i}`} at={[0, 0.002, i - 4]} size={[11.8, 0.003, 0.009]} material={m.trim} solid={false} />)}
    {Array.from({ length: 11 }, (_, i) => <Box key={`floorx${i}`} at={[i - 5, 0.002, 0]} size={[0.009, 0.003, 8.8]} material={m.trim} solid={false} />)}
    {[-4, -2, 0, 4].map(x => <Box key={x} at={[x, 2, -4.365]} size={[0.014, 4, 0.015]} material={m.trim} solid={false} />)}
    <Box at={[0, 0.12, 4.34]} size={[11.8, 0.24, 0.06]} material={m.trim} solid={false} />
    {[-5.84, 5.84].map(x => <Box key={x} at={[x, 0.12, 0]} size={[0.06, 0.24, 8.7]} material={m.trim} solid={false} />)}
    <Door material={m.steel} />
    {/* Corridor opens into the Linux archive room. */}
    <Box at={[1.8, -0.15, -7.25]} size={[2.1, 0.3, 5.5]} material={m.floor} />
    <Box at={[0.65, 2, -7.25]} size={[0.2, 4, 5.5]} material={m.wall} />
    <Box at={[2.95, 2, -7.25]} size={[0.2, 4, 5.5]} material={m.wall} />
    <Box at={[1.8, 4.1, -7.25]} size={[2.5, 0.2, 5.5]} material={m.trim} />
    <Box at={[1.8, -0.15, -13.5]} size={[8, 0.3, 7]} material={m.floor} />
    <Box at={[-2.2, 2, -13.5]} size={[0.2, 4, 7]} material={m.wall} />
    <Box at={[5.8, 2, -13.5]} size={[0.2, 4, 7]} material={m.wall} />
    <Box at={[1.8, 2, -17]} size={[8, 4, 0.2]} material={m.wall} />
    <Box at={[-0.725, 2, -10]} size={[2.95, 4, 0.2]} material={m.wall} />
    <Box at={[4.325, 2, -10]} size={[2.95, 4, 0.2]} material={m.wall} />
    <Box at={[1.8, 3.5, -10]} size={[2.1, 1, 0.2]} material={m.wall} />
    <Box at={[1.8, 4.1, -13.5]} size={[8, 0.2, 7]} material={m.trim} />
    {[-7, -12, -15].map(z => <group key={z}>
      <Box at={[1.8, 3.75, z]} size={[1.7, 0.06, 0.3]} material={m.light} solid={false} />
      <pointLight position={[1.8, 3.5, z]} intensity={24} distance={9} color="#e0f0ed" />
    </group>)}
    <Sign at={[1.8, 2.8, -16.88]} width={3.6} height={1.2} lines={['LINUX SYSTEMS', '01 / STUDY ARCHIVE', 'Content connection pending']} />
    {[-1, 0.2, 3.4, 4.6].map(x => <group key={x}>
      <Box at={[x, 1.35, -15.5]} size={[0.9, 2.7, 0.9]} material={m.dark} />
      {[0, 1, 2, 3, 4].map(i => <Box key={i} at={[x, 0.4 + i * 0.45, -15.03]} size={[0.74, 0.23, 0.04]} material={m.steel} solid={false} />)}
    </group>)}
    <Sign at={[1.8, 3.45, -4.3]} width={2.4} height={0.65} lines={['01 / LINUX SYSTEMS', 'INFRASTRUCTURE LAB']} />
    <Sign at={[4.45, 2.1, -4.32]} width={1.7} height={1.15} lines={['DIRECTORY', '01  LINUX SYSTEMS', '02  NETWORK', '03  DATABASE', '04  CLOUD']} />
    {/* Equipment racks with individual server trays, handles, vents and status LEDs. */}
    {[0, 1, 2].map(i => <group key={i} position={[-4.75 + i * 1.15, 0, -3.65]}>
      <Box at={[0, 1.4, 0]} size={[0.98, 2.8, 0.95]} material={m.dark} />
      {[-0.45, 0.45].map(x => <Box key={x} at={[x, 1.4, 0.49]} size={[0.035, 2.7, 0.05]} material={m.steel} solid={false} />)}
      {[0, 1, 2, 3, 4, 5, 6].map(slot => <group key={slot} position={[0, 0.36 + slot * 0.34, 0.5]}>
        <Box at={[0, 0, 0]} size={[0.83, 0.27, 0.06]} material={m.trim} solid={false} />
        <Box at={[-0.03, 0, 0.04]} size={[0.52, 0.12, 0.01]} material={m.dark} solid={false} />
        <Box at={[0.33, 0.04, 0.045]} size={[0.025, 0.018, 0.01]} material={m.led} solid={false} />
        {[-0.36, 0.36].map(x => <Box key={x} at={[x, -0.025, 0.07]} size={[0.025, 0.1, 0.04]} material={m.steel} solid={false} />)}
      </group>)}
    </group>)}
    {/* Desk at realistic seated-work height, with monitors and keyboard. */}
    <Box at={[-1.9, 0.81, -0.7]} size={[3.9, 0.1, 1.2]} material={m.wood} />
    {[-3.5, -0.3].map(x => <Box key={x} at={[x, 0.38, -0.7]} size={[0.12, 0.76, 1.05]} material={m.dark} />)}
    {[-2.8, -1.3].map((x, i) => <group key={x}>
      <Box at={[x, 1.3, -1]} size={[1.05, 0.62, 0.08]} material={m.dark} />
      <Box at={[x, 1, -1]} size={[0.06, 0.3, 0.1]} material={m.steel} solid={false} />
      <Box at={[x, 0.88, -0.92]} size={[0.4, 0.04, 0.3]} material={m.dark} solid={false} />
      <Sign at={[x, 1.3, -0.95]} width={0.97} height={0.53} lines={i ? ['INFRASTRUCTURE LAB', 'LOCAL WORKSTATION', 'Archive pending setup'] : ['KidCalmBoy@lab:~$', '$ _', '', 'SYSTEM CONSOLE']} />
      <Box at={[x, 0.9, -0.3]} size={[0.65, 0.04, 0.22]} material={m.trim} solid={false} />
    </group>)}
    {/* Cable ducts and suspended rectangular luminaires. */}
    {[-4.4, 4.4].map(x => <Box key={x} at={[x, 3.82, 0]} size={[0.25, 0.18, 8.7]} material={m.steel} />)}
    {[-2, 2].flatMap(x => [-2, 2].map(z => <group key={`${x}:${z}`}>
      <Box at={[x, 3.82, z]} size={[2.5, 0.16, 0.44]} material={m.dark} />
      <Box at={[x, 3.73, z]} size={[2.3, 0.025, 0.3]} material={m.light} solid={false} />
      <pointLight position={[x, 3.4, z]} color={z < 0 ? '#dceafa' : '#fff0da'} intensity={18} distance={10} decay={2} />
    </group>))}
    <Box at={[1.8, 0.004, 0]} size={[0.065, 0.003, 7.8]} material={m.paint} solid={false} />
    <Box at={[1.8, 0.004, -2.5]} size={[2, 0.003, 0.065]} material={m.paint} solid={false} />
  </group>
}
