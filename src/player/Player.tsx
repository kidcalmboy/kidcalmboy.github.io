import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Box3, Euler, Vector3 } from 'three'
import type { Object3D } from 'three'
import { GAME_CONFIG } from '../config/game.ts'
import { stepBody } from './physics.ts'

// Static-room collision and gravity; dynamic rigid bodies can be added later.
export default function Player() {
  const { camera, gl, scene } = useThree()
  const keys = useRef(new Set<string>())
  const obstacles = useRef<Box3[]>([])
  const moving = useRef<{ object: Object3D; box: Box3 }[]>([])
  const direction = useRef(new Vector3())
  const angles = useRef(new Euler(0, 0, 0, 'YXZ'))
  const body = useRef({ x: GAME_CONFIG.camera.position[0], y: 0, z: GAME_CONFIG.camera.position[2], velocityY: 0, grounded: true })
  const jump = useRef(false)
  useEffect(() => {
    scene.updateMatrixWorld(true)
    const boxes: Box3[] = []
    moving.current = []
    scene.traverse((object) => {
      if (!object.userData.solid) return
      const box = new Box3().setFromObject(object)
      boxes.push(box)
      if (object.userData.dynamic) moving.current.push({ object, box })
    })
    obstacles.current = boxes
    const reset = () => { keys.current.clear(); jump.current = false }
    const locked = () => document.pointerLockElement === gl.domElement
    const down = (event: KeyboardEvent) => {
      if (locked() && ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(event.code)) {
        if (event.code === 'Space' && !event.repeat) jump.current = true
        event.preventDefault(); keys.current.add(event.code)
      }
    }
    const up = (event: KeyboardEvent) => keys.current.delete(event.code)
    const look = (event: MouseEvent) => {
      if (!locked()) return
      const euler = angles.current.setFromQuaternion(camera.quaternion, 'YXZ')
      euler.y -= event.movementX * GAME_CONFIG.mouseSensitivity
      euler.x = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, euler.x - event.movementY * GAME_CONFIG.mouseSensitivity))
      euler.z = 0
      camera.quaternion.setFromEuler(euler)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', reset)
    document.addEventListener('pointerlockchange', reset)
    document.addEventListener('mousemove', look)
    return () => {
      reset()
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', reset)
      document.removeEventListener('pointerlockchange', reset)
      document.removeEventListener('mousemove', look)
    }
  }, [camera, gl, scene])
  useFrame(({ camera: frameCamera }, delta) => {
    if (document.pointerLockElement !== gl.domElement) return
    moving.current.forEach(({ object, box }) => box.setFromObject(object))
    const input = keys.current
    const x = Number(input.has('KeyD')) - Number(input.has('KeyA'))
    const z = Number(input.has('KeyS')) - Number(input.has('KeyW'))
    const yaw = angles.current.setFromQuaternion(frameCamera.quaternion, 'YXZ').y
    const move = direction.current.set(x, 0, z).normalize()
    const dx = (move.x * Math.cos(yaw) + move.z * Math.sin(yaw)) * GAME_CONFIG.playerSpeed * Math.min(delta, 0.05)
    const dz = (-move.x * Math.sin(yaw) + move.z * Math.cos(yaw)) * GAME_CONFIG.playerSpeed * Math.min(delta, 0.05)
    body.current = stepBody(body.current, dx, dz, Math.min(delta, 0.05), jump.current, obstacles.current, {
      radius: GAME_CONFIG.playerRadius, height: GAME_CONFIG.playerHeight,
      gravity: GAME_CONFIG.gravity, jumpVelocity: GAME_CONFIG.jumpVelocity,
    })
    jump.current = false
    frameCamera.position.set(body.current.x, body.current.y + GAME_CONFIG.eyeHeight, body.current.z)
  }, -1)
  return null
}
