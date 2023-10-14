import * as THREE from 'three'
import gsap from 'gsap'

import { Module } from './module'
import { assetManager, ASSET_ID } from './asset'
import { control } from './control'
import { Logo } from './logo.object'
import { clamp } from '@/utils/math'

const CAMERA_VIEW_POSITION_Z = 1.5

export class HeroModule extends Module {
  bgScene: THREE.Group
  logo: Logo
  cameraLookAt = new THREE.Vector3(0, 0, 0)
  gridMaterial: THREE.MeshStandardMaterial
  leaveTimeline: gsap.core.Timeline

  setup () {
    this.setupGrid()
    this.setupLogo()
    this.setupAnimateLeaveTimeline()
    this.listenToStore()
  }

  setupGrid () {
    const { scene, camera } = this.world

    const bgModelAsset = assetManager.getItem(ASSET_ID.Bg_Model)
    const bgScene = bgModelAsset.data.scene

    bgScene.traverse((obj: any) => {
      if (obj.name === 'Grid') {
        const material = obj.material as THREE.MeshStandardMaterial
        // material.color.set(0x000000)
        material.opacity *= 1
        material.emissive.set(0xcccccc)
        this.gridMaterial = material
      }

      if (obj.name === 'Grid_point') {
        const material = obj.material as THREE.MeshStandardMaterial
        material.opacity = 0.5
        material.emissive.set(0x2dd018)
      }
    })

    scene.add(bgScene)
    this.bgScene = bgScene
  }

  setupLogo() {
    this.logo = new Logo({ world: this.world })
    this.logo.init()
  }

  async animateEnter () {
    const store = useStore()
    const { camera } = this.world

    // @TODO：优化摄像机路径
    gsap.fromTo(camera.position, {
      z: 3,
      y: -10
    }, {
      z: CAMERA_VIEW_POSITION_Z,
      y: 0,
      duration: 2
    })
    this.logo.animateIn()
    gsap.to('.fixed-container .section-hero', {
      opacity: 1,
      delay: 2,
      onComplete: () => {
        store.ui.heroUIStart = true
      }
    })
  }

  setupAnimateLeaveTimeline () {
    this.leaveTimeline = gsap.timeline({
      paused: true
    })
    .to(this.logo.uniforms.uAlpha, { value: 0 })
    .to(this.gridMaterial, { opacity: 0.02, onUpdate: () => {
      this.gridMaterial.needsUpdate = true
    }}, 0)
    .to('.scroll-tips', { opacity: 0 }, 0)

    this.logo.outlines.map((outline: any, i) => {
      this.leaveTimeline.to(outline.material.uniforms.uAlpha, {
        value: 0
      }, i + 0.05)
    })

  }

  listenToStore () {
    const store = useStore()
    const { touchTexture } = this.world

    watch(store.ui.cursor, () => {
      touchTexture.addTouch({
        x: control.cursor.ratio.x,
        y: 1 - control.cursor.ratio.y
      })
    })

    watch(() => store.ui.heroEnterProgress, (val) => {
      this.animateEnter()
    })

    watch(() => store.ui.heroScrollLeaveProgress, (val) => {
      if (!store.ui.heroEnterProgress) return
      this.leaveTimeline.progress(val)
    })
  }

  resize(width: number, height: number) {
    this.logo.resize(width, height)
  }

  updatePan () {
    const { camera, scene } = this.world
    const panX =
      -control.pan.value.x / control.pan.amplitude.x
    const panY =
      control.pan.value.y / control.pan.amplitude.y
    const instensity = 0.1

    // 这里需要加上一个 Camera Offset，否则 Camera 位置永远是固定范围的
    if (!isNaN(panX)) {
      // scene.rotation.y = -panX * stensity
      // scene.rotation.x = -panY * instensity
      // camera.position.y = panY * instensity + this.cameraLookAt.x
      // camera.position.x = panX * instensity + this.cameraLookAt.y
      camera.position.y = camera.position.z * 0.5 * panY * instensity + this.cameraLookAt.x
      camera.position.x = camera.position.z * panX * instensity + this.cameraLookAt.y
      camera.position.x = clamp(camera.position.x, -1, 1)
      camera.position.y = clamp(camera.position.y, -1, 1)
      camera.lookAt(this.cameraLookAt.x, this.cameraLookAt.y, camera.position.z - CAMERA_VIEW_POSITION_Z)
    }

  }

  update () {
    this.updatePan()
  }

}
