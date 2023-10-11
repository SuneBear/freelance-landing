<template lang="pug">
nuxt-layout( )
  nuxt-page
  svg-filters( v-if="!$device.isSafari" )
</template>

<script lang="ts" setup>
// @TODO: Import UI Kit
import '~/styles/main.styl'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  gsap.registerPlugin(ScrollToPlugin)
})
</script>

<style lang="stylus">
// Scaffolding
::selection
  background-color: brand(20)

body
  margin: 0
  font-family: "Noto Sans SC", "Inter", "Roboto", "Helvetica", "Arial", sans-serif
  color: $primary100
  font-size: 1rem
  line-height: 1.5
  letter-spacing: 0.00938em
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  -webkit-overflow-scrolling: touch
  overscroll-behavior-y: contain

  // Hide scrollbar
  &::-webkit-scrollbar
    width: 0px

  &::-webkit-scrollbar *
    background: transparent

  &::-webkit-scrollbar-thumb
    background: rgba(0,0,0,0.001) !important

  &.disable-scroll
    overflow: hidden

.font-chakra
  font-family: 'Chakra Petch', "Noto Sans SC", sans-serif

*, :before, :after
  box-sizing: border-box
</style>
