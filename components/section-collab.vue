<template lang="pug">
.section.section-collab.flex.flex-col.items-center
  .section-title
    span 了解我的
    span.green 自由职业
    span 工作流
  .section-desc 自从 2018 年开始远程工作，实现了只工作不上班。在创业公司我们用简洁且透明的协作方式来提高效率，利用节省下来的时间我去了很多地方游玩，学了很多舒适圈以外的东西。希望 24 年开始利用复业创造很多收入。
  .workflow-list
    //- 确定样式，把 Item 封装成组件
    .workflow-item
      .workflow-icon
      .workflow-body
        .workflow-title
        .workflow-desc
</template>

<script lang="ts" setup>
</script>

<style lang="stylus">
.section-collab
  padding: 0 20px
  padding-top: 20vh

  @media $mediaInMobile
    padding-top: 10vh

  .section-title
    font-size: fluid-value(30, 50)
    margin-bottom: fluid-value(20, 32)
    color: rgba(0, 0, 0, 0.2)
    -webkit-text-stroke: fluid-value(0.5, 1) black

    .green
      color: brand(20)

  .section-desc
    font-size: fluid-value(16, 22)
    opacity: 0.8
    max-width: 1100px
    text-align: center

  .workflow-list
    max-width: 1000px
</style>
