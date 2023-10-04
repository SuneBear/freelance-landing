<template lang="pug">
.fixed-container
  .section.section-hero
    //- .text Hero Title
    focus-card.scroll-tips
     | 滚动了解我的工作流程
</template>

<script lang="ts" setup>
</script>

<style lang="stylus">
.fixed-container .section-hero
  opacity: 0

  .scroll-tips
    text-align: center
    width: 220px
    position absolute
    bottom: 30px
    left: 50%
    transform: translateX(-50%)
</style>
