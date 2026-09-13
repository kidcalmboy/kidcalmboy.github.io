export interface Bounds { min: { x: number; y: number; z: number }; max: { x: number; y: number; z: number } }
export interface Body { x: number; y: number; z: number; velocityY: number; grounded: boolean }
export interface BodyConfig { radius: number; height: number; gravity: number; jumpVelocity: number }

const EPS = 0.0001
function overlapsXZ(x: number, z: number, b: Bounds, r: number) {
  return x > b.min.x - r + EPS && x < b.max.x + r - EPS && z > b.min.z - r + EPS && z < b.max.z + r - EPS
}

// Static AABB collision, axis sliding and swept vertical landing/head collision.
// Substeps keep lateral movement below a fraction of the player's radius.
export function stepBody(body: Body, dx: number, dz: number, dt: number, jump: boolean, boxes: Bounds[], config: BodyConfig): Body {
  const next = { ...body }
  if (jump && next.grounded) { next.velocityY = config.jumpVelocity; next.grounded = false }
  const steps = Math.max(1, Math.ceil(dt / (1 / 120)))
  const h = dt / steps
  for (let i = 0; i < steps; i++) {
    const blocked = (x: number, z: number) => boxes.some(b => overlapsXZ(x, z, b, config.radius) && next.y + config.height > b.min.y + EPS && next.y < b.max.y - EPS)
    if (!blocked(next.x + dx / steps, next.z)) next.x += dx / steps
    if (!blocked(next.x, next.z + dz / steps)) next.z += dz / steps
    next.velocityY -= config.gravity * h
    let newY = next.y + next.velocityY * h
    next.grounded = false
    for (const b of boxes) {
      if (!overlapsXZ(next.x, next.z, b, config.radius)) continue
      if (next.velocityY <= 0 && next.y >= b.max.y - EPS && newY <= b.max.y) {
        newY = Math.max(newY, b.max.y); next.velocityY = 0; next.grounded = true
      } else if (next.velocityY > 0 && next.y + config.height <= b.min.y + EPS && newY + config.height >= b.min.y) {
        newY = b.min.y - config.height; next.velocityY = 0
      }
    }
    next.y = newY
  }
  return next
}
