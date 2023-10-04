import * as THREE from 'three'
import gsap from 'gsap'
import fragmentShader from './shaders/logo.frag'
import vertexShader from './shaders/logo.vert'
import { assetManager, ASSET_ID } from './asset'

const commonUniforms = {
  resolution: {
    value: new THREE.Vector2()
  },

  time: {
    value: 0
  }
}

const fluidUniforms = {
  tFluid: {
    value: new THREE.Texture()
  },
  tFluidMask: {
    value: new THREE.Texture()
  }
}

export function createLogoMaterial() {
  const uniforms = {
    ...commonUniforms,
    ...fluidUniforms,
    tMap: {
      value: null
    },
    uClamp: {
      value: new THREE.Vector2(0,1)
    },
    uFlipClamp: {
      value: 0
    },
    uTransition: {
      value: 0
    },
    uOutline: {
      value: 0
    },
    uColor: {
      value: new THREE.Color("#4ff54d")
    },
    uAlpha: {
      value: 0.95
    },
    uLogoSize: {
      value: new THREE.Vector2()
    },
    uInvertAnim: {
      value: 0
    }
  }

  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    size: THREE.FrontSide,
    fragmentShader,
    vertexShader,
    uniforms
  })
}

export class LogoMesh extends THREE.Mesh {
  constructor(options = {}) {
    super()

    this.geometry = new THREE.PlaneGeometry(
      options.width,
      options.height,
      1,
      1
    )

    this.material = createLogoMaterial()
  }
}

export class Logo {

  constructor(options) {
    options = {
      ...options
    }
    this.uniforms = {
      uAlpha: { value: 0 }
    }

    this.outlines = [
      // new THREE.Color(0x00fffc),
      // new THREE.Color(0xff88ff),
      new THREE.Color(0x46ed69),
      new THREE.Color(0xe1a23e),
      new THREE.Color(0x132679)
    ]
    this.world = options.world
    this.options = options
    this.logoTexture = assetManager.getItem(ASSET_ID.Div_Logo_Texture).data
    this.fluidTexture = assetManager.getItem(ASSET_ID.Fluid_Texture).data
  }

  init() {
    const { mesh, uniforms } = this.createMesh()
    this.mesh = mesh
    this.mesh.position.z = -0.2
    this.mesh.position.y = 0.1
    this.uniforms = uniforms
    this.uniforms.uAlpha.value = 0.7

    this.world.scene.add(this.mesh)
    this.generateOutlineLayers()
    this.resize()
  }

  createMesh() {
    const store = useStore()
    const { width, height } = store.ui.viewport

    this.logoMetrics = this.getLogoMetrics(
      1920,
      900,
      window.innerWidth,
      window.innerHeight
    )

    const mesh = new LogoMesh({ width: this.logoMetrics.logoWidth, height: this.logoMetrics.logoHeight })
    const uniforms = mesh.material.uniforms

    uniforms.tMap.value = this.logoTexture
    uniforms.tFluidMask.value = this.world.touchTexture.texture
    uniforms.tFluid.value = this.fluidTexture

    uniforms.uLogoSize.value.set(
      this.logoMetrics.logoWidth,
      this.logoMetrics.logoHeight
    )

    uniforms.resolution.value.x = window.innerWidth
    uniforms.resolution.value.y = window.innerHeight

    return { mesh, uniforms }
  }

  generateOutlineLayers() {
    this.outlines.map((color ,i) => {
      const { mesh: outline } = this.createMesh()
      const layer = i + 1
      outline.position.z = this.mesh.position.z + layer * -0.01
      outline.position.y = this.mesh.position.y + layer * -0.01
      outline.material.uniforms.uColor.value = color
      outline.material.uniforms.uOutline.value = 1
      outline.material.uniforms.uAlpha.value = 1 - (layer * 0.2)
      this.outlines[i] = outline
      this.world.scene.add(outline)
    })
  }

  getLogoMetrics(viewWidth, viewHeight, width, height) {
    const logoWidth = Math.min(viewWidth, viewHeight) * 0.003;
    const size = logoWidth
    if (width < 800) {
      return {
        logoWidth: size * 1.0,
        logoHeight: size * 1.0,
        x: 0,
        // Calculate the resting(empty) space and divided by number of planes
        space: viewWidth / 3
      };
    }
    return {
      logoWidth: size,
      logoHeight: size,
      x: viewWidth / 5 / 1.5,
      // Calculate the resting(empty) space and divided by number of planes
      space: (viewWidth - (viewWidth / 5 / 1.5) * 2 - logoWidth) / 2
    };
  }

  // 用整体 Scale 的方式处理 Resize
  resize(width = window.innerWidth, height = window.innerHeight) {
    const scale = Math.max(0.43, Math.min(1, width/800))
    this.uniforms.resolution.value.x = width
    this.uniforms.resolution.value.y = height
    this.mesh.scale.set(scale, scale, 1)
    // this.mesh.position.multiplyScalar(scale)

    this.outlines.map((outline, i) => {
      outline.scale.set(scale, scale, 1)
      const layer = i + 1
      outline.position.z = this.mesh.position.z + layer * -0.01 * scale
      outline.position.y = this.mesh.position.y + layer * -0.01 * scale
      // outline.position.multiplyScalar(scale)
      outline.material.uniforms.resolution.x = width
      outline.material.uniforms.resolution.y = width
    })
  }

  async animateIn() {
    this.outlines.map(outline => {
      gsap.to(outline.material.uniforms.uTransition, {
        value: 1,
        duration: 10,
        overwrite: true
      })
    })

    return gsap.to(this.uniforms.uTransition, {
      value: 1,
      duration: 10,
      overwrite: true
    })
  }

  update(delta) {
    this.uniforms.time.value += delta

    this.outlines.map(outline => {
      outline.material.uniforms.time.value = this.uniforms.time.value
    })
  }
}
