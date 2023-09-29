import * as THREE from 'three'
import { loadingManager } from './common'
import { assetManager } from './asset'

export const init = ({
  scrollContainer = document.body
}) => {
  const store = useStore()
  assetManager.loadDefaultAssets()
  listenToLoading()
  console.log('Init options', scrollContainer)
}

const listenToLoading = () => {
  const store = useStore()

  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    store.ui.loadingProgress = itemsLoaded / itemsTotal
  }

  loadingManager.onLoad = () => {
    store.ui.isLoading = false
    console.log('Loaded')
  }

}
