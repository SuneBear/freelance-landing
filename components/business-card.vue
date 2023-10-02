<template lang="pug">
hover-spotlight-card.business-card.flex.gap-40px(
  class="lt-sm:flex-col"
  :rotateFactor="5"
  :light-size="500"
  enableOutside
  :lightSize="200"
  :enableParallax="!$device.isSafari"
  @click="handleCardClick"
  data-augmented-ui="tr-clip bl-clip br-clip-y both"
)
  sune-creepy-face.flex-shrink-0
  .main-part.flex.flex-col.flex-1.flex-justify-between
    .top-part
      h2.info-name.my-0 熊舒乐
      h3.info-title.mt-2 {{age}} 岁 · 爱切图的前端工程师

    .bottom-part.text-right
      p.my-0.into-contact.font-chakra( @click.stop="handleCopyClick(wechat)" ) 微信：{{ wechat }}
      p.my-0.into-contact.font-chakra( @click.stop="handleCopyClick(email)" ) 邮箱：{{ email }}
</template>

<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'
const { copy } = useClipboard()

const birthDate = new Date('1994-10-11')
const nowDate = new Date()
const wechat = 'SUNE94'
const email = 'Hi@SuneBear.com'
const age = computed(() => {
  return nowDate.getFullYear() - birthDate.getFullYear()
})

const handleCardClick = () => {
  // window.open(`mailto:${email}?subject=前端外包合作`)
}

const handleCopyClick = (val: string) => {
  // copy(val)
}
</script>

<style lang="stylus">
.business-card
  --radius: 2px
  --light-color: brand(5)
  padding: 30px
  padding-right: 37px
  width: s('min(80vw, 500px)')
  aspect-ratio: 1/0.55
  // cursor pointer
  // border: solid 0.5px #eee
  --aug-border-all: 2px
  --aug-border-bg: #f2f2f2
  --aug-inlay-all: 4px
  // --aug-inlay-bg: #fbfbfb
  --aug-inlay-bg: #fff

  @media $mediaInMobile
    aspect-ratio: 0.65/1

  activeState()
    background: white
    // box-shadow: 2px 2px 24px 0px rgba(0, 0, 0, 0.1)

  @media $mediaInMobile
    activeState()

  &:hover
    activeState()

  .main-part.tv-lines
    --mask-alpha: 0

  .info-name
    font-size: 40px
    font-weight: 100

  .info-title
    opacity: 0.7
    font-weight: 400
    font-size: fluid-value(16, 19)

  .into-contact
    opacity: 0.8
    font-size: fluid-value(14, 14)
</style>
