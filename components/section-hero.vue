<template lang="pug">
.fixed-container
  .section.section-hero
    //- .text Hero Title
    focus-card.scroll-tips(
      :onClick="handleScrollTipClick"
    )
      text-scramble-typing(
        newMessage="滚动浏览我的过往作品"
        :start="store.ui.heroUIStart"
      )
</template>

<script lang="ts" setup>
import gsap from 'gsap'
const store = useStore()

const handleScrollTipClick = () => {
  gsap.to(window, { duration: 1, scrollTo: window.innerHeight/1.2 });
}
</script>

<style lang="stylus">
.fixed-container .section-hero
  opacity: 0

  .scroll-tips
    text-align: center
    width: 220px
    position absolute
    bottom: 30px
    left: 50%
    transform: translateX(-50%)
    padding-top: 14px

</style>
