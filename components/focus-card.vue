<template lang="pug">
.focus-card(
  :class="{ 'has-handle': !!onClick }"
  @click="handleCardClick"
)
  .focus-corner.top-left
  .focus-corner.top-right
  .focus-corner.bottom-left
  .focus-corner.bottom-right

  .card-body
    slot
</template>

<script lang="ts" setup>
const props = defineProps<{
  onClick?: () => void
}>()

const handleCardClick = () => {
  if (props.onClick) {
    props.onClick()
  }
}
</script>

<style lang="stylus">
.focus-card
  position: relative
  padding: 12px 20px
  background-color: rgba(0, 0, 0, 0.05)

  &.has-handle
    cursor pointer
    transition: 318ms
    pointer-events all

    &:hover
      background-color: rgba(0, 0, 0, 0.2)

  .focus-corner
    position absolute
    border-color: currentColor
    width: 8px
    height: 8px

  .top-left
    left: 0
    top: 0
    border-top: 1px solid
    border-left: 1px solid

  .top-right
    right: 0
    top: 0
    border-top: 1px solid
    border-right: 1px solid

  .bottom-left
    left: 0
    bottom: 0
    border-bottom: 1px solid
    border-left: 1px solid

  .bottom-right
    right: 0
    bottom: 0
    border-bottom: 1px solid
    border-right: 1px solid
</style>
