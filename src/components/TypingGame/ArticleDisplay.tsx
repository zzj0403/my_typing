import React from 'react'
import type { Sentence, CharInfo } from '@/types/article'
import { CharSpan } from './CharSpan'
import type { TypingChar } from '@/types/typing'
import styles from './index.module.less'

export interface ArticleDisplayProps {
  sentences: Sentence[]
  chars: TypingChar[]
  currentIndex: number
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
                  inputPinyin={typingChar?.inputPinyin}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
