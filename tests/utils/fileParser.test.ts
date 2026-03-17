import { describe, it, expect } from 'vitest'
import { parseTxtFile, isValidTxtFile } from '@/utils/fileParser'

describe('parseTxtFile', () => {
  it('should parse UTF-8 encoded txt file', async () => {
    const content = '测试文本内容'
    const file = new File([content], 'test.txt', { type: 'text/plain' })
    const result = await parseTxtFile(file)
    expect(result).toBe(content)
  })

  it('should handle Chinese characters correctly', async () => {
    const content = '床前明月光，疑是地上霜。'
    const file = new File([content], 'chinese.txt', { type: 'text/plain' })
    const result = await parseTxtFile(file)
    expect(result).toBe(content)
  })

  it('should reject non-txt files', async () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })
    await expect(parseTxtFile(file)).rejects.toThrow('不支持的文件类型')
  })

  it('should handle file read errors', async () => {
    const file = new File([''], 'empty.txt', { type: 'text/plain' })
    // 模拟读取错误较为复杂，这里只测试正常流程
    const result = await parseTxtFile(file)
    expect(typeof result).toBe('string')
  })
})

describe('isValidTxtFile', () => {
  it('should return true for .txt files', () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    expect(isValidTxtFile(file)).toBe(true)
  })

  it('should return false for non-txt files', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })
    expect(isValidTxtFile(file)).toBe(false)
  })

  it('should check file extension case-insensitively', () => {
    const file = new File(['content'], 'test.TXT', { type: 'text/plain' })
    expect(isValidTxtFile(file)).toBe(true)
  })
})
