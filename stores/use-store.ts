import { defineStore } from 'pinia'

type MainState = {
  ui: {
    isLoading: boolean
    loadingProgress: number

    cursor: {
      x: number,
      y: number
    },

    viewport: {
      width: number,
      height: number
    },

    scrollSpeed: number
    swellProgress: number
    contentScrollProgress: number
    heroEnterProgress: number
    heroUIStart: boolean
    heroScrollLeaveProgress: number
    galleryScrollProgress: number
    collabScrollProgress: number
    collabHeight: number
  },
  context: {
    lastPath: string
    isInited: boolean
  }
}

export const useStore = defineStore('main', {
  state: () => ({
    ui: {
      isLoading: true,
      loadingProgress: 0,

      cursor: {
        x: 0,
        y: 0
      },

      viewport: {
        width: 0,
        height: 0
      },

      scrollSpeed: 0,
      swellProgress: 0,
      contentScrollProgress: 0,
      heroEnterProgress: 0,
      heroUIStart: false,
      heroScrollLeaveProgress: 0,
      galleryScrollProgress: 0,
      collabScrollProgress: 0,
      collabHeight: 0,
    },

    context: {
      lastPath: '/',
      isInited: false
    },
  } as MainState),

  getters: {
  },

  actions: {

  }
})
