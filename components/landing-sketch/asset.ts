import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import { loaderManager } from './loader'

export interface Asset {
  id: ASSET_ID
  url: string
  type?: string
  options?: {
    [key: string]: any
  }
}

interface LoadedAsset<T = unknown> extends Asset {
  data: T
}

const REPEAT_TEXTURE_OPTIONS = {
  wrapS: THREE.RepeatWrapping,
  wrapT: THREE.RepeatWrapping
}
const REPEAT_NO_MIPMAPS_TEXTURE_OPTIONS = {
  ...REPEAT_TEXTURE_OPTIONS,
  minFilter: THREE.LinearFilter,
  generateMipmaps: false
}

const LINEAR_TEXTURE_OPTIONS = {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter
}

const NEAREST_TEXTURE_OPTIONS = {
  minFilter: THREE.NearestFilter,
  magFilter: THREE.NearestFilter
}

export enum ASSET_ID {
  Gradient_Noise,
  Bg_Model
}

interface DefaultAssetsMap {
  [ASSET_ID.Gradient_Noise]: LoadedAsset<THREE.Texture>
  [ASSET_ID.Bg_Model]: LoadedAsset<GLTF>
}

const DEFAULT_ASSETS: Asset[] = [
  {
    id: ASSET_ID.Gradient_Noise,
    url: '/textures/T_Random_54.png',
    type: 'texture',
    options: REPEAT_TEXTURE_OPTIONS
  },
  {
    id: ASSET_ID.Bg_Model,
    url: '/models/bg.glb'
  }
]

class AssetManager {
  _assets: DefaultAssetsMap = {} as any

  loadDefaultAssets () {
    DEFAULT_ASSETS.map(async (asset) => {
      loaderManager.load([asset], (_, data) => {
        this._assets[asset.id] = {
          ...asset,
          data
        }
      })
    })
  }

  getItem<T extends keyof DefaultAssetsMap>(id: T): DefaultAssetsMap[T] {
    return this._assets[id]
  }

}

export const assetManager = new AssetManager()
