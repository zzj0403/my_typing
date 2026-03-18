import React from 'react'
import classNames from 'classnames'
import type { CharInfo } from '@/types/article'
import { CharState } from '@/types/typing'
import { CharType } from '@/core'
import Grid from '@/components/FourLinesGrid/Grid'
import styles from './CharSpan.module.less'

export interface CharSpanProps {
  char: CharInfo
  state: CharState
  isCurrent: boolean
  inputPinyin?: string
}

/**
 * 获取汉字的拼音
 */
function getPinyin(char: CharInfo): string | null {
  if (char.type === CharType.Hanzi) {
    return (char as { type: CharType.Hanzi; char: string; quanpin: string }).quanpin
  }
  return null
}

export function CharSpan({ char, state, isCurrent, inputPinyin = '' }: CharSpanProps) {
  const pinyin = getPinyin(char)
  const isCompleted = state === CharState.Correct || state === CharState.Incorrect || state === CharState.Skipped
  const isHanzi = char.type === CharType.Hanzi

  const className = classNames(
    isHanzi ? styles.charBox : styles.markBox,
    {
      [styles.current]: isCurrent,
      [styles.correct]: state === CharState.Correct,
      [styles.incorrect]: state === CharState.Incorrect,
      [styles.skipped]: state === CharState.Skipped,
    }
  )

  // For completed characters, show the pinyin in the grid
  // For current character, show user input
  const displayPinyin = isCompleted ? (pinyin || '') : inputPinyin

  // Punctuation marks - just show the character
  if (!isHanzi) {
    return (
      <span className={className}>
        <span className={styles.mark}>{char.char}</span>
      </span>
    )
  }

  return (
    <span className={className}>
      <span className={styles.hanzi}>{char.char}</span>
      <div className={styles.gridWrapper}>
        <Grid
          original={pinyin || ''}
          modified={displayPinyin}
          capitalized={false}
          cursor={isCurrent && !isCompleted}
        />
      </div>
    </span>
  )
}
