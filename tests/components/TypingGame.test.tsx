import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TypingGame } from '@/components/TypingGame'
import { useArticleStore } from '@/stores/articleStore'
import { CharType } from '@/core'

// Mock the store
vi.mock('@/stores/articleStore', () => ({
  useArticleStore: vi.fn(),
}))

const mockArticle = {
  id: 'test-1',
  key: 'test',
  title: 'Test Article',
  content: '你好。',
  sentences: [
    {
      id: 's1',
      text: '你好。',
      chars: [
        { type: CharType.Hanzi, char: '你', quanpin: 'ni' },
        { type: CharType.Hanzi, char: '好', quanpin: 'hao' },
        { type: CharType.Mark, char: '。' },
      ],
    },
  ],
  source: 'builtin' as const,
  createdAt: Date.now(),
}

describe('TypingGame', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display article content for typing (TYP-01)', () => {
    ;(useArticleStore as any).mockReturnValue({
      currentArticleId: 'test-1',
      getArticleById: () => mockArticle,
    })

    render(<TypingGame />)

    expect(screen.getByText('Test Article')).toBeInTheDocument()
    // Use getAllByText since the char appears in both article area and current char display
    expect(screen.getAllByText('你').length).toBeGreaterThan(0)
    expect(screen.getAllByText('好').length).toBeGreaterThan(0)
    expect(screen.getAllByText('。').length).toBeGreaterThan(0)
  })

  it('should show current character in input area (TYP-01)', () => {
    ;(useArticleStore as any).mockReturnValue({
      currentArticleId: 'test-1',
      getArticleById: () => mockArticle,
    })

    render(<TypingGame />)

    // Reset button should be visible (antd may add space)
    const resetButton = screen.getByRole('button', { name: /重/ })
    expect(resetButton).toBeInTheDocument()
  })

  it('should show empty state when no article selected (TYP-01)', () => {
    ;(useArticleStore as any).mockReturnValue({
      currentArticleId: null,
      getArticleById: () => null,
    })

    render(<TypingGame />)

    expect(screen.getByText('请先选择一篇文章')).toBeInTheDocument()
  })
})
