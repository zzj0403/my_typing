import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { CharSpan } from '@/components/TypingGame/CharSpan'
import { CharState } from '@/types/typing'
import { CharType } from '@/core'

describe('CharSpan', () => {
  const baseChar = {
    type: CharType.Hanzi,
    char: '你',
    quanpin: 'ni',
  }

  it('should render pending character with correct class (UI-02)', () => {
    render(<CharSpan char={baseChar} state={CharState.Pending} isCurrent={false} />)
    const span = screen.getByText('你')
    expect(span).not.toHaveClass('current')
    expect(span).not.toHaveClass('correct')
    expect(span).not.toHaveClass('incorrect')
  })

  it('should render current character with underline class (UI-02)', () => {
    render(<CharSpan char={baseChar} state={CharState.Pending} isCurrent={true} />)
    const span = screen.getByText('你')
    expect(span).toHaveClass('current')
  })

  it('should render correct character with green class (UI-03)', () => {
    render(<CharSpan char={baseChar} state={CharState.Correct} isCurrent={false} />)
    const span = screen.getByText('你')
    expect(span).toHaveClass('correct')
  })

  it('should render incorrect character with red and strikethrough (UI-04)', () => {
    render(<CharSpan char={baseChar} state={CharState.Incorrect} isCurrent={false} inputPinyin="ta" />)
    const span = screen.getByText('你')
    expect(span).toHaveClass('incorrect')
    expect(screen.getByText('ta')).toBeInTheDocument() // shows error pinyin
  })
})
