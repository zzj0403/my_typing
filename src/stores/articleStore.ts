import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Article, CreateArticleInput, ArticleSource, Sentence, CharInfo } from '@/types/article'
import { splitIntoSentences } from '@/utils/sentenceSplit'
import { pinyin } from 'pinyin-pro'
import { POEMS_DATA } from '@/assets/texts/Poems'
import { QUOTES_DATA } from '@/assets/texts/Quotes'
import { CharType } from '@/core'

/**
 * 将文本转换为字符信息数组
 */
function textToChars(text: string): CharInfo[] {
  return Array.from(text).map(char => {
    // 检查是否为汉字
    const isHanzi = /[\u4e00-\u9fa5]/.test(char)
    if (isHanzi) {
      // 将 ü 转换为 v，因为键盘上没有 ü 键
      const quanpin = pinyin(char, { toneType: 'none' }).replace(/ü/g, 'v')
      return {
        type: CharType.Hanzi,
        char,
        quanpin,
      }
    }
    return {
      type: CharType.Mark,
      char,
    }
  })
}

/**
 * 将文章内容转换为带拼音的句子数组
 */
function contentToSentences(content: string): Sentence[] {
  const sentenceTexts = splitIntoSentences(content)
  return sentenceTexts.map((text, index) => ({
    id: `sentence-${index}`,
    text,
    chars: textToChars(text),
  }))
}

/**
 * 将 CreateArticleInput 转换为完整的 Article
 */
function createArticle(input: CreateArticleInput): Article {
  return {
    id: input.source === 'builtin' ? input.key : uuidv4(),
    key: input.key,
    title: input.title,
    description: input.description,
    content: input.content,
    sentences: contentToSentences(input.content),
    source: input.source,
    createdAt: Date.now(),
  }
}

export interface ArticleState {
  articles: Article[]
  currentArticleId: string | null

  // Actions
  addArticle: (input: CreateArticleInput) => void
  removeArticle: (id: string) => void
  selectArticle: (id: string | null) => void
  getArticleById: (id: string) => Article | undefined
  getArticlesBySource: (source: ArticleSource) => Article[]
  initBuiltinArticles: () => void
}

export const useArticleStore = create<ArticleState>()(
  persist(
    (set, get) => ({
      articles: [],
      currentArticleId: null,

      addArticle: (input) => set((state) => {
        // 检查是否已存在相同 key 的文章
        if (state.articles.some(a => a.key === input.key)) {
          return state
        }
        const article = createArticle(input)
        return {
          articles: [...state.articles, article],
        }
      }),

      removeArticle: (id) => set((state) => ({
        articles: state.articles.filter(a => a.id !== id),
        // 如果删除的是当前选中的文章，清除选中状态
        currentArticleId: state.currentArticleId === id ? null : state.currentArticleId,
      })),

      selectArticle: (id) => set({ currentArticleId: id }),

      getArticleById: (id) => get().articles.find(a => a.id === id),

      getArticlesBySource: (source) => get().articles.filter(a => a.source === source),

      initBuiltinArticles: () => set((state) => {
        // 获取已存在的内置文章 keys
        const existingKeys = new Set(state.articles.map(a => a.key))

        // 添加诗词数据
        const poemsToAdd = POEMS_DATA
          .filter(p => !existingKeys.has(p.key))
          .map(p => createArticle(p))

        // 添加名言数据
        const quotesToAdd = QUOTES_DATA
          .filter(q => !existingKeys.has(q.key))
          .map(q => createArticle(q))

        return {
          articles: [...state.articles, ...poemsToAdd, ...quotesToAdd],
        }
      }),
    }),
    {
      name: 'article-storage',
      storage: createJSONStorage(() => localStorage),
      // 仅持久化上传的文章和当前选中状态
      partialize: (state) => ({
        articles: state.articles.filter(a => a.source === 'upload'),
        currentArticleId: state.currentArticleId,
      }),
    }
  )
)

// 初始化内置文章
// 在 store 创建后立即调用
if (typeof window !== 'undefined') {
  useArticleStore.getState().initBuiltinArticles()
}
