import * as THREE from 'three'

import { ModuleManager } from './module'
import { HeroModule } from './hero.module'
import { control } from './control'

// @TODO: 支持 HMR 更新
export class World {
  $container: HTMLDivElement
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  moduleManager: ModuleManager

  init ($container: HTMLDivElement) {
    this.$container = $container
    this.scene = new THREE.Scene()
    // @TODO: 支持配置不同 Camera
    this.camera = new THREE.PerspectiveCamera(75, 4/3, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    this.renderer.autoClear = false
    this.$container.appendChild(this.renderer.domElement)
    control.init()
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
    control.update(delta)
    this.moduleManager.update(delta)
    renderer.render(scene, camera)
  }

}

export const world = new World()
