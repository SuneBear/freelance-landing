<template lang="pug">
.section.section-collab(
  ref="maskWrapper"
)

  .container.flex.flex-col.items-center
    .section-title
      span 了解我的
      span.green 自由职业
      span 工作流
    .section-desc 自从 2018 年开始远程工作，实现了只工作不上班。在创业公司我们用简洁且透明的协作方式来提高效率，利用节省下来的时间我去了很多地方游玩，学了很多舒适圈以外的东西。希望 24 年开始利用副业创造很多收入。

  mask-scan-reveal.container(
    :progress="store.ui.collabScrollProgress"
  )
    .flex.flex-col.items-center
      .workflow-list.flex.flex-col.items-center
        //-  @TODO: 支持动态定位
        .dom-arrows(
          v-if="!$device.isMobile"
        )
          .arrow.arrow-req-to-schedule
            nuxt-icon.arrow-marker(
              name="down-arrow"
            )
          .arrow.arrow-schedule-to-develop
            nuxt-icon.arrow-marker(
              name="down-arrow"
            )
          .arrow.arrow-develop-to-deliver
            nuxt-icon.arrow-marker(
              name="down-arrow"
            )
        workflow-item.workflow-req(
          themeColor="#aec9d7"
          title="1. 根据设计稿和 PRD 确认需求"
          iconEmoji="📖"
        )
          | 最理想的开局是客户有一个份
          icon-link(
            iconName="figma"
            href="https://figma.com"
          ) Figma
          | 设计稿，这样能确保我对需求有最直观的理解，还能避免像
          icon-link(
            iconName="sketch"
            href="https://www.sketch.com"
          ) Sketch
          | 同步困难。有一些逻辑/交互在 UI 稿上无法体现，可以额外在
          icon-link(
            iconName="notion"
            href="https://www.notion.so"
          ) Notion
          | 上提供 PRD。<br/><br/>

          | 在需求文档 Ready 后，我会和客户拉一个
          icon-link(
            iconName="feishu"
            href="https://www.feishu.cn"
          ) 飞书会议
          | 做需求评审，提出疑惑的地方。确定技术方案以及可行性。

        workflow-item.workflow-schedule(
          themeColor="#c4886f"
          width="540px"
          title="2. 做出估时与报价"
          iconEmoji="🕰"
        )
          | 在需求评审通过后不会立刻进入迭代，我会花 1-2 天时间做任务拆分和排期。任务会考虑全周期：
          ol
            li 项目架构，确保能支撑产品
            li 功能迭代，对业务逻辑解构与实现
            li 上游联调，涉及到后端或者第三方接口
            li 测试优化，尤其是响应式，不同环境下的兼容性
            li 部署上线，触达用户

          | 我会创建一个表格，对每一个任务做耗时预估，这样就能得出排期和报价方案。目前我一个工作日收费是
          icon-link(
            iconName="exchange-cny-line"
          ) {{ costPerDay }} CNY
          | ，等值的美元或数字货币也是可接受的。假设一个需求耗时 10 个工作日，报价则为
          | <code>{{costPerDay}} * 10 = {{ costPerDay * 10 }} CNY</code>

        workflow-item.workflow-develop(
          title="3. 达成共识，开始迭代"
          themeColor="#b99220"
          width="700px"
          iconEmoji="👨‍💻"
        )
          | 在制定排期和报价方案时，我也会与客户进行充分的沟通和协商，以确保双方达成共识。<br/>
          | 在形成共识后，我会在
          icon-link(
            iconName="github"
            href="https://github.com"
          ) GitHub
          | 上创建一个私有项目，并部署到
          icon-link(
            iconName="file-type-light-vercel"
            href="https://vercel.com"
          ) Vercel
          | 上。<br/><br/>
          | 接下来是按照计划进行迭代。我会在
          icon-link(
            iconName="slack"
            href="https://slack.com"
          ) Slack
          | 或
          icon-link(
            iconName="wechat"
            href="https://www.wechat.com"
          ) 微信
          | 与客户进行沟通和反馈。这样可以确保项目在开发过程中的灵活性和及时调整。

        workflow-item.workflow-deliver(
          title="4. 持续交付与打磨"
          themeColor="#3de157"
          iconEmoji="🍀"
        )
          | 当项目的开发工作完成后，我会进行代码梳理和自测。自测通过后会部署一个稳定的 Staging 环境给客户进行测试，根据客户的反馈作出必要的打磨和修复，这个过程会
          icon-link(
            iconName="loop"
          ) 循环多次
          | 直到验收通过。<br/><br/>
          | 接下来是把项目部署到线上并绑定域名，让用户体验我们的成果 🎉。最后我会给客户一个
          icon-link(
            iconName="money-bag"
          ) 收款方式
          | ，支付我相应的报酬。我会给项目提供长期售后，为多次合作打下基础。

        workflow-item.workflow-tips(
          width="700px"
          title="除前端之外，更全面的合作"
          themeColor="#808080"
          iconEmoji="👐"
        )
          | 如果客户拥有 <b>💡 Idea</b>，想要完整的产品团队。我可以介绍与我合作多年的 <b>视觉设计师、后端、合约、算法、运维工程师</b> 一起，帮助客户把想法落地。
          | <br/><br/>
          | 想要了解更多？欢迎阅读《
          icon-link(
            iconName="notebook-agenda"
            :href="PATH.coCreateManual"
          ) &nbsp;与舒乐熊一起快乐协作手册.pdf
          | 》

</template>

<script lang="ts" setup>
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useResizeObserver } from '@vueuse/core'
import { PATH } from '@/utils/const'

const store = useStore()
const { isMobile } = useDevice()
const costPerDay = ref(1600)
const maskWrapper = ref()

const setupResize = () => {
  // 同步 trigger 和 content 的高度，然后通知 ScrollTrigger
  useResizeObserver(maskWrapper.value, async (entries) => {
    const entry = entries[0]
    store.ui.collabHeight = entry.contentRect.bottom
    await nextTick()
    ScrollTrigger.refresh()
  })
}

// @FIXME: 需要解决滚动后的定位问题
const setupLeaderLine = async () => {
  if (isMobile) return
  const { default: LeaderLine } = await import('leader-line-new')
  const lineStyle = {
    color: '#ccc',
    size: 1
  }
  const line1 = new LeaderLine({
    start: document.querySelector('.workflow-req') as Element,
    end: document.querySelector('.workflow-schedule') as Element,
    ...lineStyle
  })
  const line2 = new LeaderLine({
    start: document.querySelector('.workflow-schedule') as Element,
    end: document.querySelector('.workflow-develop') as Element,
    ...lineStyle
  })

  Array.from(document.querySelectorAll('.leader-line')).map(el => {
    document.querySelector('.content-wrapper')?.appendChild(el)
  })

  watch(() => store.ui.contentScrollProgress, () => {
    line1.position()
    line2.position()
  })
}

const setupArrows = async () => {
  if (isMobile) return
}

onMounted(() => {
  setupResize()
  // setupLeaderLine()
  setupArrows()
})
</script>

<style lang="stylus">
.leader-line
  z-index: 20
  // transform: translate3d(0, -270px, 0)

.section-collab
  padding: 0 20px
  padding-top: 16vh
  padding-bottom: 8vh

  @media $mediaInMobile
    padding-top: 8vh

  .arrow
    position absolute

    .arrow-marker
      position absolute

  .arrow-req-to-schedule
    left: 400px
    top: 150px
    width: 100px
    height: 180px
    color: #ccc
    border-top: 1px solid currentColor
    border-right: 1px solid currentColor

    .arrow-marker
      right: 0
      bottom: 0
      transform: translate3d(50%, 80%, 0)

  .arrow-schedule-to-develop
    left: 60px
    top: 560px
    width: 100px
    height: 210px
    color: #ccc
    border-left: 1px solid currentColor
    border-top: 1px solid currentColor

    .arrow-marker
      left: 0
      bottom: 0
      transform: translate3d(-50%, 80%, 0)

  .arrow-develop-to-deliver
    left: 340px
    top: 1023px
    width: 0px
    height: 30px
    color: #64eb79
    border-left: 1px solid currentColor

    .arrow-marker
      left: 0
      bottom: 0
      transform: translate3d(-50%, 75%, 0)

  .container
    max-width: 880px
    margin: 0 auto

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
    margin-bottom: fluid-value(42, 60)

  .workflow-list
    max-width: 1000px
    position relative

    .workflow-req
      align-self: flex-start

    .workflow-tips
      @media (min-width: 1000px)
        margin-top: 100px

      b
        font-weight: 500
        color: $primary100

    .workflow-deliver,
    .workflow-develop
      .workflow-emoji
        transform: scale(0.9)

    .workflow-schedule
      align-self: flex-end

      .workflow-emoji
        transform: scale(0.83)

    .link-notion,
    .link-money-bag,
    .link-exchange-cny-line
      .nuxt-icon
        position relative
        top: -1px
</style>
