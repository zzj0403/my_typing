import { describe, it, expect } from 'vitest'
import { POEMS_DATA } from '@/assets/texts/Poems'

describe('Poems data', () => {
  it('should export valid poem array', () => {
    expect(Array.isArray(POEMS_DATA)).toBe(true)
    expect(POEMS_DATA.length).toBeGreaterThanOrEqual(20)
  })

  it('should have required fields: id, key, title, content', () => {
    POEMS_DATA.forEach((poem) => {
      expect(poem).toHaveProperty('id')
      expect(poem).toHaveProperty('key')
      expect(poem).toHaveProperty('title')
      expect(poem).toHaveProperty('content')
      expect(poem).toHaveProperty('source')
    })
  })

  it('should have source as builtin', () => {
    POEMS_DATA.forEach((poem) => {
      expect(poem.source).toBe('builtin')
    })
  })

  it('should have non-empty content', () => {
    POEMS_DATA.forEach((poem) => {
      expect(poem.content.length).toBeGreaterThan(0)
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
