<template lang="pug">
div.text-scramble-typing(ref="wrapper")
  div.text-scramble-typing_texts(ref="content")
    template(v-if="typingTexts.length")
      span(
        v-for="text in typingTexts"
      ) {{ text }}
      TypingRandom(
        v-if="status === 'typing' && !isWaitingFutureMessage"
        :lang="lang"
      )
    span(v-else) {{ defaultMessage }}
</template>

<style lang="stylus">
.text-scramble-typing
  &_texts
    word-break break-word
    padding-bottom 4px
</style>

<script>
/**
 * @source: https://github.com/rct-ai/nfts-web/blob/satoshi/staging/src/views/chat/typing-message.vue
 */
import { getFormattedContent, getTypingDelay } from '@/utils/typing-content'

// @TODO: 支持显示 Caret
export default {
  props: {
    lang: {
      type: String,
      default: 'cn'
    },

    newMessage: {
      type: String,
    },

    start: {
      type: Boolean,
    },

    defaultMessage: {
      type: String,
      // default: '......',
      default: '·'
    }
  },

  data: () => ({
    futureMessages: [],
    isWaitingFutureMessage: false,
    // 'loading' | 'typing' | 'done'
    status: 'done',

    typingTexts: [],
    typingTimer: null,

    resizeObserver: null
  }),

  computed: {
    currentMessageTexts() {
      return getFormattedContent(this.futureMessages[0], this.lang)
    }
  },

  watch: {
    start: {
      immediate: true,
      handler () {
        if (this.start) {
          this.addTypingMessages([this.newMessage])
        }
      },
    }
  },

  methods: {
    setTypingText() {
      if (this.typingTexts.length >= this.currentMessageTexts.length) {
        clearTimeout(this.typingTimer)
        this.futureMessages.shift()

        if (this.futureMessages.length) {
          this.isWaitingFutureMessage = true
          this.typingTimer = setTimeout(() => {
            this.typingTexts = []
            this.isWaitingFutureMessage = false
            this.status = 'typing'
            this.setTypingText()
          }, 2000)
        } else {
          this.isWaitingFutureMessage = false
          this.status = 'done'
        }

        return
      }

      const currentText = this.currentMessageTexts[this.typingTexts.length]
      const typingDelay = getTypingDelay(currentText, this.lang)

      if (typingDelay) {
        this.typingTimer = setTimeout(() => {
          this.typingTexts.push(currentText)
          this.setTypingText()
        }, typingDelay)
      } else {
        this.typingTexts.push(currentText)
        this.setTypingText()
      }
    },

    startTyping() {
      clearTimeout(this.typingTimer)
      this.typingTexts = []
      this.$nextTick()

      if (this.futureMessages.length) {
        this.status = 'typing'
        this.setTypingText()
      } else {
        this.status = 'done'
      }
    },

    addTypingMessages(newMessages = []) {
      const enabledMessages = newMessages.filter((message) => !!message)
      if (!enabledMessages.length) return

      const lastCount = this.futureMessages.length
      this.futureMessages = this.futureMessages.concat(enabledMessages)
      if (!lastCount) {
        this.startTyping()
      }
    }
  },

  mounted() {
    const wrapperEl = this.$refs.wrapper
    const contentEl = this.$refs.content
    if (!wrapperEl || !contentEl) return

    this.resizeObserver = new ResizeObserver(() => {
      wrapperEl.scrollTop = 9999
    })
    this.resizeObserver.observe(contentEl)
  },

  beforeUnmount() {
    clearTimeout(this.typingTimer)
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  }
}
</script>
