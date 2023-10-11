<template lang="pug">
transition( @leave="onLeave" :css="false" )
  .initial-loading.anim-squiggly( v-if="store.ui.isLoading" )
    .flex.flex-col.items-center.justify-center.pt-30vh
      .loading-text.flex.justify-between
        text-scramble-loading(
          :paused="store.ui.loadingProgress >= 1"
        )
        //- .percent.font-chakra {{ percent }}

      loading-progress(
        :progress="store.ui.loadingProgress"
      )
</template>

<script lang="ts" setup>
import gsap from 'gsap'
const store = useStore()

const percent = computed(() => {
  return store.ui.loadingProgress * 100 + '%'
})

const onLeave = async (el: HTMLElement, done: () => void) => {
  await gsap.to(el, {
    opacity: 0,
    duration: 0.5
  })
  done()
}
</script>

<style lang="stylus">
.initial-loading
  position absolute
  z-index: 23
  width: 100%
  height: 100%
  background: var(--bg-color)

  .loading-text
    margin-bottom: 20px
    font-size: fluid-value(26, 56)

  .text-scramble
    font-weight: bold

  .percent
    position relative
    top: -2px
    font-size: 12px
    opacity: 0.7
</style>
