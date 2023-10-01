<template lang="pug">
.section.section-contact(
  :style="{ '--card-progress': businessCardProgress }"
)
  .pin-container.flex.flex-col.items-center.gap-5vh
    text-split-typing.contact-title(
      text="感谢浏览，期待与你创造有趣的事物"
      :progress="heroTypingProgress"
    )
    .card-wrapper
      business-card
    .footer 最后更新于 {{ lastUpdatedDate }}
</template>

<script lang="ts" setup>
import gsap from 'gsap'
import { useDateFormat } from '@vueuse/core'

const props = withDefaults(defineProps<{
  timelineProgress: number
}>(), {
  timelineProgress: 0
})
const config = useRuntimeConfig()
const store = useStore()

const heroTypingProgress = ref(-0.01)
const businessCardProgress = ref(0)

const lastUpdatedDate = useDateFormat(new Date(config.public.buildTime), 'YYYY-MM-DD')

const setupAnimation = () => {
  const tl = gsap.timeline({
    paused: true,
    ease: 'none'
  })

  tl
    .to(heroTypingProgress, {
      value: 1,
      duration: 1
    })
    .to(businessCardProgress, {
      value: 1,
      delay: 0.2,
      duration: 0.4
    })

  watch(() => props.timelineProgress, () => {
    tl.progress(props.timelineProgress)
  })
}

onMounted(() => {
  setupAnimation()
})
</script>

<style lang="stylus">
.section-contact
  padding-top: 16dvh
  // background-color: white
  z-index: 233
  position relative

  @media $mediaInMobile
    padding-top: 6dvh

  .contact-title
    font-size: fluid-value(20, 40)
    font-weight: 300
    // opacity: calc(1 - var(--card-progress))

  .card-wrapper
    transform: translate3d(0, calc((1 - var(--card-progress)) * 10%), 0)
    opacity: var(--card-progress)

  .footer
    position absolute
    left: 50%
    transform: translateX(-50%)
    bottom: 20px
    opacity: 0.5
    font-size: 0.8em

</style>
