<template lang="pug">
.layout.default-layout
  .fluid-container
    slot
</template>

<style lang="stylus">
.default-layout
  min-height: 500px
  position relative
  overflow: hidden

  .fluid-container
    height: 100%
    min-height: 500px
</style>
