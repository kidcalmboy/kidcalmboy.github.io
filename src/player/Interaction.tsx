import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Raycaster, Vector2 } from 'three'
import { GAME_CONFIG } from '../config/game.ts'

interface Action { label: string; available: () => boolean; run: () => void }
export default function Interaction({ onHint }: { onHint: (hint: string) => void }) {
  const get = useThree(state => state.get)
  const ray = useRef(new Raycaster())
  const center = useRef(new Vector2())
  const lastHint = useRef('')
  function selected(): Action | null {
    const { camera, gl, scene } = get()
    if (document.pointerLockElement !== gl.domElement) return null
    scene.updateMatrixWorld(true)
    ray.current.far = GAME_CONFIG.interactionDistance
    ray.current.setFromCamera(center.current, camera)
    // All visible surfaces block the ray, not just interactable objects.
    const hit = ray.current.intersectObjects(scene.children, true).find(h => h.object.visible)
    const action = hit?.object.userData.interaction as Action | undefined
    return action?.available() ? action : null
  }
  useFrame(() => {
    const hint = selected()?.label ?? ''
    if (hint !== lastHint.current) { lastHint.current = hint; onHint(hint) }
  })
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.code !== 'KeyE' || event.repeat) return
      const action = selected()
      if (action) { event.preventDefault(); action.run() }
    }
    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  })
  return null
}
