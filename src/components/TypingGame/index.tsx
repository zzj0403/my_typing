import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Progress, Typography, message } from 'antd'
import { useArticleStore } from '@/stores/articleStore'
import { useTypingGame } from '@/hooks/useTypingGame'
import { CharType } from '@/core'
import { ArticleDisplay } from './ArticleDisplay'
import styles from './index.module.less'

const { Title } = Typography

// Map English punctuation to Chinese
const PUNCTUATION_MAP: Record<string, string> = {
  ',': '，',
  '.': '。',
  '?': '？',
  '!': '！',
  ':': '：',
  ';': '；',
  '(': '（',
  ')': '）',
  '"': '"',
  "'": "'",
  '<': '《',
  '>': '》',
}

export function TypingGame() {
  const { currentArticleId, getArticleById } = useArticleStore()
  const article = currentArticleId ? getArticleById(currentArticleId) ?? null : null

  const {
    chars,
    currentIndex,
    progress,
    isComplete,
    handleInput,
    reset,
  } = useTypingGame(article)

  const [inputPinyin, setInputPinyin] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Completion message
  useEffect(() => {
    if (isComplete) {
      message.success('恭喜！文章打字完成！')
    }
  }, [isComplete])

  // Auto focus
  useEffect(() => {
    inputRef.current?.focus()
  }, [article?.id, currentIndex])

  // Check if input matches expected pinyin
  const checkAndSubmit = useCallback((value: string) => {
    const lowerValue = value.toLowerCase()
    const currentChar = chars[currentIndex]

    if (!currentChar) return false

    // Handle Hanzi characters
    if (currentChar.type === CharType.Hanzi) {
      const expectedPinyin = (currentChar as { quanpin: string }).quanpin.toLowerCase()
      if (lowerValue === expectedPinyin) {
        handleInput(lowerValue)
        setInputPinyin('')
        return true
      }
    }

    return false
  }, [chars, currentIndex, handleInput])

  // Get max input length for current character
  const getMaxInputLength = useCallback(() => {
    const currentChar = chars[currentIndex]
    if (!currentChar) return 0
    if (currentChar.type === CharType.Hanzi) {
      return (currentChar as { quanpin: string }).quanpin.length
    }
    return 0
  }, [chars, currentIndex])

  // Handle composition events (for IME input like Chinese)
  const handleCompositionStart = useCallback(() => {
    setIsComposing(true)
  }, [])

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false)
    const value = e.currentTarget.value

    // Check if current char is punctuation and value matches
    const currentChar = chars[currentIndex]
    if (currentChar?.type === CharType.Mark) {
      const chinesePunc = PUNCTUATION_MAP[value] || value
      if (chinesePunc === currentChar.char) {
        handleInput(currentChar.char)
        setInputPinyin('')
        return
      }
    }

    // Apply max length restriction
    const maxLen = getMaxInputLength()
    const trimmedValue = maxLen > 0 ? value.toLowerCase().slice(0, maxLen) : value.toLowerCase()

    if (!checkAndSubmit(trimmedValue)) {
      setInputPinyin(trimmedValue)
    }
  }, [chars, currentIndex, handleInput, checkAndSubmit, getMaxInputLength])

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const currentChar = chars[currentIndex]

    // Check for punctuation input
    if (currentChar?.type === CharType.Mark && !isComposing) {
      const lastChar = value.slice(-1)
      const chinesePunc = PUNCTUATION_MAP[lastChar] || lastChar
      if (chinesePunc === currentChar.char) {
        handleInput(currentChar.char)
        setInputPinyin('')
        return
      }
    }

    // Apply max length restriction for Hanzi
    const maxLen = getMaxInputLength()
    let processedValue = value.toLowerCase()
    if (maxLen > 0 && processedValue.length > maxLen) {
      processedValue = processedValue.slice(0, maxLen)
    }

    if (isComposing) {
      setInputPinyin(processedValue)
      return
    }

    // For direct typing (not IME)
    if (!checkAndSubmit(processedValue)) {
      setInputPinyin(processedValue)
    }
  }, [isComposing, checkAndSubmit, chars, currentIndex, handleInput, getMaxInputLength])

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Direct punctuation key press
    const currentChar = chars[currentIndex]
    if (currentChar?.type === CharType.Mark) {
      const chinesePunc = PUNCTUATION_MAP[e.key]
      if (chinesePunc === currentChar.char) {
        e.preventDefault()
        handleInput(currentChar.char)
        setInputPinyin('')
        return
      }
      // Also allow direct Chinese punctuation input
      if (e.key === currentChar.char) {
        e.preventDefault()
        handleInput(currentChar.char)
        setInputPinyin('')
        return
      }
    }
  }, [chars, currentIndex, handleInput])

  const handleReset = useCallback(() => {
    reset()
    setInputPinyin('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [reset])

  // Keep input focused when clicking container
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  if (!article) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <Typography.Text type="secondary">请先选择一篇文章</Typography.Text>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container} onClick={handleContainerClick}>
      {/* Hidden input for capturing keyboard events */}
      <input
        ref={inputRef}
        type="text"
        className={styles.hiddenInput}
        value={inputPinyin}
        onChange={handleInputChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onKeyDown={handleKeyDown}
        autoFocus
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Header with progress */}
      <div className={styles.header}>
        <Title level={4} className={styles.title}>{article.title}</Title>
        <div className={styles.progressWrapper}>
          <Progress
            className={styles.progressBar}
            percent={Math.round((progress.typed / progress.total) * 100)}
            status={isComplete ? 'success' : 'active'}
          />
          <span className={styles.progressText}>
            {progress.typed} / {progress.total} 字
          </span>
        </div>
      </div>

      {/* Article display area with inline input */}
      <div className={styles.articleArea}>
        <ArticleDisplay
          sentences={article.sentences}
          chars={chars}
          currentIndex={currentIndex}
          inputPinyin={inputPinyin}
        />
      </div>

      {/* Action buttons */}
      {!isComplete && (
        <div className={styles.actionButtons}>
          <Button onClick={handleReset} size="small">重置</Button>
        </div>
      )}

      {/* Completion state */}
      {isComplete && (
        <div className={styles.completeArea}>
          <Typography.Title level={4} className={styles.completeText}>
            🎉 恭喜完成！
          </Typography.Title>
          <Button type="primary" onClick={handleReset}>再来一次</Button>
        </div>
      )}
    </div>
  )
}
