<template lang="pug">
.tv-detector
</template>

<script lang="ts" setup>
</script>

<style lang="stylus">
@keyframes detectorMove
  50%,
  to
    transform: translate3d(0, -70%, 0)

.tv-detector
  position: absolute
  left: 0
  top: 0
  background-repeat: no-repeat
  z-index: 233
  width: 100%
  height: 200%
  background-repeat: no-repeat
  background-position: center left
  background-image: url('@/assets/detector.png')
  background-size: 100% auto
  transform: translate3d(0, 10%, 0)
  filter: invert(100%)
  animation: detectorMove 3630ms linear infinite
  pointer-events: none
  will-change: transform
</style>
