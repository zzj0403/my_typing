import React from 'react'
import type { Sentence, CharInfo } from '@/types/article'
import { CharSpan } from './CharSpan'
import type { TypingChar, TypingHanziChar } from '@/types/typing'
import { CharType } from '@/core'
import styles from './index.module.less'

export interface ArticleDisplayProps {
  sentences: Sentence[]
  chars: TypingChar[]
  currentIndex: number
}

/**
 * 安全获取 inputPinyin 属性
 */
function getInputPinyin(char: TypingChar | undefined): string | undefined {
  if (char && char.type === CharType.Hanzi) {
    return (char as TypingHanziChar).inputPinyin
  }
  return undefined
}

export function ArticleDisplay({ sentences, chars, currentIndex }: ArticleDisplayProps) {
  // Calculate character offset for each sentence
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

              return (
                <CharSpan
                  key={`${sentence.id}-${charIndex}`}
                  char={char}
                  state={typingChar?.state || 'pending'}
                  isCurrent={globalIndex === currentIndex}
                  inputPinyin={getInputPinyin(typingChar)}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
