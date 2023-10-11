<template lang="pug">
span.typing-message_random {{ randomText }}
</template>

<script>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { getRandomText } from '@/utils/typing-content'

const letterSpeed = 80

export default {
  props: {
    lang: {
      type: String
    }
  },

  setup(props) {
    let randomTimer = null
    const randomText = ref(getRandomText(props.lang))
    const setRandomText = async () => {
      randomText.value = getRandomText(props.lang)
      await nextTick()
      randomTimer = setTimeout(setRandomText, letterSpeed)
    }

    onMounted(setRandomText)

    onBeforeUnmount(() => {
      clearTimeout(randomTimer)
    })

    return {
      randomText
    }
  }
}
</script>

<style lang="stylus">
.typing-message_random
  opacity .3
</style>
