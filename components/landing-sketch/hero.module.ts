import * as THREE from 'three'

import { Module } from './module'
import { assetManager, ASSET_ID } from './asset'
import { control } from './control'

const CAMERA_VIEW_POSITION_Z = 1.5

export class HeroModule extends Module {
  bgScene: THREE.Group
  cameraLookAt = new THREE.Vector3(0, 0, 0)
  gridMaterial: THREE.MeshStandardMaterial

  setup () {
    this.setupGrid()
  }

  setupGrid () {
    const { scene, camera } = this.world

    const bgModelAsset = assetManager.getItem(ASSET_ID.Bg_Model)
    const bgScene = bgModelAsset.data.scene

    bgScene.traverse((obj: any) => {
      if (obj.name.includes('Grid')) {
        const material = obj.material as THREE.MeshStandardMaterial
        // material.color.set(0x000000)
        material.opacity *= 2
        material.emissive.set(0x808080)
        this.gridMaterial = material
      }

      if (obj.name.includes('Grid_Point')) {
        const material = obj.material as THREE.MeshStandardMaterial
        material.opacity *= 10
        material.emissive.set(0x000000)
      }
    })

    camera.position.set(0, 0, CAMERA_VIEW_POSITION_Z)

    scene.add(bgScene)
    this.bgScene = bgScene
  }

  updatePan () {
    const { camera, scene } = this.world
    const panX =
      -control.pan.value.x / control.pan.amplitude.x
    const panY =
      control.pan.value.y / control.pan.amplitude.y
    const instensity = 0.1

    if (!isNaN(panX)) {
      // scene.rotation.y = -panX * stensity
      // scene.rotation.x = -panY * instensity
      camera.position.y = panY * instensity + this.cameraLookAt.x
      camera.position.x = panX * instensity + this.cameraLookAt.y
      camera.lookAt(this.cameraLookAt.x, this.cameraLookAt.y, camera.position.z - CAMERA_VIEW_POSITION_Z)
    }

  }

  update () {
    this.updatePan()
  }

}
