<template lang="pug">
.tv-lines
  slot
</template>

<script lang="ts" setup>
</script>

<style lang="stylus">
.tv-lines
  --line-base: 2px
  --line-spacing: 0.5px
  mask-image: repeating-linear-gradient(
    black, black var(--line-base),
    transparent calc(var(--line-base) + var(--line-spacing))
  )
</style>
