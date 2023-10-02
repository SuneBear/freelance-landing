<template lang="pug">
.mask-scan-reveal(
  ref="el"
  :style="rootStyles"
)
  .mask-cursor.flex.justify-center(
    v-if="needCursor && progress < 1 && progress > 0"
  )
    .cursor-text 扫描中
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
const BAR_GAP_PROGRESS = 0.333
const BAR_SYNC_AMOUNT = (1 - BAR_GAP_PROGRESS) / BAR_GAP_PROGRESS

const BAR_DELAY    = 100
const RENDER_DELAY = 1 + 280 - BAR_DELAY
const BAR_DURATION = 130

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
  pageEnterBarIndex: 0,
  pageEnterBarProgress: 0
})

useResizeObserver(el, (entries) => {
  const entry = entries[0]
  state.pageWidth = entry.contentRect.width
})

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
      positions.push(`${width}px`)
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
    '--cursor-transform': `translate3d(0, ${(state.pageEnterBarIndex) * 100}%, 0)`,
    '--cursor-text-transform': `translate3d(${state.pageWidth * state.pageEnterBarProgress}px, 0, 0)`,
    '--reveal-position-x': positions.join(','),
    '--placeholder-position-x': props.needPlaceholder && placeholderPositions.join(',')
  }
})

watchEffect(() => {
  const bar = props.progress / 0.02
  state.pageEnterBarIndex = Math.trunc(bar)
  state.pageEnterBarProgress = bar - state.pageEnterBarIndex
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
      // transform: var(--cursor-text-transform)
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
