<template lang="pug">
.workflow-item(
  data-augmented-ui="tr-clip-x br-clip border"
  :style="{ '--theme': themeColor, '--width': width  }"
)
  .workflow-header.flex.gap-2.items-center
    .workflow-emoji {{ iconEmoji }}
    .workflow-title {{ title }}
  .divider
  .workflow-body
    slot
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  title: string
  iconEmoji: string
  order?: number
  themeColor?: string
  direction?: string
  width?: string
}>(), {
  order: 0,
  title: '',
  iconEmoji: '',
  width: '400px',
  themeColor: '#808080',
  // @values: normal | reverse
  direction: 'normal'
})
</script>

<style lang="stylus">
.workflow-item
  // background-color: white
  --aug-border-all: 1px
  --aug-border-bg: var(--theme)
  --aug-br: 8px
  --aug-tr: 7px
  --aug-tr-inset2: 60%
  max-width: var(--width)
  position relative

  &:before
    content: ''
    position absolute
    inset 0
    background: var(--theme)
    opacity: 0.08
    z-index -1

  & + .workflow-item
    margin-top: fluid-value(32, 48)

  .workflow-emoji
    font-size: 1.8em

  .workflow-header
    padding: 8px 20px
    font-weight: 500
    font-size: 18px

  .divider
    width: 100%
    height: 1px
    opacity: 0.3
    background-color var(--theme)

  .workflow-body
    padding: 20px
    color: $primary87
</style>
