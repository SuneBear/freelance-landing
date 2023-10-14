import * as THREE from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

import vertexShader from './shaders/final-pass.vert?raw'
import fragmentShader from './shaders/final-pass.frag?raw'

export class FinalPass extends ShaderPass {

  constructor() {
    const shader: THREE.Shader = {
      uniforms: {
        texture1: { value: null },
        texture2: { value: null },
        uvScale: {
          value: 1.
        }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    }

    super(shader, 'texture2')

    this.listenToStore()
  }

  listenToStore() {
    const store = useStore()

    watch(() => store.ui.heroScrollLeaveProgress, (val) => {
      if (store.ui.heroScrollLeaveProgress >= 1) {
        this.uniforms.uvScale.value = 1.0
        return
      }
      this.uniforms.uvScale.value = 1.0 + val * 4
    })
  }
}
