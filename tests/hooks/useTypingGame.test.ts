import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTypingGame } from '@/hooks/useTypingGame'
import { CharState } from '@/types/typing'
import { CharType } from '@/core'
import type { Article, CharInfo } from '@/types/article'

// Mock article data
const mockArticle: Article = {
  id: 'test-1',
  key: 'test',
  title: 'Test Article',
  content: '你好，世界。',
  sentences: [
    {
      id: 's1',
      text: '你好，世界。',
      chars: [
        { type: CharType.Hanzi, char: '你', quanpin: 'ni' },
        { type: CharType.Hanzi, char: '好', quanpin: 'hao' },
        { type: CharType.Mark, char: '，' },
        { type: CharType.Hanzi, char: '世', quanpin: 'shi' },
        { type: CharType.Hanzi, char: '界', quanpin: 'jie' },
        { type: CharType.Mark, char: '。' },
      ],
    },
  ],
  source: 'builtin',
  createdAt: Date.now(),
}

describe('useTypingGame', () => {
  it('should match pinyin for Hanzi characters (TYP-02)', () => {
    const { result } = renderHook(() => useTypingGame(mockArticle))
    act(() => { result.current.handleInput('ni') })
    expect(result.current.chars[0].state).toBe(CharState.Correct)
    expect(result.current.currentIndex).toBe(1)
  })

  it('should mark character as correct when pinyin matches (TYP-03)', () => {
    const { result } = renderHook(() => useTypingGame(mockArticle))
    act(() => { result.current.handleInput('hao') })
    expect(result.current.chars[1].state).toBe(CharState.Incorrect) // Index moved
    act(() => { result.current.reset() })
    act(() => { result.current.handleInput('ni') })
    expect(result.current.chars[0].state).toBe(CharState.Correct)
  })

  it('should mark character as incorrect and continue (TYP-04)', () => {
    const { result } = renderHook(() => useTypingGame(mockArticle))
    act(() => { result.current.handleInput('wrong') })
    expect(result.current.chars[0].state).toBe(CharState.Incorrect)
    expect(result.current.chars[0].inputPinyin).toBe('wrong')
    expect(result.current.currentIndex).toBe(1)
  })

  it('should skip current character on ESC (TYP-04)', () => {
    const { result } = renderHook(() => useTypingGame(mockArticle))
    act(() => { result.current.skipCurrent() })
    expect(result.current.chars[0].state).toBe(CharState.Skipped)
    expect(result.current.currentIndex).toBe(1)
  })

  it('should match punctuation with English-to-Chinese mapping (TYP-05)', () => {
    const { result } = renderHook(() => useTypingGame(mockArticle))
    act(() => { result.current.handleInput('ni') })  // Index 0 -> 1
    act(() => { result.current.handleInput('hao') }) // Index 1 -> 2
    act(() => { result.current.handleInput(',') })   // Index 2: ',' should match '，'
    expect(result.current.chars[2].state).toBe(CharState.Correct)
  })

  it('should calculate progress correctly (UI-05)', () => {
    const { result } = renderHook(() => useTypingGame(mockArticle))
    expect(result.current.progress.typed).toBe(0)
    expect(result.current.progress.total).toBe(6)
    act(() => { result.current.handleInput('ni') })
    expect(result.current.progress.typed).toBe(1)
    expect(result.current.progress.correct).toBe(1)
  })
})
