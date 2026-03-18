import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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
    expect(screen.getByText('你')).toBeInTheDocument()
    expect(screen.getByText('好')).toBeInTheDocument()
    expect(screen.getByText('。')).toBeInTheDocument()
  })

  it('should show completion message when article is finished (TYP-06)', async () => {
    ;(useArticleStore as any).mockReturnValue({
      currentArticleId: 'test-1',
      getArticleById: () => mockArticle,
    })

    render(<TypingGame />)

    // Type all characters
    const input = screen.getByPlaceholderText('输入拼音...')

    // Type 'ni' for first char
    fireEvent.change(input, { target: { value: 'ni' } })
    fireEvent.compositionEnd(input, { currentTarget: { value: 'ni' } })

    // Type 'hao' for second char
    const input2 = screen.getByPlaceholderText('输入拼音...')
    fireEvent.change(input2, { target: { value: 'hao' } })
    fireEvent.compositionEnd(input2, { currentTarget: { value: 'hao' } })

    // Type '。' for punctuation - input change when not composing
    const input3 = screen.getByPlaceholderText('输入标点...')
    fireEvent.change(input3, { target: { value: '。' } })

    // The completion message is rendered via antd message.success in a portal
    await waitFor(() => {
      expect(screen.getByText(/恭喜！文章打字完成/)).toBeInTheDocument()
    })
  })
})
