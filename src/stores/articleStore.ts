import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type {
  Article,
  ArticleMeta,
  CreateArticleInput,
  ArticleSource,
  Sentence,
  CharInfo,
  BuiltinArticleDef,
} from '@/types/article'
import { splitIntoSentences } from '@/utils/sentenceSplit'
import { pinyin } from 'pinyin-pro'
import { POEMS_DATA } from '@/assets/texts/Poems'
import { QUOTES_DATA } from '@/assets/texts/Quotes'
import { ESSAYS_DATA } from '@/assets/texts/Essays'
import { CharType } from '@/core'

// 内置文章注册表
const BUILTIN_REGISTRY: Map<string, BuiltinArticleDef> = new Map()

/**
 * 初始化内置文章注册表
 */
function initBuiltinRegistry() {
  POEMS_DATA.forEach((def) => BUILTIN_REGISTRY.set(def.id, def))
  QUOTES_DATA.forEach((def) => BUILTIN_REGISTRY.set(def.id, def))
  ESSAYS_DATA.forEach((def) => BUILTIN_REGISTRY.set(def.id, def))
}

// 立即初始化注册表
initBuiltinRegistry()

/**
 * 将文本转换为字符信息数组
 */
function textToChars(text: string): CharInfo[] {
  return Array.from(text).map((char) => {
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

// 缓存的内置文章元数据（只计算一次）
let cachedBuiltinMetas: ArticleMeta[] | null = null

/**
 * 从注册表获取内置文章元数据列表（带缓存）
 */
function getBuiltinMetas(): ArticleMeta[] {
  if (cachedBuiltinMetas) return cachedBuiltinMetas
  cachedBuiltinMetas = Array.from(BUILTIN_REGISTRY.values()).map((def) => ({
    id: def.id,
    key: def.key,
    title: def.title,
    description: def.description,
    source: 'builtin' as ArticleSource,
  }))
  return cachedBuiltinMetas
}

/**
 * 加载内置文章完整内容
 */
function loadBuiltinArticle(id: string): Article | null {
  const def = BUILTIN_REGISTRY.get(id)
  if (!def) return null

  const content = def.getContent()
  return {
    id: def.id,
    key: def.key,
    title: def.title,
    description: def.description,
    content,
    sentences: contentToSentences(content),
    source: 'builtin',
    createdAt: Date.now(),
  }
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
  // 用户上传的文章（完整内容，需要持久化）
  uploadedArticles: Article[]
  // 当前选中的文章 ID
  currentArticleId: string | null
  // 已加载的完整文章缓存（内置文章）
  loadedArticles: Map<string, Article>

  // Actions
  addArticle: (input: CreateArticleInput) => void
  removeArticle: (id: string) => void
  selectArticle: (id: string | null) => void
  selectNextArticle: () => void
  ensureArticleLoaded: (id: string) => void
  getArticleById: (id: string) => Article | null
  getArticleMetas: () => ArticleMeta[]
  getMetasBySource: (source: ArticleSource) => ArticleMeta[]
}

export const useArticleStore = create<ArticleState>()(
  persist(
    (set, get) => ({
      uploadedArticles: [],
      currentArticleId: null,
      loadedArticles: new Map(),

      addArticle: (input) =>
        set((state) => {
          // 检查是否已存在相同 key 的文章
          if (state.uploadedArticles.some((a) => a.key === input.key)) {
            return state
          }
          const article = createArticle(input)
          return {
            uploadedArticles: [...state.uploadedArticles, article],
          }
        }),

      removeArticle: (id) =>
        set((state) => ({
          uploadedArticles: state.uploadedArticles.filter((a) => a.id !== id),
          currentArticleId:
            state.currentArticleId === id ? null : state.currentArticleId,
        })),

      ensureArticleLoaded: (id) => {
        const state = get()
        if (state.loadedArticles.has(id)) return
        const article = loadBuiltinArticle(id)
        if (!article) return

        set((currentState) => {
          if (currentState.loadedArticles.has(id)) {
            return currentState
          }
          const newLoaded = new Map(currentState.loadedArticles)
          newLoaded.set(id, article)
          return { loadedArticles: newLoaded }
        })
      },

      selectArticle: (id) => {
        if (!id) {
          set({ currentArticleId: null })
          return
        }

        const state = get()

        // 检查是否是上传的文章
        const uploaded = state.uploadedArticles.find((a) => a.id === id)
        if (uploaded) {
          set({ currentArticleId: id })
          return
        }

        get().ensureArticleLoaded(id)
        if (get().loadedArticles.has(id)) {
          set({ currentArticleId: id })
        }
      },

      selectNextArticle: () => {
        const metas = get().getArticleMetas()
        if (metas.length === 0) return

        const { currentArticleId } = get()
        const currentIndex = metas.findIndex((m) => m.id === currentArticleId)
        const nextIndex = (currentIndex + 1) % metas.length
        get().selectArticle(metas[nextIndex].id)
      },

      getArticleById: (id) => {
        const state = get()

        // 先检查上传的文章
        const uploaded = state.uploadedArticles.find((a) => a.id === id)
        if (uploaded) return uploaded

        // 检查已加载的内置文章
        const loaded = state.loadedArticles.get(id)
        if (loaded) return loaded

        return null
      },

      getArticleMetas: () => {
        const { uploadedArticles } = get()
        const builtinMetas = getBuiltinMetas()
        const uploadedMetas: ArticleMeta[] = uploadedArticles.map((a) => ({
          id: a.id,
          key: a.key,
          title: a.title,
          description: a.description,
          source: a.source,
        }))
        return [...builtinMetas, ...uploadedMetas]
      },

      getMetasBySource: (source) => {
        if (source === 'builtin') {
          return getBuiltinMetas()
        }
        if (source === 'upload') {
          const { uploadedArticles } = get()
          return uploadedArticles.map((a) => ({
            id: a.id,
            key: a.key,
            title: a.title,
            description: a.description,
            source: a.source,
          }))
        }
        return get().getArticleMetas()
      },
    }),
    {
      name: 'article-storage',
      storage: createJSONStorage(() => localStorage),
      // 仅持久化上传的文章和当前选中状态
      partialize: (state) => ({
        uploadedArticles: state.uploadedArticles,
        currentArticleId: state.currentArticleId,
      }),
    },
  ),
)
