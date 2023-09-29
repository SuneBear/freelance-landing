<template lang="pug">
.page.page-home
  tv-frame
    initial-loading(
      v-if="config.public.needLoading"
    )

    .sketch-container( ref="sketchContainer" )

  .section.section-hero
  .section.section-gallery
  .section.section-collab

  .section.section-contact.flex.flex-col.items-center.gap-5vh
    business-card
</template>

<script lang="ts" setup>
import { init } from '@/components/landing-sketch'
import gsap from 'gsap'

const store = useStore()
const config = useRuntimeConfig()

const initSketch = () => {
  init({
    scrollContainer: document.body
  })
}

const setupScrollTrigger = () => {
  setupContactScrollTrigger()
}

const setupContactScrollTrigger = () => {
  gsap.to('.tv-frame-wrapper', {
    scrollTrigger: {
      trigger: '.section-contact',
      ease: "none",
      scrub: 1
    },
    // y: "50vh",
    opacity: 0.1
  })
}

onMounted(() => {
  initSketch()
  setupScrollTrigger()
})

useHead({
  bodyAttrs: {
    class: computed(() => {
      return store.ui.isLoading ? 'disable-scroll' : ''
    }),
  },
});
</script>

<style lang="stylus">
.page.page-home
  margin: 0 auto
  // max-width: 1000px
  // padding: 20px fluid-value(20, 100)

  .scroll-trigger
    // height: 300vh

  .section
    width: 100%
    min-height: 100vh
    min-height: 100dvh
    // background-color: var(--bg-color)
    // background-color: white

  .section-contact
    padding-top: 25dvh
    position relative
    z-index 233
    background-color: white

    @media $mediaInMobile
      padding-top: 10dvh
</style>
