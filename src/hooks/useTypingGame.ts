import { useState, useCallback, useMemo, useEffect } from 'react'
import { CharType } from '@/core'
import { CharState, PUNCTUATION_MAP, type TypingChar, type TypingProgress } from '@/types/typing'
import type { Article } from '@/types/article'

/**
 * 将 Article 的字符转换为 TypingChar
 */
function articleToTypingChars(article: Article | null): TypingChar[] {
  if (!article) return []
  return article.sentences.flatMap(s =>
    s.chars.map(c => {
      if (c.type === CharType.Hanzi) {
        return {
          type: CharType.Hanzi,
          char: c.char,
          quanpin: c.quanpin,
          state: CharState.Pending,
        } as TypingChar
      }
      return {
        type: CharType.Mark,
        char: c.char,
        state: CharState.Pending,
      } as TypingChar
    })
  )
}

export function useTypingGame(article: Article | null) {
  const [chars, setChars] = useState<TypingChar[]>(() => articleToTypingChars(article))
  const [currentIndex, setCurrentIndex] = useState(0)

  // 当 article 变化时，重新初始化
  useEffect(() => {
    setChars(articleToTypingChars(article))
    setCurrentIndex(0)
  }, [article?.id])

  const handleInput = useCallback((value: string) => {
    if (!article || currentIndex >= chars.length) return

    const currentChar = chars[currentIndex]
    let isCorrect = false

    if (currentChar.type === CharType.Mark) {
      isCorrect = value === currentChar.char || PUNCTUATION_MAP[value] === currentChar.char
    } else if (currentChar.type === CharType.Hanzi) {
      isCorrect = value.toLowerCase() === currentChar.quanpin.toLowerCase()
    }

    setChars(prev => prev.map((c, i) => {
      if (i !== currentIndex) return c
      return {
        ...c,
        state: isCorrect ? CharState.Correct : CharState.Incorrect,
        inputPinyin: isCorrect ? undefined : value,
      }
    }))

    setCurrentIndex(prev => prev + 1)
  }, [article, chars, currentIndex])

  const skipCurrent = useCallback(() => {
    if (currentIndex >= chars.length) return
    setChars(prev => prev.map((c, i) =>
      i === currentIndex ? { ...c, state: CharState.Skipped } : c
    ))
    setCurrentIndex(prev => prev + 1)
  }, [chars, currentIndex])

  const reset = useCallback(() => {
    setChars(articleToTypingChars(article))
    setCurrentIndex(0)
  }, [article])

  const progress = useMemo<TypingProgress>(() => ({
    typed: currentIndex,
    total: chars.length,
    correct: chars.filter(c => c.state === CharState.Correct).length,
    incorrect: chars.filter(c => c.state === CharState.Incorrect).length,
    skipped: chars.filter(c => c.state === CharState.Skipped).length,
  }), [chars, currentIndex])

  const isComplete = currentIndex >= chars.length

  return {
    chars,
    currentIndex,
    progress,
    isComplete,
    handleInput,
    skipCurrent,
    reset,
  }
}
