<template lang="pug">
hover-spotlight-card.business-card.flex.gap-40px(
  class="lt-sm:flex-col"
  :rotateFactor="5"
  :light-size="500"
  enableOutside
  enableParallax
  @click="handleCardClick"
)
  sune-creepy-face.flex-shrink-0
  .main-part.flex.flex-col.flex-1.flex-justify-between
    .top-part
      h2.info-name.my-0 熊舒乐
      h3.info-title.mt-2 {{age}} 岁 · 前端工程师

    .bottom-part.text-right
      p.my-0.into-contact( @click.stop="handleCopyClick(wechat)" ) 微信：{{ wechat }}
      p.my-0.into-contact( @click.stop="handleCopyClick(email)" ) 邮箱：{{ email }}
</template>

<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'
const { copy } = useClipboard()

const birthDate = new Date('1994-10-11')
const nowDate = new Date()
const wechat = 'sune94'
const email = 'hi@sunebear.com'
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
  width: s('min(80vw, 500px)')
  aspect-ratio: 1/0.55
  // cursor pointer

  @media $mediaInMobile
    aspect-ratio: 0.65/1

  activeState()
    background: white
    box-shadow: 2px 2px 24px 0px rgba(0, 0, 0, 0.1)

  @media $mediaInMobile
    activeState()

  &:hover
    activeState()

  // @TODO: 把 Mask 抽象成组件
  .main-part
    mask-image: repeating-linear-gradient(black, black 2px, transparent 2.5px)

  .info-name
    font-size: 40px
    font-weight: 100

  .info-title
    opacity: 0.7
    font-weight: 400

  .into-contact
    opacity: 0.8
</style>
