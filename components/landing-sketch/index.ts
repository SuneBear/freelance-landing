import * as THREE from 'three'
import { gsap } from 'gsap'
import { loadingManager } from './common'
import { assetManager } from './asset'
import { clock, runLoop } from './loop'

const MIN_LOADING_DURATION = 5000
const LEAVE_LOADING_DURATION = 1200

export const init = ({
  scrollContainer = document.body
}) => {
  const store = useStore()
  assetManager.loadDefaultAssets()
  runLoop(loop)
  listenToLoading()
  console.log('Init options', scrollContainer)
}

// @TODO: 传 World Loop 进度
const loop = () => {

}

const listenToLoading = () => {
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
    const delay = getTimeDelay()
    // @TODO: 和 RAF 关联起来
    setTimeout(() => {
      store.ui.isLoading = false
      console.log('Loaded')
    }, config.public.needLoading ? delay + LEAVE_LOADING_DURATION : 0)
  }

}
