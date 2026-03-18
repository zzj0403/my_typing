import { describe, it, expect } from 'vitest'
import { QUOTES_DATA } from '@/assets/texts/Quotes'

describe('Quotes data', () => {
  it('should export valid quotes array', () => {
    expect(Array.isArray(QUOTES_DATA)).toBe(true)
    expect(QUOTES_DATA.length).toBeGreaterThanOrEqual(30)
  })

  it('should have required fields: id, key, title, getContent', () => {
    QUOTES_DATA.forEach((quote) => {
      expect(quote).toHaveProperty('id')
      expect(quote).toHaveProperty('key')
      expect(quote).toHaveProperty('title')
      expect(quote).toHaveProperty('getContent')
      expect(typeof quote.getContent).toBe('function')
    })
  })

  it('should have non-empty content from getContent()', () => {
    QUOTES_DATA.forEach((quote) => {
      const content = quote.getContent()
      expect(content.length).toBeGreaterThan(0)
    })
  })

  it('should have id format as quote-xxx', () => {
    QUOTES_DATA.forEach((quote) => {
      expect(quote.id).toMatch(/^quote-/)
    })
  })

  it('should have key format matching id', () => {
    QUOTES_DATA.forEach((quote) => {
      expect(quote.key).toBe(quote.id)
    })
  })
})
