import { describe, it, expect, beforeEach } from 'vitest'
import { useArticleStore } from '@/stores/articleStore'
import type { CreateArticleInput } from '@/types/article'

// 重置 store 状态
beforeEach(() => {
  useArticleStore.setState({
    uploadedArticles: [],
    currentArticleId: null,
    loadedArticles: new Map(),
  })
})

describe('useArticleStore', () => {
  describe('addArticle', () => {
    it('should add article with generated id and createdAt', () => {
      const { addArticle, uploadedArticles } = useArticleStore.getState()
      const input: CreateArticleInput = {
        key: 'test-article',
        title: '测试文章',
        content: '测试内容。',
        source: 'upload',
      }
      addArticle(input)
      const newArticles = useArticleStore.getState().uploadedArticles
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
      const newArticles = useArticleStore.getState().uploadedArticles
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
      const articleId = useArticleStore.getState().uploadedArticles[0].id
      removeArticle(articleId)
      expect(useArticleStore.getState().uploadedArticles.length).toBe(0)
    })

    it('should not affect other articles', () => {
      const { addArticle, removeArticle } = useArticleStore.getState()
      addArticle({ key: 'a1', title: 'A1', content: 'A1', source: 'upload' })
      addArticle({ key: 'a2', title: 'A2', content: 'A2', source: 'upload' })
      const articleId = useArticleStore.getState().uploadedArticles[0].id
      removeArticle(articleId)
      expect(useArticleStore.getState().uploadedArticles.length).toBe(1)
    })
  })

  describe('selectArticle', () => {
    it('should set currentArticleId for uploaded article', () => {
      const { addArticle, selectArticle } = useArticleStore.getState()
      addArticle({
        key: 'test',
        title: 'Test',
        content: 'Test',
        source: 'upload',
      })
      const articleId = useArticleStore.getState().uploadedArticles[0].id
      selectArticle(articleId)
      expect(useArticleStore.getState().currentArticleId).toBe(articleId)
    })

    it('should set currentArticleId for builtin article', () => {
      const { selectArticle } = useArticleStore.getState()
      selectArticle('poem-jingyesi')
      expect(useArticleStore.getState().currentArticleId).toBe('poem-jingyesi')
    })
  })

  describe('getArticleById', () => {
    it('should return article by id for uploaded article', () => {
      const { addArticle, getArticleById } = useArticleStore.getState()
      addArticle({
        key: 'test',
        title: 'Test',
        content: 'Test',
        source: 'upload',
      })
      const articleId = useArticleStore.getState().uploadedArticles[0].id
      const article = getArticleById(articleId)
      expect(article).toBeDefined()
      expect(article?.title).toBe('Test')
    })

    it('should return null for non-existent id', () => {
      const { getArticleById } = useArticleStore.getState()
      const article = getArticleById('non-existent')
      expect(article).toBeNull()
    })

    it('should return loaded builtin article', () => {
      const { ensureArticleLoaded, getArticleById } = useArticleStore.getState()
      ensureArticleLoaded('poem-jingyesi')
      const article = getArticleById('poem-jingyesi')
      expect(article).not.toBeNull()
      expect(article?.title).toBe('静夜思')
    })
  })

  describe('getArticleMetas', () => {
    it('should return all article metas including builtins', () => {
      const { getArticleMetas } = useArticleStore.getState()
      const metas = getArticleMetas()
      expect(metas.length).toBeGreaterThan(0)
      // 检查包含诗词
      const poems = metas.filter((m) => m.id.startsWith('poem-'))
      expect(poems.length).toBeGreaterThan(0)
      // 检查包含名言
      const quotes = metas.filter((m) => m.id.startsWith('quote-'))
      expect(quotes.length).toBeGreaterThan(0)
    })

    it('should include uploaded articles in metas', () => {
      const { addArticle, getArticleMetas } = useArticleStore.getState()
      addArticle({
        key: 'test',
        title: 'Test',
        content: 'Test',
        source: 'upload',
      })
      const metas = getArticleMetas()
      const uploaded = metas.filter((m) => m.source === 'upload')
      expect(uploaded.length).toBe(1)
      expect(uploaded[0].title).toBe('Test')
    })
  })

  describe('getMetasBySource', () => {
    it('should filter metas by source', () => {
      const { addArticle, getMetasBySource } = useArticleStore.getState()
      addArticle({ key: 'u1', title: 'U1', content: 'U1', source: 'upload' })
      const uploaded = getMetasBySource('upload')
      const builtins = getMetasBySource('builtin')
      expect(uploaded.length).toBe(1)
      expect(builtins.length).toBeGreaterThan(0)
    })
  })

  describe('selectNextArticle', () => {
    it('should select next article', () => {
      const { selectArticle, selectNextArticle, getArticleMetas } =
        useArticleStore.getState()
      const metas = getArticleMetas()
      if (metas.length < 2) return

      selectArticle(metas[0].id)
      expect(useArticleStore.getState().currentArticleId).toBe(metas[0].id)

      selectNextArticle()
      expect(useArticleStore.getState().currentArticleId).toBe(metas[1].id)
    })

    it('should wrap to first article when at end', () => {
      const { selectArticle, selectNextArticle, getArticleMetas } =
        useArticleStore.getState()
      const metas = getArticleMetas()
      if (metas.length < 2) return

      selectArticle(metas[metas.length - 1].id)
      selectNextArticle()
      expect(useArticleStore.getState().currentArticleId).toBe(metas[0].id)
    })
  })
})
