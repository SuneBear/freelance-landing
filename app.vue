<template lang="pug">
nuxt-layout( keepalive )
  nuxt-page
</template>

<script lang="ts" setup>
// @TODO: Import UI Kit
import '~/styles/main.styl'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

</script>

<style lang="stylus">
// Scaffolding
body
  margin: 0
  font-family: "Noto Sans SC", "Inter", "Roboto", "Helvetica", "Arial", sans-serif
  color: $primary100
  font-size: 1rem
  line-height: 1.5
  letter-spacing: 0.00938em
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  background-color: var(--bg-color)

  &.disable-scroll
    overflow: hidden

.font-chakra
  font-family: 'Chakra Petch', "Noto Sans SC", sans-serif

*, :before, :after
  box-sizing: border-box
</style>
