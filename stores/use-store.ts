import { defineStore } from 'pinia'

type MainState = {
  ui: {
    isLoading: boolean
    loadingProgress: number

    contentScrollProgress: number
    heroScrollEnterProgress: number
    heroScrollLeaveProgress: number

    collabScrollProgress: number
    collabHeight: number
  },
  context: {
    lastPath: string
  }
}

export const useStore = defineStore('main', {
  state: () => ({
    ui: {
      isLoading: true,
      loadingProgress: 0,

      contentScrollProgress: 0,
      heroScrollEnterProgress: 0,
      heroScrollLeaveProgress: 0,
      collabScrollProgress: 0,
      collabHeight: 0,
    },

    context: {
      lastPath: '/',
    },
  } as MainState),

  getters: {
  },

  actions: {

  }
})
