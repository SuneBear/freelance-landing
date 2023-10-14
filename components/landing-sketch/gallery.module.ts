import * as THREE from 'three'
import gsap from 'gsap'

import { LAYERS } from './common'
import { Module } from './module'
import { ProjectCaseOptions, ProjectCaseObject } from './project-case.object'

const CASE_GAP = 1
const VIEWPORT_SIZE = 2.2

const projectCasesConfig: ProjectCaseOptions[] = [
  {
    mockupModelUrl: '/cases/rct-tv/mockup.glb',
    recordVideoUrl: '/cases/rct-tv/record.mp4',
    recordVideoRatio: 718/670,
    name: 'rct TV',
    meta: {
      year: 2018
    },
    flipY: false,
    modelSize: 1.4,
    // scale: 0.28,
    // rotation: [ -0.1, -0.52, 0],
    // position: [0, -0, -0.2]
    scale: 0.6,
    rotation: [ -0.1, -0.36, 0],
    position: [0, -0.5, 0]
  },

  {
    mockupModelUrl: '/cases/rct-dna/mockup.glb',
    recordVideoUrl: '/cases/rct-dna/record.mp4',
    recordVideoRatio: 720/720,
    name: 'rct DNA',
    meta: {
      year: 2019
    },
    flipY: false,
    modelSize: 1.1,
    scale: 0.28,
    rotation: [ -0.1, -0.3, 0],
    position: [0, -0.25, 0]
  },

  {
    mockupModelUrl: '/cases/mirrorworld-space/mockup.glb',
    recordVideoUrl: '/cases/mirrorworld-space/record.mp4',
    recordVideoRatio: 1280/720,
    name: 'Mirror World Crystal Space',
    meta: {
      year: 2021
    },
    flipY: false,
    modelSize: 1.6,
    scale: 0.7,
    rotation: [ -0.1, -0.4, 0],
    position: [0, -0.5, 0]
  },

  {
    mockupModelUrl: '/cases/delysium-whitepaper/mockup.glb',
    recordVideoUrl: '/cases/delysium-whitepaper/record.mp4',
    recordVideoRatio: 1252/712,
    name: 'Delysium Whitepaper',
    meta: {
      year: 2022
    },
    flipY: false,
    modelSize: 1.8,
    scale: 0.4,
    rotation: [ -0.1, -0.45, 0],
    position: [0, -0.3, 0]
  },

  {
    mockupModelUrl: '/cases/affine-landing-v2/mockup.glb',
    recordVideoUrl: '/cases/affine-landing-v2/record.mp4',
    recordVideoRatio: 1222/638,
    name: 'AFFiNE Landing V2',
    meta: {
      year: 2023
    },
    flipY: false,
    modelSize: 1.7,
    scale: 0.7,
    rotation: [ -0.1, -0.4, 0],
    position: [0, -0.48, 0]
  }
]

export class GalleryModule extends Module {
  group: THREE.Group
  galleryWidthSize: number = 0

  setup () {
    const { scene } = this.world
    this.group = new THREE.Group()
    scene.add(this.group)

    // 只给 Gallery 用
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    ambientLight.layers.set(LAYERS.GALLERY)
    this.group.add(ambientLight)

    // const light = new THREE.DirectionalLight(0x4ff54d)
    const light = new THREE.DirectionalLight(0x808080)
    light.position.y = 10
    light.position.x = 10
    light.layers.set(LAYERS.GALLERY)
    this.group.add(light)

    this.setupProjectCases()
    this.listenToStore()
  }

  setupProjectCases () {
    // const filteredCases = [projectCasesConfig[0], projectCasesConfig[1]]
    const filteredCases = projectCasesConfig
    filteredCases.map(config => {
      const object = new ProjectCaseObject(config)
      // 动态计算 X 轴位置
      if (!config.position) {
        config.position = [0, 0, 0]
      }
      config.position[0] = this.galleryWidthSize
      this.group.add(object.$object)
      if (config.modelSize) {
        this.galleryWidthSize += config.modelSize + CASE_GAP
      }
    })
  }

  listenToStore () {
    const store = useStore()

    const scrollTimeline = gsap.timeline({
      paused: true
    })

    scrollTimeline.fromTo(this.group.position, { x: 10 }, {
      x: -this.galleryWidthSize - VIEWPORT_SIZE
    })

    watch(() => store.ui.galleryScrollProgress, (val) => {
      scrollTimeline.progress(val)
    })
  }

  update (delta: number) {

  }

}
