<template lang="pug">
.hover-spotlight-card(
  ref="el"
  :class="{ 'enable-parallax': enableParallax }"
  :style="{ '--light-size': `${lightSize}px`, ...transformStyle }"
)
  .spotlight( v-if="enableHover" )
  slot
</template>

<script setup lang="ts">
import { useMouseInElement } from '@vueuse/core'
import { clamp } from '@/utils/math'

const props = withDefaults(defineProps<{
  enableHover?: boolean,
  enableParallax: boolean,
  enableOutside: boolean,
  rotateFactor: number
  lightSize: number
}>(), {
  lightSize: 400,
  rotateFactor: 15,
  enableHover: true
})
const el = ref(null)

const cardMouse = useMouseInElement(el, { handleOutside: props.enableOutside })
const { elementX, elementY, isOutside } = cardMouse

const transformStyle = computed(() => {
  if (!props.enableParallax) return

  const x = cardMouse.elementX.value - cardMouse.elementWidth.value / 2
  const y = cardMouse.elementY.value - cardMouse.elementHeight.value / 2
  const mousePX = x / cardMouse.elementWidth.value
  const mousePY = y / cardMouse.elementHeight.value
  const rx = clamp(mousePX * props.rotateFactor, -props.rotateFactor * 2, props.rotateFactor * 2)
  const ry = clamp(mousePY * props.rotateFactor, -props.rotateFactor * 2, props.rotateFactor * 2)
  return {
    '--cursor-x': elementX.value,
    '--cursor-y': elementY.value,
    transform: (cardMouse.isOutside.value && !props.enableOutside) ? null : `perspective(800px) rotateY(${rx}deg) rotateX(${ry}deg)`
  }
})

defineExpose({
  isOutside
})

</script>

<style lang="stylus">
.hover-spotlight-card
  overflow: hidden
  position: relative
  --light-color: brand(8)
  --radius: 12px
  --border: 2px
  --y: s('calc(var(--cursor-y) * 1px)')
  --x: s('calc(var(--cursor-x) * 1px)')

  &.enable-parallax
    transition: all 318ms, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)
    transform-style: preserve-3d

  .spotlight
    pointer-events: none;
    user-select: none;
    position: absolute;
    z-index: 1;
    opacity: 0;
    top: var(--border);
    bottom: var(--border);
    left: var(--border);
    right: var(--border);
    border-radius: var(--radius);
    will-change: background, opacity;
    background: radial-gradient(var(--light-size) circle at var(--x) var(--y), var(--light-color),transparent)
    contain: strict
    transition: opacity 400ms ease 0s

  &:hover
    .spotlight
      opacity: 1

  /html.dark &
    --light-color: rgba(255,255,255,0.1)
</style>
