import * as THREE from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

import vertexShader from './shaders/swell-pass.vert?raw'
import fragmentShader from './shaders/swell-pass.frag?raw'

export class SwellPass extends ShaderPass {

  constructor() {
    const shader: THREE.Shader = {
      uniforms: {
        tDiffuse: { value: null },
        u_progress: { value: 0.5 }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    }

    super(shader)

    this.listenToStore()
  }

  listenToStore () {
    const store = useStore()
    watch(() => store.ui.swellProgress, (val) => {
      this.uniforms.u_progress.value = val
    })
  }

}
