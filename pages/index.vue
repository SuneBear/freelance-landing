<template lang="pug">
.page.page-home
  h2 Home
  .flex.align-center.my-2
    .brand-color.mr-2( :style="{ color: 'var(--brand)' }" ) Brand Color
    nuxt-icon( name="youtube" )

  theme-switcher

  .section.section-contact.flex.flex-col.items-center.gap-5vh
    business-card
</template>

<script lang="ts" setup>
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
