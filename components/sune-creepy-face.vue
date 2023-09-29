<template lang="pug">
.sune-creepy-face(
  data-augmented-ui="tr-clip bl-clip br-clip-y both"
)
  img(
    :class="{ 'need-flip': needFlip }"
    ref="faceImg"
    src="/sune-creepy-face/serious.jpg"
  )
</template>

<script lang="ts" setup>
import creepyface from 'creepyface'

const faceImg = ref<HTMLImageElement>()
const needFlip = ref(false)

const initFace = () => {
  if (!faceImg.value) return

  // @TODO: 重新拍一组度数颗粒更小的
  creepyface(faceImg.value, {
    hover: '/sune-creepy-face/hover.jpg',
    looks: [
      { angle: 0, src: '/sune-creepy-face/0.jpg' },
      { angle: 45, src: '/sune-creepy-face/45.jpg' },
      { angle: 45 + 270, src: '/sune-creepy-face/45.jpg' },
      { angle: 90, src: '/sune-creepy-face/90.jpg' },
      { angle: 90 + 180, src: '/sune-creepy-face/90.jpg' },
      { angle: 135, src: '/sune-creepy-face/135.jpg' },
      { angle: 135 + 90, src: '/sune-creepy-face/135.jpg' },
      { angle: 180, src: '/sune-creepy-face/180.jpg' },
    ],
    fieldOfVision: 0,
    // timeToDefault: -1,
    timeToDefault: 1500,
    onDebug: ({src, point, angle}) => {
      needFlip.value = angle as number > 200
        && !src.includes('180.jpg')
        && !src.includes('/0.jpg')
    }
  })
}

onMounted(() => {
  initFace()
})
</script>

<style lang="stylus">
.sune-creepy-face
  --aug-border-all: 2px
  --aug-border-bg: '#383838'
  --aug-tr: 10px
  --aug-bl: 13px
  --aug-br: 10px
  width: 144px
  height: 144px
  background-image: linear-gradient(transparent 0%, rgba(187, 187, 187, 0.5) 50%)
  background-size: 1000px 3px
  // border-top-left-radius: 10px
  overflow hidden

  img
    display: block
    width: 100%
    height: 100%
    opacity: 0.6

    &.need-flip
      transform: scaleX(-1)
</style>
