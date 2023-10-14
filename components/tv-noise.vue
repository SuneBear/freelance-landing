<template lang="pug">
.tv-noise
  canvas(
    width="1024px"
    height="1024px"
    ref="canvasRef"
  )
</template>

<script lang="ts" setup>
import { useRafFn } from '@vueuse/core'

const canvasRef = ref<HTMLCanvasElement>()

onMounted(() => {
  setupCanvas()
})

const setupCanvas = () => {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return

  let w = ctx.canvas.width,
      h = ctx.canvas.height,
      idata = ctx.createImageData(w, h),
      buffer32 = new Uint32Array(idata.data.buffer),
      len = buffer32.length,
      i = 0

  const noise = (ctx: CanvasRenderingContext2D) => {
    for(i=0; i < len;)
        buffer32[i++] = ((255 * Math.random())|0) << 24
    ctx.putImageData(idata, 0, 0)
  }

  // Limit noise fps
  let frame = 0
  useRafFn(() => {
    frame++
    if (frame % 4) {
      return
    }
    noise(ctx)
  })
}
</script>

<style lang="stylus">
// @TODO：优化噪点样式
.tv-noise
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100000;
  opacity: 0.3;
  pointer-events: none;
  mix-blend-mode: color-dodge;

  canvas
    width: 100%
    height: 100%
    filter: invert(70%)
</style>
