<template lang="pug">
.tv-lines
  slot
</template>

<script lang="ts" setup>
</script>

<style lang="stylus">
// 这里可能改成 Background 的形式更好一点
.tv-lines
  --line-base: 2px
  --line-spacing: 0.5px
  --mask-alpha: 0.5
  mask-image: repeating-linear-gradient(
    black, black var(--line-base),
    s('rgba(0,0,0, var(--mask-alpha))') calc(var(--line-base) + var(--line-spacing))
  )

  &.bg-mode
    background-image: linear-gradient(transparent 0%, rgba(10, 16, 10, 0.3) 50%)
    background-size: 1000px 2px
</style>
