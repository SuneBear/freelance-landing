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

    contentScrollProgress: number
    heroEnterProgress: number
    heroScrollLeaveProgress: number

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

      contentScrollProgress: 0,
      heroEnterProgress: 0,
      heroScrollLeaveProgress: 0,
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
