import React from 'react'
import classNames from 'classnames'
import type { CharInfo } from '@/types/article'
import { CharState } from '@/types/typing'
import styles from './CharSpan.module.less'

export interface CharSpanProps {
  char: CharInfo
  state: CharState
  isCurrent: boolean
  inputPinyin?: string
}

export function CharSpan({ char, state, isCurrent, inputPinyin }: CharSpanProps) {
  const className = classNames(styles.char, {
    [styles.current]: isCurrent,
    [styles.correct]: state === CharState.Correct,
    [styles.incorrect]: state === CharState.Incorrect,
    [styles.skipped]: state === CharState.Skipped,
  })

  return (
    <span className={className}>
      {char.char}
      {state === CharState.Incorrect && inputPinyin && (
        <span className={styles.errorPinyin}>{inputPinyin}</span>
      )}
    </span>
  )
}
