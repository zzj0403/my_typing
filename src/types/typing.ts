import { CharType } from '@/core'

/**
 * 字符状态枚举
 */
export enum CharState {
  Pending = 'pending',
  Correct = 'correct',
  Incorrect = 'incorrect',
  Skipped = 'skipped',
}

/**
 * 打字字符 - 标点类型
 */
export interface TypingMarkChar {
  type: CharType.Mark
  char: string
  state: CharState
}

/**
 * 打字字符 - 汉字类型
 */
export interface TypingHanziChar {
  type: CharType.Hanzi
  char: string
  quanpin: string
  state: CharState
  inputPinyin?: string  // 用户输入（用于错误显示）
}

/**
 * 打字字符 - 联合类型
 */
export type TypingChar = TypingMarkChar | TypingHanziChar

/**
 * 打字进度
 */
export interface TypingProgress {
  typed: number      // 当前位置 (currentIndex)
  total: number      // 总字符数
  correct: number    // 正确数
  incorrect: number  // 错误数
  skipped: number    // 跳过数
}

/**
 * 英文标点到中文标点的映射
 */
export const PUNCTUATION_MAP: Record<string, string> = {
  ',': '，',
  '.': '。',
  '!': '！',
  '?': '？',
  ';': '；',
  ':': '：',
}
