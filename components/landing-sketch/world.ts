import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { SwellPass } from './swell-pass'
import { FinalPass } from './final-pass'

import { LAYERS } from './common'
import { ModuleManager } from './module'
import { HeroModule } from './hero.module'
import { GalleryModule } from './gallery.module'
import { control } from './control'
import { TouchTexture } from './touch.texture'

// @TODO: 支持 HMR 更新
export class World {
  $container: HTMLDivElement
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  renderTarget: THREE.WebGLRenderTarget
  finalPass: ShaderPass
  fxaaPass: ShaderPass
  composer: EffectComposer
  moduleManager: ModuleManager
  touchTexture: TouchTexture

  init ($container: HTMLDivElement) {
    this.$container = $container
    this.scene = new THREE.Scene()
    // @TODO: 支持配置不同 Camera
    this.camera = new THREE.PerspectiveCamera(75, 4/3, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })
    this.renderer.toneMapping = THREE.LinearToneMapping
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    this.renderer.autoClear = false
    this.$container.appendChild(this.renderer.domElement)
    this.touchTexture = new TouchTexture()
    control.init()
    this.setupPostprocessing()
    this.setupModules()

    const light = new THREE.DirectionalLight(0xffffff)
    this.scene.add(light)
  }

  // @TODO: 支持细分屏幕 Pass
  setupPostprocessing () {
    this.renderTarget = new THREE.WebGLRenderTarget(2000, 1000, { samples: 4 })
    this.renderer.setRenderTarget(this.renderTarget)
    this.composer = new EffectComposer(this.renderer)
    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)
    const fxaaPass = this.fxaaPass = new ShaderPass(FXAAShader)
    this.composer.addPass(new SwellPass())
    this.finalPass = new FinalPass()
    this.composer.addPass(this.finalPass)
    this.finalPass.uniforms.texture1.value = this.renderTarget.texture
    this.composer.addPass(fxaaPass)
  }

  setupModules () {
    this.moduleManager = new ModuleManager(this)
    this.moduleManager.add(HeroModule)
    this.moduleManager.add(GalleryModule)
  }

  resize (width: number, height: number) {
    const { camera, renderer } = this
    const pixelRatio = this.renderer.getPixelRatio()

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
    this.renderTarget.setSize(width * 2, height * 2)

    this.composer.setPixelRatio(pixelRatio)
    this.composer.setSize(width, height)
    this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / (width * pixelRatio)
    this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / (height * pixelRatio)

    this.moduleManager.resize(width, height)
  }

  update (delta: number) {
    const { renderer, scene, camera } = this

    renderer.clear()
    control.update(delta)
    this.touchTexture.update(delta)
    this.moduleManager.update(delta)

    // Layer Default
    this.renderer.toneMappingExposure = Math.pow(2, 0)
    camera.layers.set(LAYERS.DEFAULT)
    // this.composer.render()
    renderer.render(scene, camera)

    // Layer Gallery
    this.renderer.toneMappingExposure = Math.pow(2, 1.7)
    camera.layers.set(LAYERS.GALLERY)
    // renderer.render(scene, camera)
    this.composer.render()
  }

}

export const world = new World()
