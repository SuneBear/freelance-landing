import * as THREE from 'three'
import gsap from 'gsap'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { loaderManager } from './loader'
import { LAYERS } from './common'
import { clamp } from '@/utils/math'

import fragmentShader from './shaders/case-screen.frag'
import vertexShader from './shaders/case-screen.vert'

export interface ProjectCaseOptions {
  // Media
  mockupModelUrl: string
  recordVideoUrl: string
  recordVideoRatio: number
  screenshotUrl?: string

  // Meta
  meta: {
    year: number
    client?: {
      name: string
      logoUrl: string
    }
  }
  name?: string
  content?: string

  // Render params
  flipY?: boolean
  modelSize?: number
  scale?: number
  position?: number[]
  rotation?: number[]
}

const DEFAULT_OPTIONS: Partial<ProjectCaseOptions> = {
  modelSize: 1,
  scale: 1,
  flipY: true,
  position: [],
  rotation: []
}

export class ProjectCaseObject {
  options: ProjectCaseOptions
  videoTexture: THREE.VideoTexture
  gltf: GLTF
  $object: THREE.Group
  screenUniforms: any

  constructor(options: ProjectCaseOptions) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    }

    this.$object = new THREE.Group()

    this.generateVideoTexture()
    this.setupObject()
  }

  generateVideoTexture () {
    const { isMobileOrTablet } = useDevice()
    const videoElement = document.createElement('video')
    videoElement.playsInline = true
    videoElement.autoplay = true
    videoElement.loop = true
    videoElement.muted = true
    videoElement.crossOrigin = 'anonymous'
    videoElement.src = this.options.recordVideoUrl
    videoElement.onloadstart = () => {
      setTimeout(() => {
        videoElement.play()
      })
    }
    if (isMobileOrTablet) {
      document.addEventListener('touchstart', () => {
        videoElement.play()
      })
    }
    this.videoTexture = new THREE.VideoTexture(videoElement)
    this.videoTexture.flipY = this.options.flipY || false
    // this.videoTexture.magFilter = THREE.NearestFilter
    // this.videoTexture.minFilter = THREE.NearestFilter
  }

  async setupObject () {
    loaderManager.load<GLTF>([{
      url: this.options.mockupModelUrl
    } as any], (_, data) => {
      this.gltf = data
      this.$object.add(this.gltf.scene)
      this.$object.traverseVisible((obj) => {
        obj.layers.set(LAYERS.GALLERY)
      })

      if (this.options.position?.length) {
        const position = this.options.position
        this.$object.position.set(position[0], position[1], position[2])
      }

      if (this.options.rotation?.length) {
        const rotation = this.options.rotation
        this.$object.rotation.set(rotation[0], rotation[1], rotation[2])
      }

      if (this.options.scale) {
        this.$object.scale.multiplyScalar(this.options.scale)
      }

      const screen = this.$object.getObjectByName('screen') as any
      if (screen) {
        screen.material.map = this.videoTexture
      }

      this.setupObjectMaterial()
    })
  }

  // @TODO: 采用后处理的方式做 RGB Shift
  // @TODO: 支持 Hover Distort
  setupObjectMaterial () {
    const store = useStore()

    this.screenUniforms = {
      uTexture: {
        value: this.videoTexture
      },
      uOffset: {
        //distortion strength
        value: new THREE.Vector2(0.0, 0.0)
      },
      uAlpha: {
        //opacity
        value: 0.99
      }
    }
    const material = new THREE.ShaderMaterial({
      uniforms: this.screenUniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    })
    const screen = this.$object.getObjectByName('screen') as any
    if (screen) {
      screen.material = material
    }

    watch(() => store.ui.scrollSpeed, (val) => {
      val = clamp(val, -50, 50)
      gsap.to(this.screenUniforms.uOffset.value, {
        x: val * -0.002,
        overwrite: true,
        duration: clamp(Math.random(), 0.3, 1)
      })
    })
  }

}
