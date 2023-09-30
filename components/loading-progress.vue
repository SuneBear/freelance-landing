<template lang="pug">
.loading-progress
  .progress-track.flex.items-center.gap-14px
    .bars
      .bar(
        v-for="(n, i) in 50"
        :class="{ 'has-done': units[i] }"
        :key="n + i"
      )
    .percent {{ percent }}
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  progress: number
}>(), {
  progress: 0
})

const units = computed(() => {
  const n = Math.min(50, Math.ceil(50 * props.progress))
  return new Array(n).fill(true)
})
</script>

<style lang="stylus">
.loading-progress
  .progress-track
    height: 10px
    width: 300px
    padding: 2px

  .bars
    width 100%
    height 100%
    display flex
    gap 3px

    .bar
      width 30px
      height 100%
      background rgba(0, 0, 0, 0.1)

      &.has-done
        background rgba(0, 0, 0, 0.87)

  .percent
    display none
    position relative
    top: -1px
    font-size: 18px

</style>
