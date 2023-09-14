<template lang="pug">
.page.page-home
  h2 Home
  .flex.align-center.my-2
    .brand-color.mr-2( :style="{ color: 'var(--brand)' }" ) Brand Color
    nuxt-icon( name="youtube" )

  theme-switcher
</template>

<script lang="ts" setup>
</script>

<style lang="stylus">
.page.page-home
  max-width: 1000px
  margin: 0 auto
  padding: 20px fluid-value(20, 100)
</style>
