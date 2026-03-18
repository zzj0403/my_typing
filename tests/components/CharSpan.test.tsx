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

  it('should render pending character with grid (UI-02)', () => {
    render(<CharSpan char={baseChar} state={CharState.Pending} isCurrent={false} />)
    const hanzi = screen.getByText('你')
    const container = hanzi.parentElement
    expect(container?.className).not.toMatch(/current/)
    expect(container?.className).not.toMatch(/correct/)
    expect(container?.className).not.toMatch(/incorrect/)
    // Grid shows the original pinyin in gray
    expect(screen.getByText('n')).toBeInTheDocument()
    expect(screen.getByText('i')).toBeInTheDocument()
  })

  it('should render current character with highlight class (UI-02)', () => {
    render(<CharSpan char={baseChar} state={CharState.Pending} isCurrent={true} />)
    const hanzi = screen.getByText('你')
    const container = hanzi.parentElement
    expect(container?.className).toMatch(/current/)
  })

  it('should render correct character with green class (UI-03)', () => {
    render(<CharSpan char={baseChar} state={CharState.Correct} isCurrent={false} />)
    const hanzi = screen.getByText('你')
    const container = hanzi.parentElement
    expect(container?.className).toMatch(/correct/)
  })

  it('should render incorrect character with red and strikethrough (UI-04)', () => {
    render(<CharSpan char={baseChar} state={CharState.Incorrect} isCurrent={false} inputPinyin="ta" />)
    const hanzi = screen.getByText('你')
    const container = hanzi.parentElement
    expect(container?.className).toMatch(/incorrect/)
  })
})
