import React, { useState, useCallback, useEffect } from 'react'
import { Button, Progress, Typography, message } from 'antd'
import { useArticleStore } from '@/stores/articleStore'
import { useTypingGame } from '@/hooks/useTypingGame'
import { CharType } from '@/core'
import { ArticleDisplay } from './ArticleDisplay'
import styles from './index.module.less'

const { Title } = Typography

export function TypingGame() {
  const { currentArticleId, getArticleById } = useArticleStore()
  const article = currentArticleId ? getArticleById(currentArticleId) ?? null : null

  const {
    chars,
    currentIndex,
    progress,
    isComplete,
    handleInput,
    skipCurrent,
    reset,
  } = useTypingGame(article)

  const [isComposing, setIsComposing] = useState(false)
  const [inputBuffer, setInputBuffer] = useState('')

  // Completion message
  useEffect(() => {
    if (isComplete) {
      message.success('恭喜！文章打字完成！')
    }
  }, [isComplete])

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true)
  }, [])

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false)
    const value = e.currentTarget.value
    handleInput(value)
    setInputBuffer('')
  }, [handleInput])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputBuffer(value)

    // Handle punctuation directly when not composing
    if (!isComposing) {
      const currentChar = chars[currentIndex]
      if (currentChar?.type === CharType.Mark && value === currentChar.char) {
        handleInput(value)
        setInputBuffer('')
      }
    }
  }, [isComposing, chars, currentIndex, handleInput])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      skipCurrent()
      setInputBuffer('')
      return
    }
  }, [skipCurrent])

  const handleSkip = useCallback(() => {
    skipCurrent()
    setInputBuffer('')
  }, [skipCurrent])

  const handleReset = useCallback(() => {
    reset()
    setInputBuffer('')
  }, [reset])

  if (!article) {
    return (
      <div className={styles.container}>
        <div className={styles.articleDisplay}>
          <Typography.Text type="secondary">请先选择一篇文章</Typography.Text>
        </div>
      </div>
    )
  }

  const currentChar = chars[currentIndex]
  const placeholder = currentChar?.type === CharType.Hanzi ? '输入拼音...' : '输入标点...'

  return (
    <div className={styles.container}>
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

      <ArticleDisplay
        sentences={article.sentences}
        chars={chars}
        currentIndex={currentIndex}
      />

      <div className={styles.inputArea}>
        <input
          className={styles.input}
          value={inputBuffer}
          onChange={handleInputChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus
        />
        <div className={styles.buttons}>
          <Button onClick={handleSkip}>跳过 (ESC)</Button>
          <Button onClick={handleReset}>重置</Button>
        </div>
      </div>
    </div>
  )
}
