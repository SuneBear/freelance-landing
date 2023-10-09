<template lang="pug">
.mask-scan-reveal(
  ref="el"
  :style="rootStyles"
)
  .mask-cursor.flex.justify-center(
    v-if="needCursor && progress < 1 && progress > 0"
  )
    .cursor-text {{ state.isRunning ? '扫描中' : '请滚动' }}
  .mask-layer.placeholder-layer(
    v-if="needPlaceholder"
  )
  .mask-layer.reveal-layer(
  )
    slot
</template>

<script lang="ts" setup>
import anime from 'animejs'
import { useResizeObserver } from '@vueuse/core'

const PAGE_BAR_AMOUNT = 50
// const BAR_GAP_PROGRESS = 1
const BAR_GAP_PROGRESS = 0.333
const BAR_SYNC_AMOUNT = (1 - BAR_GAP_PROGRESS) / BAR_GAP_PROGRESS

const BAR_DELAY    = 100
const RENDER_DELAY = 1 + 280 - BAR_DELAY
const BAR_DURATION = 530

const props = withDefaults(defineProps<{
  progress: number,
  needCursor: boolean
  needPlaceholder: boolean
}>(), {
  progress: 0,
  needCursor: true,
  needPlaceholder: false,
})

const el = ref(null)

const state = reactive({
  pageWidth: 0,
  isRunning: false,
  runningTime: 4,
  pageEnterBarIndex: 0,
  pageEnterBarProgress: 0
})

useResizeObserver(el, (entries) => {
  const entry = entries[0]
  state.pageWidth = entry.contentRect.width
})

const animate = () => {
  if (state.isRunning) return

  const animeOptions = () => ({
    targets: state,
    delay: state.pageEnterBarProgress ? 0 : BAR_DELAY * 3,
    duration: BAR_DURATION * (1.4 - state.pageEnterBarProgress),
    pageEnterBarProgress: 1,
    easing: 'linear',
    complete: () => {
      if (
        state.pageEnterBarIndex + 1 >= PAGE_BAR_AMOUNT
      ) {
        return
      } else {
        state.pageEnterBarIndex += 1
        state.pageEnterBarProgress = 1 - BAR_GAP_PROGRESS
      }
      state.runningTime--
      if (state.runningTime > 0) {
        anime(animeOptions())
      } else {
        state.isRunning = false
      }
    }
  })

  state.isRunning = true
  state.runningTime = 4
  anime(animeOptions())
}

// @TODO: 优化 Placeholder 动画
const rootStyles = computed(() => {
  if (!state.pageWidth) return

  const positions = []
  const placeholderPositions = []
  const pageLeaveBarIndex = 50 - state.pageEnterBarIndex
  const pageLeaveBarProgress = 1 - state.pageEnterBarProgress

  for (let i = 0; i < PAGE_BAR_AMOUNT; ++i) {
    const enterBarDiff = i - state.pageEnterBarIndex
    const leaveBarDiff = i - pageLeaveBarIndex

    if (
      i >= state.pageEnterBarIndex &&
      enterBarDiff <= BAR_SYNC_AMOUNT
    ) {
      const width = (state.pageEnterBarProgress - BAR_GAP_PROGRESS * enterBarDiff - 1) * state.pageWidth
      positions.push(`${width * 2}px`)
    } else if (i > state.pageEnterBarIndex) {
      positions.push(`${-state.pageWidth}px`)
    } else {
      positions.push(0)
    }

    if (
      i >= state.pageEnterBarIndex &&
      enterBarDiff <= BAR_SYNC_AMOUNT
    ) {
      const width = (state.pageEnterBarProgress - BAR_GAP_PROGRESS * enterBarDiff - 1) * state.pageWidth
      placeholderPositions.push(`${state.pageWidth + width / 2}px`)
    } else if (i > state.pageEnterBarIndex + 1) {
      placeholderPositions.push(0)
    } else {
      placeholderPositions.push(`${state.pageWidth}px`)
    }
  }

  return {
    '--cursor-transform': `translate3d(0, ${(state.pageEnterBarIndex + 2) * 100}%, 0)`,
    // '--cursor-text-transform': `translate3d(${state.pageWidth * state.pageEnterBarProgress / 2}px, 0, 0)`,
    '--reveal-position-x': positions.join(','),
    '--placeholder-position-x': props.needPlaceholder && placeholderPositions.join(',')
  }
})

watch(() => props.progress, () => {
  animate()

  if (props.progress >= 1) {
    state.pageEnterBarIndex = PAGE_BAR_AMOUNT
  }
  // @hack: 用 progress 计算出 barIndex
  // const bar = props.progress / 0.02
  // state.pageEnterBarIndex = props.barIndex
  // state.pageEnterBarProgress = bar - state.pageEnterBarIndex
})

defineExpose({
  el
})
</script>

<style lang="stylus">
  barsMaskImage(amount = 50)
    amount += -1
    image = s('')
    for num in (1..amount)
      image += 'linear-gradient(to right, black, black),'
    image += 'linear-gradient(to right, black, black)'
    return image

  barsMaskPositionY(amount = 50)
    amount += -1
    position = s('')
    for num in (1..amount)
      position += s('100vw ' + (num - 1) * 2.1 + '%,')
    position += s('100vw 98%')
    return position

.mask-scan-reveal
  position relative
  overflow: hidden

  .mask-layer
    mask-repeat: no-repeat
    mask-size: 100% 2.5%
    mask-image: barsMaskImage()
    mask-position: barsMaskPositionY()

  .mask-cursor
    position absolute
    z-index 3
    height: 2.22%
    width: 100%
    border-top: 1px solid brand(100)
    transform: var(--cursor-transform)

    .cursor-text
      position relative
      padding: 0 12px
      height: 22px
      background: brand(30)
      font-size: 12px
      transform: var(--cursor-text-transform)
      // transition: 168ms

  .placeholder-layer
    position absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index 2
    pointer-events: none
    -webkit-mask-position-x: var(--placeholder-position-x)
    background: linear-gradient(to right, white 0%, #fafafa 14.2857142857%, #ffe60a 14.2857142857%, #f5dc00 28.5714285714%, #0affd9 28.5714285714%, #00f5ce 42.8571428571%, #10ea00 42.8571428571%, #0ed600 57.1428571429%, #ff0afe 57.1428571429%, #f500f4 71.4285714286%, #ed0014 71.4285714286%, #d90012 85.7142857143%, #002fc6 85.7142857143%, #002bb2 100%)

  .reveal-layer
    -webkit-mask-position-x: var(--reveal-position-x)

</style>
