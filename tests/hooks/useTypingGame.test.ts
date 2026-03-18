import { describe, it, expect, vi } from 'vitest'

// Mock article data structure placeholder
interface MockCharInfo {
  char: string
  pinyin: string
  status: 'pending' | 'correct' | 'incorrect' | 'skipped'
}

interface MockArticle {
  id: string
  title: string
  content: string
  sentences: string[]
}

describe('useTypingGame', () => {
  // TYP-02: Pinyin matching for Hanzi characters
  it.todo('should match pinyin for Hanzi characters (TYP-02)')

  // TYP-03: Correct character marking
  it.todo('should mark character as correct when pinyin matches (TYP-03)')

  // TYP-04: Incorrect handling and continue
  it.todo('should mark character as incorrect and continue (TYP-04)')

  // TYP-04: Skip on ESC key
  it.todo('should skip current character on ESC (TYP-04)')

  // TYP-05: Punctuation mapping
  it.todo('should match punctuation with English-to-Chinese mapping (TYP-05)')

  // UI-05: Progress calculation
  it.todo('should calculate progress correctly (UI-05)')
})
