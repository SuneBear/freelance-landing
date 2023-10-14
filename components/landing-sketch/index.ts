import * as THREE from 'three'
import { gsap } from 'gsap'
import { loadingManager } from './common'
import { assetManager } from './asset'
import { clock, runLoop } from './loop'
import { world } from './world'

// 这个文件相当于 Sketch.js，在 World 和 Vue Page 之间搭建桥梁

const MIN_LOADING_DURATION = 5000
const LEAVE_LOADING_DURATION = 1200

interface InitOptions {
  scrollContainer?: HTMLElement
  sketchContainer: HTMLDivElement
}

export const init = ({
  scrollContainer = document.body,
  sketchContainer
}: InitOptions) => {
  const store = useStore()
  world.init(sketchContainer)
  runLoop(loop)
  console.log('Init options', scrollContainer)
}

export const preInit = () => {
  assetManager.loadDefaultAssets()
  listenToLoading()
}

export const resize = (width: number, height: number) => {
  world.resize(width, height)
}

// @TODO: 传 World Loop 进度
const loop = (delta: number) => {
  world.update(delta)
}

export const listenToLoading = () => {
  const store = useStore()
  const config = useRuntimeConfig()

  const getTimeDelay = () => {
    const diff = clock.elapsedTime * 1000
    const delay = Math.max(0, MIN_LOADING_DURATION - diff)
    return delay
  }

  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const delay = getTimeDelay()
    const loadingProgress = itemsLoaded / itemsTotal

    gsap.to(store.ui, {
      loadingProgress,
      duration: delay/1000,
      overwrite: true
    })
    // store.ui.loadingProgress = 0.5
  }

  loadingManager.onLoad = () => {
    if (!store.ui.isLoading) return

    const delay = getTimeDelay()
    // @TODO: 和 RAF 关联起来
    setTimeout(() => {
      store.ui.isLoading = false
      console.log('Loaded')
    }, config.public.needLoading ? delay + LEAVE_LOADING_DURATION : 0)
  }

}
