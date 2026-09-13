import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { Mesh, Material } from 'three'

export default function Door({ material }: { material: Material }) {
  const mesh = useRef<Mesh>(null)
  const opening = useRef(false)
  const get = useThree(state => state.get)
  useFrame((_, delta) => {
    if (!mesh.current || !opening.current || document.pointerLockElement !== get().gl.domElement) return
    // One-way upward opening avoids closing onto a player in the doorway.
    mesh.current.position.y = Math.min(4.7, mesh.current.position.y + Math.min(delta, 0.05) * 2)
    mesh.current.updateMatrixWorld(true)
  }, -2)
  return <mesh ref={mesh} position={[1.8, 1.5, -4.5]} material={material} castShadow receiveShadow
    userData={{ solid: true, dynamic: true, interaction: {
      label: 'E — 문 열기', available: () => !opening.current, run: () => { opening.current = true },
    } }}>
    <boxGeometry args={[2.1, 3, 0.18]} />
  </mesh>
}
