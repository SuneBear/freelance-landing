import * as THREE from 'three'

import { Module } from './module'
import { assetManager, ASSET_ID } from './asset'

export class HeroModule extends Module {

  setup () {
    this.setupGrid()
  }

  setupGrid () {
    const { scene } = this.world

    const bgModelAsset = assetManager.getItem(ASSET_ID.Bg_Model)

    scene.add(bgModelAsset.data.scene)
  }

  update () {

  }

}
