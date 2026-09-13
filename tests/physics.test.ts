import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { stepBody } from '../src/player/physics.ts'

const floor = { min: { x: -6, y: -0.3, z: -5 }, max: { x: 6, y: 0, z: 5 } }
const cfg = { radius: 0.28, height: 1.8, gravity: 18, jumpVelocity: 6 }
const standing = () => ({ x: 0, y: 0, z: 0, velocityY: 0, grounded: true })

test('closed door blocks passage and raised door permits passage', () => {
  const door = { min: { x: -1, y: 0, z: -1.1 }, max: { x: 1, y: 3, z: -0.9 } }
  let body = standing()
  for (let i = 0; i < 100; i++) body = stepBody(body, 0, -0.03, 1 / 120, false, [floor, door], cfg)
  assert.ok(body.z >= -0.9 + cfg.radius - 0.0001)
  door.min.y = 3.2; door.max.y = 6.2
  for (let i = 0; i < 100; i++) body = stepBody(body, 0, -0.03, 1 / 120, false, [floor, door], cfg)
  assert.ok(body.z < -2)
})

test('jump rises approximately one metre and lands on the floor', () => {
  let body = standing(), peak = 0
  for (let i = 0; i < 150; i++) {
    body = stepBody(body, 0, 0, 1 / 120, i === 0, [floor], cfg)
    peak = Math.max(peak, body.y)
  }
  assert.ok(peak > 0.9 && peak < 1.05)
  assert.equal(body.y, 0); assert.equal(body.grounded, true)
})
test('airborne press does not provide another impulse', () => {
  const body = stepBody(standing(), 0, 0, 0.1, true, [floor], cfg)
  assert.deepEqual(stepBody(body, 0, 0, 0.01, true, [floor], cfg), stepBody(body, 0, 0, 0.01, false, [floor], cfg))
})
test('ceiling stops upward movement', () => {
  const ceiling = { min: { x: -3, y: 2.1, z: -3 }, max: { x: 3, y: 2.3, z: 3 } }
  let body = standing()
  for (let i = 0; i < 100; i++) {
    body = stepBody(body, 0, 0, 1 / 120, i === 0, [floor, ceiling], cfg)
    assert.ok(body.y + cfg.height <= 2.1001)
  }
  assert.equal(body.grounded, true)
})
test('wall blocks movement and walking off a platform causes falling', () => {
  const wall = { min: { x: 1, y: 0, z: -4 }, max: { x: 1.2, y: 4, z: 4 } }
  let body = standing()
  for (let i = 0; i < 100; i++) body = stepBody(body, 0.03, 0, 1 / 120, false, [floor, wall], cfg)
  assert.ok(body.x <= 1 - cfg.radius + 0.0001)
  const platform = { min: { x: -0.5, y: 0, z: -0.5 }, max: { x: 0.5, y: 0.7, z: 0.5 } }
  body = { ...standing(), y: 0.7 }
  for (let i = 0; i < 100; i++) body = stepBody(body, 0.03, 0, 1 / 120, false, [floor, platform], cfg)
  assert.equal(body.y, 0)
})
test('a falling body lands on a desk instead of passing through it', () => {
  const desk = { min: { x: -1, y: 0.76, z: -1 }, max: { x: 1, y: 0.86, z: 1 } }
  let body = { ...standing(), y: 1.2, grounded: false }
  for (let i = 0; i < 60; i++) body = stepBody(body, 0, 0, 1 / 120, false, [floor, desk], cfg)
  assert.equal(body.y, 0.86); assert.equal(body.grounded, true)
})
