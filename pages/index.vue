<template lang="pug">
.page.page-home(
  :style="pageStyle"
)
  tv-frame
    .sketch-container( ref="sketchContainer" )

    initial-loading(
      v-if="config.public.needLoading"
    )

    //- 这次内容因为有一些不在 Frame 中，导致 Layer 分了好多层，这样无法 Pin 来 fixed，还需要手动同步滚动进度
    //- Fixed layer
    section-hero

    //- Scrollable frame layer
    .content-wrapper
      .section.section-hero
      //- .section.section-gallery
      section-collab

  .scroll-trigger
    .section.section-hero
    //- .section.section-gallery
    .section.section-collab

  //- Non frame content layer
  section-contact(
    :timelineProgress="contactTimelineProgress"
  )
</template>

<script lang="ts" setup>
import { preInit, init, resize } from '@/components/landing-sketch'
import { useResizeObserver } from '@vueuse/core'
import { useMouse } from '@vueuse/core'
import gsap from 'gsap'

const store = useStore()
const config = useRuntimeConfig()
const sketchContainer = ref()
const contactTimelineProgress = ref(0)

const pageStyle = computed(() => {
  return {
    '--collab-height': store.ui.collabHeight ? `${store.ui.collabHeight}px` : '100vh'
  }
})

const initSketch = () => {
  useResizeObserver(sketchContainer.value, async (entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect
    store.ui.viewport = {
      width,
      height
    }
    if (!store.context.isInited) {
      init({
        sketchContainer: sketchContainer.value,
        scrollContainer: document.body
      })
      store.context.isInited = true
    }
    resize(width, height)
  })
}

const setupScrollTrigger = () => {
  syncContentAndTriggerScrollTop()
  setupHeroScrollTrigger()
  setupCollabScrollTrigger()
  setupContactScrollTrigger()
}

// @Hack: 同步两个 Wrapper 的滚动值
const syncContentAndTriggerScrollTop = () => {
  const scrollSync = gsap.to('.content-wrapper', {
    scrollTrigger: {
      trigger: '.scroll-trigger',
      start: "top top",
      end: "bottom",
      markers: false,
      scrub: 1,
      id: 'scrollSync'
    },
    y: "-100%",
    ease: "none",
    onUpdate: function () {
      store.ui.contentScrollProgress = this.progress()
    }
  })
}

const setupHeroScrollTrigger = () => {
  gsap.to(store.ui, {
    scrollTrigger: {
      trigger: '.scroll-trigger .section-hero',
      markers: false,
      start: 'top',
      end: 'bottom 20%',
      scrub: 1,
      id: 'heroScrollLeaveProgress'
    },
    ease: "none",
    heroScrollLeaveProgress: 1
  })
}

const setupCollabScrollTrigger = () => {
  // @TODO: 支持配置 Scan 模式，可以和 collabScrollProgress 关联起来
  const tween = gsap.to(store.ui, {
    scrollTrigger: {
      trigger: '.scroll-trigger .section-collab',
      start: 'top center',
      // end: 'bottom 40%',
      scrub: 1,
      id: 'collabScrollProgress'
    },
    ease: "none",
    // collabScrollProgress: 1,
    onUpdate: () => {
      // 这样做就只支持单向扫描
      if (store.ui.collabScrollProgress > 1) return
      gsap.to(store.ui, {
        collabScrollProgress: "+=0.02",
        ease: 'none',
        duration: 0.2,
        // overwrite 会覆盖 store.ui 上所有的 tween，谨慎使用
        // overwrite: true,
        onUpdate: () => {
          // console.log('update', store.ui.collabScrollProgress)
        }
      })
    },
  })
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
    onUpdate: function () {
      contactTimelineProgress.value = this.progress()
      // console.log('this.$tsi.pageScrollProgress', this.$tsi.pageScrollProgress)
    }
  })
}

onMounted(() => {
  preInit()
  setupCursorListener()
  watch(() => store.ui.isLoading, (val) => {
    if (!val) {
      initSketch()
      initHeroAfterLoading()
    }
    setTimeout(() => {
      setupScrollTrigger()
    }, 0)
  })
})

const setupCursorListener = () => {
  const { x, y } = useMouse({ type: 'client' })

  store.ui.cursor.x = window.innerWidth / 1.7
  store.ui.cursor.y = window.innerHeight / 2

  watch([x, y], () => {
    store.ui.cursor.x = x.value
    store.ui.cursor.y = y.value
  })
}

const initHeroAfterLoading = () => {
  setTimeout(() => {
    store.ui.heroEnterProgress = 1
  }, 200)
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
    will-change: transform
    // transition: transform 168ms

  .scroll-trigger
    opacity: 0
    visibility: hidden

    .section-collab
      height: var(--collab-height, 100vh)

  .sketch-container
    position absolute
    width: 100%
    height: 100%
    // filter: invert(100%)

  .fixed-container
    position fixed
    width: 100%
    min-height: 100vh
    min-height: 100dvh
    z-index 3
    pointer-events: none

    > *
      position: absolute

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

  .section-gallery
    min-height: 200vh

</style>
