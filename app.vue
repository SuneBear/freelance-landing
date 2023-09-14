<template lang="pug">
nuxt-layout( keepalive )
  nuxt-page
</template>

<script lang="ts" setup>
// @TODO: Import UI Kit
import '~/styles/main.styl'
</script>

<style lang="stylus">
// Scaffolding
body
  margin: 0
  font-family: "Inter", "Roboto", "Helvetica", "Arial", sans-serif
  background: $secondary100
  color: $primary100
  font-size: 1rem
  line-height: 1.5
  letter-spacing: 0.00938em
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale

*, :before, :after
  box-sizing: border-box
</style>
