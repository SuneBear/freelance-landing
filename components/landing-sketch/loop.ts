import * as THREE from 'three'

let loop: () => void
export const clock = new THREE.Clock(false)

export const runLoop = (callback: (delta: number) => void) => {
  clock.start()
  // @TODO: 支持多个 Loop
  const loop = () => {
    const delta = clock.getDelta()
    if (callback) {
      callback(delta)
    }
    if (clock.running) {
      requestAnimationFrame(loop)
    }
  }
  loop()
}

export const stopLoop = (callback: () => void) => {
  clock.stop()
}

