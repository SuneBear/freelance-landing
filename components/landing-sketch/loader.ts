import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Asset } from './asset'
import { loadingManager } from './common'

const getPreloadWrapper = () => {
  let $wrapper = document.querySelector('.preload-wrapper')

  if (!$wrapper) {
    $wrapper = document.createElement('DIV')
    $wrapper.setAttribute('class', 'preload-wrapper')
    $wrapper.setAttribute('style', 'position: absolute;overflow: hidden;left: -9999px;top: -9999px;height: 1px;width: 1px')
    document.body.appendChild($wrapper)
  }

  return $wrapper
}

interface Loader {
  extensions: string[],
  action: (asset: Asset, callback: any) => void
}

class LoaderManager {
  loaders: Loader[] = []

  constructor() {
    this.setLoaders()
  }

  setLoaders() {
    const textureLoader = new THREE.TextureLoader(loadingManager)
    const imageLoader = new THREE.ImageLoader(loadingManager)

    // Images
    this.loaders.push({
      extensions: ['jpg', 'png'],
      action: (asset: Asset, callback: any) => {
        if (asset.type === 'texture') {
          textureLoader.load(asset.url, (data) => {
            if (asset.options) {
              Object.assign(data, asset.options)
              data.needsUpdate = true
            }
            callback(asset, data)
          })
          return
        }

        loadingManager.itemStart(asset.url)
        const image = new Image()
        image.addEventListener('load', () => {
          this.fileLoadEnd(asset, image, callback)
          const $wrapper = getPreloadWrapper()
          $wrapper.appendChild(image)
        })

        image.addEventListener('error', () => {
          this.fileLoadEnd(asset, image, callback)
        })

        image.src = asset.url
      }
    })

    // Draco
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('draco/')
    dracoLoader.setDecoderConfig({ type: 'js' })

    this.loaders.push({
      extensions: ['drc'],
      action: (_resource, callback) => {
        dracoLoader.load(_resource.url, _data => {
          this.fileLoadEnd(_resource, _data, callback)
          // DRACOLoader.releaseDecoderModule()
        })
      }
    })

    // GLTF
    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)

    this.loaders.push({
      extensions: ['glb', 'gltf'],
      action: (_resource, callback) => {
        loadingManager.itemStart(_resource.url)
        gltfLoader.load(_resource.url, _data => {
          this.fileLoadEnd(_resource, _data, callback)
        })
      }
    })
  }

  load<T = any>(_resources: Asset[] = [], callback?: (asset: Asset, data: T) => void) {
    if (!Array.isArray(_resources)) {
      _resources = [_resources]
    }

    for (const _resource of _resources) {
      const extensionMatch = _resource.url.match(/\.([0-9a-z]+)$/)

      if (extensionMatch && typeof extensionMatch[1] !== 'undefined') {
        const extension = extensionMatch[1]
        const loader = this.loaders.find(_loader =>
          _loader.extensions.find((ext: string) => ext === extension)
        )

        if (loader) {
          try {
            loader.action(_resource, callback)
          } catch (error) {
            console.log('Asset load error', error)
            loadingManager.itemError(_resource.url)
          }
        } else {
          console.warn(`Cannot found loader for ${_resource}`)
        }
      } else {
        console.warn(`Cannot found extension of ${_resource}`)
      }
    }
  }

  fileLoadEnd(asset: Asset, _data: any, callback: any) {
    if (asset.id) {
      loadingManager.itemEnd(asset.url)
    }
    callback && callback(asset, _data)
  }
}

export const loaderManager = new LoaderManager()
