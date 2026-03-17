import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useArticleStore } from '@/stores/articleStore'
import type { CreateArticleInput } from '@/types/article'

// 重置 store 状态
beforeEach(() => {
  useArticleStore.setState({
    articles: [],
    currentArticleId: null,
  })
})

describe('useArticleStore', () => {
  describe('addArticle', () => {
    it('should add article with generated id and createdAt', () => {
      const { addArticle, articles } = useArticleStore.getState()
      const input: CreateArticleInput = {
        key: 'test-article',
        title: '测试文章',
        content: '测试内容。',
        source: 'upload',
      }
      addArticle(input)
      const newArticles = useArticleStore.getState().articles
      expect(newArticles.length).toBe(1)
      expect(newArticles[0].id).toBeDefined()
      expect(newArticles[0].createdAt).toBeDefined()
      expect(newArticles[0].sentences).toBeDefined()
    })

    it('should split content into sentences', () => {
      const { addArticle } = useArticleStore.getState()
      const input: CreateArticleInput = {
        key: 'test-article',
        title: '测试文章',
        content: '第一句。第二句！',
        source: 'upload',
      }
      addArticle(input)
      const newArticles = useArticleStore.getState().articles
      expect(newArticles[0].sentences.length).toBe(2)
    })
  })

  describe('removeArticle', () => {
    it('should remove article by id', () => {
      const { addArticle, removeArticle } = useArticleStore.getState()
      const input: CreateArticleInput = {
        key: 'test-article',
        title: '测试文章',
        content: '内容',
        source: 'upload',
      }
      addArticle(input)
      const articleId = useArticleStore.getState().articles[0].id
      removeArticle(articleId)
      expect(useArticleStore.getState().articles.length).toBe(0)
    })

    it('should not affect other articles', () => {
      const { addArticle, removeArticle } = useArticleStore.getState()
      addArticle({ key: 'a1', title: 'A1', content: 'A1', source: 'upload' })
      addArticle({ key: 'a2', title: 'A2', content: 'A2', source: 'upload' })
      const articleId = useArticleStore.getState().articles[0].id
      removeArticle(articleId)
      expect(useArticleStore.getState().articles.length).toBe(1)
    })
  })

  describe('selectArticle', () => {
    it('should set currentArticleId', () => {
      const { selectArticle } = useArticleStore.getState()
      selectArticle('test-id')
      expect(useArticleStore.getState().currentArticleId).toBe('test-id')
    })
  })

  describe('getArticleById', () => {
    it('should return article by id', () => {
      const { addArticle, getArticleById } = useArticleStore.getState()
      addArticle({ key: 'test', title: 'Test', content: 'Test', source: 'upload' })
      const articleId = useArticleStore.getState().articles[0].id
      const article = getArticleById(articleId)
      expect(article).toBeDefined()
      expect(article?.title).toBe('Test')
    })

    it('should return undefined for non-existent id', () => {
      const { getArticleById } = useArticleStore.getState()
      const article = getArticleById('non-existent')
      expect(article).toBeUndefined()
    })
  })

  describe('getArticlesBySource', () => {
    it('should filter articles by source', () => {
      const { addArticle, getArticlesBySource } = useArticleStore.getState()
      addArticle({ key: 'u1', title: 'U1', content: 'U1', source: 'upload' })
      addArticle({ key: 'b1', title: 'B1', content: 'B1', source: 'builtin' })
      const uploaded = getArticlesBySource('upload')
      const builtins = getArticlesBySource('builtin')
      expect(uploaded.length).toBe(1)
      expect(builtins.length).toBe(1)
    })
  })

  describe('initialization', () => {
    it('should load builtin articles on init', () => {
      // 手动调用初始化内置文章（测试环境没有 window 对象）
      const { initBuiltinArticles, articles } = useArticleStore.getState()
      initBuiltinArticles()
      const updatedArticles = useArticleStore.getState().articles
      const builtinArticles = updatedArticles.filter(a => a.source === 'builtin')
      expect(builtinArticles.length).toBeGreaterThan(0)
    })
  })
})
