import * as THREE from 'three'

import { loaderManager } from './loader'

enum ASSET_ID {
  Gradient_Noise
}
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

interface DefaultAssetsMap {
  [ASSET_ID.Gradient_Noise]: LoadedAsset<THREE.Texture>
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

const DEFAULT_ASSETS: Asset[] = [
  {
    id: ASSET_ID.Gradient_Noise,
    url: '/textures/T_Random_54.png',
    type: 'texture',
    options: REPEAT_TEXTURE_OPTIONS
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

  getItem(id: ASSET_ID): DefaultAssetsMap[ASSET_ID] {
    return this._assets[id]
  }

}

export const assetManager = new AssetManager()
