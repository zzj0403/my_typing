import { describe, it, expect } from 'vitest'
import { ESSAYS_DATA } from '@/assets/texts/Essays'

describe('Essays data', () => {
  it('should export valid essay array', () => {
    expect(Array.isArray(ESSAYS_DATA)).toBe(true)
    expect(ESSAYS_DATA.length).toBeGreaterThanOrEqual(1)
  })

  it('should have required fields: id, key, title, getContent', () => {
    ESSAYS_DATA.forEach((essay) => {
      expect(essay).toHaveProperty('id')
      expect(essay).toHaveProperty('key')
      expect(essay).toHaveProperty('title')
      expect(essay).toHaveProperty('getContent')
      expect(typeof essay.getContent).toBe('function')
    })
  })

  it('should have non-empty content from getContent()', () => {
    ESSAYS_DATA.forEach((essay) => {
      const content = essay.getContent()
      expect(content.length).toBeGreaterThan(0)
    })
  })

  it('should have id format as essay-xxx', () => {
    ESSAYS_DATA.forEach((essay) => {
      expect(essay.id).toMatch(/^essay-/)
    })
  })

  it('should have key format matching id', () => {
    ESSAYS_DATA.forEach((essay) => {
      expect(essay.key).toBe(essay.id)
    })
  })
})
