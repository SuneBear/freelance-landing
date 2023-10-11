/**
 * @source: https://github.com/rct-ai/nfts-web/blob/satoshi/staging/src/views/chat/typing-content.js
 */

/**
 * Unicode 列表: https://zh.wikipedia.org/wiki/Unicode%E5%AD%97%E7%AC%A6%E5%88%97%E8%A1%A8
 * 主要看“十进制”一列，如：&#032; 代表空格，在配置中就写 32
 */

const langConfigs = {
  'cn': {
    formatter: (texts) => {
      return texts.split('')
    },
    unicodeRange: [19968, 40869],
    letterDelay: 250
  },

  'en': {
    formatter: (texts) => {
      return texts.split(' ').map((text) => `${text} `)
    },
    unicodeRange: [65, 122],
    letterDelay: 200
  }
}

export const getFormattedContent = (texts, lang) => {
  const config = langConfigs[lang] || langConfigs.cn
  return config.formatter(texts)
}

export const getTypingDelay = (text = '', lang) => {
  const config = langConfigs[lang] || langConfigs.cn
  const [start, end] = config.unicodeRange
  const textCodePoint = text.codePointAt(0)
  // 如果不在字符范围内，判定为标点或混搭词汇，直接跳过
  if (textCodePoint < start || textCodePoint > end) return 0

  const textLength = text.trim().length
  return Math.round(Math.random() * config.letterDelay * textLength)
}

export const getRandomText = (lang) => {
  const config = langConfigs[lang] || langConfigs.cn
  const [start, end] = config.unicodeRange
  return String.fromCodePoint(Math.round(Math.random() * (end - start)) + start)
}
