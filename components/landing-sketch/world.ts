import * as THREE from 'three'

import { ModuleManager } from './module'
import { HeroModule } from './hero.module'

export class World {
  $container: HTMLDivElement
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  moduleManager: ModuleManager

  init ($container: HTMLDivElement) {
    this.$container = $container
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, 4/3, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({
      alpha: true
    })
    this.renderer.autoClear = false
    this.$container.appendChild(this.renderer.domElement)
    this.setupModules()
  }

  setupModules () {
    this.moduleManager = new ModuleManager(this)
    this.moduleManager.add(HeroModule)
  }

  resize (width: number, height: number) {
    const { camera, renderer } = this
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

  update (delta: number) {
    const { renderer, scene, camera } = this
    renderer.clear()
    this.moduleManager.update(delta)
    renderer.render(scene, camera)
  }

}

export const world = new World()
