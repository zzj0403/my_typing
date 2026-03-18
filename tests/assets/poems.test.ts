import { describe, it, expect } from 'vitest'
import { POEMS_DATA } from '@/assets/texts/Poems'

describe('Poems data', () => {
  it('should export valid poem array', () => {
    expect(Array.isArray(POEMS_DATA)).toBe(true)
    expect(POEMS_DATA.length).toBeGreaterThanOrEqual(20)
  })

  it('should have required fields: id, key, title, getContent', () => {
    POEMS_DATA.forEach((poem) => {
      expect(poem).toHaveProperty('id')
      expect(poem).toHaveProperty('key')
      expect(poem).toHaveProperty('title')
      expect(poem).toHaveProperty('getContent')
      expect(typeof poem.getContent).toBe('function')
    })
  })

  it('should have non-empty content from getContent()', () => {
    POEMS_DATA.forEach((poem) => {
      const content = poem.getContent()
      expect(content.length).toBeGreaterThan(0)
    })
  })

  it('should have id format as poem-xxx', () => {
    POEMS_DATA.forEach((poem) => {
      expect(poem.id).toMatch(/^poem-/)
    })
  })

  it('should have key format matching id', () => {
    POEMS_DATA.forEach((poem) => {
      expect(poem.key).toBe(poem.id)
    })
  })
})
