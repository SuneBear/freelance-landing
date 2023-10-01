<template lang="pug">
.page.page-home
  tv-frame
    .sketch-container( ref="sketchContainer" )

    initial-loading(
      v-if="config.public.needLoading"
    )

    .content-wrapper
      //- .section.section-hero
      //- .section.section-gallery
      section-collab

  .scroll-trigger
    //- .section.section-hero
    //- .section.section-gallery
    .section.section-collab

  section-contact(
    :timelineProgress="contactTimelineProgress"
  )
</template>

<script lang="ts" setup>
import { init } from '@/components/landing-sketch'
import gsap from 'gsap'

const store = useStore()
const config = useRuntimeConfig()
const contactTimelineProgress = ref(0)

const initSketch = () => {
  init({
    scrollContainer: document.body
  })
}

const setupScrollTrigger = () => {
  // @FIXME: 同步两个 Wrapper 的滚动值
  const scrollSync = gsap.to('.content-wrapper', {
    scrollTrigger: {
      trigger: '.scroll-trigger',
      start: "top top",
      // end: "bottom",
      markers: false,
      scrub: 1
    },
    y: "-100%",
    ease: "none",
    onUpdate: () => {
    }
  })

  setupContactScrollTrigger()
}

const setupContactScrollTrigger = () => {
  const tween = gsap.to('.tv-frame', {
    scrollTrigger: {
      trigger: '.section-contact',
      markers: false,
      start: '-20% top',
      end: 'bottom bottom',
      scrub: 1
    },
    ease: "none",
    scale: 1.5,
    opacity: 0,
    onUpdate: () => {
      contactTimelineProgress.value = tween.progress()
      // console.log('this.$tsi.pageScrollProgress', this.$tsi.pageScrollProgress)
    }
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
    visibility: hidden

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

  .section-collab
    min-height: 50vh

  .section-hero
    // background: red

</style>
