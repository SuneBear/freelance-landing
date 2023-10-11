<template lang="pug">
span.text-scramble-shuffle(
  @mouseenter="handleMouseEnter"
)
  span.char(
    v-for="(char, i) in displayedText"
  ) {{ char }}
</template>

<script lang="ts" setup>
import { getRandomText } from '@/utils/typing-content'
import { useIntervalFn } from '@vueuse/core'

const props = withDefaults(defineProps<{
  enableHover?: boolean
  forcePlay?: boolean
  needMask?: boolean
  text: string
  playingDuration?: number
  shuffleSpeed?: number
}>(), {
  enableHover: true,
  playingDuration: 200,
  shuffleSpeed: 100
})

const isPlaying = ref(false)

const isChinese = (char: string) => char && char.match(/[\u3400-\u9FBF]/)

const generateRandomTexts = () => {
  return props.text.split('').map(str => {
    if (str === ' ') return str
    return getRandomText(isChinese(str) ? 'cn' : 'en')
  }).join('')
}

const displayedText = ref(props.needMask ? generateRandomTexts() : props.text)


watch(() => props.forcePlay, () => {
  if (props.forcePlay) {
    playShuffle()
  }
})

const playShuffle = () => {
  if (isPlaying.value) return

  isPlaying.value = true

  const { pause } = useIntervalFn(() => {
    displayedText.value = generateRandomTexts()
  }, props.shuffleSpeed)

  setTimeout(() => {
    pause()
    isPlaying.value = false
    displayedText.value = props.text
  }, 1000)
}

const handleMouseEnter = () => {
  if (!props.enableHover || isPlaying.value) return

  playShuffle()
}
</script>

<style lang="stylus">
.text-scramble-shuffle
  null
</style>
