<template lang="pug">
.page.page-home( ref="scrollContainer" )
  initial-loading(
    v-if="config.public.needLoading"
  )

  .sketch-container( ref="sketchContainer" )

  .section.section-contact.flex.flex-col.items-center.gap-5vh
    business-card
</template>

<script lang="ts" setup>
import { init } from '@/components/landing-sketch'

const config = useRuntimeConfig()
const scrollContainer = ref<HTMLDivElement>()

const initSketch = () => {
  init({
    scrollContainer: scrollContainer.value
  })
}

onMounted(() => {
  initSketch()
})
</script>

<style lang="stylus">
.page.page-home
  margin: 0 auto
  // max-width: 1000px
  // padding: 20px fluid-value(20, 100)

  .section
    width: 100%
    height: 100vh
    height: 100dvh
    background-color: #FFFFFA

  .section-contact
    padding-top: 25dvh

    @media $mediaInMobile
      padding-top: 10dvh
</style>
