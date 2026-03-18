import { CharType, MarkCharConfig, HanziCharConfig } from '@/core'

/**
 * 文章来源类型
 */
export type ArticleSource = 'builtin' | 'upload'

/**
 * 字符信息 - 复用现有 TextRegister 类型
 */
export type CharInfo = MarkCharConfig | HanziCharConfig

/**
 * 句子结构
 */
export interface Sentence {
  id: string
  text: string
  chars: CharInfo[]
}

/**
 * 文章结构
 */
export interface Article {
  id: string
  key: string // 兼容现有 TextConfig.key
  title: string
  description?: string
  content: string // 原始文本
  sentences: Sentence[] // 分句后的数据
  source: ArticleSource
  createdAt: number // 时间戳
}

/**
 * 创建文章的输入参数（不含自动生成的字段）
 */
export interface CreateArticleInput {
  key: string
  title: string
  description?: string
  content: string
  source: ArticleSource
}
