import { defineStore } from 'pinia'

type MainState = {
  ui: {
    isLoading: boolean
    loadingProgress: number
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
