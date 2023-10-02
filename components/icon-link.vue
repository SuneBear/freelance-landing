<template lang="pug">
a.icon-link(
  :href="href"
  :target="target"
  :class="[`link-${iconName}`]"
)
  nuxt-icon( :name="iconName" filled)
  .link-body
    slot
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  href?: string
  target?: string
  iconName?: string
}>(), {
  target: '_blank'
})
</script>

<style lang="stylus">
.icon-link
  display: inline-flex
  align-items: center
  gap: 2px
  margin: 0 6px
  color: $primary100
  // text-decoration: none
  text-decoration-color: brand(30)
  text-underline-offset: 2px

  .link-body
    font-weight: 500
</style>
