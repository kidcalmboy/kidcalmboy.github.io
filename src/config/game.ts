export const GAME_CONFIG = {
  playerSpeed: 3.5,
  interactionDistance: 2.5,
  mouseSensitivity: 0.002,
  maxDpr: 1.5,
  eyeHeight: 1.65,
  playerRadius: 0.28,
  playerHeight: 1.8,
  gravity: 18,
  jumpVelocity: 6,
  camera: { position: [1.8, 1.65, 3.2] as [number, number, number], fov: 75 },
} as const
