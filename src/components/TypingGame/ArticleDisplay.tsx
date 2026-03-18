import React from 'react'
import type { Sentence, CharInfo } from '@/types/article'
import { CharSpan } from './CharSpan'
import type { TypingChar } from '@/types/typing'
import { CharType } from '@/core'
import styles from './index.module.less'

export interface ArticleDisplayProps {
  sentences: Sentence[]
  chars: TypingChar[]
  currentIndex: number
  inputPinyin?: string
}

export function ArticleDisplay({
  sentences,
  chars,
  currentIndex,
  inputPinyin = '',
}: ArticleDisplayProps) {
  let charOffset = 0

  return (
    <div className={styles.articleDisplay}>
      {sentences.map((sentence, sentenceIndex) => {
        const sentenceStart = charOffset
        const sentenceEnd = charOffset + sentence.chars.length
        charOffset = sentenceEnd

        return (
          <div key={sentence.id} className={styles.sentence}>
            {sentence.chars.map((char, charIndex) => {
              const globalIndex = sentenceStart + charIndex
              const typingChar = chars[globalIndex]
              const isCurrent = globalIndex === currentIndex

              // Get input pinyin for current hanzi character
              const charInputPinyin =
                isCurrent && char.type === CharType.Hanzi ? inputPinyin : ''

              return (
                <CharSpan
                  key={`${sentence.id}-${charIndex}`}
                  char={char}
                  state={typingChar?.state || 'pending'}
                  isCurrent={isCurrent}
                  inputPinyin={charInputPinyin}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
