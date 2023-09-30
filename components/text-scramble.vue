<template lang="pug">
.text-scramble.font-chakra
  span.char(
    v-for="(char, i) in displayedText"
    :class="{ 'has-done': currentIndex > i, 'is-chinese': isChinese(currentText[i]) }"
  ) {{ char }}
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  texts?: string[],
  letterSpeed?: number
  nextLetterSpeed?: number
  pausedText?: string
  paused?: boolean
  pauseTime?: number
}>(), {
  texts: ['HOLOCASTING', '信号正在穿越时空'] as any,
  letterSpeed: 30,
  nextLetterSpeed: 160,
  pausedText: '信号搜索完毕，开始呈现',
  paused: false,
  pauseTime: 300,
})

const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-_=+{}|[]\\;':\"<>?,./`~".split("")

const randomItem = (array: string[]) => array[Math.floor(Math.random() * array.length)]

const isChinese = (char: string) => char && char.match(/[\u3400-\u9FBF]/)

const nextItem = (array: string[], currentItem: string) => {
  const currentIndex = array.indexOf(currentItem)
  const bound = array.length
  const nextIndex = (currentIndex + bound + 1) % bound
  return array[nextIndex]
}

const currentText = ref(props.texts[0])
const currentIndex = ref(0)

const initSymbols = Array(currentText.value.length)
    .fill(0)
    .map(() => randomItem(symbols))

const displayedText = ref(initSymbols)

const leftIndexes: number[] = [];

const defaultLeftIndexes = () => {
  currentText.value.split("").forEach((_, i) => {
    // 避免多个文本之间等待太久
    if (leftIndexes.length > currentText.value.length - 1) return
    leftIndexes.push(i);
  });
  currentIndex.value = 0
};

let bakeLetterInterval: ReturnType<typeof setTimeout>
let bakeTextInterval: ReturnType<typeof setTimeout>

const bakeLetter = () => {
  bakeLetterInterval = setInterval(() => {
    if (!props.paused) {
      const updatedText:string[] = [];

      currentText.value.split("").forEach((_, i) => {
        if (!leftIndexes.includes(i)) {
          updatedText[i] = currentText.value[i];
          return;
        }

        const randomSymbol = randomItem(symbols);
        updatedText[i] = randomSymbol;
      });

      displayedText.value = updatedText
    }
  }, props.letterSpeed);
};

const bakeText = () => {
  defaultLeftIndexes();
  bakeLetter();

  bakeTextInterval = setInterval(() => {
    if (!props.paused) {
      if (leftIndexes.length === 0) {
        clearTimer();

        setTimeout(() => {
          if (props.texts.length > 1) {
            currentText.value = nextItem(props.texts, currentText.value);
            defaultLeftIndexes();
          } else {
            bakeText();
          }
        }, props.pauseTime);
      }

      leftIndexes.shift();
      currentIndex.value = (displayedText.value.length - leftIndexes.length);
    }
  }, props.nextLetterSpeed);
};

const clearTimer = () => {
  clearInterval(bakeLetterInterval);
  clearInterval(bakeTextInterval);
};

const resetText = () => {
  clearTimer();
  currentText.value = props.pausedText
  displayedText.value = currentText.value.split("")
  currentIndex.value = displayedText.value.length
}

watchEffect(() => {
  if (!props.paused) {
    bakeText()
  } else {
    resetText()
  }
})

onUnmounted(() => {
  clearTimer()
})
</script>

<style lang="stylus">
.text-scramble
  padding-right: 4px
  font-size: 0.8em

  .char
    display: inline-block
    will-change: transform
    min-width: 1em
    text-align: center
    opacity: 0.5
    transform: translateX(100%) scale(0.9)
    transition: transform 500ms;
    color: currentColor

    &.is-chinese
      min-width: 1.2em
      font-weight: 600

    &.has-done
      opacity: 1
      transform: translateX(0) scale(1)
</style>
