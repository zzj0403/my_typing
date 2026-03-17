/**
 * 中文句子分隔符正则
 * 匹配：句号、感叹号、问号、分号
 */
const SENTENCE_END_PUNCTUATION = /([。！？；]+)/g

/**
 * 将文本按中文标点分割成句子数组
 * @param text 原始文本
 * @returns 句子数组，每个句子保留结尾标点
 */
export function splitIntoSentences(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return []
  }

  // 清理多余空白和换行
  const cleanText = text.replace(/\s+/g, ' ').trim()

  // 如果没有标点，返回整个文本
  if (!SENTENCE_END_PUNCTUATION.test(cleanText)) {
    return cleanText.length > 0 ? [cleanText] : []
  }

  // 重置正则状态
  SENTENCE_END_PUNCTUATION.lastIndex = 0

  // 使用分割+保留标点的方式
  const sentences: string[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = SENTENCE_END_PUNCTUATION.exec(cleanText)) !== null) {
    const endIndex = match.index + match[0].length
    const sentence = cleanText.slice(lastIndex, endIndex).trim()
    if (sentence) {
      sentences.push(sentence)
    }
    lastIndex = endIndex
  }

  // 处理最后没有标点的部分
  if (lastIndex < cleanText.length) {
    const remaining = cleanText.slice(lastIndex).trim()
    if (remaining) {
      sentences.push(remaining)
    }
  }

  return sentences
}
