<template lang="pug">
.page.page-home
  tv-frame
    .sketch-container( ref="sketchContainer" )

    .content-wrapper
      .section.section-loading
        initial-loading(
          v-if="config.public.needLoading"
        )
      .section.section-hero
      .section.section-gallery
      .section.section-collab

  .scroll-trigger
    .section-loading
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
  // @FIXME: 同步两个 Wrapper 的滚动值
  gsap.to('.content-wrapper', {
    scrollTrigger: {
      trigger: '.scroll-trigger',
      ease: "none",
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    },
    y: "-100%",
    ease: "none"
  })

  setupContactScrollTrigger()
}

const setupContactScrollTrigger = () => {
  gsap.to('.content-wrapper', {
    scrollTrigger: {
      trigger: '.section-contact',
      scrub: 1
    },
    // y: "50vh",
    opacity: 0.1
  })
}

onMounted(() => {
  initSketch()
  setupScrollTrigger()
  scrollToHeroAfterLoading()
})

const scrollToHeroAfterLoading = () => {
  watch(() => store.ui.isLoading, () => {
    console.log("TODO: Switch to hero")
  })
}

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

  .content-wrapper
    position relative
    z-index 2

  .scroll-trigger
    opacity: 0

  .sketch-container
    position absolute
    width: 100%
    height: 100%

  .section
    position relative
    width: 100%
    min-height: 100vh
    min-height: 100dvh
    // background-color: var(--bg-color)
    // background-color: white

  .section-hero
    // background: red

  .section-contact
    padding-top: 25dvh
    background-color: white
    z-index: 233

    @media $mediaInMobile
      padding-top: 10dvh
</style>
