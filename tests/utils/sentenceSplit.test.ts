import { describe, it, expect } from 'vitest'
import { splitIntoSentences } from '@/utils/sentenceSplit'

describe('splitIntoSentences', () => {
  it('should split text by Chinese punctuation', () => {
    const result = splitIntoSentences('你好。世界！')
    expect(result).toEqual(['你好。', '世界！'])
  })

  it('should preserve punctuation at end of sentences', () => {
    const result = splitIntoSentences('天行健，君子以自强不息。')
    expect(result).toEqual(['天行健，君子以自强不息。'])
  })

  it('should handle empty string', () => {
    const result = splitIntoSentences('')
    expect(result).toEqual([])
  })

  it('should handle text without punctuation', () => {
    const result = splitIntoSentences('没有标点的文本')
    expect(result).toEqual(['没有标点的文本'])
  })

  it('should handle multiple punctuation types', () => {
    const result = splitIntoSentences('第一句。第二句！第三句？')
    expect(result).toEqual(['第一句。', '第二句！', '第三句？'])
  })

  it('should handle semicolon as separator', () => {
    const result = splitIntoSentences('选项一；选项二。')
    expect(result).toEqual(['选项一；', '选项二。'])
  })

  it('should trim whitespace and newlines', () => {
    const result = splitIntoSentences('  句子一。  \n句子二。  ')
    expect(result).toEqual(['句子一。', '句子二。'])
  })

  it('should handle consecutive punctuation', () => {
    const result = splitIntoSentences('真的吗？？')
    expect(result).toEqual(['真的吗？？'])
  })
})
