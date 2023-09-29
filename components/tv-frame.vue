<template lang="pug">
.tv-frame-wrapper
  .tv-frame
    .tv-screen
      .tv-screen-overlay
        img(src="@/assets/frame.png")
      tv-noise
      tv-detector
      tv-lines.tv-content
        slot
</template>

<script lang="ts" setup>
</script>

<style lang="stylus">
.tv-frame
  --frame-size: 0
  position fixed
  z-index: 2
  top: 50%
  left: 50%
  transform: translate3d(-50%, -50%, 0)
  padding: var(--frame-size)
  width: 100%
  // max-width: s('min(80vw, 1200px)')

  @media $mediaInDesktop
    // aspect-ratio 4/3
    height: 100%

  @media $mediaInMobile
    height: 100%
    max-width: 100vw

  &-wrapper
    min-height: 100vh
    min-height: 100dvh
    width: 100%
    position fixed
    z-index: 20

  .tv-screen
    position absolute
    inset: var(--frame-size)
    overflow: hidden

  .tv-screen-overlay
    --offset: -6%
    opacity: 0.85
    position: absolute
    inset: var(--offset)
    z-index: 10
    pointer-events: none
    mix-blend-mode: difference

    > img
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: fill

  .tv-content
    position relative
    width: 100%
    height: 100%
    background-color: var(--bg-color)
    // mask-image: url('./assets/tv-mask.png')
    // mask-size: cover
</style>
